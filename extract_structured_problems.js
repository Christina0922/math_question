// 초등 수학 문제 구조화 및 변형문제 생성 스크립트 (개선판)
//
// 사용 방법 (Usage):
// 
// // 초등 2학년 2단원 문제 추출 (ES_PACK02_Basics 폴더 내 2-2.pdf 존재)
// const result = extractAndStructureProblems(2, 2, 'ES_PACK02_Basics');
// console.log(JSON.stringify(result, null, 2));
//
// 매개변수:
//   - grade: 학년 (예: 2)
//   - unit: 단원 (예: 2)
//   - packName: 패키지 이름 (예: 'ES_PACK02_Basics'), 선택사항
//   - maxPages: 최대 읽을 페이지 수 (기본값: 5)
//
// 주의: grade와 unit은 반드시 해당 pack 폴더 내에 실제 존재하는 pdf_key와 일치해야 합니다.
//       예를 들어, ES_PACK02_Basics에는 2-2.pdf가 존재하므로 grade=2, unit=2가 올바른 조합입니다.

const fs = require('fs');
const path = require('path');

// 깨진 텍스트 감지 함수
function detectBrokenText(text) {
    // 대체문자() 체크 (U+FFFD)
    const replacementChars = (text.match(/\uFFFD/g) || []).length;
    
    // 의미 없는 특수기호 연속 체크
    const allowedChars = /[\w\s가-힣0-9.,?!()+\-×÷=<>≤≥≠±·≈∞√²³⁰¹⁴⁵⁶⁷⁸⁹]/g;
    const totalAllowed = (text.match(allowedChars) || []).length;
    const meaninglessSymbols = text.length - totalAllowed;
    const totalChars = text.length;
    
    // 한글/숫자 비율 체크
    const koreanNums = (text.match(/[가-힣0-9]/g) || []).length;
    const koreanNumRatio = totalChars > 0 ? koreanNums / totalChars : 0;
    
    // 깨짐 기준
    const hasBrokenChars = replacementChars > 3;
    const hasTooManySymbols = meaninglessSymbols > totalChars * 0.3;
    const hasLowKoreanRatio = koreanNumRatio < 0.3;
    
    return {
        isBroken: hasBrokenChars || hasTooManySymbols || hasLowKoreanRatio,
        reasons: [
            hasBrokenChars && `대체문자 ${replacementChars}개`,
            hasTooManySymbols && `의미없는 기호 ${meaninglessSymbols}개`,
            hasLowKoreanRatio && `한글/숫자 비율 ${(koreanNumRatio * 100).toFixed(1)}%`
        ].filter(Boolean)
    };
}

// 추출 신뢰도 계산
function calculateConfidence(text, hasAnswer, hasSolution, isBroken) {
    let confidence = 1.0;
    
    if (isBroken) confidence *= 0.3;
    if (!hasAnswer) confidence *= 0.7;
    if (!hasSolution) confidence *= 0.9;
    if (text.length < 10) confidence *= 0.5;
    if (text.length > 500) confidence *= 0.9; // 너무 길면 오탐 가능
    
    return Math.max(0, Math.min(1, confidence));
}

// 금지 개념 검수 함수 (강화)
function checkBannedConcepts(text, grade) {
    const banned = [];
    
    // 분수 검사 (패턴)
    if (/\d+\s*\/\s*\d+/.test(text) || 
        text.includes('분모') || text.includes('분자') || 
        text.includes('분수') || /\d+분의\d+/.test(text)) {
        banned.push('분수');
    }
    
    // 소수점 검사 (4학년 이상에서만 허용)
    if (grade < 4 && (/\d+\.\d+/.test(text) || text.includes('소수점') || text.includes('소수'))) {
        banned.push('소수');
    }
    
    // 음수 검사 (단, 뺄셈 맥락은 제외)
    if (/-?\d+/.test(text)) {
        const negativeMatches = text.match(/-\d+/g);
        if (negativeMatches && negativeMatches.length > 0 && !text.includes('빼기') && !text.includes('뺄셈')) {
            banned.push('음수');
        }
    }
    
    // 좌표/그래프 검사 (중등 스타일)
    if (/\([xy],\s*[xy]\)/.test(text) || 
        text.includes('좌표평면') || 
        text.includes('함수') || 
        /y\s*=\s*\w+/.test(text)) {
        banned.push('좌표/함수');
    }
    
    // 문자 미지수 검사 (단, □나  같은 간단한 표시는 허용)
    if (/\b[xXyY]\s*[+\-×÷=]/.test(text) || 
        /\b[xXyY]\b.*\d/.test(text) ||
        text.includes('방정식') || 
        text.includes('일차방정식') ||
        text.includes('미지수')) {
        banned.push('방정식');
    }
    
    // 제곱근 검사
    if (/√\d+/.test(text) || text.includes('제곱근') || text.includes('근호')) {
        banned.push('제곱근');
    }
    
    // 삼각비 검사
    if (/sin|cos|tan/i.test(text) || text.includes('삼각비')) {
        banned.push('삼각비');
    }
    
    return banned;
}

// 문제 타입 판단
function determineProblemType(text) {
    const lower = text.toLowerCase();
    if (lower.includes('그림') || lower.includes('도형') || 
        lower.includes('각') || lower.includes('길이') || 
        lower.includes('넓이') || lower.includes('둘레')) {
        return '도형';
    }
    if (lower.includes('그래프') || lower.includes('표') || 
        lower.includes('차트') || lower.includes('막대')) {
        return '자료해석';
    }
    if (lower.includes('구하세요') || lower.includes('계산') || 
        lower.includes('식을') || lower.includes('계산하세요')) {
        return '계산';
    }
    return '문장제';
}

// 난이도 판단
function determineDifficulty(text, grade) {
    const length = text.length;
    const hasMultiStep = text.includes('먼저') || text.includes('그리고') || 
                        text.includes('다음') || text.includes('단계');
    const hasComplexCalc = /\d{3,}/.test(text) || 
                          text.match(/\d+/g)?.length > 5;
    
    if (grade <= 2) {
        if (length < 30 && !hasMultiStep && !hasComplexCalc) return '하';
        if (length < 60 && !hasMultiStep) return '중';
        return '상';
    } else {
        if (length < 50 && !hasMultiStep && !hasComplexCalc) return '하';
        if (length < 100) return '중';
        return '상';
    }
}

// 개념 태그 추출
function extractConcepts(text, grade, unit) {
    const concepts = [];
    const lower = text.toLowerCase();
    
    if (grade === 1) {
        if (lower.includes('모으기') || lower.includes('가르기')) concepts.push('모으기와가르기');
        if (lower.includes('덧셈') || lower.includes('더하기')) concepts.push('덧셈');
        if (lower.includes('뺄셈') || lower.includes('빼기')) concepts.push('뺄셈');
        if (lower.includes('비교') || lower.includes('크기')) concepts.push('크기비교');
        if (lower.includes('순서')) concepts.push('수의순서');
    } else if (grade === 2) {
        if (lower.includes('곱셈')) concepts.push('곱셈');
        if (lower.includes('나눗셈')) concepts.push('나눗셈');
        if (lower.includes('길이') || lower.includes('cm')) concepts.push('길이');
        if (lower.includes('무게')) concepts.push('무게');
    }
    
    // 도형 관련
    if (lower.includes('도형') || lower.includes('삼각형') || 
        lower.includes('사각형') || lower.includes('원')) {
        concepts.push('도형');
    }
    
    return concepts.length > 0 ? concepts : ['기본계산'];
}

// 텍스트 정리 함수
function cleanText(text) {
    // 연속된 공백 제거
    text = text.replace(/\s+/g, ' ');
    // 줄바꿈 정리
    text = text.replace(/\n+/g, '\n');
    return text.trim();
}

// 텍스트에서 문제 추출 (개선된 버전)
function extractProblemsFromText(text, pageNum, grade, unit, pdfKey, pack, txtDir, pngDir) {
    const problems = [];
    
    // 텍스트 정리
    text = cleanText(text);
    
    // 텍스트가 너무 짧으면 건너뛰기
    if (text.length < 20) {
        return [];
    }
    
    const brokenCheck = detectBrokenText(text);
    
    // 깨진 텍스트면 경고만 하고 진행 (나중에 needs_review 처리)
    if (brokenCheck.isBroken) {
        console.warn(`Page ${pageNum}: 깨진 텍스트 감지 - ${brokenCheck.reasons.join(', ')}`);
    }
    
    // 문제 번호 패턴들 (간단하고 직접적인 방식)
    const problemStartPatterns = [
        { pattern: /\b(\d+)[\.)]\s+([^0-9]{15,}?)(?=\d+[\.)]|\(|$)/g, type: 'numbered' },  // 1. 문제내용
        { pattern: /\((\d+)\)\s+([^)]{15,}?)(?=\(\d+\)|$)/g, type: 'parenthesized' }, // (1) 문제내용
        { pattern: /[①-⑳]\s+([^①-⑳]{15,}?)(?=[①-⑳]|\d+[\.)]|$)/g, type: 'circle' },        // ① 문제내용
        { pattern: /문제\s*(\d+)[\.:]\s+([^문제]{15,}?)(?=문제|문항|$)/gi, type: 'problem' },    // 문제 1: 내용
        { pattern: /문항\s*(\d+)[\.:]\s+([^문제]{15,}?)(?=문제|문항|$)/gi, type: 'question' },   // 문항 1: 내용
        { pattern: /⑴\s+([^⑵]{15,}?)(?=⑵|$)/g, type: 'numbered-korean' }, // ⑴ 문제내용
        { pattern: /⑵\s+([^⑶]{15,}?)(?=⑶|$)/g, type: 'numbered-korean' }  // ⑵ 문제내용
    ];
    
    // 보기 패턴들
    const choicePatterns = [
        /^[①-⑳]\s+(.+)/m,
        /^[가-라]\s*[\.)]\s*(.+)/m,
        /^\([A-D]\)\s+(.+)/m,
        /^보기\s*[\.:]/mi
    ];
    
    // 전체 텍스트에서 문제 패턴 찾기 (줄 단위 + 전체 텍스트)
    let problemCounter = 0;
    const foundProblems = [];
    const seenQuestions = new Set();
    
    // 각 패턴으로 문제 찾기
    for (const patternInfo of problemStartPatterns) {
        try {
            // 패턴에 g 플래그가 없으면 추가
            let pattern = patternInfo.pattern;
            if (!pattern.global) {
                const flags = pattern.flags + 'g';
                pattern = new RegExp(pattern.source, flags);
            }
            
            const matches = [...text.matchAll(pattern)];
            for (const match of matches) {
                const problemNum = match[1] || String(++problemCounter);
                let questionText = (match[2] || match[1] || '').trim();
                
                // 텍스트 정리 (연속 공백 제거, 특수 문자 정리)
                questionText = questionText.replace(/\s+/g, ' ').trim();
                
                // 최소 길이 체크 및 중복 체크
                if (questionText.length >= 15 && questionText.length < 500) {
                    // 중복 체크용 키 (처음 30자)
                    const questionKey = questionText.substring(0, 30);
                    if (!seenQuestions.has(questionKey)) {
                        seenQuestions.add(questionKey);
                        foundProblems.push({
                            num: problemNum,
                            question: questionText,
                            type: patternInfo.type,
                            index: match.index || 0
                        });
                    }
                }
            }
        } catch (e) {
            // 패턴 오류 무시하고 계속
            console.warn(`Pattern error for ${patternInfo.type}:`, e.message);
        }
    }
    
    // 추가: "의 값을 구하세요", "의 크기는", "만큼" 등 문제 문구가 있는 문장 찾기
    const problemKeywords = /(구하세요|구해보세요|구하시오|찾아보세요|써넣으세요|비교해보세요|나타내는|의\s*값|의\s*크기|만큼|개|장|원)/i;
    const sentences = text.split(/[.!?]\s+/).filter(s => s.length > 20 && s.length < 300);
    
    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        if (problemKeywords.test(sentence) && !foundProblems.some(p => sentence.includes(p.question.substring(0, 20)))) {
            // 숫자가 포함된 문장만
            if (/\d+/.test(sentence)) {
                foundProblems.push({
                    num: String(foundProblems.length + 1),
                    question: sentence.replace(/\s+/g, ' ').trim(),
                    type: 'sentence',
                    index: text.indexOf(sentence)
                });
            }
        }
    }
    
    // 인덱스 순으로 정렬
    foundProblems.sort((a, b) => a.index - b.index);
    
    // 중복 제거 (같은 인덱스 근처의 문제)
    const uniqueProblems = [];
    for (const found of foundProblems) {
        const isDuplicate = uniqueProblems.some(p => 
            Math.abs(p.index - found.index) < 10 && 
            p.question.substring(0, 20) === found.question.substring(0, 20)
        );
        if (!isDuplicate) {
            uniqueProblems.push(found);
        }
    }
    
    // 각 발견된 문제를 구조화
    for (const found of uniqueProblems) {
        if (found.question.length < 10) continue; // 너무 짧으면 건너뛰기
        
        const currentProblem = {
            id: `${pdfKey}-p${String(pageNum).padStart(4, '0')}-q${found.num}`,
            grade: grade,
            unit: unit,
            pack: pack,
            pdf_key: pdfKey,
            source: {
                pdf: `${pdfKey}.pdf`,
                page_start: pageNum,
                page_end: pageNum
            },
            has_figure: false,
            figure_files: [],
            concepts: [],
            difficulty: '중',
            type: '계산',
            question: found.question,
            choices: [],
            answer: '',
            solution: '',
            banned_hit: [],
            extraction_method: 'text',
            extraction_confidence: 1.0,
            needs_review: brokenCheck.isBroken || false,
            skip_variant: false
        };
        
        // 정답 찾기 (문제 텍스트 주변에서)
        const answerPatterns = [
            /정답[:\s]*(\d+|[가-라①②③④⑤])/,
            /답[:\s]*(\d+|[가-라①②③④⑤])/,
            /\(정답[:\s]*(\d+|[가-라①②③④⑤])\)/
        ];
        
        for (const pattern of answerPatterns) {
            const answerMatch = text.match(pattern);
            if (answerMatch) {
                currentProblem.answer = answerMatch[1];
                break;
            }
        }
        
        // 해설 찾기
        const solutionMatch = text.match(/(?:해설|풀이)[:\s]*(.+?)(?=\n\s*(?:정답|답|\d+[\.)]|$))/is);
        if (solutionMatch) {
            currentProblem.solution = solutionMatch[1].trim();
        }
        
        problems.push(currentProblem);
    }
    
    // 각 문제 검수 및 보완
    return problems.map(problem => {
        // 도형/그래프 검사
        const hasFigureKeywords = /그림|도형|그래프|표|각|길이|넓이|둘레/i.test(problem.question);
        if (hasFigureKeywords || problem.question.length < 20) {
            problem.has_figure = true;
            if (pngDir) {
                const pngPath = path.join(pngDir, `${String(pageNum).padStart(4, '0')}.png`);
                if (fs.existsSync(pngPath)) {
                    problem.figure_files.push(pngPath);
                }
            }
        }
        
        // 개념 추출
        problem.concepts = extractConcepts(problem.question, grade, unit);
        
        // 난이도 판단
        problem.difficulty = determineDifficulty(problem.question, grade);
        
        // 타입 판단
        problem.type = determineProblemType(problem.question);
        
        // 금지 개념 검수
        problem.banned_hit = checkBannedConcepts(
            problem.question + ' ' + problem.answer + ' ' + problem.solution, 
            grade
        );
        
        // 정답 없으면 needs_review
        if (!problem.answer || problem.answer.trim().length === 0) {
            problem.needs_review = true;
        }
        
        // 금지 개념 있으면 skip_variant
        if (problem.banned_hit.length > 0) {
            problem.skip_variant = true;
        }
        
        // 추출 신뢰도 계산
        problem.extraction_confidence = calculateConfidence(
            problem.question,
            !!problem.answer && problem.answer.length > 0,
            !!problem.solution && problem.solution.length > 0,
            false
        );
        
        // 텍스트가 너무 짧으면 신뢰도 낮춤
        if (problem.question.length < 10) {
            problem.extraction_confidence *= 0.5;
            problem.needs_review = true;
        }
        
        return problem;
    });
}

// 변형 문제 생성 (개선된 버전)
function generateVariants(original, count = 3) {
    const variants = [];
    
    // 변형 생성 금지 조건
    if (original.skip_variant || original.banned_hit.length > 0) {
        return variants;
    }
    
    // 도형/그래프 문제는 그림 유지하고 숫자만 변경
    const isFigureProblem = original.has_figure || 
                           /그림|도형|그래프|표/i.test(original.question);
    
    for (let i = 0; i < count; i++) {
        const variant = JSON.parse(JSON.stringify(original));
        variant.id = `${original.id}-v${i + 1}`;
        
        // 숫자 추출 및 변형
        const numbers = original.question.match(/\d+/g) || [];
        const replacedNumbers = new Set();
        
        let modifiedQuestion = original.question;
        
        // 숫자 변형 (학년에 맞게)
        for (const numStr of numbers) {
            if (replacedNumbers.has(numStr)) continue;
            
            const num = parseInt(numStr);
            let newNum;
            
            if (original.grade === 1) {
                // 1학년: 1~20 범위, 작은 변동
                if (num <= 20) {
                    newNum = num + (Math.random() > 0.5 ? 1 : -1);
                    newNum = Math.max(1, Math.min(20, newNum));
                } else {
                    continue; // 큰 수는 변경하지 않음
                }
            } else if (original.grade === 2) {
                // 2학년: 1~100 범위
                if (num <= 100) {
                    newNum = num + Math.floor(Math.random() * 6) - 3;
                    newNum = Math.max(1, Math.min(100, newNum));
                } else {
                    continue;
                }
            } else {
                // 3학년 이상
                if (num <= 1000) {
                    newNum = num + Math.floor(Math.random() * 10) - 5;
                    newNum = Math.max(1, Math.min(1000, newNum));
                } else {
                    continue;
                }
            }
            
            if (newNum !== num) {
                // 단어 경계 확인해서 교체
                const regex = new RegExp(`\\b${numStr}\\b`, 'g');
                modifiedQuestion = modifiedQuestion.replace(regex, String(newNum));
                replacedNumbers.add(numStr);
            }
        }
        
        variant.question = modifiedQuestion;
        
        // 난이도 약간 조정
        const difficulties = ['하', '중', '상'];
        const currentIdx = difficulties.indexOf(variant.difficulty);
        if (currentIdx >= 0 && Math.random() > 0.7) {
            const newIdx = Math.max(0, Math.min(2, currentIdx + (Math.random() > 0.5 ? 1 : -1)));
            variant.difficulty = difficulties[newIdx];
        }
        
        // 변형 문제도 같은 figure_files 유지
        if (isFigureProblem) {
            variant.figure_files = [...original.figure_files];
        }
        
        variants.push(variant);
    }
    
    return variants;
}

// 메인 함수: grade/unit에 맞는 문제 추출 및 구조화
function extractAndStructureProblems(grade, unit, packName = null, maxPages = 5) {
    // data_index.json 읽기
    const dataIndexPath = path.join(__dirname, 'data_index.json');
    const dataIndex = JSON.parse(fs.readFileSync(dataIndexPath, 'utf-8'));
    
    // 해당 grade/unit 찾기 (pdf_key에서 추출한 값과 일치 확인)
    let targetItems = dataIndex.filter(item => {
        const [itemGrade, itemUnit] = item.pdf_key.split('-').map(Number);
        return itemGrade === grade && itemUnit === unit;
    });
    
    // pack 지정이 있으면 필터링
    if (packName) {
        targetItems = targetItems.filter(item => item.pack === packName);
    }
    
    if (targetItems.length === 0) {
        return { 
            error: `Grade ${grade}, Unit ${unit}에 해당하는 항목을 찾을 수 없습니다.`,
            extraction_method: 'text'
        };
    }
    
    const results = [];
    
    // 각 항목 처리
    for (const item of targetItems) {
        const { pack, pdf_key, txt_dir, png_dir } = item;
        
        // pdf_key에서 학년/단원 재확인 (하드 필터)
        const [verifyGrade, verifyUnit] = pdf_key.split('-').map(Number);
        if (verifyGrade !== grade || verifyUnit !== unit) {
            console.warn(`Skip: pdf_key ${pdf_key} doesn't match grade=${grade}, unit=${unit}`);
            continue;
        }
        
        // 앞 N페이지 읽기 (기본 5페이지)
        const problems = [];
        
        for (let page = 1; page <= maxPages; page++) {
            const pageNum = String(page).padStart(4, '0');
            const txtPath = path.join(txt_dir, `${pageNum}.txt`);
            
            if (fs.existsSync(txtPath)) {
                const text = fs.readFileSync(txtPath, 'utf-8');
                
                // 텍스트 비어있는지 확인
                if (text.trim().length < 10) {
                    console.warn(`Page ${pageNum}: 텍스트가 거의 비어있음`);
                    continue;
                }
                
                const extracted = extractProblemsFromText(
                    text, page, grade, unit, pdf_key, pack, txt_dir, png_dir
                );
                
                // 금지 개념 없는 문제만 (skip_variant는 나중에)
                problems.push(...extracted);
            }
        }
        
        // 각 원문에 대해 변형 생성 (skip_variant=false인 경우만)
        const structured = problems.map(original => ({
            original: original,
            variants: original.skip_variant ? [] : generateVariants(original, 3)
        }));
        
        results.push({
            pack: pack,
            pdf_key: pdf_key,
            grade: grade,
            unit: unit,
            problems: structured,
            extraction_method: 'text',
            total_extracted: problems.length,
            valid_for_variants: problems.filter(p => !p.skip_variant).length
        });
    }
    
    return results;
}

// 실행 예시
if (require.main === module) {
    // 테스트: 초등 2학년 2단원 (ES_PACK02_Basics 폴더 내 2-2.pdf 존재)
    const grade = 2;
    const unit = 2;
    const pack = 'ES_PACK02_Basics';
    
    console.log(`Extracting problems for Grade ${grade}, Unit ${unit} (${pack})...\n`);
    
    // 초등 2학년 2단원 문제 추출 (ES_PACK02_Basics 폴더 내 2-2.pdf 존재)
    const result = extractAndStructureProblems(grade, unit, pack, 5);
    
    // JSON 출력
    console.log(JSON.stringify(result, null, 2));
    
    // 요약 출력
    if (result.length > 0 && !result.error) {
        const summary = result[0];
        console.log(`\n=== 요약 ===`);
        console.log(`추출된 문제: ${summary.total_extracted}개`);
        console.log(`변형 가능: ${summary.valid_for_variants}개`);
        console.log(`변형 불가 (금지개념/검토필요): ${summary.total_extracted - summary.valid_for_variants}개`);
    }
}

module.exports = {
    extractAndStructureProblems,
    generateVariants,
    checkBannedConcepts,
    extractProblemsFromText,
    detectBrokenText
};
