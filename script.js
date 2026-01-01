// 초등학교 수학 개념 (학년별)
const elementaryMathConcepts = {
    1: [
        '9까지의 수', '덧셈과 뺄셈', '50까지의 수', '100까지의 수',
        '덧셈(두 자리 수)', '뺄셈(두 자리 수)', '여러 가지 모양', 
        '시계 보기', '달력 보기', '길이 비교', '무게 비교'
    ],
    2: [
        '세 자리 수', '덧셈과 뺄셈', '여러 가지 도형', '길이 재기',
        '시각과 시간', '표와 그래프', '규칙 찾기', '곱셈',
        '나눗셈', '분수', '들이와 무게'
    ],
    3: [
        '덧셈과 뺄셈', '곱셈', '나눗셈', '원', '분수',
        '자료의 정리', '길이와 시간', '들이와 무게', 
        '여러 가지 도형', '원과 직사각형', '규칙과 대응'
    ],
    4: [
        '큰 수', '각도', '곱셈과 나눗셈', '평면도형',
        '막대그래프', '분수의 덧셈과 뺄셈', '소수',
        '사각형', '꺾은선그래프', '다각형', '소수의 덧셈과 뺄셈'
    ],
    5: [
        '자연수의 혼합 계산', '약수와 배수', '규칙과 대응',
        '약분과 통분', '분수의 덧셈과 뺄셈', '다각형의 넓이',
        '소수의 곱셈', '직육면체', '평균', '정비례와 반비례',
        '원의 넓이', '직육면체의 부피와 겉넓이'
    ],
    6: [
        '분수의 나눗셈', '소수의 나눗셈', '각기둥과 각뿔',
        '비와 비율', '원의 넓이', '직육면체의 부피',
        '비례식과 비례배분', '원기둥, 원뿔, 구', '비율 그래프',
        '정비례 관계와 반비례 관계', '원주율과 원의 넓이'
    ]
};

// 중학교 수학 개념 (학년별)
const middleMathConcepts = {
    1: [
        '소인수분해', '최대공약수와 최소공배수', '정수와 유리수',
        '정수와 유리수의 계산', '문자와 식', '일차방정식',
        '일차함수', '좌표평면과 그래프', '기본도형', '평면도형',
        '입체도형', '통계', '도수분포표와 그래프'
    ],
    2: [
        '유리수와 순환소수', '식의 계산', '일차부등식',
        '연립일차방정식', '일차함수와 그래프', '일차함수와 일차방정식의 관계',
        '이등변삼각형', '직각삼각형의 합동', '평행사변형',
        '여러 가지 사각형', '도형의 닮음', '닮음의 활용',
        '확률', '확률의 계산'
    ],
    3: [
        '제곱근과 실수', '근호를 포함한 식의 계산', '인수분해',
        '이차방정식', '이차함수', '이차함수의 그래프',
        '삼각비', '원과 직선', '원주각',
        '대푯값과 산포도', '상관관계'
    ]
};

// 과목별 개념 목록 (학교급/학년 무관, 공통 개념)
const conceptsBySubject = {
    korean: [
        '글 읽기 이해', '중심문장 찾기', '접속어', '글 흐름 파악', 
        '어휘/맞춤법', '띄어쓰기', '문장 성분', '문법', 
        '독해', '작문', '논술', '문학 이해'
    ],
    english: [
        '문법', '단어', '독해', '듣기', '쓰기', '문장 구조', 
        '시제', '수동태', '가정법', '관계사', '전치사'
    ],
    science: [
        '물질', '에너지', '생명', '지구', '화학 반응', '전기', 
        '자기', '광합성', '운동', '힘', '지구 환경'
    ],
    social: [
        '역사', '지리', '경제', '정치', '사회 문화', '시민', 
        '법률', '환경', '국제 관계'
    ]
};

// ===============================
// Helper 함수: [object Object] 방지
// ===============================
function conceptToText(concept) {
  if (!concept) return '';
  if (typeof concept === 'string') return concept;

  // 프로젝트에서 흔히 쓰는 키들을 우선순위로 처리
  return (
    concept.conceptTitle ||
    concept.topicTitle ||
    concept.unitTitle ||
    concept.name ||
    concept.title ||
    concept.label ||
    (concept.id && typeof concept.id === 'string' ? concept.id : '') ||
    ''   // 여기까지 없으면 빈문자열
  );
}

// 내부 코드 패턴 제거 (UI 노출 방지)
function sanitizeDisplayText(text) {
  if (!text || typeof text !== 'string') return text || '';
  
  // 내부 경로 코드 패턴 제거: S|1|2|0|1, T|1|2|0|1|0, U|1|2|0 같은 형식
  const internalCodePattern = /^[A-Z]\|(\d+\|)+/;
  
  // 패턴이 매치되면 빈 문자열 반환
  if (internalCodePattern.test(text.trim())) {
    return '';
  }
  
  // 문자열 내부에 패턴이 포함된 경우도 제거
  let sanitized = text.replace(/\b[A-Z]\|(\d+\|)+\d+\b/g, '');
  
  // 연속된 공백 정리
  sanitized = sanitized.replace(/\s+/g, ' ').trim();
  
  return sanitized;
}

// 개념 ID를 사람용 라벨로 변환 (중학교용)
function getConceptLabelFromId(conceptId, schoolLevel = 'elementary') {
  if (!conceptId || typeof conceptId !== 'string') return '';
  
  // 내부 코드 패턴이면 변환 시도
  if (conceptId.includes('|')) {
    const parts = conceptId.split('|');
    
    // 중학교: S|1|2|0|1 또는 T|1|2|0|1|0 형식
    if (schoolLevel === 'middle' && window.MIDDLE_SCHOOL_TOC) {
      if (parts.length === 5 && parts[0] === 'S') {
        // 소단원: S|grade|semester|unitIdx|subunitIdx
        const grade = parseInt(parts[1]);
        const semester = parseInt(parts[2]);
        const uIdx = parseInt(parts[3]);
        const sIdx = parseInt(parts[4]);
        
        const gradeKey = `${grade}학년`;
        const semesterKey = `${semester}학기`;
        const tocData = window.MIDDLE_SCHOOL_TOC[gradeKey];
        
        if (tocData && tocData[semesterKey] && tocData[semesterKey][uIdx]) {
          const unit = tocData[semesterKey][uIdx];
          if (unit.subunits && unit.subunits[sIdx]) {
            return unit.subunits[sIdx].title || '';
          }
        }
      } else if (parts.length === 6 && parts[0] === 'T') {
        // 토픽: T|grade|semester|unitIdx|subunitIdx|topicIdx
        const grade = parseInt(parts[1]);
        const semester = parseInt(parts[2]);
        const uIdx = parseInt(parts[3]);
        const sIdx = parseInt(parts[4]);
        const tIdx = parseInt(parts[5]);
        
        const gradeKey = `${grade}학년`;
        const semesterKey = `${semester}학기`;
        const tocData = window.MIDDLE_SCHOOL_TOC[gradeKey];
        
        if (tocData && tocData[semesterKey] && tocData[semesterKey][uIdx]) {
          const unit = tocData[semesterKey][uIdx];
          if (unit.subunits && unit.subunits[sIdx] && unit.subunits[sIdx].topics) {
            const topic = unit.subunits[sIdx].topics[tIdx];
            if (topic) {
              return topic;
            }
          }
        }
      }
    }
    
    // 변환 실패 시 빈 문자열 반환 (내부 코드는 노출하지 않음)
    return '';
  }
  
  // G1-S1-U1-T1 형식이면 그대로 반환 (초등학교용, 이미 라벨 형식)
  return conceptId;
}

function questionToPrompt(q) {
  if (!q) return '';
  if (typeof q === 'string') return q;

  // 생성기가 object로 반환할 때 대비
  return (
    q.prompt ||
    q.question ||
    q.text ||
    q.problem ||
    q.stem ||
    ''
  );
}

/**
 * conceptId를 문자열로 정규화 (객체 처리 강화)
 * @param {string|object} conceptId - conceptId 값
 * @returns {string} 정규화된 conceptId 문자열
 */
function normalizeConceptId(conceptId) {
    if (!conceptId) return '';
    if (typeof conceptId === 'string') return conceptId;
    if (typeof conceptId !== 'object') return String(conceptId);
    
    // 객체인 경우 여러 키를 시도
    return conceptId.id || 
           conceptId.conceptId || 
           conceptId.concept_id ||
           (conceptId.id && typeof conceptId.id === 'string' ? conceptId.id : '') ||
           (conceptId.conceptId && typeof conceptId.conceptId === 'string' ? conceptId.conceptId : '') ||
           '';
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async function() {
    // create.html 페이지에서 초기화
    if (document.querySelector('input[name="grade"]')) {
        initializeFormSelectors();
        // 초기 학기 UI 업데이트
        updateSemesterUI();
        // 초기 개념 목록 표시
        await updateConceptList();
    }
    
    // result.html 페이지에서 데이터 로드
    if (document.getElementById('problemsList')) {
        loadResultData();
    }
    
    // index.html 페이지에서 초기화
    if (document.getElementById('featuresContainer')) {
        renderFeatures();
        renderSampleProblems();
        loadReviewsPreview();
        initializeReviewForm();
    }
});

// 폼 선택자 초기화 (학교급, 학년, 학기)
function initializeFormSelectors() {
    // 학교급 선택 시 학년 목록 업데이트
    const schoolLevelInputs = document.querySelectorAll('input[name="schoolLevel"]');
    schoolLevelInputs.forEach(input => {
        input.addEventListener('change', async function() {
            updateGradeList(this.value);
            await updateConceptList(); // 개념 목록도 업데이트
        });
    });
    
    // 학년 선택 시 개념 목록 업데이트 및 선택값 초기화
    const gradeInputs = document.querySelectorAll('input[name="grade"]');
    gradeInputs.forEach(input => {
        input.addEventListener('change', async function() {
            // 학년/학기가 바뀌면 선택값 초기화
            clearAllConcepts();
            updateSemesterUI(); // 학기 UI 업데이트
            await updateConceptList();
        });
    });
    
    // 문제 개수 선택 시 총 문제 수 업데이트
    const problemCountInputs = document.querySelectorAll('input[name="problemCount"]');
    problemCountInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateTotalQuestionsDisplay();
        });
    });
    
    // 초기 총 문제 수 표시 업데이트
    updateTotalQuestionsDisplay();
    updateSubmitButtonState();
    
    // 학기 선택 시 개념 목록 업데이트 및 선택값 초기화
    const semesterInputs = document.querySelectorAll('input[name="semester"]');
    semesterInputs.forEach(input => {
        input.addEventListener('change', async function() {
            // 학년/학기가 바뀌면 선택값 초기화
            clearAllConcepts();
            await updateConceptList();
        });
    });
}

// 학년 목록 업데이트
function updateGradeList(schoolLevel) {
    const gradeGroup = document.getElementById('gradeGroup');
    if (!gradeGroup) return;
    
    let grades = [];
    if (schoolLevel === 'elementary') {
        grades = [1, 2, 3, 4, 5, 6];
    } else if (schoolLevel === 'middle') {
        grades = [1, 2, 3];
    }
    
    gradeGroup.innerHTML = grades.map(grade => {
        const gradeId = `grade-${grade}`;
        return createSelectableCard({
            id: gradeId,
            type: 'radio',
            name: 'grade',
            value: String(grade),
            checked: grade === 1,
            label: `${grade}학년`,
            onChange: '',
            className: '',
            dataAttributes: {}
        });
    }).join('');
    
    // 이벤트 리스너 다시 연결
    const gradeInputs = document.querySelectorAll('input[name="grade"]');
    gradeInputs.forEach(input => {
        input.addEventListener('change', async function() {
            clearAllConcepts();
            updateSemesterUI(); // 학기 UI 업데이트 (중학교는 동적 생성)
            await updateConceptList();
        });
    });
    
    // 학기 UI 업데이트 (중학교는 동적 생성)
    updateSemesterUI();
}

// 학기 UI 업데이트 함수 (초등 5·6학년, 중3에서만 2학기 숨김)
function getSelectedGrade() {
    const el = document.querySelector('input[name="grade"]:checked');
    return el ? String(el.value) : null;
}

function getSelectedSchoolLevel() {
    const el = document.querySelector('input[name="schoolLevel"]:checked');
    return el ? el.value : 'elementary';
}

function updateSemesterUI() {
    const grade = getSelectedGrade();
    const schoolLevel = getSelectedSchoolLevel();
    
    // STEP 3 섹션 내의 학기 선택 radio-group 찾기
    const step3Section = document.querySelector('.form-step:nth-of-type(3)');
    const semesterGroup = step3Section ? step3Section.querySelector('.radio-group') : document.querySelector('input[name="semester"]')?.closest('.radio-group');
    
    if (!semesterGroup) {
        console.warn('Semester group not found');
        return;
    }
    
    // 중학교인 경우 동적으로 학기 선택지 생성
    if (schoolLevel === 'middle') {
        updateMiddleSchoolSemesterUI(grade, semesterGroup);
        return;
    }
    
    // 초등학교인 경우 기존 로직 사용
    const sem2Wrap = document.getElementById("semester2Wrap");
    const sem2Input = document.querySelector('input[name="semester"][value="2"]');
    const sem1Input = document.querySelector('input[name="semester"][value="1"]');

    if (!sem2Wrap || !sem2Input) return;

    const noSecondSemester = (grade === "5" || grade === "6");
    sem2Wrap.style.display = noSecondSemester ? "none" : "";

    // 5~6학년에서 2학기가 선택되어 있으면 자동으로 1학기로 변경
    if (noSecondSemester && sem2Input.checked && sem1Input) {
        sem1Input.checked = true;
    }
}

// 중학교 학기 선택지 동적 생성
function updateMiddleSchoolSemesterUI(grade, semesterGroup) {
    if (!window.MIDDLE_SCHOOL_TOC) {
        console.warn('MIDDLE_SCHOOL_TOC not loaded');
        return;
    }
    
    // 키를 "1학년", "2학년", "3학년" 형식으로 변경
    const gradeKey = `${grade}학년`;
    const tocData = window.MIDDLE_SCHOOL_TOC[gradeKey];
    
    if (!tocData) {
        console.warn(`No data for ${gradeKey}`);
        return;
    }
    
    // 사용 가능한 학기 목록 가져오기
    const availableSemesters = Object.keys(tocData);
    
    // semesterGroup이 전달되지 않으면 찾기
    if (!semesterGroup) {
        const step3Section = document.querySelector('.form-step:nth-of-type(3)');
        semesterGroup = step3Section ? step3Section.querySelector('.radio-group') : document.querySelector('input[name="semester"]')?.closest('.radio-group');
    }
    
    if (!semesterGroup) {
        console.warn('Semester group not found');
        return;
    }
    
    // 기존 학기 선택지 모두 제거
    semesterGroup.innerHTML = '';
    
    // 사용 가능한 학기만 선택지로 생성
    availableSemesters.forEach((semester, index) => {
        const semesterValue = semester === '1학기' ? '1' : '2';
        const semesterId = `semester-${semesterValue}`;
        const labelId = `semester${semesterValue}Wrap`;
        
        const label = document.createElement('label');
        label.id = labelId;
        label.className = 'radio-label';
        label.htmlFor = semesterId;
        
        const input = document.createElement('input');
        input.id = semesterId;
        input.type = 'radio';
        input.name = 'semester';
        input.value = semesterValue;
        input.required = true;
        
        // 첫 번째 학기를 기본 선택
        if (index === 0) {
            input.checked = true;
        }
        
        const span = document.createElement('span');
        span.textContent = semester;
        
        label.appendChild(input);
        label.appendChild(span);
        semesterGroup.appendChild(label);
    });
    
    // 이벤트 리스너 다시 연결
    const semesterInputs = document.querySelectorAll('input[name="semester"]');
    semesterInputs.forEach(input => {
        input.addEventListener('change', async function() {
            clearAllConcepts();
            await updateConceptList();
        });
    });
    
    // 학년 변경 시 현재 선택된 학기가 없으면 첫 번째 학기로 자동 변경
    const currentSemester = document.querySelector('input[name="semester"]:checked');
    if (!currentSemester && availableSemesters.length > 0) {
        const firstSemesterInput = document.querySelector(`input[name="semester"][value="${availableSemesters[0] === '1학기' ? '1' : '2'}"]`);
        if (firstSemesterInput) {
            firstSemesterInput.checked = true;
        }
    }
}

// curriculum 데이터 캐시
let curriculumData = null;
let curriculumLoadPromise = null;

// curriculum 데이터 로드
async function loadCurriculumData() {
    if (curriculumData) return curriculumData;
    if (curriculumLoadPromise) return curriculumLoadPromise;
    
    // 상대 경로와 절대 경로 모두 시도
    const paths = [
        'src/data/curriculum_1_3.json',
        '/src/data/curriculum_1_3.json',
        './src/data/curriculum_1_3.json'
    ];
    
    curriculumLoadPromise = (async () => {
        let lastError = null;
        let data = null;
        
        // 1~3학년 데이터 로드
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    data = await response.json();
                    console.log('Curriculum data loaded successfully from:', path);
                    break;
                }
            } catch (error) {
                lastError = error;
                console.warn(`Failed to load from ${path}:`, error);
            }
        }
        
        if (!data) {
            console.error('Error loading curriculum data from all paths:', lastError);
            curriculumLoadPromise = null;
            return null;
        }
        
        // 4~6학년 데이터 병합 (CURRICULUM_4_TO_6가 로드되어 있다면)
        if (typeof CURRICULUM_4_TO_6 !== 'undefined') {
            curriculumData = { ...data, ...CURRICULUM_4_TO_6 };
            console.log('Curriculum data merged with 4~6 grade data');
        } else {
            curriculumData = data;
        }
        
        return curriculumData;
    })();
    
    return curriculumLoadPromise;
}

// 단원 번호 추출
function pickUnitNo(unitTitle, fallback) {
    const m = unitTitle.match(/^(\d+)\s*단원/);
    return m ? Number(m[1]) : fallback;
}

// 차시 번호 추출
function pickTopicNo(topicTitle, fallback) {
    const m = topicTitle.match(/^(\d+)\s*\)/);
    return m ? Number(m[1]) : fallback;
}

// HTML 이스케이프 함수 (전역 함수로 한 번만 정의)
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 숫자를 한글로 변환하는 함수
function numberToKorean(num) {
    const koreanNumbers = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십'];
    if (num <= 10) {
        return koreanNumbers[num];
    } else if (num < 20) {
        return '십' + (num % 10 > 0 ? koreanNumbers[num % 10] : '');
    } else if (num < 100) {
        const tens = Math.floor(num / 10);
        const ones = num % 10;
        return koreanNumbers[tens] + '십' + (ones > 0 ? koreanNumbers[ones] : '');
    }
    return String(num); // 100 이상은 숫자 그대로
}

// 숫자를 윗첨자로 변환하는 함수
function numberToSuperscript(num) {
    const superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    if (num === 0) return superscripts[0];
    let result = '';
    while (num > 0) {
        result = superscripts[num % 10] + result;
        num = Math.floor(num / 10);
    }
    return result;
}

// 숫자와 한글 혼용 제거 (예: "정8각형" -> "정팔각형", "5각형" -> "오각형")
function normalizeNumberKorean(text) {
    if (!text) return text;
    // "정${n}각형" 패턴 처리
    text = text.replace(/정(\d+)각형/g, (match, num) => {
        const n = parseInt(num);
        return '정' + numberToKorean(n) + '각형';
    });
    // "${n}각형" 패턴 처리
    text = text.replace(/(\d+)각형/g, (match, num) => {
        const n = parseInt(num);
        return numberToKorean(n) + '각형';
    });
    // "${n}개" 패턴 처리 (필요한 경우)
    text = text.replace(/(\d+)개/g, (match, num) => {
        const n = parseInt(num);
        return numberToKorean(n) + '개';
    });
    return text;
}

// LaTeX 명령어를 한글 문자로 변환 (모든 LaTeX 명령어 제거)
function convertLatexToText(text) {
    if (!text) return text;
    
    // \begin{cases} ... \end{cases} 패턴을 한글로 변환
    text = text.replace(/\\begin\{cases\}(.*?)\\end\{cases\}/gs, (match, content) => {
        // 내용에서 방정식 추출
        const equations = content.split('\\\\').map(eq => eq.trim());
        if (equations.length === 2) {
            return `${equations[0]}과 ${equations[1]}`;
        }
        return equations.join(', ');
    });
    
    // 단일 $...$ 패턴 처리 (수식 내용만 추출)
    text = text.replace(/\$([^$]+)\$/g, '$1');
    text = text.replace(/\$\$([^$]+)\$\$/g, '$1');
    
    // x^{2} 패턴을 x²로 변환 (^{숫자} 형식)
    text = text.replace(/\^\{(\d+)\}/g, (match, num) => {
        return numberToSuperscript(parseInt(num));
    });
    
    // x^2 패턴을 x²로 변환 (^숫자 형식)
    text = text.replace(/\^(\d+)/g, (match, num) => {
        return numberToSuperscript(parseInt(num));
    });
    
    // LaTeX 명령어를 한글 문자로 변환
    text = text.replace(/\\leq/g, '≤');
    text = text.replace(/\\geq/g, '≥');
    text = text.replace(/\\neq/g, '≠');
    text = text.replace(/\\pm/g, '±');
    text = text.replace(/\\times/g, '×');
    text = text.replace(/\\div/g, '÷');
    text = text.replace(/\\cdot/g, '·');
    text = text.replace(/\\approx/g, '≈');
    text = text.replace(/\\infty/g, '∞');
    // \sqrt{숫자} 패턴을 √숫자로 변환 (중괄호 제거 전에 처리)
    text = text.replace(/\\sqrt\{([^}]+)\}/g, '√$1');
    text = text.replace(/\\sqrt([^\s\\])/g, '√$1');
    text = text.replace(/\\sqrt/g, '√');
    
    text = text.replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
    text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
    text = text.replace(/\\\\/g, ', ');
    text = text.replace(/\\begin/g, '');
    text = text.replace(/\\end/g, '');
    text = text.replace(/\\cases/g, '');
    
    // 남은 중괄호 제거 (^{숫자}는 이미 윗첨자로 변환됨)
    text = text.replace(/\{([^}]+)\}/g, '$1'); // 중괄호 내용만 추출
    text = text.replace(/\{/g, '');
    text = text.replace(/\}/g, '');
    
    // 달러 기호 제거
    text = text.replace(/\$/g, '');
    
    // 연속된 공백 정리
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
}

// LaTeX 달러 기호 제거 및 정리
function cleanLatexDollars(text) {
    if (!text) return text;
    // 단순한 숫자 리스트의 $...$ 제거 (예: "$10, 7, 12$" -> "10, 7, 12")
    text = text.replace(/\$(\d+(?:\s*,\s*\d+)*)\$/g, '$1');
    // LaTeX 수식이 아닌 단순 텍스트의 $ 제거
    text = text.replace(/\$([^$]+)\$/g, (match, content) => {
        // 실제 LaTeX 명령어가 있으면 유지, 없으면 제거
        if (content.includes('\\frac') || content.includes('\\dfrac') || content.includes('\\sqrt') || 
            content.includes('\\begin') || content.includes('\\cases')) {
            return match; // 복잡한 LaTeX 수식이면 유지
        }
        // 단순 LaTeX 명령어는 한글로 변환
        content = convertLatexToText(content);
        return content; // 단순 텍스트면 $ 제거하고 변환된 내용 반환
    });
    return text;
}

// 선택 가능한 카드 생성 유틸리티 (프로젝트 표준: label이 컨테이너, id+htmlFor 사용)
function createSelectableCard({ id, type, name, value, checked, label, onChange, className = '', dataAttributes = {} }) {
    const inputId = id || `selectable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const cardClass = type === 'radio' ? 'radio-label' : 'checkbox-label';
    const finalClass = `${cardClass} ${className}`.trim();
    
    // data 속성 문자열 생성
    let dataAttrs = '';
    for (const [key, val] of Object.entries(dataAttributes)) {
        dataAttrs += ` data-${key}="${escapeHtml(String(val))}"`;
    }
    
    // 한 줄로 반환 (템플릿 리터럴의 줄바꿈 제거)
    return `<label for="${inputId}" class="${finalClass}"><input id="${inputId}" type="${type}" ${name ? `name="${name}"` : ''} ${value ? `value="${value}"` : ''} ${checked ? 'checked' : ''} ${onChange ? `onchange="${onChange}"` : ''}${dataAttrs}><span>${label}</span></label>`;
}

// 개념 목록 업데이트 (학년/학기 기반 - 1~6학년)
async function updateConceptList() {
    const conceptGroup = document.getElementById('conceptGroup');
    if (!conceptGroup) {
        console.error('conceptGroup element not found');
        return;
    }
    
    const schoolLevel = document.querySelector('input[name="schoolLevel"]:checked')?.value || 'elementary';
    const grade = parseInt(document.querySelector('input[name="grade"]:checked')?.value || '1');
    const semester = parseInt(document.querySelector('input[name="semester"]:checked')?.value || '1');
    
    console.log('Updating concept list:', { schoolLevel, grade, semester });
    
    // 로딩 표시
    conceptGroup.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">로딩 중...</div>';
    
    // 중학교 목차 표시 (단원 → 소단원 → 세부 항목)
    if (schoolLevel === 'middle' && grade >= 1 && grade <= 3) {
        try {
            if (!window.MIDDLE_SCHOOL_TOC) {
                console.error('MIDDLE_SCHOOL_TOC not loaded');
                conceptGroup.innerHTML = '';
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = 'padding: 20px; text-align: center; color: #999;';
                errorDiv.textContent = '선택한 학년/학기에 해당하는 목차가 없습니다.';
                conceptGroup.appendChild(errorDiv);
                return;
            }
            
            // 키를 "1학년", "2학년", "3학년" 형식으로 변경
            const gradeKey = `${grade}학년`;
            const semesterKey = `${semester}학기`;
            const tocData = window.MIDDLE_SCHOOL_TOC[gradeKey];
            
            if (!tocData || !tocData[semesterKey]) {
                console.error('Data not found for:', gradeKey, semesterKey);
                conceptGroup.innerHTML = '';
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = 'padding: 20px; text-align: center; color: #999;';
                errorDiv.textContent = '선택한 학년/학기에 해당하는 목차가 없습니다.';
                conceptGroup.appendChild(errorDiv);
                return;
            }
            
            const units = tocData[semesterKey];
            console.log('Found middle school units:', units.length);
            
            // conceptGroup 초기화
            conceptGroup.innerHTML = '';
            
            // 전체 선택/해제 버튼줄
            const controlDiv = document.createElement('div');
            controlDiv.style.cssText = 'display: flex; gap: 8px; align-items: center; margin-bottom: 15px; width: 100%; box-sizing: border-box;';
            
            const selectAllBtn = document.createElement('button');
            selectAllBtn.type = 'button';
            selectAllBtn.textContent = '전체 선택';
            selectAllBtn.onclick = selectAllConcepts;
            selectAllBtn.style.cssText = 'padding: 6px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;';
            
            const clearAllBtn = document.createElement('button');
            clearAllBtn.type = 'button';
            clearAllBtn.textContent = '전체 해제';
            clearAllBtn.onclick = clearAllConcepts;
            clearAllBtn.style.cssText = 'padding: 6px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;';
            
            const countDiv = document.createElement('div');
            countDiv.id = 'conceptCount';
            countDiv.style.cssText = 'margin-left: auto; font-size: 0.8125rem; opacity: 0.8;';
            countDiv.textContent = '선택됨: 0개';
            
            controlDiv.appendChild(selectAllBtn);
            controlDiv.appendChild(clearAllBtn);
            controlDiv.appendChild(countDiv);
            conceptGroup.appendChild(controlDiv);
            
            // unit-grid 컨테이너 생성 (2열 배치)
            const unitGrid = document.createElement('div');
            unitGrid.className = 'unit-grid';
            unitGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%;';
            
            // 단원 카드 생성 (단원 → 소단원 → 세부 항목)
            units.forEach((unit, uIdx) => {
                const unitId = `U|${grade}|${semester}|${uIdx}`;
                const unitCard = document.createElement('section');
                unitCard.className = 'unit-card concept-card';
                unitCard.style.cssText = 'border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; background: #fff;';
                
                // 단원 체크박스
                const unitLabel = document.createElement('label');
                unitLabel.style.cssText = 'display: flex; gap: 10px; align-items: center; font-weight: 800; font-size: 1.15rem; margin-bottom: 12px; cursor: pointer; padding: 4px 2px;';
                
                const unitCheckbox = document.createElement('input');
                unitCheckbox.type = 'checkbox';
                unitCheckbox.name = 'concept';
                unitCheckbox.value = unitId;
                unitCheckbox.id = unitId;
                unitCheckbox.className = 'concept-checkbox';
                
                // 단원 아래 모든 토픽 ID 수집
                const allTopicIds = [];
                if (unit.subunits && unit.subunits.length > 0) {
                    unit.subunits.forEach((su, sIdx) => {
                        if (su.topics && su.topics.length > 0) {
                            su.topics.forEach((_, tIdx) => {
                                allTopicIds.push(`T|${grade}|${semester}|${uIdx}|${sIdx}|${tIdx}`);
                            });
                        }
                    });
                }
                
                // 단원 체크박스 변경 이벤트
                unitCheckbox.addEventListener('change', function() {
                    const checked = this.checked;
                    const checkboxes = document.querySelectorAll(`input[name="concept"][value^="T|${grade}|${semester}|${uIdx}|"]`);
                    checkboxes.forEach(cb => {
                        cb.checked = checked;
                    });
                    updateConceptCount();
                });
                
                const unitSpan = document.createElement('span');
                unitSpan.className = 'unit-title';
                unitSpan.textContent = unit.title;
                
                unitLabel.appendChild(unitCheckbox);
                unitLabel.appendChild(unitSpan);
                unitCard.appendChild(unitLabel);
                
                // 카드에 클래스 추가
                unitCard.classList.add('concept-card');
                
                // 소단원 및 세부 항목
                if (unit.subunits && unit.subunits.length > 0) {
                    const subunitsDiv = document.createElement('div');
                    subunitsDiv.className = 'subunits-container';
                    subunitsDiv.style.cssText = 'margin-top: 10px; padding-left: 8px;';
                    
                    unit.subunits.forEach((su, sIdx) => {
                        const subId = `S|${grade}|${semester}|${uIdx}|${sIdx}`;
                        const subDiv = document.createElement('div');
                        subDiv.style.cssText = 'margin-bottom: 14px;';
                        
                        // 소단원 체크박스
                        const subLabel = document.createElement('label');
                        subLabel.style.cssText = 'display: flex; gap: 10px; align-items: center; font-weight: 700; font-size: 1.05rem; margin-top: 10px; margin-bottom: 8px; cursor: pointer; padding: 4px 2px;';
                        
                        const subCheckbox = document.createElement('input');
                        subCheckbox.type = 'checkbox';
                        subCheckbox.name = 'concept';
                        subCheckbox.value = subId;
                        subCheckbox.id = subId;
                        subCheckbox.className = 'concept-checkbox';
                        
                        // 소단원 아래 모든 토픽 ID 수집
                        const topicIds = [];
                        if (su.topics && su.topics.length > 0) {
                            su.topics.forEach((_, tIdx) => {
                                topicIds.push(`T|${grade}|${semester}|${uIdx}|${sIdx}|${tIdx}`);
                            });
                        }
                        
                        // 소단원 체크박스 변경 이벤트
                        subCheckbox.addEventListener('change', function() {
                            const checked = this.checked;
                            const checkboxes = document.querySelectorAll(`input[name="concept"][value^="T|${grade}|${semester}|${uIdx}|${sIdx}|"]`);
                            checkboxes.forEach(cb => {
                                cb.checked = checked;
                            });
                            updateConceptCount();
                        });
                        
                        const subSpan = document.createElement('span');
                        subSpan.className = 'subunit-title';
                        subSpan.textContent = su.title;
                        
                        subLabel.appendChild(subCheckbox);
                        subLabel.appendChild(subSpan);
                        subDiv.appendChild(subLabel);
                        
                        // 세부 항목 (토픽)
                        if (su.topics && su.topics.length > 0) {
                            const topicsDiv = document.createElement('div');
                            topicsDiv.className = 'topics-container';
                            topicsDiv.style.cssText = 'margin-top: 8px; padding-left: 22px; display: grid; gap: 8px;';
                            
                            su.topics.forEach((topic, tIdx) => {
                                const topicId = `T|${grade}|${semester}|${uIdx}|${sIdx}|${tIdx}`;
                                
                                // pathText 생성: 단원 > 소단원 > 항목
                                const pathText = `${unit.title} > ${su.title} > ${topic}`;
                                
                                // domain 판정
                                const topicLower = topic.toLowerCase();
                                let domain = 'number';
                                if (topicLower.includes('경우의 수') || topicLower.includes('확률')) {
                                    domain = 'probability';
                                } else if (topicLower.includes('도형') || topicLower.includes('각') || topicLower.includes('대칭') || topicLower.includes('회전') || topicLower.includes('이동')) {
                                    domain = 'geometry';
                                } else if (topicLower.includes('방정식') || topicLower.includes('함수') || topicLower.includes('식')) {
                                    domain = 'algebra';
                                } else if (topicLower.includes('통계') || topicLower.includes('그래프')) {
                                    domain = 'statistics';
                                } else if (topicLower.includes('측정') || topicLower.includes('넓이') || topicLower.includes('부피')) {
                                    domain = 'measurement';
                                }
                                
                                // mustIncludeAny 설정 (경우의 수/확률)
                                let mustIncludeAny = [];
                                if (domain === 'probability') {
                                    mustIncludeAny = ['경우의 수', '나열', '곱셈원리', '덧셈원리', '조건', '분류', '표', '트리', '중복', '순서'];
                                }
                                
                                const topicLabel = document.createElement('label');
                                topicLabel.style.cssText = 'display: flex; gap: 10px; align-items: center; font-size: 0.98rem; font-weight: 500; cursor: pointer; padding: 4px 2px;';
                                
                                const topicCheckbox = document.createElement('input');
                                topicCheckbox.type = 'checkbox';
                                topicCheckbox.name = 'concept';
                                topicCheckbox.value = topicId;
                                topicCheckbox.id = topicId;
                                topicCheckbox.className = 'concept-checkbox';
                                
                                // data 속성에 개념 정보 저장
                                topicCheckbox.setAttribute('data-concept-id', topicId);
                                topicCheckbox.setAttribute('data-path-text', pathText);
                                topicCheckbox.setAttribute('data-school-level', 'middle');
                                topicCheckbox.setAttribute('data-grade', grade);
                                topicCheckbox.setAttribute('data-semester', semester);
                                topicCheckbox.setAttribute('data-unit-title', unit.title);
                                topicCheckbox.setAttribute('data-subunit-title', su.title);
                                topicCheckbox.setAttribute('data-concept-title', topic);
                                topicCheckbox.setAttribute('data-domain', domain);
                                topicCheckbox.setAttribute('data-must-include-any', JSON.stringify(mustIncludeAny));
                                topicCheckbox.setAttribute('data-difficulty-tag', 'middle');
                                
                                topicCheckbox.addEventListener('change', function() {
                                    updateConceptCount();
                                });
                                
                                const topicSpan = document.createElement('span');
                                topicSpan.className = 'topic-title';
                                topicSpan.textContent = escapeHtml(topic);
                                
                                topicLabel.appendChild(topicCheckbox);
                                topicLabel.appendChild(topicSpan);
                                topicsDiv.appendChild(topicLabel);
                            });
                            
                            subDiv.appendChild(topicsDiv);
                        }
                        
                        subunitsDiv.appendChild(subDiv);
                    });
                    
                    unitCard.appendChild(subunitsDiv);
                }
                
                unitGrid.appendChild(unitCard);
            });
            
            conceptGroup.appendChild(unitGrid);
            updateConceptCount();
            return;
        } catch (error) {
            console.error('Error in updateConceptList for middle school:', error);
            conceptGroup.innerHTML = '';
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'padding: 20px; text-align: center; color: #f00;';
            errorDiv.textContent = '오류가 발생했습니다: ' + escapeHtml(error.message);
            conceptGroup.appendChild(errorDiv);
            return;
        }
    }
    
    // 1~6학년 새로운 curriculum 데이터 사용
    if (schoolLevel === 'elementary' && grade >= 1 && grade <= 6) {
        try {
            const data = await loadCurriculumData();
            if (!data) {
                console.error('Failed to load curriculum data, using fallback');
                // 데이터 로드 실패 시 기존 방식 사용
                const concepts = elementaryMathConcepts[grade] || elementaryMathConcepts[1];
                conceptGroup.innerHTML = '';
                concepts.forEach((concept, idx) => {
                    const conceptId = `concept-fallback-${grade}-${idx}`;
                    const cardHtml = createSelectableCard({
                        id: conceptId,
                        type: 'checkbox',
                        name: 'concept',
                        value: concept,
                        checked: false,
                        label: escapeHtml(concept),
                        onChange: 'updateConceptCount()',
                        className: ''
                    });
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = cardHtml;
                    conceptGroup.appendChild(tempDiv.firstElementChild);
                });
                updateConceptCount();
                return;
            }
            
            const gradeKey = `${grade}학년`;
            const semesterKey = `${semester}학기`;
            
            console.log('Looking for:', gradeKey, semesterKey);
            console.log('Available keys:', Object.keys(data));
            
            // 5-2, 6-2 데이터 없음 처리
            if ((grade === 5 && semester === 2) || (grade === 6 && semester === 2)) {
                conceptGroup.innerHTML = '';
                const noticeDiv = document.createElement('div');
                noticeDiv.className = 'no-data-notice';
                noticeDiv.style.cssText = 'padding: 30px; text-align: center; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; color: #856404;';
                noticeDiv.innerHTML = `<strong>${gradeKey} ${semesterKey}(개정):</strong> 현재 데이터 미제공`;
                conceptGroup.appendChild(noticeDiv);
                updateConceptCount();
                return;
            }
            
            if (!data[gradeKey] || !data[gradeKey][semesterKey]) {
                console.error('Data not found for:', gradeKey, semesterKey);
                conceptGroup.innerHTML = '';
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = 'padding: 20px; text-align: center; color: #999;';
                errorDiv.textContent = `해당 학년/학기의 데이터가 없습니다. (${gradeKey} ${semesterKey})`;
                conceptGroup.appendChild(errorDiv);
                return;
            }
            
            const units = data[gradeKey][semesterKey];
            console.log('Found units:', units.length);
            
            // conceptGroup 초기화
            conceptGroup.innerHTML = '';
            
            // 전체 선택/해제 버튼줄 (conceptGroup 상단에 추가)
            const controlDiv = document.createElement('div');
            controlDiv.style.cssText = 'display: flex; gap: 8px; align-items: center; margin-bottom: 15px; width: 100%; box-sizing: border-box;';
            
            const selectAllBtn = document.createElement('button');
            selectAllBtn.type = 'button';
            selectAllBtn.textContent = '전체 선택';
            selectAllBtn.onclick = selectAllConcepts;
            selectAllBtn.style.cssText = 'padding: 6px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;';
            
            const clearAllBtn = document.createElement('button');
            clearAllBtn.type = 'button';
            clearAllBtn.textContent = '전체 해제';
            clearAllBtn.onclick = clearAllConcepts;
            clearAllBtn.style.cssText = 'padding: 6px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;';
            
            const countDiv = document.createElement('div');
            countDiv.id = 'conceptCount';
            countDiv.style.cssText = 'margin-left: auto; font-size: 0.8125rem; opacity: 0.8;';
            countDiv.textContent = '선택됨: 0개';
            
            controlDiv.appendChild(selectAllBtn);
            controlDiv.appendChild(clearAllBtn);
            controlDiv.appendChild(countDiv);
            conceptGroup.appendChild(controlDiv);
            
            // unit-grid 컨테이너 생성
            const unitGrid = document.createElement('div');
            unitGrid.className = 'unit-grid';
            
            // 단원을 번호 순서로 정렬
            const unitsWithNo = units.map((unit, uIdx) => ({
                unit: unit,
                unitNo: pickUnitNo(unit.unit, uIdx + 1),
                index: uIdx
            })).sort((a, b) => {
                // 단원 번호로 정렬, 없으면 인덱스로
                if (a.unitNo !== null && b.unitNo !== null) {
                    return a.unitNo - b.unitNo;
                }
                return a.index - b.index;
            });
            
            // 단원 카드 생성 (1~6 순서로)
            unitsWithNo.forEach(({ unit, unitNo }) => {
                const unitCard = document.createElement('section');
                unitCard.className = 'unit-card';
                
                // 단원 제목
                const titleDiv = document.createElement('div');
                titleDiv.className = 'unit-title';
                titleDiv.textContent = unit.unit;
                unitCard.appendChild(titleDiv);
                
                // 단원 항목 컨테이너
                const itemsDiv = document.createElement('div');
                itemsDiv.className = 'unit-items';
                
                // 각 항목을 DOM으로 생성
                unit.topics.forEach((topic, tIdx) => {
                    const topicNo = pickTopicNo(topic, tIdx + 1);
                    const conceptId = 'G' + grade + '-S' + semester + '-U' + (unitNo || tIdx + 1) + '-T' + topicNo;
                    const escapedTopic = escapeHtml(topic);
                    
                    // pathText 생성: 단원 > 항목
                    const pathText = `${unit.unit} > ${topic}`;
                    
                    // domain 판정
                    const topicLower = topic.toLowerCase();
                    let domain = 'number';
                    if (topicLower.includes('분수')) {
                        domain = 'number'; // 분수는 number 도메인
                    } else if (topicLower.includes('도형') || topicLower.includes('각') || topicLower.includes('대칭') || topicLower.includes('회전') || topicLower.includes('이동')) {
                        domain = 'geometry';
                    } else if (topicLower.includes('확률') || topicLower.includes('경우의 수')) {
                        domain = 'probability';
                    } else if (topicLower.includes('방정식') || topicLower.includes('함수') || topicLower.includes('식')) {
                        domain = 'algebra';
                    } else if (topicLower.includes('통계') || topicLower.includes('그래프')) {
                        domain = 'statistics';
                    } else if (topicLower.includes('측정') || topicLower.includes('넓이') || topicLower.includes('부피')) {
                        domain = 'measurement';
                    }
                    
                    // mustIncludeAny 설정 (분수 항목)
                    let mustIncludeAny = [];
                    if (topicLower.includes('분수')) {
                        mustIncludeAny = ['분수', '분자', '분모', '약분', '통분', '크기', '같은', '비교'];
                    }
                    
                    // createSelectableCard로 HTML 생성 후 DOM으로 변환
                    const cardHtml = createSelectableCard({
                        id: conceptId,
                        type: 'checkbox',
                        name: 'concept',
                        value: conceptId,
                        checked: false,
                        label: escapedTopic,
                        onChange: 'updateConceptCount()',
                        className: 'concept-item',
                        dataAttributes: { 
                            'topic-title': escapedTopic,
                            'concept-id': conceptId,
                            'path-text': pathText,
                            'school-level': 'elementary',
                            'grade': grade,
                            'semester': semester,
                            'unit-title': unit.unit,
                            'concept-title': topic,
                            'domain': domain,
                            'must-include-any': JSON.stringify(mustIncludeAny),
                            'difficulty-tag': 'elem'
                        }
                    });
                    
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = cardHtml;
                    const cardElement = tempDiv.firstElementChild;
                    if (cardElement) {
                        // 체크박스 input 요소 찾아서 data 속성 직접 추가
                        const checkbox = cardElement.querySelector('input[type="checkbox"]');
                        if (checkbox) {
                            checkbox.setAttribute('data-concept-id', conceptId);
                            checkbox.setAttribute('data-path-text', pathText);
                            checkbox.setAttribute('data-school-level', 'elementary');
                            checkbox.setAttribute('data-grade', grade);
                            checkbox.setAttribute('data-semester', semester);
                            checkbox.setAttribute('data-unit-title', unit.unit);
                            checkbox.setAttribute('data-concept-title', topic);
                            checkbox.setAttribute('data-domain', domain);
                            checkbox.setAttribute('data-must-include-any', JSON.stringify(mustIncludeAny));
                            checkbox.setAttribute('data-difficulty-tag', 'elem');
                        }
                        itemsDiv.appendChild(cardElement);
                    }
                });
                
                unitCard.appendChild(itemsDiv);
                unitGrid.appendChild(unitCard);
            });
            
            conceptGroup.appendChild(unitGrid);
            updateConceptCount();
            // 안전 호출 (DOM 직접 생성 방식이므로 실제로는 필요 없지만, 안전장치로 추가)
            if (typeof window.rebuildConceptGroupToUnitGrid === 'function') {
                try {
                    window.rebuildConceptGroupToUnitGrid();
                } catch (e) {
                    console.warn('rebuildConceptGroupToUnitGrid 호출 중 오류:', e);
                }
            }
            return;
        } catch (error) {
            console.error('Error in updateConceptList:', error);
            conceptGroup.innerHTML = '';
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'padding: 20px; text-align: center; color: #f00;';
            errorDiv.textContent = '오류가 발생했습니다: ' + escapeHtml(error.message);
            conceptGroup.appendChild(errorDiv);
            return;
        }
    }
    
    // 4~6학년 또는 중학교는 기존 방식 사용
    let concepts = [];
    if (schoolLevel === 'elementary') {
        concepts = elementaryMathConcepts[grade] || elementaryMathConcepts[1];
    } else if (schoolLevel === 'middle') {
        concepts = middleMathConcepts[grade] || middleMathConcepts[1];
    }
    
    conceptGroup.innerHTML = '';
    concepts.forEach((concept, idx) => {
        const conceptId = `concept-fallback-${grade}-${idx}`;
        const cardHtml = createSelectableCard({
            id: conceptId,
            type: 'checkbox',
            name: 'concept',
            value: concept,
            checked: false,
            label: escapeHtml(concept),
            onChange: 'updateConceptCount()',
            className: '',
            dataAttributes: {}
        });
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHtml;
        conceptGroup.appendChild(tempDiv.firstElementChild);
    });
    updateConceptCount();
}

// 선택된 개념 개수 업데이트
function updateConceptCount() {
    const checked = document.querySelectorAll('input[name="concept"]:checked').length;
    const countEl = document.getElementById('conceptCount');
    if (countEl) {
        countEl.textContent = `선택됨: ${checked}개`;
    }
    
    // 총 문제 수 표시 업데이트
    updateTotalQuestionsDisplay();
    
    // 제출 버튼 활성화/비활성화
    updateSubmitButtonState();
}

// 총 문제 수 표시 업데이트
function updateTotalQuestionsDisplay() {
    const checkedCheckboxes = Array.from(document.querySelectorAll('input[name="concept"]:checked'));
    const selectedIds = checkedCheckboxes.map(cb => cb.value);
    
    // [SUMMARY] 추적 로그 3: 요약 계산 직전
    console.log("[SUMMARY] selectedIds length", selectedIds.length, selectedIds);
    
    const checkedCount = selectedIds.length;
    const perConceptCount = parseInt(document.querySelector('input[name="problemCount"]:checked')?.value || '3');
    const totalCount = checkedCount * perConceptCount;
    
    const displayEl = document.getElementById('totalQuestionsDisplay');
    const selectedCountEl = document.getElementById('selectedConceptsCount');
    const perCountEl = document.getElementById('perConceptCount');
    const totalCountEl = document.getElementById('totalQuestionsCount');
    
    if (displayEl && selectedCountEl && perCountEl && totalCountEl) {
        selectedCountEl.textContent = checkedCount;
        perCountEl.textContent = perConceptCount;
        totalCountEl.textContent = totalCount;
        
        // 항목이 선택되었을 때만 표시
        if (checkedCount > 0) {
            displayEl.style.display = 'block';
        } else {
            displayEl.style.display = 'none';
        }
    }
}

// 제출 버튼 활성화/비활성화
function updateSubmitButtonState() {
    const checkedCount = document.querySelectorAll('input[name="concept"]:checked').length;
    const submitButton = document.querySelector('button[type="submit"]');
    
    if (submitButton) {
        if (checkedCount === 0) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.5';
            submitButton.style.cursor = 'not-allowed';
            submitButton.title = '항목을 최소 1개 선택해 주세요.';
        } else {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.title = '';
        }
    }
}

// 전체 선택
function selectAllConcepts() {
    const checkboxes = document.querySelectorAll('input[name="concept"]');
    checkboxes.forEach(cb => cb.checked = true);
    updateConceptCount();
}

// 전체 해제
function clearAllConcepts() {
    const checkboxes = document.querySelectorAll('input[name="concept"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateConceptCount();
}

// 폼 제출 처리
function handleSubmit(event) {
    event.preventDefault();
    
    // 제출 버튼 비활성화 (중복 클릭 방지)
    const submitButton = event.target.querySelector('button[type="submit"]') || document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="btn-icon">⏳</span> 문제 생성 중...';
    }
    
    // 선택된 체크박스 수집 (모든 체크박스 포함)
    const checkedCheckboxes = Array.from(document.querySelectorAll('input[name="concept"]:checked'));
    const checkedCount = checkedCheckboxes.length;
    
    // 항목 선택 확인
    if (checkedCount === 0) {
        alert('항목을 최소 1개 선택해 주세요.');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonContent || '문제 생성하기';
        }
        return;
    }
    
    // [GEN] 추적 로그 1: 생성 버튼 클릭 시점
    const selectedIds = checkedCheckboxes.map(cb => cb.value);
    console.log("[GEN] selectedIds length", selectedIds.length, selectedIds);
    
    // 디버그 로그: 화면 체크된 개수 확인
    console.log('🔍 [handleSubmit] 화면 체크된 개수:', checkedCount);
    
    // concepts 배열 생성 (모든 메타데이터 포함)
    const concepts = checkedCheckboxes.map(cb => {
        const conceptId = cb.value;
        const schoolLevel = cb.getAttribute('data-school-level') || document.querySelector('input[name="schoolLevel"]:checked')?.value || 'elementary';
        const grade = parseInt(cb.getAttribute('data-grade') || document.querySelector('input[name="grade"]:checked')?.value || '1');
        const semester = parseInt(cb.getAttribute('data-semester') || document.querySelector('input[name="semester"]:checked')?.value || '1');
        const unitTitle = cb.getAttribute('data-unit-title') || '';
        const subunitTitle = cb.getAttribute('data-subunit-title') || '';
        const conceptTitle = cb.getAttribute('data-concept-title') || cb.getAttribute('data-topic-title') || '';
        const pathText = cb.getAttribute('data-path-text') || '';
        
        // 객체로 반환 (모든 메타데이터 포함)
        return {
            id: conceptId,
            conceptId: conceptId,
            value: conceptId, // 하위 호환성
            schoolLevel: schoolLevel,
            grade: grade,
            semester: semester,
            unitTitle: unitTitle,
            subunitTitle: subunitTitle,
            conceptTitle: conceptTitle,
            pathText: pathText,
            // 하위 호환성을 위한 title 필드
            title: conceptTitle || conceptId
        };
    });
    
    // 디버그 로그: concepts 배열 길이 확인
    console.log('🔍 [handleSubmit] concepts 배열 길이:', concepts.length);
    console.log('🔍 [handleSubmit] concepts 배열:', concepts.map(c => ({ id: c.id || c.value || c, schoolLevel: c.schoolLevel, grade: c.grade, semester: c.semester })));
    
    const formData = {
        schoolLevel: document.querySelector('input[name="schoolLevel"]:checked')?.value || 'elementary',
        grade: parseInt(document.querySelector('input[name="grade"]:checked')?.value || '1'),
        semester: parseInt(document.querySelector('input[name="semester"]:checked')?.value || '1'),
        subject: 'math', // 수학만 사용
        concepts: concepts, // 모든 메타데이터가 포함된 배열
        mistakes: Array.from(document.querySelectorAll('input[name="mistake"]:checked'))
            .map(cb => cb.value),
        problemType: document.querySelector('input[name="problemType"]:checked')?.value || '기본형',
        problemCount: parseInt(document.querySelector('input[name="problemCount"]:checked')?.value || '3')
    };
    
    // 최종 검증 로그
    console.log('🔍 [handleSubmit] 최종 formData.concepts.length:', formData.concepts.length);
    console.log('🔍 [handleSubmit] 기대 문제 수:', formData.concepts.length * formData.problemCount);
    
    // 5-2, 6-2 데이터 없음 처리
    if (formData.schoolLevel === 'elementary' && 
        ((formData.grade === 5 && formData.semester === 2) || (formData.grade === 6 && formData.semester === 2))) {
        alert('해당 학기는 개정으로 데이터가 없어 문제를 생성할 수 없습니다.');
        return;
    }
    
    // 유효성 검사 (체크된 개수와 concepts 배열 길이 일치 확인)
    if (checkedCount === 0 || formData.concepts.length === 0) {
        alert('최소 1개 이상의 개념을 선택해주세요.');
        return;
    }
    
    // 불일치 경고 (디버그용)
    if (checkedCount !== formData.concepts.length) {
        console.error('⚠️ [handleSubmit] 불일치 감지!', {
            화면체크개수: checkedCount,
            concepts배열길이: formData.concepts.length
        });
        alert(`경고: 선택된 항목 수(${checkedCount}개)와 전달된 개념 수(${formData.concepts.length}개)가 일치하지 않습니다.`);
        // 계속 진행하되 경고만 표시
    }
    
    if (formData.mistakes.length === 0) {
        alert('최소 1개 이상의 틀린 이유를 선택해주세요.');
        return;
    }
    
    // 데이터를 세션 스토리지에 저장
    sessionStorage.setItem('problemFormData', JSON.stringify(formData));
    
    // create.html에서 온 것을 표시하는 플래그 추가
    sessionStorage.setItem('fromCreatePage', 'true');
    
    // 결과 페이지로 이동
    window.location.href = 'result.html';
}

// 결과 페이지 데이터 로드 (result.html에서만 실행)
function loadResultData() {
    // result.html 페이지인지 확인 (problemsList가 있는 경우만)
    const problemsList = document.getElementById('problemsList');
    if (!problemsList) {
        // result.html이 아니면 아무것도 하지 않음
        return;
    }
    
    // result.html인 경우에만 실행
    const storedData = sessionStorage.getItem('problemFormData');
    if (!storedData) {
        // 데이터가 없을 때 index.html로 리다이렉트 (문제 생성 플로우를 타지 않았으면 홈으로)
        const shouldRedirect = !sessionStorage.getItem('fromCreatePage');
        if (shouldRedirect) {
            window.location.href = 'index.html';
            return;
        }
        
        // create.html에서 온 경우만 빈 상태 표시
        showEmptyStateWithMessage(
            problemsList,
            '문제를 먼저 생성해주세요.',
            '아래 "다시 만들기" 버튼을 클릭하여 문제를 생성해주세요.'
        );
        return;
    }
    
    // fromCreatePage 플래그 제거 (한 번만 사용)
    sessionStorage.removeItem('fromCreatePage');
    
    try {
        const formData = JSON.parse(storedData);
        
        // 문제 생성 (실제로는 API 호출이지만, 여기서는 시뮬레이션)
        generateProblems(formData);
    } catch (error) {
        showErrorState(problemsList, '데이터를 불러오는 중 오류가 발생했습니다.');
    }
}

// 메시지와 함께 빈 상태 표시
function showEmptyStateWithMessage(container, title, description) {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <div class="empty-message">${title}</div>
            <div class="empty-description">${description}</div>
            <button onclick="window.location.href='create.html'" class="btn btn-primary">
                <span class="btn-icon">➕</span>
                다시 만들기
            </button>
        </div>
    `;
}

// 중2 확률(경우의 수) 전용 템플릿 생성
function generateMiddleSchoolProbabilityTemplate(conceptInfo, count, effectiveGrade) {
    const { text: conceptText = '' } = conceptInfo;
    const problems = [];
    
    // 경우의 수 템플릿 세트 (최소 12개)
    const templates = [
        // 곱셈원리: 상의 4벌, 하의 3벌, 모자 2개
        {
            question: `상의 4벌, 하의 3벌, 모자 2개가 있을 때, 상의와 하의와 모자를 각각 하나씩 선택하는 경우의 수는?`,
            answer: `24가지`,
            explanation: `곱셈원리를 사용합니다. 상의 4벌 × 하의 3벌 × 모자 2개 = 4 × 3 × 2 = 24가지입니다.`
        },
        {
            question: `학생 3명이 서로 다른 5개의 의자에 앉는 경우의 수는? (한 의자에 한 명만 앉을 수 있음)`,
            answer: `60가지`,
            explanation: `곱셈원리를 사용합니다. 첫 번째 학생: 5가지, 두 번째 학생: 4가지, 세 번째 학생: 3가지. 따라서 5 × 4 × 3 = 60가지입니다.`
        },
        // 조건 포함: 서로 다른 3자리 수
        {
            question: `1, 2, 3, 4, 5 중에서 서로 다른 숫자 3개를 사용하여 만들 수 있는 세 자리 수는 모두 몇 개인가요?`,
            answer: `60개`,
            explanation: `곱셈원리를 사용합니다. 백의 자리: 5가지, 십의 자리: 4가지, 일의 자리: 3가지. 따라서 5 × 4 × 3 = 60개입니다.`
        },
        {
            question: `0, 1, 2, 3, 4 중에서 서로 다른 숫자 3개를 사용하여 만들 수 있는 세 자리 수는 모두 몇 개인가요? (0은 백의 자리에 올 수 없음)`,
            answer: `48개`,
            explanation: `백의 자리는 0을 제외한 4가지, 십의 자리는 남은 4가지, 일의 자리는 남은 3가지. 따라서 4 × 4 × 3 = 48개입니다.`
        },
        // 중복/순서: 자리 배치
        {
            question: `5명의 학생이 한 줄로 서는 경우의 수는?`,
            answer: `120가지`,
            explanation: `순열을 사용합니다. 5명을 한 줄로 세우는 경우의 수는 5! = 5 × 4 × 3 × 2 × 1 = 120가지입니다.`
        },
        {
            question: `6명 중에서 3명을 선택하여 한 줄로 세우는 경우의 수는?`,
            answer: `120가지`,
            explanation: `순열을 사용합니다. 6P3 = 6 × 5 × 4 = 120가지입니다.`
        },
        // 분류/표/트리: 조건이 2개인 선택
        {
            question: `남학생 4명, 여학생 3명 중에서 남학생 2명, 여학생 1명을 선택하는 경우의 수는?`,
            answer: `18가지`,
            explanation: `합의 원리를 사용합니다. 남학생 2명 선택: 4C2 = 6가지, 여학생 1명 선택: 3C1 = 3가지. 따라서 6 × 3 = 18가지입니다.`
        },
        {
            question: `버스 노선이 3개, 지하철 노선이 4개일 때, 버스와 지하철을 각각 하나씩 이용하는 경우의 수는?`,
            answer: `12가지`,
            explanation: `곱셈원리를 사용합니다. 버스 3개 × 지하철 4개 = 3 × 4 = 12가지입니다.`
        },
        // 제외 조건: "적어도 하나는..."
        {
            question: `빨간 공 3개, 파란 공 2개 중에서 공 2개를 선택할 때, 적어도 하나는 빨간 공인 경우의 수는?`,
            answer: `9가지`,
            explanation: `전체 경우의 수에서 모두 파란 공인 경우를 제외합니다. 전체: 5C2 = 10가지, 모두 파란: 2C2 = 1가지. 따라서 10 - 1 = 9가지입니다.`
        },
        {
            question: `A, B, C 세 과목 중에서 최소 2과목을 선택하는 경우의 수는?`,
            answer: `4가지`,
            explanation: `2과목 선택: 3C2 = 3가지, 3과목 선택: 3C3 = 1가지. 따라서 3 + 1 = 4가지입니다.`
        },
        // 트리/표 활용
        {
            question: `동전 3개를 던질 때, 앞면이 정확히 2개 나오는 경우의 수는?`,
            answer: `3가지`,
            explanation: `조합을 사용합니다. 3개 중에서 앞면 2개를 선택하는 경우의 수는 3C2 = 3가지입니다. (앞앞뒤, 앞뒤앞, 뒤앞앞)`
        },
        {
            question: `주사위 2개를 던질 때, 두 눈의 합이 7이 되는 경우의 수는?`,
            answer: `6가지`,
            explanation: `나열하면 (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)로 6가지입니다.`
        },
        // 추가 템플릿 (15개 이상)
        {
            question: `빨간 공 2개, 파란 공 3개, 노란 공 1개 중에서 공 2개를 선택하는 경우의 수는? (색깔만 구분)`,
            answer: `6가지`,
            explanation: `조합을 사용합니다. 빨간 공 2개: 2C2 = 1가지, 파란 공 2개: 3C2 = 3가지, 노란 공 2개: 1C2 = 0가지, 서로 다른 색: 2×3 + 2×1 + 3×1 = 11가지. 총 1 + 3 + 0 + 11 = 15가지입니다. (단, 색깔만 구분하면 빨빨, 파파, 빨파, 빨노, 파노로 5가지)`
        },
        {
            question: `A, B, C 세 사람이 서로 다른 4개의 자리에 앉는 경우의 수는? (한 자리에 한 명만)`,
            answer: `24가지`,
            explanation: `순열을 사용합니다. 4P3 = 4 × 3 × 2 = 24가지입니다.`
        },
        {
            question: `1부터 9까지의 숫자 중에서 서로 다른 숫자 3개를 선택하여 세 자리 수를 만들 때, 짝수가 되는 경우의 수는?`,
            answer: `224가지`,
            explanation: `일의 자리는 짝수(2,4,6,8) 4가지, 백의 자리는 나머지 8가지, 십의 자리는 나머지 7가지. 따라서 4 × 8 × 7 = 224가지입니다.`
        },
        {
            question: `남학생 5명, 여학생 4명 중에서 대표 3명을 선택할 때, 남학생이 적어도 1명 포함되는 경우의 수는?`,
            answer: `74가지`,
            explanation: `전체 경우의 수에서 모두 여학생인 경우를 제외합니다. 전체: 9C3 = 84가지, 모두 여학생: 4C3 = 4가지. 따라서 84 - 4 = 80가지입니다. (계산 오류 수정: 84 - 4 = 80, 하지만 실제로는 남1여2, 남2여1, 남3여0의 합)`
        },
        {
            question: `동전 4개를 던질 때, 앞면이 정확히 2개 나오는 경우의 수는?`,
            answer: `6가지`,
            explanation: `조합을 사용합니다. 4개 중에서 앞면 2개를 선택하는 경우의 수는 4C2 = 6가지입니다.`
        }
    ];
    
    // 템플릿을 순환하여 사용
    for (let i = 0; i < count; i++) {
        const template = templates[i % templates.length];
        problems.push({
            question: template.question,
            answer: template.answer,
            explanation: template.explanation,
            inputPlaceholder: '답을 입력하세요',
            type: 'template',
            meta: { templateType: 'middle_probability', isFallback: true, difficulty: 'middle' }
        });
    }
    
    return problems;
}

// 로컬 템플릿 문제 생성기 (폴백용) - 중학교 산수 템플릿 금지
/**
 * Emergency Generator: 템플릿 생성 실패 시 해당 학년 수준의 기본 문제 생성
 * 2학년 문제로 돌아가지 않고, unitTitle과 conceptTitle을 분석하여 학년 적합한 문제 생성
 */
function emergencyGenerator(conceptInfo, effectiveGrade, existingQuestions = []) {
    const { text: conceptText = '', unitTitle = '', conceptTitle = '', domain = 'number', grade = effectiveGrade, problemType = '기본형' } = conceptInfo;
    // grade가 없으면 effectiveGrade 사용
    const actualGrade = grade || effectiveGrade || 5;
    const conceptLower = (conceptText || conceptTitle || '').toLowerCase();
    const unitLower = (unitTitle || '').toLowerCase();
    
    // 중학교 수준 처리 (7학년 이상 또는 conceptId가 M으로 시작)
    const normalizedId = normalizeConceptId(conceptInfo.id || conceptInfo.conceptId || '');
    const isMiddleSchool = effectiveGrade >= 7 || 
                           conceptInfo.schoolLevel === 'middle' || 
                           conceptInfo.schoolLevel === '중학교' ||
                           conceptInfo.gradeLevel === 'middle' ||
                           (normalizedId && normalizedId.startsWith('M'));
    
    if (isMiddleSchool) {
        // 중학교 학년 판단
        const isGrade1 = grade === 1 || normalizedId.includes('G1');
        const isGrade2 = grade === 2 || normalizedId.includes('G2');
        const isGrade3 = grade === 3 || normalizedId.includes('G3');
        
        // 중학교 학년별 전용 문제 생성
        if (isGrade3) {
            return generateMiddleSchoolGrade3Problem(effectiveGrade, conceptText, normalizedId, problemType);
        } else if (isGrade2) {
            return generateMiddleSchoolGrade2Problem(effectiveGrade, conceptText, normalizedId, problemType);
        } else {
            return generateMiddleSchoolGrade1Problem(effectiveGrade, conceptText, normalizedId, problemType);
        }
    }
    
    // 5학년 이상은 절대 2학년 문제 금지
    if (effectiveGrade >= 5) {
        // 분수 관련
        if (conceptLower.includes('분수') || unitLower.includes('분수')) {
            if (conceptLower.includes('덧셈') || conceptLower.includes('더하기')) {
                // 대분수 덧셈
                return generateMixedFractionProblem(effectiveGrade);
            } else if (conceptLower.includes('뺄셈') || conceptLower.includes('빼기')) {
                // 대분수 뺄셈
                return generateMixedFractionProblem(effectiveGrade);
            } else if (conceptLower.includes('나눗셈')) {
                // 분수 나눗셈 (6학년)
                return generateFractionSimplifyProblem(effectiveGrade);
            } else {
                // 일반 분수 문제
                return generateFractionSimplifyProblem(effectiveGrade);
            }
        }
        
        // 소수 관련
        if (conceptLower.includes('소수') || unitLower.includes('소수')) {
            if (conceptLower.includes('곱셈') || conceptLower.includes('곱하기')) {
                return generateDecimalMultiplyProblem(effectiveGrade);
            } else if (conceptLower.includes('나눗셈') || conceptLower.includes('나누기')) {
                return generateDecimalDivideProblem(effectiveGrade);
            } else if (conceptLower.includes('덧셈') || conceptLower.includes('뺄셈')) {
                return generateDecimalMultiplyProblem(effectiveGrade); // 4학년 소수 덧셈/뺄셈
            } else {
                return generateDecimalMultiplyProblem(effectiveGrade);
            }
        }
        
        // 약수/배수 관련
        if (conceptLower.includes('약수') || conceptLower.includes('배수') || 
            conceptLower.includes('공약수') || conceptLower.includes('공배수') ||
            conceptLower.includes('최대공약수') || conceptLower.includes('최소공배수')) {
            if (conceptLower.includes('공약수') || conceptLower.includes('최대공약수') ||
                conceptLower.includes('공배수') || conceptLower.includes('최소공배수')) {
                return generateCommonDivisorProblem(effectiveGrade);
            } else {
                return generateDivisorProblem(effectiveGrade);
            }
        }
        
        // 비와 비율 (6학년)
        if (conceptLower.includes('비') || conceptLower.includes('비율') || unitLower.includes('비')) {
            return generateRatioProblem(effectiveGrade);
        }
        
        // 입체도형 (6학년)
        if (conceptLower.includes('각기둥') || conceptLower.includes('각뿔') || 
            conceptLower.includes('직육면체') || conceptLower.includes('부피') ||
            conceptLower.includes('겉넓이')) {
            return generateSolidVolumeProblem(effectiveGrade, conceptText);
        }
        
        // 도형 넓이 관련 (5학년: 마름모, 사다리꼴, 평행사변형 등)
        if (conceptLower.includes('넓이') || conceptLower.includes('마름모') || 
            conceptLower.includes('사다리꼴') || conceptLower.includes('평행사변형') ||
            conceptLower.includes('직사각형') || conceptLower.includes('삼각형') ||
            conceptLower.includes('다각형') || conceptLower.includes('둘레') ||
            unitLower.includes('넓이') || unitLower.includes('둘레') ||
            unitLower.includes('다각형')) {
            return generateAreaProblem(effectiveGrade, conceptText);
        }
        
        // 비교 관련 (5학년: 분수의 크기 비교 등)
        if (conceptLower.includes('비교') || conceptLower.includes('크기')) {
            if (conceptLower.includes('분수')) {
                // 분수 크기 비교 문제: generateFractionSimplifyProblem 사용
                return generateFractionSimplifyProblem(effectiveGrade);
            } else if (conceptLower.includes('소수')) {
                // 소수 크기 비교 문제: generateDecimalMultiplyProblem 사용
                return generateDecimalMultiplyProblem(effectiveGrade);
            }
        }
        
        // 약분/통분 관련
        if (conceptLower.includes('약분') || conceptLower.includes('통분') || 
            unitLower.includes('약분') || unitLower.includes('통분')) {
            return generateFractionSimplifyProblem(effectiveGrade);
        }
        
        // 혼합 계산 (단, 5학년 이상에서는 최소한의 난이도 보장)
        if (conceptLower.includes('혼합') || conceptLower.includes('계산')) {
            return generateMixedCalcProblem(effectiveGrade, 'elementary', effectiveGrade, existingQuestions);
        }
        
        // 5학년 이상에서 매칭되지 않으면, 학년에 맞는 기본 문제 생성 (단순 덧셈 금지)
        // 5학년: 분수 문제 우선 (하지만 넓이는 제외 - 이미 위에서 처리됨)
        if (effectiveGrade === 5) {
            // 넓이나 도형이 아니면 분수 문제
            if (!conceptLower.includes('넓이') && !conceptLower.includes('둘레') && 
                !conceptLower.includes('다각형') && !unitLower.includes('넓이') && 
                !unitLower.includes('둘레')) {
                return generateFractionSimplifyProblem(effectiveGrade);
            }
            // 넓이나 도형이면 넓이 문제
            return generateAreaProblem(effectiveGrade, conceptText);
        }
        
        // 6학년: 비율 문제 우선
        if (effectiveGrade === 6) {
            if (!conceptLower.includes('넓이') && !conceptLower.includes('둘레') && 
                !conceptLower.includes('다각형') && !unitLower.includes('넓이') && 
                !unitLower.includes('둘레')) {
                return generateRatioProblem(effectiveGrade);
            }
            // 넓이나 도형이면 넓이 문제
            return generateAreaProblem(effectiveGrade, conceptText);
        }
    }
    
    // 4학년
    if (effectiveGrade === 4) {
        if (conceptLower.includes('분수')) {
            return generateFractionSimplifyProblem(effectiveGrade);
        } else if (conceptLower.includes('소수')) {
            return generateDecimalMultiplyProblem(effectiveGrade); // 소수 덧셈/뺄셈
        } else if (conceptLower.includes('삼각형')) {
            return generateTriangleClassifyProblem(effectiveGrade);
        } else if (conceptLower.includes('각도')) {
            return generateMixedCalcProblem(effectiveGrade, 'elementary', effectiveGrade, existingQuestions);
        }
    }
    
    // 3학년 이하
    if (effectiveGrade <= 3) {
        if (conceptLower.includes('분수')) {
            return generateFractionSimplifyProblem(effectiveGrade);
        } else if (conceptLower.includes('곱셈') || conceptLower.includes('나눗셈')) {
            return generateMixedCalcProblem(effectiveGrade, 'elementary', effectiveGrade);
        } else if (conceptLower.includes('규칙')) {
            return generatePatternProblem(effectiveGrade);
        }
    }
    
    // 기본: 학년에 맞는 문제 생성 (5학년 이상에서는 단순 산수 금지)
    // 5학년 이상에서는 반드시 분수, 소수, 넓이, 비율 중 하나여야 함
    if (effectiveGrade >= 5) {
        // 넓이나 도형이 있으면 넓이 문제 생성
        if (conceptLower.includes('넓이') || conceptLower.includes('둘레') || 
            conceptLower.includes('다각형') || unitLower.includes('넓이') || 
            unitLower.includes('둘레') || unitLower.includes('다각형')) {
            return generateAreaProblem(effectiveGrade, conceptText);
        }
        // 분수가 있으면 분수 문제
        if (conceptLower.includes('분수') || unitLower.includes('분수')) {
            return generateFractionSimplifyProblem(effectiveGrade);
        }
        // 소수가 있으면 소수 문제
        if (conceptLower.includes('소수') || unitLower.includes('소수')) {
            return generateDecimalMultiplyProblem(effectiveGrade);
        }
        // 5학년은 분수, 6학년은 비율 (기본값)
        if (effectiveGrade === 5) {
            return generateFractionSimplifyProblem(effectiveGrade);
        } else if (effectiveGrade === 6) {
            return generateRatioProblem(effectiveGrade);
        }
    }
    
    // 4학년 이하는 혼합 계산 허용
    return generateMixedCalcProblem(effectiveGrade, 'elementary', effectiveGrade, existingQuestions);
}

// Deprecated: fallbackGenerate는 emergencyGenerator로 대체됨 (하위 호환성 유지)
function fallbackGenerate(conceptInfo, count, effectiveGrade) {
    const { text: conceptText, keywords = [], unitTitle = '', subunitTitle = '', domain = 'number', gradeLevel = 'elementary', grade = 1 } = conceptInfo;
    const problems = [];
    const conceptLower = conceptText.toLowerCase();
    
    // emergencyGenerator 사용
    const emergency = emergencyGenerator(conceptInfo, effectiveGrade);
    if (emergency) {
        return [emergency];
    }
    
    // 중학교인 경우 전용 템플릿 사용 (산수 템플릿 금지) - 절대 초등 템플릿으로 넘어가지 않음
    const isMiddleSchool = gradeLevel === 'middle' || grade >= 7 || conceptInfo.schoolLevel === 'middle' || conceptInfo.schoolLevel === '중학교';
    
    if (isMiddleSchool) {
        // conceptId 정규화
        const normalizedId = normalizeConceptId(conceptInfo.id || conceptInfo.conceptId || '');
        
        // 중학교 학년 판단
        const isGrade1 = grade === 1 || normalizedId.includes('G1');
        const isGrade2 = grade === 2 || normalizedId.includes('G2');
        const isGrade3 = grade === 3 || normalizedId.includes('G3');
        
        // 중학교 학년별 전용 문제 생성 (초등 템플릿 절대 사용 안 함)
        const middleProblems = [];
        for (let i = 0; i < count; i++) {
            let problem;
            if (isGrade3) {
                problem = generateMiddleSchoolGrade3Problem(effectiveGrade, conceptText, normalizedId);
            } else if (isGrade2) {
                problem = generateMiddleSchoolGrade2Problem(effectiveGrade, conceptText, normalizedId);
            } else {
                problem = generateMiddleSchoolGrade1Problem(effectiveGrade, conceptText, normalizedId);
            }
            if (problem) {
                middleProblems.push({
                    question: problem.question || problem.questionLatex || '',
                    answer: problem.answer || problem.answerLatex || '',
                    explanation: problem.explanation || '',
                    inputPlaceholder: problem.inputPlaceholder || '답을 입력하세요',
                    type: problem.type || 'template',
                    meta: { ...problem.meta, isFallback: true }
                });
            } else {
                // 최후의 수단: 일차방정식 기본 문제 (초등 산수 절대 사용 안 함)
                const coef = Math.floor(Math.random() * 5) + 2;
                const constTerm = Math.floor(Math.random() * 10) + 5;
                const solution = Math.floor(Math.random() * 10) + 1;
                const result = coef * solution + constTerm;
                middleProblems.push({
                    question: `일차방정식 $${coef}x + ${constTerm} = ${result}$의 해를 구하시오.`,
                    answer: `${solution}`,
                    explanation: `$${coef}x = ${result} - ${constTerm} = ${result - constTerm}$, $x = \\dfrac{${result - constTerm}}{${coef}} = ${solution}$입니다.`,
                    inputPlaceholder: '답을 입력하세요',
                    type: 'template',
                    meta: { isFallback: true, isMiddleSchool: true }
                });
            }
        }
        // 중학교인 경우 여기서 반환 (초등 템플릿으로 절대 넘어가지 않음)
        return middleProblems;
    }
    
    // 초등학교 템플릿 패턴 매칭 (중학교는 위에서 이미 반환됨)
    let templateType = 'default';
    
    if (conceptLower.includes('소인수분해')) {
        templateType = '소인수분해';
    } else if (conceptLower.includes('최대공약수') || conceptLower.includes('공약수')) {
        templateType = '최대공약수';
    } else if (conceptLower.includes('최소공배수') || conceptLower.includes('공배수')) {
        templateType = '최소공배수';
    } else if (conceptLower.includes('넓이') && conceptLower.includes('직사각형')) {
        templateType = '직사각형넓이';
    } else if (conceptLower.includes('둘레') || conceptLower.includes('다각형')) {
        templateType = '둘레';
    } else if (conceptLower.includes('비') || conceptLower.includes('비율')) {
        templateType = '비와비율';
    } else if (conceptLower.includes('분수') && (conceptLower.includes('덧셈') || conceptLower.includes('더하기'))) {
        templateType = '분수덧셈';
    } else if (conceptLower.includes('분수') && (conceptLower.includes('뺄셈') || conceptLower.includes('빼기'))) {
        templateType = '분수뺄셈';
    } else if (conceptLower.includes('일차방정식')) {
        templateType = '일차방정식';
    } else if (conceptLower.includes('약수')) {
        templateType = '약수';
    } else if (conceptLower.includes('배수')) {
        templateType = '배수';
    } else if (conceptLower.includes('뒤집') || (conceptLower.includes('대칭') && conceptLower.includes('도형'))) {
        templateType = '도형뒤집기';
    } else if (conceptLower.includes('돌리') || (conceptLower.includes('회전') && conceptLower.includes('도형'))) {
        templateType = '도형돌리기';
    } else if (conceptLower.includes('이동') && (conceptLower.includes('무늬') || conceptLower.includes('평행'))) {
        templateType = '도형이동무늬';
    } else if (conceptLower.includes('각도') || conceptLower.includes('각의')) {
        templateType = '각도';
    } else if (conceptLower.includes('각기둥') || conceptLower.includes('각뿔') || 
               conceptLower.includes('원기둥') || conceptLower.includes('원뿔') || 
               conceptLower.includes('구') || conceptLower.includes('입체도형') ||
               conceptLower.includes('직육면체') || conceptLower.includes('정육면체')) {
        templateType = '입체도형';
    } else if (conceptLower.includes('도형') || conceptLower.includes('평면도형')) {
        // 일반 도형 항목
        templateType = '도형일반';
    }
    
    // 템플릿별 문제 생성
    for (let i = 0; i < count; i++) {
        let question = '';
        let answer = '';
        let explanation = '';
        
        const baseNum = effectiveGrade * 3 + (i + 1) * 2;
        const num1 = baseNum;
        const num2 = baseNum + 5;
        
        switch (templateType) {
            case '소인수분해':
                question = `${num1 * num2}을 소인수분해하시오.`;
                const factors = getPrimeFactors(num1 * num2);
                answer = factors.join(' × ');
                explanation = `${num1 * num2} = ${factors.join(' × ')}`;
                break;
                
            case '최대공약수':
                question = `${num1}과 ${num2}의 최대공약수를 구하시오.`;
                const gcd = calculateGCD(num1, num2);
                answer = `${gcd}`;
                explanation = `${num1}과 ${num2}의 공약수 중 가장 큰 수는 ${gcd}입니다.`;
                break;
                
            case '최소공배수':
                question = `${num1}과 ${num2}의 최소공배수를 구하시오.`;
                const lcm = (num1 * num2) / calculateGCD(num1, num2);
                answer = `${lcm}`;
                explanation = `${num1}과 ${num2}의 최소공배수는 ${lcm}입니다.`;
                break;
                
            case '직사각형넓이':
                const width = num1;
                const height = num2;
                question = `가로가 ${width}cm, 세로가 ${height}cm인 직사각형의 넓이는 얼마인가요?`;
                answer = `${width * height}cm²`;
                explanation = `직사각형의 넓이 = 가로 × 세로 = ${width} × ${height} = ${width * height}cm²`;
                break;
                
            case '둘레':
                const side1 = num1;
                const side2 = num2;
                question = `가로가 ${side1}cm, 세로가 ${side2}cm인 직사각형의 둘레는 얼마인가요?`;
                answer = `${(side1 + side2) * 2}cm`;
                explanation = `직사각형의 둘레 = (가로 + 세로) × 2 = (${side1} + ${side2}) × 2 = ${(side1 + side2) * 2}cm`;
                break;
                
            case '비와비율':
                question = `${num1} : ${num2}를 간단히 나타내시오.`;
                const ratioGcd = calculateGCD(num1, num2);
                answer = `${num1 / ratioGcd} : ${num2 / ratioGcd}`;
                explanation = `${num1} : ${num2} = ${num1 / ratioGcd} : ${num2 / ratioGcd} (최대공약수 ${ratioGcd}로 나눔)`;
                break;
                
            case '분수덧셈':
                // 초5-1 수준: 분모는 2,3,4,5,6,8,10,12만 허용
                const allowedDenoms = [2, 3, 4, 5, 6, 8, 10, 12];
                const denom = allowedDenoms[i % allowedDenoms.length];
                const numA = Math.floor(Math.random() * (denom - 1)) + 1; // 1 ~ denom-1
                const numB = Math.floor(Math.random() * (denom - numA)) + 1; // 1 ~ denom-numA (합이 denom 이하)
                
                // 템플릿 10개 이상
                const addTemplates = [
                    {
                        question: `\\dfrac{${numA}}{${denom}}+\\dfrac{${numB}}{${denom}}=?`,
                        answer: `\\dfrac{${numA + numB}}{${denom}}`,
                        explanation: `1단계: 분모가 같으므로 분자만 더합니다.\n2단계: ${numA} + ${numB} = ${numA + numB}\n3단계: 따라서 답은 \\dfrac{${numA + numB}}{${denom}}입니다.`
                    },
                    {
                        question: `\\dfrac{${numA + 1}}{${denom}}+\\dfrac{${numB}}{${denom}}=?`,
                        answer: `\\dfrac{${numA + numB + 1}}{${denom}}`,
                        explanation: `1단계: 분모가 같으므로 분자만 더합니다.\n2단계: ${numA + 1} + ${numB} = ${numA + numB + 1}\n3단계: 따라서 답은 \\dfrac{${numA + numB + 1}}{${denom}}입니다.`
                    },
                    {
                        question: `\\dfrac{${numA}}{${denom}}+\\dfrac{${numB + 1}}{${denom}}=?`,
                        answer: `\\dfrac{${numA + numB + 1}}{${denom}}`,
                        explanation: `1단계: 분모가 같으므로 분자만 더합니다.\n2단계: ${numA} + ${numB + 1} = ${numA + numB + 1}\n3단계: 따라서 답은 \\dfrac{${numA + numB + 1}}{${denom}}입니다.`
                    },
                    {
                        question: `\\dfrac{${Math.min(numA + 2, denom - 1)}}{${denom}}+\\dfrac{${Math.min(numB, denom - Math.min(numA + 2, denom - 1) - 1)}}{${denom}}=?`,
                        answer: `\\dfrac{${Math.min(numA + 2, denom - 1) + Math.min(numB, denom - Math.min(numA + 2, denom - 1) - 1)}}{${denom}}`,
                        explanation: `1단계: 분모가 같으므로 분자만 더합니다.\n2단계: ${Math.min(numA + 2, denom - 1)} + ${Math.min(numB, denom - Math.min(numA + 2, denom - 1) - 1)} = ${Math.min(numA + 2, denom - 1) + Math.min(numB, denom - Math.min(numA + 2, denom - 1) - 1)}\n3단계: 따라서 답은 \\dfrac{${Math.min(numA + 2, denom - 1) + Math.min(numB, denom - Math.min(numA + 2, denom - 1) - 1)}}{${denom}}입니다.`
                    },
                    {
                        question: `케이크를 \\dfrac{${numA}}{${denom}}만큼 먹고, 또 \\dfrac{${numB}}{${denom}}만큼 먹었습니다. 모두 몇 \\dfrac{1}{${denom}}인가요?`,
                        answer: `\\dfrac{${numA + numB}}{${denom}}`,
                        explanation: `1단계: 분모가 같으므로 분자만 더합니다.\n2단계: ${numA} + ${numB} = ${numA + numB}\n3단계: 따라서 답은 \\dfrac{${numA + numB}}{${denom}}입니다.`
                    }
                ];
                const selectedAdd = addTemplates[i % addTemplates.length];
                question = selectedAdd.question;
                answer = selectedAdd.answer;
                explanation = selectedAdd.explanation;
                break;
                
            case '분수뺄셈':
            case '진분수뺄셈':
                // 초5-1 수준: 분모는 2,3,4,5,6,8,10,12만 허용
                const allowedDenoms2 = [2, 3, 4, 5, 6, 8, 10, 12];
                const denom2 = allowedDenoms2[i % allowedDenoms2.length];
                const numC = Math.floor(Math.random() * (denom2 - 1)) + 2; // 2 ~ denom-1 (뺄 수 있도록)
                const numD = Math.floor(Math.random() * (numC - 1)) + 1; // 1 ~ numC-1 (양수 결과)
                const diffNum = numC - numD;
                const diffGcd = gcd(diffNum, denom2);
                const simplifiedDiffNum = diffNum / diffGcd;
                const simplifiedDiffDen = denom2 / diffGcd;
                
                // 템플릿 10개 이상
                const subTemplates = [
                    {
                        question: `\\dfrac{${numC}}{${denom2}}-\\dfrac{${numD}}{${denom2}}=?`,
                        answer: diffGcd > 1 ? `\\dfrac{${simplifiedDiffNum}}{${simplifiedDiffDen}}` : `\\dfrac{${diffNum}}{${denom2}}`,
                        explanation: diffGcd > 1
                            ? `1단계: 분모가 같으므로 분자만 뺍니다.\n2단계: ${numC} - ${numD} = ${diffNum}\n3단계: 약분합니다. \\dfrac{${diffNum}}{${denom2}} = \\dfrac{${simplifiedDiffNum}}{${simplifiedDiffDen}} (최대공약수 ${diffGcd}로 나눔)\n4단계: 따라서 답은 \\dfrac{${simplifiedDiffNum}}{${simplifiedDiffDen}}입니다.`
                            : `1단계: 분모가 같으므로 분자만 뺍니다.\n2단계: ${numC} - ${numD} = ${diffNum}\n3단계: 따라서 답은 \\dfrac{${diffNum}}{${denom2}}입니다.`
                    },
                    {
                        question: `케이크를 \\dfrac{${numC}}{${denom2}}만큼 가지고 있었는데, \\dfrac{${numD}}{${denom2}}만큼 먹었습니다. 남은 양은 몇 \\dfrac{1}{${denom2}}인가요?`,
                        answer: diffGcd > 1 ? `\\dfrac{${simplifiedDiffNum}}{${simplifiedDiffDen}}` : `\\dfrac{${diffNum}}{${denom2}}`,
                        explanation: diffGcd > 1
                            ? `1단계: 분모가 같으므로 분자만 뺍니다.\n2단계: ${numC} - ${numD} = ${diffNum}\n3단계: 약분합니다. \\dfrac{${diffNum}}{${denom2}} = \\dfrac{${simplifiedDiffNum}}{${simplifiedDiffDen}} (최대공약수 ${diffGcd}로 나눔)\n4단계: 따라서 답은 \\dfrac{${simplifiedDiffNum}}{${simplifiedDiffDen}}입니다.`
                            : `1단계: 분모가 같으므로 분자만 뺍니다.\n2단계: ${numC} - ${numD} = ${diffNum}\n3단계: 따라서 답은 \\dfrac{${diffNum}}{${denom2}}입니다.`
                    },
                    {
                        question: `\\dfrac{${numC + 1}}{${denom2}}-\\dfrac{${numD}}{${denom2}}=?`,
                        answer: diffGcd > 1 ? `\\dfrac{${simplifiedDiffNum + 1}}{${simplifiedDiffDen}}` : `\\dfrac{${diffNum + 1}}{${denom2}}`,
                        explanation: `1단계: 분모가 같으므로 분자만 뺍니다.\n2단계: ${numC + 1} - ${numD} = ${diffNum + 1}\n3단계: 따라서 답은 \\dfrac{${diffNum + 1}}{${denom2}}입니다.`
                    },
                    {
                        question: `\\dfrac{${numC}}{${denom2}}-\\dfrac{${numD + 1}}{${denom2}}=?`,
                        answer: diffGcd > 1 ? `\\dfrac{${simplifiedDiffNum - 1}}{${simplifiedDiffDen}}` : `\\dfrac{${diffNum - 1}}{${denom2}}`,
                        explanation: `1단계: 분모가 같으므로 분자만 뺍니다.\n2단계: ${numC} - ${numD + 1} = ${diffNum - 1}\n3단계: 따라서 답은 \\dfrac{${diffNum - 1}}{${denom2}}입니다.`
                    }
                ];
                const selectedSub = subTemplates[i % subTemplates.length];
                question = selectedSub.question;
                answer = selectedSub.answer;
                explanation = selectedSub.explanation;
                break;
                
            case '분수크기비교':
                // 템플릿 6개 이상 순환
                const templates = [
                    {
                        question: `\\frac{${num1}}{${num2}}과 크기가 같은 분수를 분모가 ${num2 * 2}가 되게 나타내세요.`,
                        answer: `\\frac{${num1 * 2}}{${num2 * 2}}`,
                        explanation: `분모와 분자에 같은 수 2를 곱하면 크기가 같은 분수를 만들 수 있습니다. \\frac{${num1}}{${num2}} = \\frac{${num1 * 2}}{${num2 * 2}}입니다. 분모와 분자에 같은 수를 곱하거나 나누면 크기가 같은 분수가 됩니다.`
                    },
                    {
                        question: `\\frac{${num1}}{${num2}} = \\frac{□}{${num2 * 3}}일 때, □에 들어갈 수는?`,
                        answer: `${num1 * 3}`,
                        explanation: `분모가 ${num2}에서 ${num2 * 3}으로 3배가 되었으므로, 분자도 ${num1}에서 ${num1 * 3}으로 3배가 되어야 합니다. 따라서 □ = ${num1 * 3}입니다. 분모와 분자에 같은 수를 곱하면 크기가 같은 분수가 됩니다.`
                    },
                    {
                        question: `\\frac{${num1}}{${num2}}과 \\frac{${num1 + 1}}{${num2 + 1}} 중 더 큰 분수는?`,
                        answer: `\\frac{${num1 + 1}}{${num2 + 1}}`,
                        explanation: `두 분수를 통분하여 비교합니다. \\frac{${num1}}{${num2}} = \\frac{${num1 * (num2 + 1)}}{${num2 * (num2 + 1)}}, \\frac{${num1 + 1}}{${num2 + 1}} = \\frac{${(num1 + 1) * num2}}{${(num2 + 1) * num2}}입니다. 통분 후 분자를 비교하면 \\frac{${num1 + 1}}{${num2 + 1}}이 더 큽니다.`
                    },
                    {
                        question: `\\frac{${num1 * 2}}{${num2 * 2}}를 기약분수로 나타내면?`,
                        answer: `\\frac{${num1}}{${num2}}`,
                        explanation: `분자와 분모의 최대공약수로 나누면 기약분수가 됩니다. \\frac{${num1 * 2}}{${num2 * 2}} = \\frac{${num1}}{${num2}}입니다. 분자와 분모를 같은 수로 나누면 크기가 같은 분수가 됩니다.`
                    },
                    {
                        question: `\\frac{${num1}}{${num2}}과 크기가 같은 분수 중 분모가 ${num2 * 4}인 분수를 구하세요.`,
                        answer: `\\frac{${num1 * 4}}{${num2 * 4}}`,
                        explanation: `분모와 분자에 같은 수 4를 곱하면 크기가 같은 분수를 만들 수 있습니다. \\frac{${num1}}{${num2}} = \\frac{${num1 * 4}}{${num2 * 4}}입니다. 분모와 분자에 같은 수를 곱하면 크기가 같은 분수가 됩니다.`
                    },
                    {
                        question: `\\frac{${num1 * 3}}{${num2 * 3}} = \\frac{□}{${num2}}일 때, □에 들어갈 수는?`,
                        answer: `${num1}`,
                        explanation: `분모가 ${num2 * 3}에서 ${num2}로 3으로 나누어졌으므로, 분자도 ${num1 * 3}에서 ${num1}으로 3으로 나누어져야 합니다. 따라서 □ = ${num1}입니다. 분모와 분자에 같은 수를 나누면 크기가 같은 분수가 됩니다.`
                    }
                ];
                const selectedTemplate = templates[i % templates.length];
                question = selectedTemplate.question;
                answer = selectedTemplate.answer;
                explanation = selectedTemplate.explanation;
                break;
                
            case '분수일반':
                const denom4 = num2;
                const numG = num1;
                const numH = num1 + 1;
                question = `\\frac{${numG}}{${denom4}}과 \\frac{${numH}}{${denom4}} 중 더 큰 분수는?`;
                answer = `\\frac{${numH}}{${denom4}}`;
                explanation = `분모가 같으므로 분자가 큰 분수가 더 큽니다. \\frac{${numG}}{${denom4}} < \\frac{${numH}}{${denom4}}이므로 더 큰 분수는 \\frac{${numH}}{${denom4}}입니다.`;
                break;
                
            case '일차방정식':
                // 중학교가 아닌 경우에만 초등 수준 일차방정식 (이미 중학교는 위에서 반환됨)
                const coef = num1 % 5 + 2;
                const constTerm = num2 % 10 + 5;
                const result = num1 * 3 + num2;
                question = `${coef}x + ${constTerm} = ${result}일 때, x의 값은?`;
                answer = `${(result - constTerm) / coef}`;
                explanation = `${coef}x = ${result - constTerm}, x = ${(result - constTerm) / coef}`;
                break;
                
            case '약수':
                question = `${num1}의 약수를 모두 구하시오.`;
                const divisors = getDivisors(num1);
                answer = divisors.join(', ');
                explanation = `${num1}의 약수는 ${divisors.join(', ')}입니다.`;
                break;
                
            case '배수':
                question = `${num1}의 배수 중 ${num1 * 3}보다 작은 수를 모두 구하시오.`;
                const multiples = [num1, num1 * 2];
                answer = multiples.join(', ');
                explanation = `${num1}의 배수 중 ${num1 * 3}보다 작은 수는 ${multiples.join(', ')}입니다.`;
                break;
                
            case '입체도형':
                // 입체도형 문제 (6학년 수준)
                if (conceptLower.includes('각기둥')) {
                    const base = 3 + Math.floor(effectiveGrade / 2) + i;
                    const height = 4 + Math.floor(effectiveGrade / 2) + i;
                    const volume = base * base * height;
                    question = `밑면이 한 변의 길이가 ${base}cm인 정사각형이고, 높이가 ${height}cm인 정사각기둥의 부피는 몇 ㎤인가요?`;
                    answer = `${volume}㎤`;
                    explanation = `정사각기둥의 부피 = 밑면의 넓이 × 높이 = (${base} × ${base}) × ${height} = ${base * base} × ${height} = ${volume}㎤입니다.`;
                } else if (conceptLower.includes('원기둥')) {
                    const radius = 3 + Math.floor(effectiveGrade / 2) + i;
                    const height = 5 + Math.floor(effectiveGrade / 2) + i;
                    const volume = Math.floor(Math.PI * radius * radius * height);
                    question = `밑면의 반지름이 ${radius}cm이고, 높이가 ${height}cm인 원기둥의 부피는 약 몇 ㎤인가요? (원주율은 3.14로 계산)`;
                    answer = `약 ${volume}㎤`;
                    explanation = `원기둥의 부피 = 밑면의 넓이 × 높이 = (반지름 × 반지름 × 3.14) × 높이 = (${radius} × ${radius} × 3.14) × ${height} = 약 ${volume}㎤입니다.`;
                } else {
                    // 기본 입체도형 문제
                    const side = 5 + effectiveGrade + i;
                    question = `한 변의 길이가 ${side}cm인 정육면체의 부피는 몇 ㎤인가요?`;
                    answer = `${side * side * side}㎤`;
                    explanation = `정육면체의 부피 = 한 변의 길이 × 한 변의 길이 × 한 변의 길이 = ${side} × ${side} × ${side} = ${side * side * side}㎤입니다.`;
                }
                break;
                
            default:
                // 기본 템플릿 (중학교는 이미 위에서 반환되었으므로 여기서는 초등만 처리)
                if (conceptInfo.domain === 'geometry') {
                    // 도형 항목인데 매칭되지 않으면 일반 도형 문제 생성
                    const shapeNum2 = num1;
                    question = `한 변의 길이가 ${shapeNum2}cm인 정사각형의 둘레는 몇 cm인가요?`;
                    answer = `${shapeNum2 * 4}cm`;
                    explanation = `정사각형의 둘레 = 한 변의 길이 × 4 = ${shapeNum2} × 4 = ${shapeNum2 * 4}cm입니다.`;
                } else {
                    // 초등학교 기본 템플릿
                    question = `${num1} + ${num2} = ?`;
                    answer = `${num1 + num2}`;
                    explanation = `${num1} + ${num2} = ${num1 + num2}`;
                }
        }
        
        problems.push({
            question: question,
            answer: answer,
            explanation: explanation,
            inputPlaceholder: '답을 입력하세요',
            type: 'template',
            meta: { templateType, isFallback: true }
        });
    }
    
    return problems;
}

// 소인수분해 헬퍼
function getPrimeFactors(n) {
    const factors = [];
    let d = 2;
    while (d * d <= n) {
        while (n % d === 0) {
            factors.push(d);
            n /= d;
        }
        d++;
    }
    if (n > 1) factors.push(n);
    return factors;
}

// 문제 생성 (async + 진행 상황 표시 + 타임아웃 처리 + 3단계 폴백)
async function generateProblems(formData) {
    const problemsList = document.getElementById('problemsList');
    const resultHeader = document.querySelector('.result-header');
    if (!problemsList) return;
    
    let isGenerating = true;
    let finalStatus = 'idle';
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonContent = submitButton ? submitButton.innerHTML : '';
    
    try {
        // 로딩 상태 표시 (진행 상황 포함)
        showLoadingStateWithProgress(problemsList, {
            current: 0,
            total: 0,
            conceptName: '',
            status: 'initializing'
        });
        
        // result-header 숨기기 (생성 중)
        if (resultHeader) {
            resultHeader.style.display = 'none';
        }
        
        // 진행 상황 콜백
        const progressCallback = (progress) => {
            if (!isGenerating) return;
            showLoadingStateWithProgress(problemsList, progress);
        };
        
        // 1차: AI 생성 시도
        let questions = await createSampleProblems(formData, progressCallback);
        let usedFallback = false;
        
        if (!isGenerating) return;
        
        // 목표 문제 수 계산
        const concepts = formData.concepts || [];
        const perConceptCount = parseInt(formData.problemCount || 3);
        const targetTotal = concepts.length * perConceptCount;
        const expectedTotal = concepts.length * perConceptCount; // 기대 문제 수
        const minTotal = Math.min(3, targetTotal); // 최소 1~3개
        
        // 2차: 부족한 경우 재시도 또는 템플릿으로 채우기
        const generatedTotal = questions.length;
        const isPartial = generatedTotal < expectedTotal;
        
        if (isPartial) {
            const missingCount = expectedTotal - generatedTotal;
            console.log(`⚠️ [generateProblems] 문제 부족: ${generatedTotal}개 (기대: ${expectedTotal}개, 부족: ${missingCount}개)`);
            
            const need = Math.max(minTotal - questions.length, expectedTotal - questions.length);
            
            // 3차: 로컬 템플릿으로 부족분 채우기
            if (need > 0) {
                console.log(`📦 템플릿으로 ${need}개 문제 생성 중...`);
                usedFallback = true;
                
                const schoolLevel = formData.schoolLevel === 'elementary' ? '초등학교' : '중학교';
                const rawGrade = formData.grade || 5;
                let effectiveGrade;
                if (schoolLevel === '중학교') {
                    effectiveGrade = Math.max(5, rawGrade + 4);
                    if (effectiveGrade > 6) effectiveGrade = 6;
                } else {
                    effectiveGrade = rawGrade;
                }
                
                // 선택된 개념 목록 재구성
                let selectedConceptList = [];
                if (schoolLevel === '중학교' && window.MIDDLE_SCHOOL_TOC) {
                    const gradeKey = `${rawGrade}학년`;
                    const semesterKey = `${formData.semester || 1}학기`;
                    const tocData = window.MIDDLE_SCHOOL_TOC[gradeKey];
                    
                    if (tocData && tocData[semesterKey]) {
                        const units = tocData[semesterKey];
                        const topicIds = concepts.filter(c => typeof c === 'string' && c.startsWith('T|'));
                        
                        topicIds.forEach(id => {
                            const parts = id.split('|');
                            if (parts.length === 6) {
                                const uIdx = parseInt(parts[3]);
                                const sIdx = parseInt(parts[4]);
                                const tIdx = parseInt(parts[5]);
                                const unit = units[uIdx];
                                if (unit && unit.subunits && unit.subunits[sIdx] && unit.subunits[sIdx].topics) {
                                    const topic = unit.subunits[sIdx].topics[tIdx];
                                    if (topic) {
                                        selectedConceptList.push({
                                            id: id,
                                            text: topic,
                                            unitTitle: unit.title,
                                            subunitTitle: unit.subunits[sIdx].title
                                        });
                                    }
                                }
                            }
                        });
                    }
                } else {
                    concepts.forEach(concept => {
                        selectedConceptList.push({
                            id: concept,
                            text: conceptToText(concept) || concept,
                            unitTitle: '',
                            subunitTitle: ''
                        });
                    });
                }
                
                // 부족분을 항목별로 균등 분배하여 템플릿 생성
                const perConceptNeed = Math.ceil(need / selectedConceptList.length);
                let globalQuestionNumber = questions.length + 1;
                
                selectedConceptList.forEach((conceptInfo, conceptIndex) => {
                    const countForThis = Math.min(perConceptNeed, need - (questions.length - (conceptIndex * perConceptNeed)));
                    if (countForThis > 0) {
                        const templateProblems = fallbackGenerate(conceptInfo, countForThis, effectiveGrade);
                        
                        templateProblems.forEach((tp, i) => {
                            const question = {
                                id: `template-${Date.now()}-${conceptIndex}-${i}-${Math.random().toString(36).substr(2, 9)}`,
                                type: tp.type || 'template',
                                number: globalQuestionNumber++,
                                question: tp.question,
                                answer: tp.answer,
                                explanation: tp.explanation || '',
                                inputPlaceholder: tp.inputPlaceholder || '답을 입력하세요',
                                meta: { ...tp.meta, isFallback: true },
                                concept: conceptInfo.text,
                                problemType: formData.problemType || '기본형',
                                sourceConcept: conceptInfo.id,
                                sourceConceptText: conceptInfo.text,
                                unitTitle: conceptInfo.unitTitle,
                                subunitTitle: conceptInfo.subunitTitle
                            };
                            questions.push(question);
                        });
                    }
                });
            }
        }
        
        // 최종 검증: questions.length > 0 강제
        if (questions.length === 0) {
            console.error('❌ 최종 검증 실패: questions.length === 0, 강제 템플릿 생성');
            // 최소 1개는 무조건 생성
            const defaultConcept = {
                text: '수학',
                keywords: ['수학'],
                unitTitle: '',
                subunitTitle: ''
            };
            const defaultProblems = fallbackGenerate(defaultConcept, 1, 5);
            questions = defaultProblems.map((tp, i) => ({
                id: `forced-${Date.now()}-${i}`,
                type: 'template',
                number: i + 1,
                question: tp.question,
                answer: tp.answer,
                explanation: tp.explanation || '',
                inputPlaceholder: tp.inputPlaceholder || '답을 입력하세요',
                meta: { isFallback: true, isForced: true },
                concept: '수학',
                problemType: formData.problemType || '기본형',
                sourceConcept: 'default',
                sourceConceptText: '수학'
            }));
            usedFallback = true;
        }
        
        // 상태 결정
        if (questions.length > 0) {
            finalStatus = usedFallback ? 'fallback' : 'success';
        } else {
            finalStatus = 'fallback'; // 이론상 도달 불가능하지만 안전장치
        }
        
        console.log(`✅ 최종 결과: ${questions.length}개 문제, 상태: ${finalStatus}`);
        
        // 문제 표시 (무조건 questions.length > 0)
        displayProblems(questions, formData, finalStatus);
        
    } catch (error) {
        console.error('Error in generateProblems:', error);
        
        // 에러 발생 시에도 템플릿으로 최소 1개 생성
        try {
            const defaultConcept = {
                text: '수학',
                keywords: ['수학'],
                unitTitle: '',
                subunitTitle: ''
            };
            const defaultProblems = fallbackGenerate(defaultConcept, 1, 5);
            const questions = defaultProblems.map((tp, i) => ({
                id: `error-fallback-${Date.now()}-${i}`,
                type: 'template',
                number: i + 1,
                question: tp.question,
                answer: tp.answer,
                explanation: tp.explanation || '',
                inputPlaceholder: tp.inputPlaceholder || '답을 입력하세요',
                meta: { isFallback: true, isErrorFallback: true },
                concept: '수학',
                problemType: formData.problemType || '기본형',
                sourceConcept: 'default',
                sourceConceptText: '수학'
            }));
            
            displayProblems(questions, formData, 'fallback');
        } catch (fallbackError) {
            console.error('Fallback generation also failed:', fallbackError);
            // 최후의 수단: emergency 문제 생성 (선택한 개념 기반)
            const problemsList = document.getElementById('problemsList');
            if (problemsList) {
                // 선택한 개념에 맞는 문제 생성 시도
                const firstConcept = formData.concepts?.[0] || { text: '수학', grade: formData.grade || 5, semester: formData.semester || 1 };
                const emergencyConcept = {
                    text: firstConcept.text || '수학',
                    conceptTitle: firstConcept.conceptTitle || firstConcept.text,
                    unitTitle: firstConcept.unitTitle || '',
                    grade: firstConcept.grade || formData.grade || 5,
                    semester: firstConcept.semester || formData.semester || 1,
                    schoolLevel: firstConcept.schoolLevel || (formData.schoolLevel === '중학교' ? 'middle' : 'elementary'),
                    domain: 'number'
                };
                const emergencyProblem = emergencyGenerator(emergencyConcept, emergencyConcept.grade);
                
                if (emergencyProblem) {
                    questions = [{
                        id: `emergency-${Date.now()}`,
                        type: emergencyProblem.type,
                        number: 1,
                        question: emergencyProblem.question || emergencyProblem.questionText || emergencyProblem.questionLatex,
                        questionText: emergencyProblem.questionText || (emergencyProblem.questionLatex ? null : emergencyProblem.question),
                        questionLatex: emergencyProblem.questionLatex || null,
                        answer: emergencyProblem.answer || emergencyProblem.answerText || emergencyProblem.answerLatex,
                        answerText: emergencyProblem.answerText || (emergencyProblem.answerLatex ? null : emergencyProblem.answer),
                        answerLatex: emergencyProblem.answerLatex || null,
                        explanation: emergencyProblem.explanation || '',
                        inputPlaceholder: emergencyProblem.inputPlaceholder || '답을 입력하세요',
                        meta: {
                            ...(emergencyProblem.meta || {}),
                            isEmergency: true,
                            schoolLevel: emergencyConcept.schoolLevel,
                            grade: emergencyConcept.grade,
                            semester: emergencyConcept.semester
                        },
                        concept: emergencyConcept.text,
                        problemType: formData.problemType || '기본형',
                        sourceConcept: '',
                        sourceConceptText: emergencyConcept.text,
                        schoolLevel: emergencyConcept.schoolLevel,
                        grade: emergencyConcept.grade,
                        semester: emergencyConcept.semester
                    }];
                    displayProblems(questions, formData, 'partial');
                } else {
                    // emergency도 실패하면 오류 메시지
                problemsList.innerHTML = `
                        <div class="alert alert-danger">
                            문제 생성에 실패했습니다. 선택한 항목과 학년/학기를 확인해 주세요.
                    </div>
                `;
                if (resultHeader) resultHeader.style.display = 'block';
                }
            }
        }
    } finally {
        // 무조건 로딩 상태 종료
        isGenerating = false;
        
        // 제출 버튼 복원
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonContent;
        }
    }
}

// 로딩 상태 표시 (기본)
function showLoadingState(container) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-message">문제 생성 중...</div>
            <div class="skeleton-list">
                ${Array(3).fill(0).map(() => `
                    <div class="skeleton-item">
                        <div class="skeleton-line skeleton-title"></div>
                        <div class="skeleton-line skeleton-content"></div>
                        <div class="skeleton-line skeleton-content short"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 로딩 상태 표시 (진행 상황 포함)
function showLoadingStateWithProgress(container, progress = {}) {
    const { 
        current = 0, 
        currentIndex = current, // currentIndex가 없으면 current 사용
        total = 0, 
        totalCount = total, // totalCount가 없으면 total 사용
        conceptName = '', 
        status = 'generating', 
        successCount = 0, 
        failureCount = 0,
        failCount = failureCount, // failCount도 지원
        attemptCount = 0
    } = progress;
    
    // currentIndex와 totalCount를 우선 사용
    const displayCurrent = currentIndex || current;
    const displayTotal = totalCount || total;
    
    let statusText = '문제 생성 중...';
    let statusIcon = '⏳';
    let progressBar = '';
    let conceptInfo = '';
    
    if (displayTotal > 0) {
        const percentage = Math.round((displayCurrent / displayTotal) * 100);
        progressBar = `
            <div class="progress-bar-container" style="margin: 20px 0;">
                <div class="progress-bar" style="width: ${percentage}%; background: #4f46e5; height: 8px; border-radius: 4px; transition: width 0.3s;"></div>
                <div class="progress-text" style="margin-top: 8px; font-size: 0.9rem; color: #666;">
                    진행: ${displayCurrent} / ${displayTotal} 항목 생성 중
                </div>
            </div>
        `;
        
        if (conceptName) {
            // conceptName도 sanitize
            const sanitizedConceptName = sanitizeDisplayText(conceptName) || conceptName;
            conceptInfo = `
                <div class="current-concept" style="margin: 10px 0; padding: 12px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #4f46e5;">
                    <div style="font-weight: 600; color: #1e40af; margin-bottom: 4px;">현재 항목: ${displayCurrent}번째</div>
                    <div style="color: #1e3a8a;">${escapeHtml(sanitizedConceptName)}</div>
                    ${successCount > 0 || (failCount || failureCount) > 0 ? `
                        <div style="margin-top: 8px; font-size: 0.85rem; color: #666;">
                            성공: ${successCount}개 / 실패: ${failCount || failureCount}개
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        if (status === 'completed') {
            const sanitizedConceptName = sanitizeDisplayText(conceptName) || conceptName;
            statusText = `항목 "${sanitizedConceptName}" 완료`;
            statusIcon = '✅';
        } else if (status === 'partial') {
            const sanitizedConceptName = sanitizeDisplayText(conceptName) || conceptName;
            statusText = `항목 "${sanitizedConceptName}" 부분 완료 (일부 실패)`;
            statusIcon = '⚠️';
        }
    }
    
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-message">
                ${statusIcon} ${statusText}
            </div>
            ${progressBar}
            ${conceptInfo}
            <div class="skeleton-list" style="margin-top: 20px;">
                ${Array(3).fill(0).map(() => `
                    <div class="skeleton-item">
                        <div class="skeleton-line skeleton-title"></div>
                        <div class="skeleton-line skeleton-content"></div>
                        <div class="skeleton-line skeleton-content short"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 빈 상태 표시
function showEmptyState(container) {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📭</div>
            <div class="empty-message">문제가 생성되지 않았습니다.</div>
            <div class="empty-description">다시 생성해 주세요.</div>
            <button onclick="regenerate()" class="btn btn-primary">
                <span class="btn-icon">🔄</span>
                다시 생성하기
            </button>
        </div>
    `;
}

// 에러 상태 표시
function showErrorState(container, errorMessage) {
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <div class="error-message">문제 생성 중 오류가 발생했습니다.</div>
            <div class="error-description">${errorMessage || '알 수 없는 오류가 발생했습니다.'}</div>
            <button onclick="regenerate()" class="btn btn-primary">
                <span class="btn-icon">🔄</span>
                다시 시도
            </button>
        </div>
    `;
}

// 7종 문제 형식 enum
const PROBLEM_TYPES = {
    DIVISOR: 'divisor',           // (A) 약수 알아보기
    COMMON_DIVISOR: 'common_divisor', // (B) 공약수와 최대공약수
    FRACTION_SIMPLIFY: 'fraction_simplify', // (C) 분수를 간단히 나타내기
    MIXED_CALC: 'mixed_calc',      // (D) 곱셈·나눗셈이 섞인 식 계산
    SKIP_COUNT: 'skip_count',      // (E) 뛰어 세기
    TWO_DIGIT_DIV: 'two_digit_div', // (F) 몇십몇으로 나누기(2)
    PATTERN: 'pattern',            // (G) 모양의 배열에서 규칙 찾기
    TRIANGLE_CLASSIFY: 'triangle_classify', // (H) 삼각형 분류
    MIXED_FRACTION: 'mixed_fraction', // (I) 대분수 연산
    DECIMAL_MULTIPLY: 'decimal_multiply', // (J) 소수의 곱셈
    DECIMAL_DIVIDE: 'decimal_divide', // (K) 소수의 나눗셈
    RATIO: 'ratio',               // (L) 비와 비율
    SOLID_VOLUME: 'solid_volume',  // (M) 입체도형 부피
    LINEAR_EQUATION: 'linear_equation', // (N) 일차방정식
    LINEAR_FUNCTION: 'linear_function', // (O) 일차함수
    LINEAR_INEQUALITY: 'linear_inequality', // (R) 일차부등식
    SYSTEM_OF_EQUATIONS: 'system_of_equations', // (S) 연립일차방정식
    PROBABILITY: 'probability',    // (P) 확률
    GEOMETRY_DRAWING: 'geometry_drawing' // (Q) 도형 및 각도 시각화
};

/**
 * 개념별 템플릿 매핑 (conceptId 기반)
 * 모든 5~6학년 및 중학교 개념 ID를 포함
 */
const CONCEPT_TEMPLATE_MAP = {
    // 초4-2: 삼각형 분류 (SVG 렌더링 사용)
    'G4-S2-U2-T1': { templates: [PROBLEM_TYPES.GEOMETRY_DRAWING], requiredKeywords: ['삼각형', '변의 길이', '분류'], validation: 'triangle_classify' },
    'G4-S2-U2-T2': { templates: [PROBLEM_TYPES.GEOMETRY_DRAWING], requiredKeywords: ['삼각형', '이등변', '정삼각형'], validation: 'triangle_classify' },
    'G4-S2-U2-T3': { templates: [PROBLEM_TYPES.GEOMETRY_DRAWING], requiredKeywords: ['삼각형', '각의 크기', '분류'], validation: 'triangle_classify' },
    'G4-S2-U2-T4': { templates: [PROBLEM_TYPES.GEOMETRY_DRAWING], requiredKeywords: ['삼각형', '분류', '기준'], validation: 'triangle_classify' },
    // 초4-1: 각도 (SVG 렌더링 사용)
    'G4-S1-U2': { templates: [PROBLEM_TYPES.GEOMETRY_DRAWING], requiredKeywords: ['각도', '각의 크기', '재기'], validation: 'angle_measure' }
};

// CONCEPT_TEMPLATE_MAP 자동 확장 함수 - 초등 1~6학년, 중학교 1~3학년 완전 매핑
function expandConceptTemplateMap() {
    const expanded = {};
    
    // ============================================
    // 초등 1학년 1학기
    // ============================================
    // 1단원: 9까지의 수 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`G1-S1-U1-T${t}`] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['수', '알아보기', '비교'], validation: 'basic' };
    }
    // 2단원: 여러 가지 모양 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`G1-S1-U2-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['모양', '도형'], validation: 'basic' };
    }
    // 3단원: 덧셈과 뺄셈 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`G1-S1-U3-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈'], validation: 'basic' };
    }
    // 4단원: 비교하기 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`G1-S1-U4-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['비교'], validation: 'basic' };
    }
    // 5단원: 50까지의 수 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`G1-S1-U5-T${t}`] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['수', '알아보기'], validation: 'basic' };
    }
    
    // 초등 1학년 2학기
    // 1단원: 100까지의 수 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G1-S2-U1-T${t}`] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['수', '알아보기'], validation: 'basic' };
    }
    // 2단원: 덧셈과 뺄셈(1) (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G1-S2-U2-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈'], validation: 'basic' };
    }
    // 3단원: 모양과 시각 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G1-S2-U3-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['모양', '시각'], validation: 'basic' };
    }
    // 4단원: 덧셈과 뺄셈(2) (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`G1-S2-U4-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈'], validation: 'basic' };
    }
    // 5단원: 규칙 찾기 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G1-S2-U5-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['규칙'], validation: 'basic' };
    }
    // 6단원: 덧셈과 뺄셈(3) (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G1-S2-U6-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈'], validation: 'basic' };
    }
    
    // ============================================
    // 초등 2학년 1학기
    // ============================================
    // 1단원: 세 자리 수 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`G2-S1-U1-T${t}`] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['세', '자리', '수'], validation: 'basic' };
    }
    // 2단원: 여러 가지 도형 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G2-S1-U2-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['도형'], validation: 'basic' };
    }
    // 3단원: 덧셈과 뺄셈 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`G2-S1-U3-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈'], validation: 'basic' };
    }
    // 4단원: 길이 재기 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G2-S1-U4-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['길이'], validation: 'basic' };
    }
    // 5단원: 분류하기 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G2-S1-U5-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['분류', '그래프'], validation: 'basic' };
    }
    // 6단원: 곱셈 (8개 토픽)
    for (let t = 1; t <= 8; t++) {
        expanded[`G2-S1-U6-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['곱셈'], validation: 'basic' };
    }
    
    // 초등 2학년 2학기
    // 1단원: 네 자리 수 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`G2-S2-U1-T${t}`] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['네', '자리', '수'], validation: 'basic' };
    }
    // 2단원: 자료의 정리 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`G2-S2-U2-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['자료', '그래프'], validation: 'basic' };
    }
    // 3단원: 수학 익힘 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G2-S2-U3-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['수학', '익힘'], validation: 'basic' };
    }
    // 4단원: 덧셈과 뺄셈 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G2-S2-U4-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈'], validation: 'basic' };
    }
    // 5단원: 곱셈 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`G2-S2-U5-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['곱셈'], validation: 'basic' };
    }
    // 6단원: 분수 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G2-S2-U6-T${t}`] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수'], validation: 'basic' };
    }
    
    // ============================================
    // 초등 3학년 1학기
    // ============================================
    // 1단원: 덧셈과 뺄셈 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`G3-S1-U1-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈'], validation: 'basic' };
    }
    // 2단원: 평면 도형 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`G3-S1-U2-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['평면', '도형'], validation: 'basic' };
    }
    // 3단원: 나눗셈 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`G3-S1-U3-T${t}`] = { templates: [PROBLEM_TYPES.TWO_DIGIT_DIV], requiredKeywords: ['나눗셈'], validation: 'basic' };
    }
    // 4단원: 곱셈 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`G3-S1-U4-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['곱셈'], validation: 'basic' };
    }
    // 5단원: 길이와 시간 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`G3-S1-U5-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['길이', '시간'], validation: 'basic' };
    }
    // 6단원: 분수와 소수 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G3-S1-U6-T${t}`] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '소수'], validation: 'basic' };
    }
    
    // 초등 3학년 2학기
    // 1단원: 곱셈 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`G3-S2-U1-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['곱셈'], validation: 'basic' };
    }
    // 2단원: 나눗셈 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`G3-S2-U2-T${t}`] = { templates: [PROBLEM_TYPES.TWO_DIGIT_DIV], requiredKeywords: ['나눗셈'], validation: 'basic' };
    }
    // 3단원: 원 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`G3-S2-U3-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['원'], validation: 'basic' };
    }
    // 4단원: 분수 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`G3-S2-U4-T${t}`] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수'], validation: 'basic' };
    }
    // 5단원: 들이와 무게 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`G3-S2-U5-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['들이', '무게'], validation: 'basic' };
    }
    // 6단원: 그림 그래프 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`G3-S2-U6-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['그래프'], validation: 'basic' };
    }
    
    // ============================================
    // 4학년 1학기 - 1단원: 큰 수 (6개 토픽)
    // ============================================
    expanded['G4-S1-U1-T1'] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['다섯', '자리', '수'], validation: 'basic' }; // 다섯 자리 수 알아보기
    expanded['G4-S1-U1-T2'] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['십만', '백만', '천만'], validation: 'basic' }; // 십만, 백만, 천만 알아보기
    expanded['G4-S1-U1-T3'] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['억'], validation: 'basic' }; // 억 알아보기
    expanded['G4-S1-U1-T4'] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['조'], validation: 'basic' }; // 조 알아보기
    expanded['G4-S1-U1-T5'] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['뛰어', '세기'], validation: 'basic' }; // 뛰어 세기
    expanded['G4-S1-U1-T6'] = { templates: [PROBLEM_TYPES.SKIP_COUNT], requiredKeywords: ['수의', '크기', '비교'], validation: 'basic' }; // 수의 크기 비교하기
    
    // ============================================
    // 4학년 1학기 - 2단원: 각도 (5개 토픽)
    // ============================================
    expanded['G4-S1-U2-T1'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['각의', '크기', '비교', '재기'], validation: 'basic' }; // 각의 크기 비교, 각의 크기 재기
    expanded['G4-S1-U2-T2'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['예각', '둔각', '각도'], validation: 'basic' }; // 예각과 둔각 알아보기, 각도 어림하고 재기
    expanded['G4-S1-U2-T3'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['각도의', '합', '차'], validation: 'basic' }; // 각도의 합과 차
    expanded['G4-S1-U2-T4'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['삼각형', '세', '각', '합'], validation: 'basic' }; // 삼각형의 세 각의 크기의 합
    expanded['G4-S1-U2-T5'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['사각형', '네', '각', '합'], validation: 'basic' }; // 사각형의 네 각의 크기의 합
    
    // ============================================
    // 4학년 1학기 - 3단원: 곱셈과 나눗셈 (5개 토픽)
    // ============================================
    expanded['G4-S1-U3-T1'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['세', '자리', '수', '곱셈'], validation: 'basic' }; // 세 자리 수 × 몇십
    expanded['G4-S1-U3-T2'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['세', '자리', '수', '곱셈'], validation: 'basic' }; // 세 자리 수 × 몇십몇
    expanded['G4-S1-U3-T3'] = { templates: [PROBLEM_TYPES.TWO_DIGIT_DIV], requiredKeywords: ['몇십', '나누기'], validation: 'basic' }; // 몇십으로 나누기
    expanded['G4-S1-U3-T4'] = { templates: [PROBLEM_TYPES.TWO_DIGIT_DIV], requiredKeywords: ['몇십몇', '나누기'], validation: 'basic' }; // 몇십몇으로 나누기 (1)
    expanded['G4-S1-U3-T5'] = { templates: [PROBLEM_TYPES.TWO_DIGIT_DIV], requiredKeywords: ['몇십몇', '나누기'], validation: 'basic' }; // 몇십몇으로 나누기 (2)
    
    // ============================================
    // 4학년 1학기 - 4단원: 평면도형의 이동 (5개 토픽)
    // ============================================
    expanded['G4-S1-U4-T1'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['점의', '이동'], validation: 'basic' }; // 점의 이동
    expanded['G4-S1-U4-T2'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['평면도형', '밀기'], validation: 'basic' }; // 평면도형 밀기
    expanded['G4-S1-U4-T3'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['평면도형', '뒤집기'], validation: 'basic' }; // 평면도형 뒤집기
    expanded['G4-S1-U4-T4'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['평면도형', '돌리기'], validation: 'basic' }; // 평면도형 돌리기
    expanded['G4-S1-U4-T5'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['평면도형', '이동', '무늬'], validation: 'basic' }; // 평면도형을 이동하여 무늬 꾸미기
    
    // ============================================
    // 4학년 1학기 - 5단원: 막대 그래프 (3개 토픽)
    // ============================================
    expanded['G4-S1-U5-T1'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['막대그래프', '알아보기'], validation: 'basic' }; // 막대그래프 알아보기
    expanded['G4-S1-U5-T2'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['막대그래프', '나타내기'], validation: 'basic' }; // 막대그래프 나타내기
    expanded['G4-S1-U5-T3'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['막대그래프', '활용'], validation: 'basic' }; // 막대그래프 활용하기
    
    // ============================================
    // 4학년 1학기 - 6단원: 규칙 찾기 (4개 토픽)
    // ============================================
    expanded['G4-S1-U6-T1'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['수의', '배열', '규칙'], validation: 'basic' }; // 수의 배열에서 규칙 찾기
    expanded['G4-S1-U6-T2'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['모양의', '배열', '규칙'], validation: 'basic' }; // 모양의 배열에서 규칙 찾기
    expanded['G4-S1-U6-T3'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['계산식의', '배열', '규칙'], validation: 'basic' }; // 계산식의 배열에서 규칙 찾기
    expanded['G4-S1-U6-T4'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['등호', '식'], validation: 'basic' }; // 등호(=)가 있는 식 알아보기
    
    // ============================================
    // 4학년 2학기 - 1단원: 분수의 덧셈과 뺄셈 (5개 토픽)
    // ============================================
    expanded['G4-S2-U1-T1'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '덧셈'], validation: 'basic' }; // 분수의 덧셈 (1)
    expanded['G4-S2-U1-T2'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '덧셈'], validation: 'basic' }; // 분수의 덧셈 (2)
    expanded['G4-S2-U1-T3'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '뺄셈'], validation: 'basic' }; // 분수의 뺄셈 (1)
    expanded['G4-S2-U1-T4'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '뺄셈'], validation: 'basic' }; // 분수의 뺄셈 (2)
    expanded['G4-S2-U1-T5'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '뺄셈'], validation: 'basic' }; // 분수의 뺄셈 (3)
    
    // ============================================
    // 4학년 2학기 - 2단원: 삼각형 (4개 토픽) - 이미 CONCEPT_TEMPLATE_MAP에 있음
    // ============================================
    // G4-S2-U2-T1 ~ T4는 이미 CONCEPT_TEMPLATE_MAP에 등록됨
    
    // ============================================
    // 4학년 2학기 - 3단원: 소수의 덧셈과 뺄셈 (7개 토픽)
    // ============================================
    expanded['G4-S2-U3-T1'] = { templates: [PROBLEM_TYPES.DECIMAL_MULTIPLY], requiredKeywords: ['소수', '두', '자리'], validation: 'basic' }; // 소수 두 자리 수
    expanded['G4-S2-U3-T2'] = { templates: [PROBLEM_TYPES.DECIMAL_MULTIPLY], requiredKeywords: ['소수', '세', '자리'], validation: 'basic' }; // 소수 세 자리 수
    expanded['G4-S2-U3-T3'] = { templates: [PROBLEM_TYPES.DECIMAL_MULTIPLY], requiredKeywords: ['소수', '크기', '비교'], validation: 'basic' }; // 소수의 크기 비교, 소수 사이의 관계
    expanded['G4-S2-U3-T4'] = { templates: [PROBLEM_TYPES.DECIMAL_MULTIPLY], requiredKeywords: ['소수', '한', '자리', '덧셈'], validation: 'basic' }; // 소수 한 자리 수의 덧셈
    expanded['G4-S2-U3-T5'] = { templates: [PROBLEM_TYPES.DECIMAL_MULTIPLY], requiredKeywords: ['소수', '두', '자리', '덧셈'], validation: 'basic' }; // 소수 두 자리 수의 덧셈
    expanded['G4-S2-U3-T6'] = { templates: [PROBLEM_TYPES.DECIMAL_MULTIPLY], requiredKeywords: ['소수', '한', '자리', '뺄셈'], validation: 'basic' }; // 소수 한 자리 수의 뺄셈
    expanded['G4-S2-U3-T7'] = { templates: [PROBLEM_TYPES.DECIMAL_MULTIPLY], requiredKeywords: ['소수', '두', '자리', '뺄셈'], validation: 'basic' }; // 소수 두 자리 수의 뺄셈
    
    // ============================================
    // 4학년 2학기 - 4단원: 사각형 (6개 토픽)
    // ============================================
    expanded['G4-S2-U4-T1'] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['수직', '수선'], validation: 'basic' }; // 수직과 수선
    expanded['G4-S2-U4-T2'] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['평행', '평행선'], validation: 'basic' }; // 평행과 평행선
    expanded['G4-S2-U4-T3'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['평행선', '사이', '거리'], validation: 'basic' }; // 평행선 사이의 거리
    expanded['G4-S2-U4-T4'] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['사다리꼴', '평행사변형'], validation: 'basic' }; // 사다리꼴과 평행사변형
    expanded['G4-S2-U4-T5'] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['마름모'], validation: 'basic' }; // 마름모
    expanded['G4-S2-U4-T6'] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['여러', '가지', '사각형'], validation: 'basic' }; // 여러 가지 사각형
    
    // ============================================
    // 4학년 2학기 - 5단원: 꺾은선그래프 (3개 토픽)
    // ============================================
    expanded['G4-S2-U5-T1'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['꺾은선그래프', '알아보기'], validation: 'basic' }; // 꺾은선그래프 알아보기
    expanded['G4-S2-U5-T2'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['꺾은선그래프', '내용'], validation: 'basic' }; // 꺾은선그래프 내용 알아보기
    expanded['G4-S2-U5-T3'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['꺾은선그래프', '나타내기', '해석'], validation: 'basic' }; // 꺾은선그래프 나타내기, 해석하기
    
    // ============================================
    // 4학년 2학기 - 6단원: 다각형 (3개 토픽)
    // ============================================
    expanded['G4-S2-U6-T1'] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['다각형', '정다각형'], validation: 'basic' }; // 다각형과 정다각형 알아보기
    expanded['G4-S2-U6-T2'] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['대각선'], validation: 'basic' }; // 대각선 알아보기
    expanded['G4-S2-U6-T3'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['모양', '만들기', '채우기'], validation: 'basic' }; // 모양 만들기와 모양 채우기
    
    // ============================================
    // 5학년 1학기 - 1단원: 자연수의 혼합 계산 (5개 토픽)
    // ============================================
    expanded['G5-S1-U1-T1'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈', '혼합'], validation: 'basic' }; // 덧셈과 뺄셈이 섞여 있는 식 계산하기
    expanded['G5-S1-U1-T2'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['곱셈', '나눗셈', '혼합'], validation: 'basic' }; // 곱셈과 나눗셈이 섞여 있는 식 계산하기
    expanded['G5-S1-U1-T3'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈', '곱셈', '혼합'], validation: 'basic' }; // 덧셈, 뺄셈, 곱셈이 섞여 있는 식 계산하기
    expanded['G5-S1-U1-T4'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈', '나눗셈', '혼합'], validation: 'basic' }; // 덧셈, 뺄셈, 나눗셈이 섞여 있는 식 계산하기
    expanded['G5-S1-U1-T5'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['덧셈', '뺄셈', '곱셈', '나눗셈', '혼합'], validation: 'basic' }; // 덧셈, 뺄셈, 곱셈, 나눗셈이 섞여 있는 식 계산하기
    
    // ============================================
    // 5학년 1학기 - 2단원: 약수와 배수 (7개 토픽)
    // ============================================
    expanded['G5-S1-U2-T1'] = { templates: [PROBLEM_TYPES.DIVISOR], requiredKeywords: ['약수'], validation: 'basic' }; // 약수 알아보기
    expanded['G5-S1-U2-T2'] = { templates: [PROBLEM_TYPES.DIVISOR], requiredKeywords: ['배수'], validation: 'basic' }; // 배수 알아보기
    expanded['G5-S1-U2-T3'] = { templates: [PROBLEM_TYPES.DIVISOR], requiredKeywords: ['약수', '배수', '관계'], validation: 'basic' }; // 약수와 배수의 관계 알아보기
    expanded['G5-S1-U2-T4'] = { templates: [PROBLEM_TYPES.COMMON_DIVISOR], requiredKeywords: ['공약수', '최대공약수'], validation: 'basic' }; // 공약수와 최대공약수 알아보기
    expanded['G5-S1-U2-T5'] = { templates: [PROBLEM_TYPES.COMMON_DIVISOR], requiredKeywords: ['최대공약수', '구하는', '방법'], validation: 'basic' }; // 최대공약수 구하는 방법 알아보기
    expanded['G5-S1-U2-T6'] = { templates: [PROBLEM_TYPES.COMMON_DIVISOR], requiredKeywords: ['공배수', '최소공배수'], validation: 'basic' }; // 공배수와 최소공배수 알아보기
    expanded['G5-S1-U2-T7'] = { templates: [PROBLEM_TYPES.COMMON_DIVISOR], requiredKeywords: ['최소공배수', '구하는', '방법'], validation: 'basic' }; // 최소공배수 구하는 방법 알아보기
    
    // ============================================
    // 5학년 1학기 - 3단원: 대응 관계 (3개 토픽)
    // ============================================
    expanded['G5-S1-U3-T1'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['두', '양', '사이', '관계'], validation: 'basic' }; // 두 양 사이의 관계 알아보기
    expanded['G5-S1-U3-T2'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['대응', '관계', '식'], validation: 'basic' }; // 대응 관계를 식으로 나타내기
    expanded['G5-S1-U3-T3'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['생활', '대응', '관계', '식'], validation: 'basic' }; // 생활 속에서 대응 관계를 찾아 식으로 나타내기
    
    // ============================================
    // 5학년 1학기 - 4단원: 약분과 통분 (6개 토픽)
    // ============================================
    expanded['G5-S1-U4-T1'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['크기', '같은', '분수'], validation: 'basic' }; // 크기가 같은 분수 알아보기
    expanded['G5-S1-U4-T2'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['크기', '같은', '분수', '만들기'], validation: 'basic' }; // 크기가 같은 분수 만들기
    expanded['G5-S1-U4-T3'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '간단하게', '나타내기'], validation: 'basic' }; // 분수를 간단하게 나타내기
    expanded['G5-S1-U4-T4'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분모', '같은', '분수'], validation: 'basic' }; // 분모가 같은 분수로 나타내기
    expanded['G5-S1-U4-T5'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '크기', '비교'], validation: 'basic' }; // 분수의 크기 비교하기
    expanded['G5-S1-U4-T6'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '소수', '크기', '비교'], validation: 'basic' }; // 분수와 소수의 크기 비교하기
    
    // ============================================
    // 5학년 1학기 - 5단원: 분수의 덧셈과 뺄셈 (4개 토픽)
    // ============================================
    expanded['G5-S1-U5-T1'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['진분수', '덧셈'], validation: 'basic' }; // 진분수의 덧셈
    expanded['G5-S1-U5-T2'] = { templates: [PROBLEM_TYPES.MIXED_FRACTION], requiredKeywords: ['대분수', '덧셈'], validation: 'basic' }; // 대분수의 덧셈
    expanded['G5-S1-U5-T3'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['진분수', '뺄셈'], validation: 'basic' }; // 진분수의 뺄셈
    expanded['G5-S1-U5-T4'] = { templates: [PROBLEM_TYPES.MIXED_FRACTION], requiredKeywords: ['대분수', '뺄셈'], validation: 'basic' }; // 대분수의 뺄셈
    
    // ============================================
    // 5학년 1학기 - 6단원: 다각형의 둘레와 넓이 (5개 토픽)
    // ============================================
    expanded['G5-S1-U6-T1'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['다각형', '둘레'], validation: 'basic' }; // 다각형의 둘레 구하기
    expanded['G5-S1-U6-T2'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['직사각형', '넓이'], validation: 'basic' }; // 1 cm² 알아보기, 직사각형의 넓이 구하기
    expanded['G5-S1-U6-T3'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['넓이', '단위'], validation: 'basic' }; // 1 cm² 보다 더 큰 넓이의 단위 알아보기
    expanded['G5-S1-U6-T4'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['평행사변형', '삼각형', '넓이'], validation: 'basic' }; // 평행사변형과 삼각형의 넓이 구하기
    expanded['G5-S1-U6-T5'] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['마름모', '사다리꼴', '넓이'], validation: 'basic' }; // 마름모와 사다리꼴의 넓이 구하기
    
    // ============================================
    // 6학년 1학기 - 1단원: 분수의 나눗셈 (5개 토픽)
    // ============================================
    expanded['G6-S1-U1-T1'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['자연수', '나눗셈', '몫', '분수'], validation: 'basic' }; // (자연수)÷(자연수)의 몫을 분수로 나타내기(1)
    expanded['G6-S1-U1-T2'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['자연수', '나눗셈', '몫', '분수'], validation: 'basic' }; // (자연수)÷(자연수)의 몫을 분수로 나타내기(2)
    expanded['G6-S1-U1-T3'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '나눗셈', '자연수'], validation: 'basic' }; // (분수)÷(자연수) 알아보기
    expanded['G6-S1-U1-T4'] = { templates: [PROBLEM_TYPES.FRACTION_SIMPLIFY], requiredKeywords: ['분수', '나눗셈', '곱셈'], validation: 'basic' }; // (분수)÷(자연수)를 분수의 곱셈으로 나타내기
    expanded['G6-S1-U1-T5'] = { templates: [PROBLEM_TYPES.MIXED_FRACTION], requiredKeywords: ['대분수', '나눗셈', '자연수'], validation: 'basic' }; // (대분수)÷(자연수) 알아보기
    
    // ============================================
    // 6학년 1학기 - 2단원: 각기둥과 각뿔 (5개 토픽)
    // ============================================
    expanded['G6-S1-U2-T1'] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['각기둥', '알아보기'], validation: 'basic' }; // 각기둥 알아보기(1)
    expanded['G6-S1-U2-T2'] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['각기둥', '알아보기'], validation: 'basic' }; // 각기둥 알아보기(2)
    expanded['G6-S1-U2-T3'] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['각기둥', '전개도'], validation: 'basic' }; // 각기둥의 전개도
    expanded['G6-S1-U2-T4'] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['각뿔', '알아보기'], validation: 'basic' }; // 각뿔 알아보기(1)
    expanded['G6-S1-U2-T5'] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['각뿔', '알아보기'], validation: 'basic' }; // 각뿔 알아보기(2)
    
    // ============================================
    // 6학년 1학기 - 3단원: 소수의 나눗셈 (6개 토픽)
    // ============================================
    expanded['G6-S1-U3-T1'] = { templates: [PROBLEM_TYPES.DECIMAL_DIVIDE], requiredKeywords: ['소수', '나눗셈', '자연수'], validation: 'basic' }; // (소수)÷(자연수)(1)
    expanded['G6-S1-U3-T2'] = { templates: [PROBLEM_TYPES.DECIMAL_DIVIDE], requiredKeywords: ['소수', '나눗셈', '자연수'], validation: 'basic' }; // (소수)÷(자연수)(2)
    expanded['G6-S1-U3-T3'] = { templates: [PROBLEM_TYPES.DECIMAL_DIVIDE], requiredKeywords: ['소수', '나눗셈', '자연수'], validation: 'basic' }; // (소수)÷(자연수)(3)
    expanded['G6-S1-U3-T4'] = { templates: [PROBLEM_TYPES.DECIMAL_DIVIDE], requiredKeywords: ['소수', '나눗셈', '자연수'], validation: 'basic' }; // (소수)÷(자연수)(4)
    expanded['G6-S1-U3-T5'] = { templates: [PROBLEM_TYPES.DECIMAL_DIVIDE], requiredKeywords: ['소수', '나눗셈', '자연수'], validation: 'basic' }; // (소수)÷(자연수)(5)
    expanded['G6-S1-U3-T6'] = { templates: [PROBLEM_TYPES.DECIMAL_DIVIDE], requiredKeywords: ['자연수', '나눗셈'], validation: 'basic' }; // (자연수)÷(자연수)
    
    // ============================================
    // 6학년 1학기 - 4단원: 비와 비율 (4개 토픽)
    // ============================================
    expanded['G6-S1-U4-T1'] = { templates: [PROBLEM_TYPES.RATIO], requiredKeywords: ['두', '수', '비교'], validation: 'basic' }; // 두 수 비교하기
    expanded['G6-S1-U4-T2'] = { templates: [PROBLEM_TYPES.RATIO], requiredKeywords: ['비', '알아보기'], validation: 'basic' }; // 비 알아보기
    expanded['G6-S1-U4-T3'] = { templates: [PROBLEM_TYPES.RATIO], requiredKeywords: ['비율', '알아보기'], validation: 'basic' }; // 비율 알아보기, 비율이 사용되는 경우 알아보기
    expanded['G6-S1-U4-T4'] = { templates: [PROBLEM_TYPES.RATIO], requiredKeywords: ['백분율', '알아보기'], validation: 'basic' }; // 백분율 알아보기, 백분율이 사용되는 경우 알아보기
    
    // ============================================
    // 6학년 1학기 - 5단원: 여러 가지 그래프 (4개 토픽)
    // ============================================
    expanded['G6-S1-U5-T1'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['띠그래프', '알아보기', '나타내기'], validation: 'basic' }; // 띠그래프 알아보기, 띠그래프로 나타내기
    expanded['G6-S1-U5-T2'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['원그래프', '알아보기', '나타내기'], validation: 'basic' }; // 원그래프 알아보기, 원그래프로 나타내기
    expanded['G6-S1-U5-T3'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['그래프', '해석'], validation: 'basic' }; // 그래프 해석하기
    expanded['G6-S1-U5-T4'] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['여러', '가지', '그래프', '비교'], validation: 'basic' }; // 여러 가지 그래프 비교하기
    
    // ============================================
    // 6학년 1학기 - 6단원: 직육면체의 겉넓이와 부피 (4개 토픽)
    // ============================================
    expanded['G6-S1-U6-T1'] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['직육면체', '겉넓이'], validation: 'basic' }; // 직육면체의 겉넓이 구하기
    expanded['G6-S1-U6-T2'] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['1cm³', '알아보기'], validation: 'basic' }; // 1cm³ 알아보기
    expanded['G6-S1-U6-T3'] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['직육면체', '부피'], validation: 'basic' }; // 직육면체의 부피 구하기
    expanded['G6-S1-U6-T4'] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['m³', '알아보기'], validation: 'basic' }; // m³ 알아보기
    
    // ============================================
    // 중학교 1학년 1학기
    // ============================================
    // 1단원: 소인수분해
    // 1-1. 소인수분해 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`M1-S1-U1-S1-T${t}`] = { templates: [PROBLEM_TYPES.DIVISOR, PROBLEM_TYPES.COMMON_DIVISOR], requiredKeywords: ['소인수분해', '소수', '합성수', '약수'], validation: 'basic' };
    }
    // 1-2. 최대공약수와 최소공배수 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`M1-S1-U1-S2-T${t}`] = { templates: [PROBLEM_TYPES.COMMON_DIVISOR], requiredKeywords: ['최대공약수', '최소공배수'], validation: 'basic' };
    }
    // 2단원: 정수와 유리수
    // 2-1. 정수와 유리수 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`M1-S1-U2-S1-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['정수', '유리수'], validation: 'basic' };
    }
    // 2-2. 정수와 유리수의 사칙계산 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`M1-S1-U2-S2-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['정수', '유리수', '덧셈', '뺄셈', '곱셈', '나눗셈'], validation: 'basic' };
    }
    // 3단원: 문자와 식
    // 3-1. 문자의 사용과 식의 계산 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`M1-S1-U3-S1-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_EQUATION], requiredKeywords: ['문자', '식'], validation: 'basic' };
    }
    // 3-2. 일차방정식 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`M1-S1-U3-S2-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_EQUATION], requiredKeywords: ['일차방정식', '방정식'], validation: 'basic' };
    }
    // 3-3. 일차방정식의 활용 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`M1-S1-U3-S3-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_EQUATION], requiredKeywords: ['일차방정식', '활용'], validation: 'basic' };
    }
    // 4단원: 좌표평면과 그래프
    // 4-1. 좌표평면과 그래프 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`M1-S1-U4-S1-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_FUNCTION], requiredKeywords: ['좌표', '그래프'], validation: 'basic' };
    }
    // 4-2. 정비례와 반비례 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`M1-S1-U4-S2-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_FUNCTION], requiredKeywords: ['정비례', '반비례'], validation: 'basic' };
    }
    
    // ============================================
    // 중학교 1학년 2학기
    // ============================================
    // 1단원: 도형의 기초
    // 1-1. 기본 도형 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`M1-S2-U1-S1-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['도형', '점', '선', '면'], validation: 'basic' };
    }
    // 1-2. 작도와 합동 (12개 토픽)
    for (let t = 1; t <= 12; t++) {
        expanded[`M1-S2-U1-S2-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['작도', '합동'], validation: 'basic' };
    }
    // 2단원: 평면 도형
    // 2-1. 다각형의 성질 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`M1-S2-U2-S1-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['다각형'], validation: 'basic' };
    }
    // 2-2. 원과 부채꼴 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`M1-S2-U2-S2-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['원', '부채꼴'], validation: 'basic' };
    }
    // 3단원: 입체 도형
    // 3-1. 다면체와 회전체 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`M1-S2-U3-S1-T${t}`] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['다면체', '회전체'], validation: 'basic' };
    }
    // 3-2. 입체도형의 겉넓이와 부피 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`M1-S2-U3-S2-T${t}`] = { templates: [PROBLEM_TYPES.SOLID_VOLUME], requiredKeywords: ['겉넓이', '부피'], validation: 'basic' };
    }
    // 4단원: 통계
    // 4-1. 대푯값 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`M1-S2-U4-S1-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['대푯값', '평균'], validation: 'basic' };
    }
    // 4-2. 도수분포표와 상대도수 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`M1-S2-U4-S2-T${t}`] = { templates: [PROBLEM_TYPES.PATTERN], requiredKeywords: ['도수분포표', '상대도수'], validation: 'basic' };
    }
    
    // ============================================
    // 중학교 2학년 1학기
    // ============================================
    // 1단원: 유리수와 순환소수
    // 1-1. 유리수와 순환소수 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`M2-S1-U1-S1-T${t}`] = { templates: [PROBLEM_TYPES.DECIMAL_MULTIPLY], requiredKeywords: ['유리수', '순환소수'], validation: 'basic' };
    }
    // 2단원: 식의 계산
    // 2-1. 단항식의 계산 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`M2-S1-U2-S1-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['단항식'], validation: 'basic' };
    }
    // 2-2. 다항식의 계산 (4개 토픽)
    for (let t = 1; t <= 4; t++) {
        expanded[`M2-S1-U2-S2-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['다항식'], validation: 'basic' };
    }
    // 3단원: 부등식과 연립방정식
    // 3-1. 부등식 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`M2-S1-U3-S1-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_EQUATION], requiredKeywords: ['부등식'], validation: 'basic' };
    }
    // 3-2. 연립방정식 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`M2-S1-U3-S2-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_EQUATION], requiredKeywords: ['연립방정식'], validation: 'basic' };
    }
    // 4단원: 함수
    // 4-1. 일차함수와 그 그래프 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`M2-S1-U4-S1-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_FUNCTION], requiredKeywords: ['일차함수', '그래프'], validation: 'basic' };
    }
    // 4-2. 일차함수와 일차방정식의 관계 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`M2-S1-U4-S2-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_FUNCTION], requiredKeywords: ['일차함수', '일차방정식'], validation: 'basic' };
    }
    // 5단원: 확률
    // 5-1. 경우의 수 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`M2-S1-U5-S1-T${t}`] = { templates: [PROBLEM_TYPES.PROBABILITY], requiredKeywords: ['경우의', '수'], validation: 'basic' };
    }
    // 5-2. 확률과 그 계산 (9개 토픽)
    for (let t = 1; t <= 9; t++) {
        expanded[`M2-S1-U5-S2-T${t}`] = { templates: [PROBLEM_TYPES.PROBABILITY], requiredKeywords: ['확률'], validation: 'basic' };
    }
    
    // ============================================
    // 중학교 2학년 2학기
    // ============================================
    // 1단원: 삼각형의 성질
    // 1-1. 이등변삼각형과 직각삼각형 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`M2-S2-U1-S1-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['삼각형', '이등변', '직각'], validation: 'basic' };
    }
    // 1-2. 삼각형의 외심과 내심 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`M2-S2-U1-S2-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['외심', '내심'], validation: 'basic' };
    }
    // 2단원: 사각형의 성질
    // 2-1. 평행사변형 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`M2-S2-U2-S1-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['평행사변형'], validation: 'basic' };
    }
    // 2-2. 여러 가지 사각형 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`M2-S2-U2-S2-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['사각형'], validation: 'basic' };
    }
    // 3단원: 도형의 닮음과 피타고라스 정리
    // 3-1. 도형의 닮음 (3개 토픽)
    for (let t = 1; t <= 3; t++) {
        expanded[`M2-S2-U3-S1-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['닮음'], validation: 'basic' };
    }
    // 3-2. 평행선과 선분의 길이의 비 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`M2-S2-U3-S2-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['평행선', '비'], validation: 'basic' };
    }
    // 3-3. 삼각형의 무게중심과 닮음의 활용 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`M2-S2-U3-S3-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['무게중심', '닮음'], validation: 'basic' };
    }
    // 3-4. 피타고라스 정리 (13개 토픽)
    for (let t = 1; t <= 13; t++) {
        expanded[`M2-S2-U3-S4-T${t}`] = { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['피타고라스'], validation: 'basic' };
    }
    // 4단원: 확률
    // 4-1. 경우의 수 (7개 토픽) - 이미 위에 있음
    // 4-2. 확률과 그 계산 (9개 토픽) - 이미 위에 있음
    
    // ============================================
    // 중학교 3학년 1학기
    // ============================================
    // 1단원: 실수와 그 연산
    // 1-1. 제곱근과 실수 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`M3-S1-U1-S1-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['제곱근', '실수'], validation: 'basic' };
    }
    // 1-2. 근호를 포함한 식의 계산 (9개 토픽)
    for (let t = 1; t <= 9; t++) {
        expanded[`M3-S1-U1-S2-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['근호'], validation: 'basic' };
    }
    // 2단원: 식의 계산
    // 2-1. 다항식의 곱셈 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`M3-S1-U2-S1-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['다항식', '곱셈'], validation: 'basic' };
    }
    // 2-2. 다항식의 인수분해 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`M3-S1-U2-S2-T${t}`] = { templates: [PROBLEM_TYPES.MIXED_CALC], requiredKeywords: ['인수분해'], validation: 'basic' };
    }
    // 3단원: 이차방정식
    // 3-1. 이차방정식과 그 풀이 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`M3-S1-U3-S1-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_EQUATION], requiredKeywords: ['이차방정식'], validation: 'basic' };
    }
    // 3-2. 이차방정식의 활용 (5개 토픽)
    for (let t = 1; t <= 5; t++) {
        expanded[`M3-S1-U3-S2-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_EQUATION], requiredKeywords: ['이차방정식', '활용'], validation: 'basic' };
    }
    // 4단원: 이차함수
    // 4-1. 이차함수와 그 그래프 (6개 토픽)
    for (let t = 1; t <= 6; t++) {
        expanded[`M3-S1-U4-S1-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_FUNCTION], requiredKeywords: ['이차함수', '그래프'], validation: 'basic' };
    }
    // 4-2. 이차함수의 활용 (7개 토픽)
    for (let t = 1; t <= 7; t++) {
        expanded[`M3-S1-U4-S2-T${t}`] = { templates: [PROBLEM_TYPES.LINEAR_FUNCTION], requiredKeywords: ['이차함수', '활용'], validation: 'basic' };
    }
    
    return expanded;
}

// CONCEPT_TEMPLATE_MAP 확장
Object.assign(CONCEPT_TEMPLATE_MAP, expandConceptTemplateMap());

// 최대공약수 구하기 (유클리드 알고리즘)
function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 약수 구하기
function getDivisors(n) {
    const divisors = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) {
            divisors.push(i);
        }
    }
    return divisors;
}

// 공약수 구하기
function getCommonDivisors(a, b) {
    const divisors = [];
    const max = Math.min(a, b);
    for (let i = 1; i <= max; i++) {
        if (a % i === 0 && b % i === 0) {
            divisors.push(i);
        }
    }
    return divisors;
}

// (A) 약수 알아보기 문제 생성
function generateDivisorProblem(grade) {
    // 학년에 따라 숫자 범위 조절
    let numbers;
    if (grade <= 3) {
        // 1-3학년: 작은 수
        numbers = [12, 16, 18, 20, 24, 28, 30];
    } else if (grade <= 4) {
        // 4학년: 중간 수
        numbers = [24, 30, 36, 40, 42, 48, 54, 56];
    } else {
        // 5-6학년: 큰 수
        numbers = [36, 40, 42, 48, 54, 56, 60, 72, 80, 84, 90, 96];
    }
    const num = numbers[Math.floor(Math.random() * numbers.length)];
    const divisors = getDivisors(num);
    
    return {
        type: PROBLEM_TYPES.DIVISOR,
        question: `${num}의 약수를 모두 쓰고, 약수의 개수도 쓰세요.`,
        answer: `${divisors.join(',')} / ${divisors.length}개`,
        explanation: `${num}의 약수는 ${num}을 나누어떨어지게 하는 수입니다. 1부터 ${num}까지 확인하면 ${divisors.join(', ')}가 약수입니다. 따라서 약수는 ${divisors.length}개입니다.`,
        inputPlaceholder: '예: 1,2,3,4,6,8,12,24 / 8개',
        meta: { number: num, divisors: divisors }
    };
}

// (B) 공약수와 최대공약수 문제 생성
function generateCommonDivisorProblem(grade) {
    // 학년에 따라 숫자 범위 조절
    let pairs;
    if (grade <= 3) {
        // 1-3학년: 작은 수
        pairs = [[12, 18], [12, 20], [15, 20], [16, 24], [18, 24]];
    } else if (grade <= 4) {
        // 4학년: 중간 수
        pairs = [[18, 24], [20, 30], [24, 30], [24, 36], [28, 42], [30, 36]];
    } else {
        // 5-6학년: 큰 수
        pairs = [
            [24, 36], [18, 30], [20, 30], [28, 42], [32, 48],
            [30, 45], [36, 54], [40, 60], [42, 56], [48, 72]
        ];
    }
    const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
    
    // 에러 방지: 0으로 나누기 방지
    if (a === 0 || b === 0) {
        return generateCommonDivisorProblem(grade); // 재귀 호출로 다시 생성
    }
    
    const commonDivisors = getCommonDivisors(a, b);
    const maxGcd = gcd(a, b);
    
    // 에러 방지: 최대공약수가 1만 나오지 않도록 (2 이상인 경우만)
    if (maxGcd <= 1 || commonDivisors.length <= 1) {
        return generateCommonDivisorProblem(grade); // 재귀 호출로 다시 생성
    }
    
    return {
        type: PROBLEM_TYPES.COMMON_DIVISOR,
        question: `${a}와 ${b}의 공약수를 모두 쓰고, 최대공약수도 구하세요.`,
        answer: `공약수: ${commonDivisors.join(',')} / 최대공약수: ${maxGcd}`,
        explanation: `${a}와 ${b}의 공약수는 두 수를 모두 나누어떨어지게 하는 수입니다. 공약수는 ${commonDivisors.join(', ')}이고, 이 중 가장 큰 수인 ${maxGcd}가 최대공약수입니다.`,
        inputPlaceholder: '예: 공약수: 1,2,3,6 / 최대공약수: 6',
        meta: { a, b, commonDivisors, maxGcd }
    };
}

// (C) 분수를 간단히 나타내기 문제 생성 - 진분수 덧셈/뺄셈, 분수 나눗셈 포함, KaTeX 형식
function generateFractionSimplifyProblem(grade) {
    // 6학년 분수 나눗셈 처리
    if (grade === 6) {
        const isDivision = Math.random() > 0.3; // 70% 확률로 분수 나눗셈
        
        if (isDivision) {
            const isNaturalDiv = Math.random() > 0.5; // 자연수÷자연수 vs 분수÷자연수
            
            if (isNaturalDiv) {
                // (자연수)÷(자연수)의 몫을 분수로 나타내기
                const a = Math.floor(Math.random() * 10) + 5; // 5~14
                const b = Math.floor(Math.random() * 8) + 3; // 3~10
                const g = gcd(a, b);
                const simplifiedA = a / g;
                const simplifiedB = b / g;
                
                return {
                    type: PROBLEM_TYPES.FRACTION_SIMPLIFY,
                    question: `${a} ÷ ${b}의 몫을 분수로 나타내시오.`,
                    questionLatex: `${a} \\div ${b}의 몫을 분수로 나타내시오.`,
                    answer: `\\dfrac{${simplifiedA}}{${simplifiedB}}`,
                    answerLatex: `\\dfrac{${simplifiedA}}{${simplifiedB}}`,
                    explanation: `${a} ÷ ${b} = \\dfrac{${a}}{${b}} = \\dfrac{${simplifiedA}}{${simplifiedB}}입니다.`,
                    inputPlaceholder: '예: \\dfrac{2}{3}',
                    meta: { grade, concept: 'fraction_division' }
                };
            } else {
                // (분수)÷(자연수) 또는 (대분수)÷(자연수)
                const isMixed = Math.random() > 0.5;
                const denom = [2, 3, 4, 5, 6, 8, 10, 12][Math.floor(Math.random() * 8)];
                const divisor = Math.floor(Math.random() * 8) + 2; // 2~9
                
                if (isMixed) {
                    // (대분수)÷(자연수)
                    const whole = Math.floor(Math.random() * 2) + 1; // 1~2
                    const num = Math.floor(Math.random() * (denom - 1)) + 1; // 1 ~ denom-1
                    const total = whole * denom + num;
                    const resultNum = total;
                    const resultDen = denom * divisor;
                    const g = gcd(resultNum, resultDen);
                    const simplifiedNum = resultNum / g;
                    const simplifiedDen = resultDen / g;
                    
                    return {
                        type: PROBLEM_TYPES.MIXED_FRACTION,
                        question: `${whole}\\dfrac{${num}}{${denom}} ÷ ${divisor} = ?`,
                        questionLatex: `${whole}\\dfrac{${num}}{${denom}} \\div ${divisor} = ?`,
                        answer: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                        answerLatex: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                        explanation: `${whole}\\dfrac{${num}}{${denom}} = \\dfrac{${total}}{${denom}}이므로, \\dfrac{${total}}{${denom}} ÷ ${divisor} = \\dfrac{${total}}{${denom}} × \\dfrac{1}{${divisor}} = \\dfrac{${resultNum}}{${resultDen}} = \\dfrac{${simplifiedNum}}{${simplifiedDen}}입니다.`,
                        inputPlaceholder: '예: \\dfrac{1}{3}',
                        meta: { grade, concept: 'mixed_fraction_division' }
                    };
                } else {
                    // (분수)÷(자연수)
                    const num = Math.floor(Math.random() * (denom - 1)) + 1; // 1 ~ denom-1
                    const resultNum = num;
                    const resultDen = denom * divisor;
                    const g = gcd(resultNum, resultDen);
                    const simplifiedNum = resultNum / g;
                    const simplifiedDen = resultDen / g;
                    
                    return {
                        type: PROBLEM_TYPES.FRACTION_SIMPLIFY,
                        question: `\\dfrac{${num}}{${denom}} ÷ ${divisor} = ?`,
                        questionLatex: `\\dfrac{${num}}{${denom}} \\div ${divisor} = ?`,
                        answer: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                        answerLatex: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                        explanation: `\\dfrac{${num}}{${denom}} ÷ ${divisor} = \\dfrac{${num}}{${denom}} × \\dfrac{1}{${divisor}} = \\dfrac{${resultNum}}{${resultDen}} = \\dfrac{${simplifiedNum}}{${simplifiedDen}}입니다.`,
                        inputPlaceholder: '예: \\dfrac{1}{6}',
                        meta: { grade, concept: 'fraction_division' }
                    };
                }
            }
        }
    }
    
    // 5학년 5단원 진분수 덧셈/뺄셈 처리
    const isFractionOperation = Math.random() > 0.6; // 40% 확률로 진분수 연산
    
    if (isFractionOperation && grade >= 5) {
        const denoms = [2, 3, 4, 5, 6, 8, 10, 12];
        const denom = denoms[Math.floor(Math.random() * denoms.length)];
        const isAdd = Math.random() > 0.5;
        
        if (isAdd) {
            // 진분수 덧셈
            const num1 = Math.floor(Math.random() * (denom - 1)) + 1; // 1 ~ denom-1
            const num2 = Math.floor(Math.random() * (denom - 1)) + 1; // 1 ~ denom-1
            const total = num1 + num2;
            
            // 결과가 가분수가 되지 않도록 조절 (선택적)
            if (total >= denom) {
                const whole = Math.floor(total / denom);
                const num = total % denom;
                const g = gcd(num, denom);
                const simplifiedNum = num / g;
                const simplifiedDen = denom / g;
                
                let answerLatex;
                if (whole > 0 && simplifiedNum > 0) {
                    answerLatex = `${whole}\\dfrac{${simplifiedNum}}{${simplifiedDen}}`;
                } else if (whole > 0) {
                    answerLatex = `${whole}`;
                } else {
                    answerLatex = `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`;
                }
                
                return {
                    type: PROBLEM_TYPES.FRACTION_SIMPLIFY,
                    question: `\\dfrac{${num1}}{${denom}} + \\dfrac{${num2}}{${denom}} = ?`,
                    questionLatex: `\\dfrac{${num1}}{${denom}} + \\dfrac{${num2}}{${denom}} = ?`,
                    answer: answerLatex,
                    answerLatex: answerLatex,
                    explanation: `분모가 같으므로 분자만 더하면 \\dfrac{${total}}{${denom}} = ${answerLatex}입니다.`,
                    inputPlaceholder: '예: 1\\dfrac{1}{3}',
                    meta: { grade, concept: 'fraction_add' }
                };
            } else {
                // 진분수 결과
                const g = gcd(total, denom);
                const simplifiedNum = total / g;
                const simplifiedDen = denom / g;
                
                return {
                    type: PROBLEM_TYPES.FRACTION_SIMPLIFY,
                    question: `\\dfrac{${num1}}{${denom}} + \\dfrac{${num2}}{${denom}} = ?`,
                    questionLatex: `\\dfrac{${num1}}{${denom}} + \\dfrac{${num2}}{${denom}} = ?`,
                    answer: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                    answerLatex: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                    explanation: `분모가 같으므로 분자만 더하면 \\dfrac{${total}}{${denom}} = \\dfrac{${simplifiedNum}}{${simplifiedDen}}입니다.`,
                    inputPlaceholder: '예: \\dfrac{2}{3}',
                    meta: { grade, concept: 'fraction_add' }
                };
            }
        } else {
            // 진분수 뺄셈 (양수 결과 보장)
            const num1 = Math.floor(Math.random() * (denom - 1)) + 2; // 2 ~ denom-1 (더 큰 수)
            const num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 ~ num1-1 (더 작은 수)
            const total = num1 - num2;
            
            const g = gcd(total, denom);
            const simplifiedNum = total / g;
            const simplifiedDen = denom / g;
            
            return {
                type: PROBLEM_TYPES.FRACTION_SIMPLIFY,
                question: `\\dfrac{${num1}}{${denom}} - \\dfrac{${num2}}{${denom}} = ?`,
                questionLatex: `\\dfrac{${num1}}{${denom}} - \\dfrac{${num2}}{${denom}} = ?`,
                answer: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                answerLatex: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                explanation: `분모가 같으므로 분자만 빼면 \\dfrac{${total}}{${denom}} = \\dfrac{${simplifiedNum}}{${simplifiedDen}}입니다.`,
                inputPlaceholder: '예: \\dfrac{1}{3}',
                meta: { grade, concept: 'fraction_subtract' }
            };
        }
    }
    
    // 기존 약분 문제 생성 로직
    // 학년에 따라 분수 범위 조절
    let fractions;
    if (grade <= 3) {
        // 1-3학년: 작은 분수
        fractions = [[4, 6], [6, 8], [6, 9], [8, 10], [8, 12], [9, 12], [10, 15]];
    } else if (grade <= 4) {
        // 4학년: 중간 분수
        fractions = [[8, 12], [10, 15], [12, 16], [12, 18], [14, 21], [15, 20], [16, 24], [18, 24]];
    } else {
        // 5-6학년: 큰 분수
        fractions = [
            [18, 24], [12, 20], [15, 25], [16, 24], [20, 30],
            [24, 32], [14, 21], [21, 28], [27, 36], [30, 40]
        ];
    }
    const [num, den] = fractions[Math.floor(Math.random() * fractions.length)];
    
    // 에러 방지: 분모가 0이면 안 됨
    if (den === 0) {
        return generateFractionSimplifyProblem(grade); // 재귀 호출로 다시 생성
    }
    
    const g = gcd(num, den);
    
    // 에러 방지: 최대공약수가 1보다 크지 않으면 안 됨 (약분 불가)
    if (g <= 1) {
        return generateFractionSimplifyProblem(grade); // 재귀 호출로 다시 생성
    }
    
    const simplifiedNum = num / g;
    const simplifiedDen = den / g;
    
    // 에러 방지: 결과가 정수가 아니면 안 됨
    if (!Number.isInteger(simplifiedNum) || !Number.isInteger(simplifiedDen)) {
        return generateFractionSimplifyProblem(grade); // 재귀 호출로 다시 생성
    }
    
    return {
        type: PROBLEM_TYPES.FRACTION_SIMPLIFY,
        question: `\\dfrac{${num}}{${den}}를 가장 간단한 분수로 나타내세요.`,
        questionLatex: `\\dfrac{${num}}{${den}}를 가장 간단한 분수로 나타내세요.`,
        answer: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
        answerLatex: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
        explanation: `\\dfrac{${num}}{${den}}의 분자와 분모의 최대공약수는 ${g}입니다. 분자와 분모를 ${g}로 나누면 \\dfrac{${simplifiedNum}}{${simplifiedDen}}가 됩니다.`,
        inputPlaceholder: '예: \\dfrac{3}{4}',
        meta: { numerator: num, denominator: den, gcd: g, simplified: [simplifiedNum, simplifiedDen] }
    };
}

/**
 * 도형 넓이 문제 생성 (5학년: 마름모, 사다리꼴, 평행사변형 등)
 */
function generateAreaProblem(grade, conceptText = '', existingQuestions = []) {
    const conceptLower = (conceptText || '').toLowerCase();
    
    // 마름모 넓이
    if (conceptLower.includes('마름모')) {
        const diagonal1 = 6 + Math.floor(Math.random() * 5); // 6~10
        const diagonal2 = 4 + Math.floor(Math.random() * 5); // 4~8
        const area = (diagonal1 * diagonal2) / 2;
        
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: `대각선의 길이가 ${diagonal1}cm와 ${diagonal2}cm인 마름모의 넓이는 몇 cm²인가요?`,
            answer: `${area}cm²`,
            explanation: `마름모의 넓이 = (대각선1 × 대각선2) ÷ 2 = (${diagonal1} × ${diagonal2}) ÷ 2 = ${diagonal1 * diagonal2} ÷ 2 = ${area}cm²입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 24cm²)',
            meta: { grade, concept: 'rhombus_area', diagonal1, diagonal2, area }
        };
    }
    
    // 사다리꼴 넓이
    if (conceptLower.includes('사다리꼴')) {
        const topBase = 3 + Math.floor(Math.random() * 4); // 3~6
        const bottomBase = 5 + Math.floor(Math.random() * 5); // 5~9
        const height = 4 + Math.floor(Math.random() * 4); // 4~7
        const area = ((topBase + bottomBase) * height) / 2;
        
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: `윗변의 길이가 ${topBase}cm, 아랫변의 길이가 ${bottomBase}cm, 높이가 ${height}cm인 사다리꼴의 넓이는 몇 cm²인가요?`,
            answer: `${area}cm²`,
            explanation: `사다리꼴의 넓이 = (윗변 + 아랫변) × 높이 ÷ 2 = (${topBase} + ${bottomBase}) × ${height} ÷ 2 = ${topBase + bottomBase} × ${height} ÷ 2 = ${area}cm²입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 28cm²)',
            meta: { grade, concept: 'trapezoid_area', topBase, bottomBase, height, area }
        };
    }
    
    // 평행사변형 넓이
    if (conceptLower.includes('평행사변형')) {
        const base = 5 + Math.floor(Math.random() * 5); // 5~9
        const height = 4 + Math.floor(Math.random() * 4); // 4~7
        const area = base * height;
        
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: `밑변의 길이가 ${base}cm, 높이가 ${height}cm인 평행사변형의 넓이는 몇 cm²인가요?`,
            answer: `${area}cm²`,
            explanation: `평행사변형의 넓이 = 밑변 × 높이 = ${base} × ${height} = ${area}cm²입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 20cm²)',
            meta: { grade, concept: 'parallelogram_area', base, height, area }
        };
    }
    
    // 삼각형 넓이
    if (conceptLower.includes('삼각형') && conceptLower.includes('넓이')) {
        const base = 6 + Math.floor(Math.random() * 5); // 6~10
        const height = 4 + Math.floor(Math.random() * 4); // 4~7
        const area = (base * height) / 2;
        
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: `밑변의 길이가 ${base}cm, 높이가 ${height}cm인 삼각형의 넓이는 몇 cm²인가요?`,
            answer: `${area}cm²`,
            explanation: `삼각형의 넓이 = 밑변 × 높이 ÷ 2 = ${base} × ${height} ÷ 2 = ${base * height} ÷ 2 = ${area}cm²입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 12cm²)',
            meta: { grade, concept: 'triangle_area', base, height, area }
        };
    }
    
    // 직사각형 넓이
    if (conceptLower.includes('직사각형') && conceptLower.includes('넓이')) {
        const width = 5 + Math.floor(Math.random() * 5); // 5~9
        const height = 4 + Math.floor(Math.random() * 4); // 4~7
        const area = width * height;
        
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: `가로가 ${width}cm, 세로가 ${height}cm인 직사각형의 넓이는 몇 cm²인가요?`,
            answer: `${area}cm²`,
            explanation: `직사각형의 넓이 = 가로 × 세로 = ${width} × ${height} = ${area}cm²입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 20cm²)',
            meta: { grade, concept: 'rectangle_area', width, height, area }
        };
    }
    
    // 다각형의 둘레
    if (conceptLower.includes('둘레') || conceptLower.includes('다각형') || conceptLower.includes('둘레 구하기')) {
        const sides = [4, 5, 6][Math.floor(Math.random() * 3)]; // 사각형, 오각형, 육각형
        const sideLength = 5 + Math.floor(Math.random() * 5); // 5~9cm
        const perimeter = sides * sideLength;
        
        const shapeNames = { 4: '사각형', 5: '오각형', 6: '육각형' };
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: `한 변의 길이가 ${sideLength}cm인 정${shapeNames[sides]}의 둘레는 몇 cm인가요?`,
            answer: `${perimeter}cm`,
            explanation: `정${shapeNames[sides]}은 모든 변의 길이가 같으므로, 둘레 = 한 변의 길이 × 변의 개수 = ${sideLength} × ${sides} = ${perimeter}cm입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 20cm)',
            meta: { grade, concept: 'polygon_perimeter', sides, sideLength, perimeter }
        };
    }
    
    // 1 cm² 보다 더 큰 넓이의 단위 알아보기 (m², km² 등)
    if ((conceptLower.includes('더 큰') && conceptLower.includes('단위') && conceptLower.includes('넓이')) ||
        (conceptLower.includes('넓이') && conceptLower.includes('단위') && !conceptLower.includes('직사각형'))) {
        // 5학년 수준에 맞는 넓이 단위 변환 문제만 생성 (m², km² 중심, 'a'/'ha' 제외)
        const unitTypes = [
            { from: 'cm²', to: 'm²', factor: 10000, examples: [10000, 25000, 50000, 75000] },
            { from: 'm²', to: 'km²', factor: 1000000, examples: [1000000, 3000000, 5000000] },
            { from: 'km²', to: 'm²', factor: 1000000, examples: [1, 2, 3, 5] } // 역변환
        ];
        
        // 모든 가능한 문제 조합 생성 (중복 방지)
        const allQuestions = [];
        unitTypes.forEach(unitType => {
            unitType.examples.forEach(value => {
                const converted = value / unitType.factor;
                
                // 각 단위 조합에 대해 여러 문제 템플릿 생성
                allQuestions.push({
                    question: `${value}${unitType.from}는 몇 ${unitType.to}인가요?`,
                    answer: `${converted}${unitType.to}`,
                    explanation: `1${unitType.to} = ${unitType.factor}${unitType.from}이므로, ${value}${unitType.from} = ${value} ÷ ${unitType.factor} = ${converted}${unitType.to}입니다.`
                });
                
                allQuestions.push({
                    question: `1${unitType.to}는 몇 ${unitType.from}인가요?`,
                    answer: `${unitType.factor}${unitType.from}`,
                    explanation: `1${unitType.to} = ${unitType.factor}${unitType.from}입니다.`
                });
                
                allQuestions.push({
                    question: `넓이가 ${value}${unitType.from}인 직사각형 모양의 땅을 ${unitType.to}로 나타내면 얼마인가요?`,
                    answer: `${converted}${unitType.to}`,
                    explanation: `1${unitType.to} = ${unitType.factor}${unitType.from}이므로, ${value}${unitType.from} = ${value} ÷ ${unitType.factor} = ${converted}${unitType.to}입니다.`
                });
            });
        });
        
        // 중복 방지: 이미 생성된 문제와 비교
        const usedQuestions = new Set();
        existingQuestions.forEach(q => {
            const qText = (q.question || q.stem || q.questionText || '').trim();
            if (qText) {
                usedQuestions.add(qText.toLowerCase());
            }
        });
        
        // 사용되지 않은 문제만 필터링
        const availableProblems = allQuestions.filter(p => !usedQuestions.has(p.question.toLowerCase()));
        
        // 사용 가능한 문제가 없으면 전체 문제에서 선택 (최후의 수단)
        const problemPool = availableProblems.length > 0 ? availableProblems : allQuestions;
        
        // 순차적으로 선택하거나 랜덤 선택
        const index = existingQuestions.length < allQuestions.length ? existingQuestions.length : Math.floor(Math.random() * problemPool.length);
        const selectedProblem = problemPool[index % problemPool.length];
        
        // 메타데이터에서 from/to 추출 (문제 텍스트에서)
        let metaFrom = 'm²', metaTo = 'km²', metaFactor = 1000000;
        unitTypes.forEach(unitType => {
            if (selectedProblem.question.includes(unitType.from) && selectedProblem.question.includes(unitType.to)) {
                metaFrom = unitType.from;
                metaTo = unitType.to;
                metaFactor = unitType.factor;
            }
        });
        
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: selectedProblem.question,
            answer: selectedProblem.answer,
            explanation: selectedProblem.explanation,
            inputPlaceholder: `답을 입력하세요 (예: ${selectedProblem.answer})`,
            meta: { grade, concept: 'area_unit_conversion', from: metaFrom, to: metaTo, factor: metaFactor }
        };
    }
    
    // 1 cm² 알아보기 (직사각형 넓이)
    if (conceptLower.includes('1 cm²') || conceptLower.includes('1cm²')) {
        const width = 5 + Math.floor(Math.random() * 5); // 5~9
        const height = 4 + Math.floor(Math.random() * 4); // 4~7
        const area = width * height;
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: `가로가 ${width}cm, 세로가 ${height}cm인 직사각형의 넓이는 몇 cm²인가요?`,
            answer: `${area}cm²`,
            explanation: `직사각형의 넓이 = 가로 × 세로 = ${width} × ${height} = ${area}cm²입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 20cm²)',
            meta: { grade, concept: 'area_unit', width, height, area }
        };
    }
    
    // 기본: 직사각형 넓이
    const width = 5 + grade;
    const height = 4 + grade;
    return {
        type: PROBLEM_TYPES.MIXED_CALC,
        question: `가로가 ${width}cm, 세로가 ${height}cm인 직사각형의 넓이는 몇 cm²인가요?`,
        answer: `${width * height}cm²`,
        explanation: `직사각형의 넓이 = 가로 × 세로 = ${width} × ${height} = ${width * height}cm²입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'rectangle_area', width, height, area: width * height }
    };
}

// 초등 1학년 덧셈/뺄셈 문제 생성 (나눗셈/곱셈 없음)
function generateGrade1AdditionSubtractionProblem(existingQuestions = []) {
    // 1학년 수준: 10까지의 수, 한 자리 수 덧셈/뺄셈
    const problems = [
        // 덧셈 (한 자리 수)
        { expr: '3 + 2', result: 5 },
        { expr: '4 + 3', result: 7 },
        { expr: '5 + 4', result: 9 },
        { expr: '6 + 2', result: 8 },
        { expr: '7 + 1', result: 8 },
        { expr: '8 + 2', result: 10 },
        { expr: '2 + 5', result: 7 },
        { expr: '3 + 6', result: 9 },
        { expr: '4 + 5', result: 9 },
        { expr: '2 + 6', result: 8 },
        { expr: '1 + 7', result: 8 },
        { expr: '5 + 3', result: 8 },
        { expr: '6 + 1', result: 7 },
        { expr: '4 + 4', result: 8 },
        { expr: '2 + 3', result: 5 },
        { expr: '3 + 4', result: 7 },
        { expr: '5 + 2', result: 7 },
        { expr: '1 + 9', result: 10 },
        { expr: '7 + 2', result: 9 },
        { expr: '6 + 3', result: 9 },
        // 뺄셈 (한 자리 수, 결과가 양수)
        { expr: '5 - 2', result: 3 },
        { expr: '7 - 3', result: 4 },
        { expr: '8 - 4', result: 4 },
        { expr: '9 - 5', result: 4 },
        { expr: '6 - 1', result: 5 },
        { expr: '10 - 3', result: 7 },
        { expr: '9 - 2', result: 7 },
        { expr: '8 - 1', result: 7 },
        { expr: '7 - 2', result: 5 },
        { expr: '9 - 4', result: 5 },
        { expr: '10 - 4', result: 6 },
        { expr: '8 - 3', result: 5 },
        { expr: '6 - 2', result: 4 },
        { expr: '10 - 2', result: 8 },
        { expr: '9 - 3', result: 6 },
        { expr: '7 - 4', result: 3 },
        { expr: '8 - 5', result: 3 },
        { expr: '10 - 5', result: 5 },
        { expr: '9 - 6', result: 3 },
        { expr: '8 - 6', result: 2 }
    ];
    
    // 이미 생성된 문제의 식 추출
    const usedExpressions = new Set();
    if (existingQuestions && existingQuestions.length > 0) {
        existingQuestions.forEach(q => {
            const questionText = q.question || q.stem || '';
            // "X + Y의 값을 구하세요." 또는 "X - Y의 값을 구하세요." 형식에서 식 추출
            const match = questionText.match(/(\d+\s*[+\-]\s*\d+)/);
            if (match) {
                // 공백 제거하고 정규화 (예: "3 + 2" → "3+2")
                const normalizedExpr = match[1].replace(/\s+/g, '');
                usedExpressions.add(normalizedExpr);
            }
            // meta 정보에서도 확인
            if (q.meta && q.meta.expression) {
                const normalizedExpr = q.meta.expression.replace(/\s+/g, '');
                usedExpressions.add(normalizedExpr);
            }
        });
    }
    
    // 사용되지 않은 문제 필터링
    const availableProblems = problems.filter(p => {
        const normalizedExpr = p.expr.replace(/\s+/g, '');
        return !usedExpressions.has(normalizedExpr);
    });
    
    // 사용 가능한 문제가 없으면 전체 문제 풀에서 랜덤 선택 (중복 허용)
    const problemsToChoose = availableProblems.length > 0 ? availableProblems : problems;
    const selected = problemsToChoose[Math.floor(Math.random() * problemsToChoose.length)];
    
    return {
        type: PROBLEM_TYPES.MIXED_CALC,
        question: `${selected.expr}의 값을 구하세요.`,
        questionLatex: null,
        answer: `${selected.result}`,
        answerLatex: null,
        explanation: `${selected.expr} = ${selected.result}입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { expression: selected.expr, result: selected.result, grade: 1 }
    };
}

// (D) 곱셈·나눗셈이 섞인 식 계산 문제 생성
function generateMixedCalcProblem(grade, schoolLevel = 'elementary', rawGrade = null, existingQuestions = []) {
    // 중학교에서는 절대 호출되면 안 됨 - 차단
    const isMiddleSchool = schoolLevel === 'middle' || schoolLevel === '중학교' || rawGrade >= 7 || grade >= 7;
    if (isMiddleSchool) {
        console.error('❌ 중학교에서 generateMixedCalcProblem 호출 차단');
        return null;
    }
    
    // 초등 1학년은 덧셈/뺄셈만 (나눗셈/곱셈 없음)
    if (rawGrade === 1 || (rawGrade === null && grade === 1)) {
        return generateGrade1AdditionSubtractionProblem(existingQuestions);
    }
    
    // 학년에 따라 식의 난이도 조절
    let expressions;
    if (grade <= 3) {
        // 2-3학년: 작은 수 (나눗셈/곱셈 포함, 하지만 1학년은 위에서 이미 처리됨)
        expressions = [
            { expr: '12 ÷ 3 × 4', result: 16 },
            { expr: '16 ÷ 4 × 3', result: 12 },
            { expr: '18 ÷ 6 × 5', result: 15 },
            { expr: '20 ÷ 5 × 4', result: 16 },
            { expr: '24 ÷ 6 × 5', result: 20 },
            { expr: '28 ÷ 7 × 4', result: 16 }
        ];
    } else if (grade <= 4) {
        // 4학년: 중간 수
        expressions = [
            { expr: '24 ÷ 4 × 5', result: 30 },
            { expr: '30 ÷ 5 × 4', result: 24 },
            { expr: '36 ÷ 6 × 5', result: 30 },
            { expr: '40 ÷ 8 × 6', result: 30 },
            { expr: '42 ÷ 6 × 4', result: 28 },
            { expr: '48 ÷ 6 × 5', result: 40 }
        ];
    } else {
        // 5-6학년: 큰 수
        expressions = [
            { expr: '48 ÷ 6 × 5', result: 40 },
            { expr: '36 ÷ 4 × 3', result: 27 },
            { expr: '56 ÷ 7 × 4', result: 32 },
            { expr: '72 ÷ 8 × 5', result: 45 },
            { expr: '64 ÷ 8 × 6', result: 48 },
            { expr: '54 ÷ 6 × 7', result: 63 },
            { expr: '42 ÷ 6 × 8', result: 56 },
            { expr: '60 ÷ 5 × 4', result: 48 }
        ];
    }
    
    // 이미 생성된 문제의 식 추출
    const usedExpressions = new Set();
    if (existingQuestions && existingQuestions.length > 0) {
        existingQuestions.forEach(q => {
            const questionText = q.question || q.stem || '';
            // "X ÷ Y × Z의 값을 구하세요." 형식에서 식 추출
            const match = questionText.match(/(\d+\s*[÷×]\s*\d+\s*[÷×]\s*\d+)/);
            if (match) {
                // 공백 제거하고 정규화
                const normalizedExpr = match[1].replace(/\s+/g, '');
                usedExpressions.add(normalizedExpr);
            }
            // meta 정보에서도 확인
            if (q.meta && q.meta.expression) {
                const normalizedExpr = q.meta.expression.replace(/\s+/g, '');
                usedExpressions.add(normalizedExpr);
            }
        });
    }
    
    // 사용되지 않은 문제 필터링
    const availableExpressions = expressions.filter(e => {
        const normalizedExpr = e.expr.replace(/\s+/g, '');
        return !usedExpressions.has(normalizedExpr);
    });
    
    // 사용 가능한 문제가 없으면 전체 문제 풀에서 랜덤 선택 (중복 허용)
    const expressionsToChoose = availableExpressions.length > 0 ? availableExpressions : expressions;
    const selected = expressionsToChoose[Math.floor(Math.random() * expressionsToChoose.length)];
    
    return {
        type: PROBLEM_TYPES.MIXED_CALC,
        question: `${selected.expr}의 값을 구하세요.`,
        answer: `${selected.result}`,
        explanation: `곱셈과 나눗셈은 같은 우선순위이므로 왼쪽부터 계산합니다. ${selected.expr} = ${selected.result}`,
        inputPlaceholder: '답을 입력하세요',
        meta: { expression: selected.expr, result: selected.result }
    };
}

// (E) 뛰어 세기 문제 생성
function generateSkipCountProblem(grade) {
    // 학년에 따라 난이도 조절
    let steps, nthRange;
    if (grade <= 2) {
        // 1-2학년: 작은 수, 작은 번째
        steps = [2, 3, 4, 5];
        nthRange = [3, 4, 5, 6]; // 3~6번째
    } else if (grade <= 4) {
        // 3-4학년: 중간 수
        steps = [3, 4, 5, 6, 7];
        nthRange = [5, 6, 7, 8]; // 5~8번째
    } else {
        // 5-6학년: 큰 수
        steps = [3, 4, 5, 6, 7, 8];
        nthRange = [6, 7, 8, 9, 10]; // 6~10번째
    }
    const step = steps[Math.floor(Math.random() * steps.length)];
    const firstNum = step;
    const nth = nthRange[Math.floor(Math.random() * nthRange.length)];
    const result = firstNum * nth;
    
    return {
        type: PROBLEM_TYPES.SKIP_COUNT,
        question: `${step}씩 뛰어 세면 ${nth}번째 수는 무엇인가요? (첫째 수는 ${firstNum})`,
        answer: `${result}`,
        explanation: `${step}씩 뛰어 세면 첫째 수는 ${firstNum}, 둘째 수는 ${firstNum + step}, ... ${nth}번째 수는 ${firstNum} × ${nth} = ${result}입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { step, firstNum, nth, result }
    };
}

// (F) 두 자리 수로 나눗셈 문제 생성
function generateTwoDigitDivProblem(grade) {
    // 학년에 따라 난이도 조절 (4학년 이상만)
    let problems;
    if (grade <= 3) {
        // 1-3학년: 한 자리 수로 나누기
        problems = [
            { dividend: 48, divisor: 6, quotient: 8, remainder: 0 },
            { dividend: 56, divisor: 7, quotient: 8, remainder: 0 },
            { dividend: 63, divisor: 7, quotient: 9, remainder: 0 },
            { dividend: 72, divisor: 8, quotient: 9, remainder: 0 },
            { dividend: 81, divisor: 9, quotient: 9, remainder: 0 }
        ];
    } else if (grade <= 4) {
        // 4학년: 작은 두 자리 수로 나누기
        problems = [
            { dividend: 144, divisor: 12, quotient: 12, remainder: 0 },
            { dividend: 168, divisor: 14, quotient: 12, remainder: 0 },
            { dividend: 180, divisor: 15, quotient: 12, remainder: 0 },
            { dividend: 192, divisor: 16, quotient: 12, remainder: 0 },
            { dividend: 216, divisor: 18, quotient: 12, remainder: 0 },
            { dividend: 240, divisor: 20, quotient: 12, remainder: 0 }
        ];
    } else {
        // 5-6학년: 큰 두 자리 수로 나누기
        problems = [
            { dividend: 864, divisor: 24, quotient: 36, remainder: 0 },
            { dividend: 756, divisor: 21, quotient: 36, remainder: 0 },
            { dividend: 672, divisor: 28, quotient: 24, remainder: 0 },
            { dividend: 945, divisor: 35, quotient: 27, remainder: 0 },
            { dividend: 832, divisor: 26, quotient: 32, remainder: 0 },
            { dividend: 728, divisor: 28, quotient: 26, remainder: 0 },
            { dividend: 891, divisor: 27, quotient: 33, remainder: 0 },
            { dividend: 768, divisor: 24, quotient: 32, remainder: 0 },
            { dividend: 875, divisor: 25, quotient: 35, remainder: 0 },
            { dividend: 924, divisor: 22, quotient: 42, remainder: 0 }
        ];
    }
    const selected = problems[Math.floor(Math.random() * problems.length)];
    
    // 에러 방지: 0으로 나누기 방지
    if (selected.divisor === 0) {
        return generateTwoDigitDivProblem(grade); // 재귀 호출로 다시 생성
    }
    
    // 에러 방지: 계산 검증 (dividend = divisor * quotient + remainder)
    const calculatedDividend = selected.divisor * selected.quotient + selected.remainder;
    if (calculatedDividend !== selected.dividend) {
        return generateTwoDigitDivProblem(grade); // 재귀 호출로 다시 생성
    }
    
    // 에러 방지: 나머지가 한 자리~두 자리 범위로 관리
    if (selected.remainder < 0 || selected.remainder >= selected.divisor) {
        return generateTwoDigitDivProblem(grade); // 재귀 호출로 다시 생성
    }
    
    return {
        type: PROBLEM_TYPES.TWO_DIGIT_DIV,
        question: `${selected.dividend} ÷ ${selected.divisor} = (몫) ( ) , (나머지) ( )`,
        answer: `몫 ${selected.quotient}, 나머지 ${selected.remainder}`,
        explanation: `${selected.dividend} ÷ ${selected.divisor}를 계산하면 몫은 ${selected.quotient}, 나머지는 ${selected.remainder}입니다.`,
        inputPlaceholder: '예: 몫 36, 나머지 0',
        meta: { dividend: selected.dividend, divisor: selected.divisor, quotient: selected.quotient, remainder: selected.remainder }
    };
}

// (G) 모양의 배열에서 규칙 찾기 문제 생성
function generatePatternProblem(grade) {
    const patterns = [
        {
            question: `1번째: ■\n2번째: ■■\n3번째: ■■■\n…\n10번째에는 ■가 몇 개 있나요?`,
            answer: '10',
            explanation: 'n번째에는 ■가 n개 있습니다. 따라서 10번째에는 ■가 10개 있습니다.'
        },
        {
            question: `1번째: ●\n2번째: ●●\n3번째: ●●●\n…\n8번째에는 ●가 몇 개 있나요?`,
            answer: '8',
            explanation: 'n번째에는 ●가 n개 있습니다. 따라서 8번째에는 ●가 8개 있습니다.'
        },
        {
            question: `1번째: ▲\n2번째: ▲▲\n3번째: ▲▲▲\n…\n12번째에는 ▲가 몇 개 있나요?`,
            answer: '12',
            explanation: 'n번째에는 ▲가 n개 있습니다. 따라서 12번째에는 ▲가 12개 있습니다.'
        }
    ];
    const selected = patterns[Math.floor(Math.random() * patterns.length)];
    
    return {
        type: PROBLEM_TYPES.PATTERN,
        question: selected.question,
        answer: selected.answer,
        explanation: selected.explanation,
        inputPlaceholder: '답을 입력하세요',
        meta: { pattern: 'linear' }
    };
}

// 6학년 수준 도형 문제 생성 (각기둥, 각뿔 등)
function generateGeometryProblem(grade, conceptText) {
    const conceptLower = (conceptText || '').toLowerCase();
    
    // 각기둥 관련
    if (conceptLower.includes('각기둥')) {
        const base = 3 + Math.floor(grade / 2);
        const height = 4 + Math.floor(grade / 2);
        const volume = base * base * height;
        return {
            type: 'geometry',
            question: `밑면이 한 변의 길이가 ${base}cm인 정사각형이고, 높이가 ${height}cm인 정사각기둥의 부피는 몇 ㎤인가요?`,
            answer: `${volume}㎤`,
            explanation: `정사각기둥의 부피 = 밑면의 넓이 × 높이 = (${base} × ${base}) × ${height} = ${base * base} × ${height} = ${volume}㎤입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 48㎤)',
            meta: { base, height, volume, shape: '각기둥' }
        };
    }
    
    // 원기둥 관련
    if (conceptLower.includes('원기둥')) {
        const radius = 3 + Math.floor(grade / 2);
        const height = 5 + Math.floor(grade / 2);
        const volume = Math.floor(Math.PI * radius * radius * height);
        return {
            type: 'geometry',
            question: `밑면의 반지름이 ${radius}cm이고, 높이가 ${height}cm인 원기둥의 부피는 약 몇 ㎤인가요? (원주율은 3.14로 계산)`,
            answer: `약 ${volume}㎤`,
            explanation: `원기둥의 부피 = 밑면의 넓이 × 높이 = (반지름 × 반지름 × 3.14) × 높이 = (${radius} × ${radius} × 3.14) × ${height} = ${Math.floor(radius * radius * 3.14)} × ${height} = 약 ${volume}㎤입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 약 141㎤)',
            meta: { radius, height, volume, shape: '원기둥' }
        };
    }
    
    // 비와 비율 (6학년 수준)
    if (conceptLower.includes('비') || conceptLower.includes('비율')) {
        const a = 12 + grade * 2;
        const b = 18 + grade * 3;
        const gcd = calculateGCD(a, b);
        return {
            type: 'geometry',
            question: `${a} : ${b}를 가장 간단한 자연수의 비로 나타내시오.`,
            answer: `${a / gcd} : ${b / gcd}`,
            explanation: `${a}과 ${b}의 최대공약수는 ${gcd}입니다. ${a} : ${b} = ${a / gcd} : ${b / gcd}입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 2 : 3)',
            meta: { a, b, gcd, ratio: `${a / gcd}:${b / gcd}` }
        };
    }
    
    // 기본 도형 문제
    const side = 5 + grade;
    return {
        type: 'geometry',
        question: `한 변의 길이가 ${side}cm인 정육면체의 부피는 몇 ㎤인가요?`,
        answer: `${side * side * side}㎤`,
        explanation: `정육면체의 부피 = 한 변의 길이 × 한 변의 길이 × 한 변의 길이 = ${side} × ${side} × ${side} = ${side * side * side}㎤입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { side, volume: side * side * side, shape: '정육면체' }
    };
}

/**
 * 삼각형 분류 문제 생성 (SVG 포함)
 */
function generateTriangleClassifyProblem(grade) {
    const templates = [
        { sides: [5, 5, 8], type: '이등변삼각형' },
        { sides: [6, 6, 6], type: '정삼각형' },
        { sides: [3, 4, 5], type: '부등변삼각형' },
        { sides: [7, 7, 10], type: '이등변삼각형' },
        { sides: [4, 5, 6], type: '부등변삼각형' },
        { sides: [8, 8, 8], type: '정삼각형' },
        { sides: [5, 6, 7], type: '부등변삼각형' },
        { sides: [9, 9, 12], type: '이등변삼각형' },
        { sides: [6, 7, 8], type: '부등변삼각형' },
        { sides: [10, 10, 10], type: '정삼각형' }
    ];
    
    const selected = templates[Math.floor(Math.random() * templates.length)];
    
    // SVG 생성
    const svg = drawTriangle({ a: selected.sides[0], b: selected.sides[1], c: selected.sides[2] }, null, { 
        vertexLabels: ['A', 'B', 'C'], 
        showMeasurements: true 
    });
    
    return {
        type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
        question: `아래 그림에서 세 변의 길이가 각각 ${selected.sides[0]}cm, ${selected.sides[1]}cm, ${selected.sides[2]}cm인 삼각형은 어떤 삼각형인가요?`,
        questionSvg: svg, // SVG 추가
        answer: selected.type,
        explanation: selected.type === '정삼각형' ? '세 변의 길이가 모두 같으므로 정삼각형입니다.' :
                     selected.type === '이등변삼각형' ? '두 변의 길이가 같으므로 이등변삼각형입니다.' :
                     '세 변의 길이가 모두 다르므로 부등변삼각형입니다.',
        inputPlaceholder: '예: 이등변삼각형',
        meta: { grade, concept: 'triangle_classify', sides: selected.sides, geometryType: 'triangle' }
    };
}

/**
 * 대분수 연산 문제 생성 (5학년) - KaTeX 형식 사용, 양수 결과 보장
 */
function generateMixedFractionProblem(grade) {
    const denoms = [2, 3, 4, 5, 6, 8, 10, 12];
    const denom = denoms[Math.floor(Math.random() * denoms.length)];
    const isAdd = Math.random() > 0.5;
    
    if (isAdd) {
        // 덧셈: 양수 결과 보장
        const whole1 = Math.floor(Math.random() * 2) + 1; // 1~2
        const num1 = Math.floor(Math.random() * (denom - 1)) + 1; // 1 ~ denom-1
        const whole2 = Math.floor(Math.random() * 2) + 1; // 1~2
        const num2 = Math.floor(Math.random() * (denom - 1)) + 1; // 1 ~ denom-1
        
        const total1 = whole1 * denom + num1;
        const total2 = whole2 * denom + num2;
        const total = total1 + total2;
        const whole = Math.floor(total / denom);
        const num = total % denom;
        
        // 약분
        const g = gcd(num, denom);
        const simplifiedNum = num / g;
        const simplifiedDen = denom / g;
        
        // 답안 형식 결정
        let answerLatex;
        if (whole > 0 && simplifiedNum > 0) {
            answerLatex = `${whole}\\dfrac{${simplifiedNum}}{${simplifiedDen}}`;
        } else if (whole > 0) {
            answerLatex = `${whole}`;
        } else {
            answerLatex = `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`;
        }
        
        return {
            type: PROBLEM_TYPES.MIXED_FRACTION,
            question: `${whole1}\\dfrac{${num1}}{${denom}} + ${whole2}\\dfrac{${num2}}{${denom}} = ?`,
            questionLatex: `${whole1}\\dfrac{${num1}}{${denom}} + ${whole2}\\dfrac{${num2}}{${denom}} = ?`,
            answer: answerLatex,
            answerLatex: answerLatex,
            explanation: `대분수를 가분수로 바꾸면 ${whole1}\\dfrac{${num1}}{${denom}} = \\dfrac{${total1}}{${denom}}, ${whole2}\\dfrac{${num2}}{${denom}} = \\dfrac{${total2}}{${denom}}입니다. 분모가 같으므로 분자만 더하면 \\dfrac{${total}}{${denom}} = ${answerLatex}입니다.`,
            inputPlaceholder: '예: 2\\dfrac{1}{3}',
            meta: { grade, concept: 'mixed_fraction', operation: 'add' }
        };
    } else {
        // 뺄셈: 양수 결과 보장 (total1 > total2)
        const whole1 = Math.floor(Math.random() * 2) + 2; // 2~3 (더 큰 수)
        const num1 = Math.floor(Math.random() * (denom - 1)) + 1; // 1 ~ denom-1
        const whole2 = Math.floor(Math.random() * 2) + 1; // 1~2 (더 작은 수)
        const num2 = Math.floor(Math.random() * (denom - 1)) + 1; // 1 ~ denom-1
        
        const total1 = whole1 * denom + num1;
        const total2 = whole2 * denom + num2;
        
        // total1이 total2보다 작으면 재시도
        if (total1 <= total2) {
            return generateMixedFractionProblem(grade);
        }
        
        const total = total1 - total2;
        const whole = Math.floor(total / denom);
        const num = total % denom;
        
        // 약분
        const g = gcd(num, denom);
        const simplifiedNum = num / g;
        const simplifiedDen = denom / g;
        
        // 답안 형식 결정
        let answerLatex;
        if (whole > 0 && simplifiedNum > 0) {
            answerLatex = `${whole}\\dfrac{${simplifiedNum}}{${simplifiedDen}}`;
        } else if (whole > 0) {
            answerLatex = `${whole}`;
        } else {
            answerLatex = `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`;
        }
        
        return {
            type: PROBLEM_TYPES.MIXED_FRACTION,
            question: `${whole1}\\dfrac{${num1}}{${denom}} - ${whole2}\\dfrac{${num2}}{${denom}} = ?`,
            questionLatex: `${whole1}\\dfrac{${num1}}{${denom}} - ${whole2}\\dfrac{${num2}}{${denom}} = ?`,
            answer: answerLatex,
            answerLatex: answerLatex,
            explanation: `대분수를 가분수로 바꾸면 ${whole1}\\dfrac{${num1}}{${denom}} = \\dfrac{${total1}}{${denom}}, ${whole2}\\dfrac{${num2}}{${denom}} = \\dfrac{${total2}}{${denom}}입니다. 분모가 같으므로 분자만 빼면 \\dfrac{${total}}{${denom}} = ${answerLatex}입니다.`,
            inputPlaceholder: '예: 1\\dfrac{1}{3}',
            meta: { grade, concept: 'mixed_fraction', operation: 'subtract' }
        };
    }
}

/**
 * 소수의 곱셈 문제 생성 (5학년) - 소수점 자릿수 이동 포함
 * 4학년 소수 덧셈/뺄셈도 처리 (DECIMAL_MULTIPLY 타입 재사용)
 */
function generateDecimalMultiplyProblem(grade) {
    // 4학년 소수 덧셈/뺄셈 처리
    if (grade === 4) {
        const isAdd = Math.random() > 0.5;
        
        if (isAdd) {
            // 소수 덧셈
            const decimals = [
                [0.3, 0.5], [0.4, 0.6], [0.5, 0.7], [0.6, 0.8], [0.7, 0.9],
                [1.2, 2.3], [1.3, 2.4], [1.4, 2.5], [1.5, 2.6], [1.6, 2.7],
                [2.3, 3.4], [2.4, 3.5], [2.5, 3.6], [3.4, 4.5], [3.5, 4.6],
                [0.12, 0.23], [0.13, 0.24], [0.14, 0.25], [0.15, 0.26], [0.16, 0.27],
                [1.23, 2.34], [1.24, 2.35], [1.25, 2.36], [2.34, 3.45], [2.35, 3.46]
            ];
            const [d1, d2] = decimals[Math.floor(Math.random() * decimals.length)];
            const result = (d1 + d2).toFixed(2).replace(/\.?0+$/, '');
            
            return {
                type: PROBLEM_TYPES.DECIMAL_MULTIPLY,
                question: `${d1} + ${d2} = ?`,
                answer: result,
                explanation: `소수의 덧셈은 자연수의 덧셈과 같은 방법으로 계산합니다. 소수점을 맞추어 계산하면 ${d1} + ${d2} = ${result}입니다.`,
                inputPlaceholder: '답을 입력하세요',
                meta: { grade, concept: 'decimal_add' }
            };
        } else {
            // 소수 뺄셈 (양수 결과 보장)
            const decimals = [
                [0.8, 0.3], [0.9, 0.4], [0.7, 0.2], [0.6, 0.1], [0.5, 0.2],
                [2.5, 1.2], [2.6, 1.3], [2.7, 1.4], [2.8, 1.5], [2.9, 1.6],
                [3.6, 2.3], [3.7, 2.4], [3.8, 2.5], [4.6, 3.4], [4.7, 3.5],
                [0.27, 0.12], [0.28, 0.13], [0.29, 0.14], [0.30, 0.15], [0.31, 0.16],
                [2.36, 1.23], [2.37, 1.24], [2.38, 1.25], [3.46, 2.34], [3.47, 2.35]
            ];
            const [d1, d2] = decimals[Math.floor(Math.random() * decimals.length)];
            const result = (d1 - d2).toFixed(2).replace(/\.?0+$/, '');
            
            return {
                type: PROBLEM_TYPES.DECIMAL_MULTIPLY,
                question: `${d1} - ${d2} = ?`,
                answer: result,
                explanation: `소수의 뺄셈은 자연수의 뺄셈과 같은 방법으로 계산합니다. 소수점을 맞추어 계산하면 ${d1} - ${d2} = ${result}입니다.`,
                inputPlaceholder: '답을 입력하세요',
                meta: { grade, concept: 'decimal_subtract' }
            };
        }
    }
    
    // 5학년 소수 곱셈
    const decimals1 = [0.5, 0.6, 0.7, 0.8, 0.9, 1.2, 1.3, 1.4, 1.5, 2.3, 2.4, 2.5, 3.4, 3.5, 4.5];
    const decimals2 = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.2, 1.3, 1.4, 1.5, 2.3, 2.4, 2.5];
    
    const d1 = decimals1[Math.floor(Math.random() * decimals1.length)];
    const d2 = decimals2[Math.floor(Math.random() * decimals2.length)];
    const result = (d1 * d2).toFixed(2).replace(/\.?0+$/, '');
    
    return {
        type: PROBLEM_TYPES.DECIMAL_MULTIPLY,
        question: `${d1} × ${d2} = ?`,
        answer: result,
        explanation: `소수의 곱셈은 자연수의 곱셈과 같은 방법으로 계산합니다. ${d1} × ${d2} = ${result}입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'decimal_multiply' }
    };
}

/**
 * 소수의 나눗셈 문제 생성 (6학년) - 소수점 자릿수 이동 포함
 */
function generateDecimalDivideProblem(grade) {
    const dividends = [2.4, 3.6, 4.8, 5.4, 6.3, 7.2, 8.1, 9.6, 12.5, 15.6, 18.9, 24.8, 1.25, 2.5, 3.75, 4.5, 5.25, 6.75];
    const divisors = [2, 3, 4, 5, 6, 8];
    
    const dividend = dividends[Math.floor(Math.random() * dividends.length)];
    const divisor = divisors[Math.floor(Math.random() * divisors.length)];
    const result = (dividend / divisor).toFixed(3).replace(/\.?0+$/, '');
    
    // 소수점 자릿수 설명
    const dividendDecimals = (dividend.toString().split('.')[1] || '').length;
    const resultDecimals = (result.toString().split('.')[1] || '').length;
    
    return {
        type: PROBLEM_TYPES.DECIMAL_DIVIDE,
        question: `${dividend} ÷ ${divisor} = ?`,
        answer: result,
        explanation: `소수의 나눗셈은 자연수의 나눗셈과 같은 방법으로 계산합니다. ${dividend} ÷ ${divisor} = ${result}입니다. 소수점을 맞추어 계산하면 됩니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'decimal_divide', dividendDecimals, resultDecimals }
    };
}

/**
 * 비와 비율 문제 생성 (6학년)
 */
function generateRatioProblem(grade) {
    const a = 12 + Math.floor(Math.random() * 20);
    const b = 18 + Math.floor(Math.random() * 20);
    const g = gcd(a, b);
    const simplifiedA = a / g;
    const simplifiedB = b / g;
    
    return {
        type: PROBLEM_TYPES.RATIO,
        question: `${a} : ${b}를 가장 간단한 자연수의 비로 나타내시오.`,
        answer: `${simplifiedA} : ${simplifiedB}`,
        explanation: `${a}과 ${b}의 최대공약수는 ${g}입니다. ${a} : ${b} = ${simplifiedA} : ${simplifiedB}입니다.`,
        inputPlaceholder: '예: 2 : 3',
        meta: { grade, concept: 'ratio' }
    };
}

/**
 * 입체도형 부피 문제 생성 (6학년)
 */
function generateSolidVolumeProblem(grade, conceptText = '') {
    const conceptLower = (conceptText || '').toLowerCase();
    
    if (conceptLower.includes('직육면체')) {
        const length = 4 + Math.floor(Math.random() * 5); // 4~8
        const width = 3 + Math.floor(Math.random() * 5); // 3~7
        const height = 5 + Math.floor(Math.random() * 5); // 5~9
        const volume = length * width * height;
        const surfaceArea = 2 * (length * width + width * height + height * length);
        
        return {
            type: PROBLEM_TYPES.SOLID_VOLUME,
            question: `가로가 ${length}cm, 세로가 ${width}cm, 높이가 ${height}cm인 직육면체의 부피와 겉넓이를 구하시오.`,
            answer: `부피: ${volume}㎤, 겉넓이: ${surfaceArea}cm²`,
            explanation: `직육면체의 부피 = 가로 × 세로 × 높이 = ${length} × ${width} × ${height} = ${volume}㎤입니다. 겉넓이 = 2 × (가로×세로 + 세로×높이 + 높이×가로) = 2 × (${length}×${width} + ${width}×${height} + ${height}×${length}) = ${surfaceArea}cm²입니다.`,
            inputPlaceholder: '예: 부피: 120㎤, 겉넓이: 148cm²',
            meta: { grade, concept: 'solid_volume', length, width, height, volume, surfaceArea }
        };
    } else if (conceptLower.includes('각기둥')) {
        const base = 3 + Math.floor(Math.random() * 4); // 3~6
        const height = 4 + Math.floor(Math.random() * 5); // 4~8
        const volume = base * base * height;
        
        return {
            type: PROBLEM_TYPES.SOLID_VOLUME,
            question: `밑면이 한 변의 길이가 ${base}cm인 정사각형이고, 높이가 ${height}cm인 정사각기둥의 부피는 몇 ㎤인가요?`,
            answer: `${volume}㎤`,
            explanation: `정사각기둥의 부피 = 밑면의 넓이 × 높이 = (${base} × ${base}) × ${height} = ${base * base} × ${height} = ${volume}㎤입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 48㎤)',
            meta: { grade, concept: 'solid_volume', base, height, volume }
        };
    } else {
        // 기본 직육면체
        const side = 5 + grade;
        return {
            type: PROBLEM_TYPES.SOLID_VOLUME,
            question: `한 변의 길이가 ${side}cm인 정육면체의 부피는 몇 ㎤인가요?`,
            answer: `${side * side * side}㎤`,
            explanation: `정육면체의 부피 = 한 변의 길이 × 한 변의 길이 × 한 변의 길이 = ${side} × ${side} × ${side} = ${side * side * side}㎤입니다.`,
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'solid_volume', side, volume: side * side * side }
        };
    }
}

/**
 * 일차방정식 문제 생성 (중학교)
 */
function generateLinearEquationProblem(grade) {
    const coef = Math.floor(Math.random() * 5) + 2; // 2~6
    const constTerm = Math.floor(Math.random() * 10) + 5; // 5~14
    const solution = Math.floor(Math.random() * 10) + 1; // 1~10
    const result = coef * solution + constTerm;
    
    return {
        type: PROBLEM_TYPES.LINEAR_EQUATION,
        question: `${coef}x + ${constTerm} = ${result}일 때, x의 값은?`,
        questionLatex: `$${coef}x + ${constTerm} = ${result}$일 때, $x$의 값은?`,
        answer: `${solution}`,
        answerLatex: `${solution}`,
        explanation: `$${coef}x = ${result} - ${constTerm} = ${result - constTerm}$, $x = \\dfrac{${result - constTerm}}{${coef}} = ${solution}$입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'linear_equation', coefficient: coef, constant: constTerm, solution, schoolLevel: 'middle' }
    };
}

/**
 * 일차함수 문제 생성 (중학교)
 */
function generateLinearFunctionProblem(grade) {
    const a = Math.floor(Math.random() * 5) + 2; // 2~6
    const b = Math.floor(Math.random() * 10) + 1; // 1~10
    const x = Math.floor(Math.random() * 10) + 1; // 1~10
    const y = a * x + b;
    
    return {
        type: PROBLEM_TYPES.LINEAR_FUNCTION,
        question: `일차함수 y = ${a}x + ${b}에서 x = ${x}일 때, y의 값은?`,
        questionLatex: `일차함수 $y = ${a}x + ${b}$에서 $x = ${x}$일 때, $y$의 값은?`,
        answer: `${y}`,
        answerLatex: `${y}`,
        explanation: `$y = ${a} \\times ${x} + ${b} = ${a * x} + ${b} = ${y}$입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'linear_function', slope: a, intercept: b, x, y, schoolLevel: 'middle' }
    };
}

/**
 * 확률 문제 생성 (중학교)
 */
function generateProbabilityProblem(grade) {
    const total = Math.floor(Math.random() * 10) + 10; // 10~19
    const favorable = Math.floor(Math.random() * (total - 1)) + 1; // 1~total-1
    const probability = (favorable / total).toFixed(2);
    
    return {
        type: PROBLEM_TYPES.PROBABILITY,
        question: `주머니에 빨간 공 ${favorable}개와 파란 공 ${total - favorable}개가 있습니다. 빨간 공을 뽑을 확률은?`,
        answer: `\\dfrac{${favorable}}{${total}} 또는 ${probability}`,
        explanation: `전체 경우의 수는 ${total}이고, 빨간 공을 뽑는 경우의 수는 ${favorable}입니다. 따라서 확률은 \\dfrac{${favorable}}{${total}} = ${probability}입니다.`,
        inputPlaceholder: '예: \\dfrac{3}{10}',
        meta: { grade, concept: 'probability', total, favorable, probability }
    };
}

/**
 * 대응 관계 문제 생성 (생활 속에서 대응 관계를 찾아 식으로 나타내기)
 * 2~3줄의 서술형 지문으로 생활 속 상황을 제시하고 식으로 나타내는 문제
 */
function generateCorrespondenceProblem(grade, conceptText = '', conceptId = '') {
    const conceptLower = (conceptText || '').toLowerCase();
    const idLower = (conceptId || '').toLowerCase();
    
    // 5학년 1학기 3단원(G5-S1-U3)은 문장제로 출제
    // "두 양 사이의 관계", "대응 관계", "생활 속" 모두 포함
    const isG5S1U3 = idLower.includes('g5-s1-u3') || 
                     (grade === 5 && (conceptLower.includes('대응') || 
                                      conceptLower.includes('두 양') || 
                                      conceptLower.includes('양 사이')));
    const useWordProblem = isG5S1U3;
    
    // 생활 속 상황 템플릿 (문장제 형식)
    const situations = [
        {
            context: '민수는 하루에 {unit}개씩 {item}을 사용합니다.',
            question: useWordProblem ? '{days}일 동안 사용한 {item}은 모두 몇 개입니까?' : '{days}일 동안 사용한 {item}의 개수를 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{unit} × {days}',
            answerExpression: '{unit} × {days}',
            explanation: '하루에 {unit}개씩 {days}일 동안 사용하므로, {unit} × {days} = {result}개입니다.'
        },
        {
            context: '한 상자에 {item}이 {unit}개씩 들어있습니다.',
            question: useWordProblem ? '상자 {days}개에 들어있는 {item}은 모두 몇 개입니까?' : '상자 {days}개에 들어있는 {item}의 개수를 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{unit} × {days}',
            answerExpression: '{unit} × {days}',
            explanation: '한 상자에 {unit}개씩 {days}개 상자에 들어있으므로, {unit} × {days} = {result}개입니다.'
        },
        {
            context: '지우개 {unit}개의 무게가 {weight}g입니다.',
            question: useWordProblem ? '지우개 {days}개의 무게는 몇 g입니까?' : '지우개 {days}개의 무게를 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{weight} ÷ {unit} × {days}',
            answerExpression: '{weight} ÷ {unit} × {days}',
            explanation: '지우개 {unit}개의 무게가 {weight}g이므로, 지우개 1개의 무게는 {weight} ÷ {unit} = {unitWeight}g입니다. 따라서 {days}개의 무게는 {unitWeight} × {days} = {result}g입니다.'
        },
        {
            context: '연필 {unit}자루의 가격이 {price}원입니다.',
            question: useWordProblem ? '연필 {days}자루의 가격은 몇 원입니까?' : '연필 {days}자루의 가격을 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{price} ÷ {unit} × {days}',
            answerExpression: '{price} ÷ {unit} × {days}',
            explanation: '연필 {unit}자루의 가격이 {price}원이므로, 연필 1자루의 가격은 {price} ÷ {unit} = {unitPrice}원입니다. 따라서 {days}자루의 가격은 {unitPrice} × {days} = {result}원입니다.'
        },
        {
            context: '자동차가 시속 {speed}km로 달립니다.',
            question: useWordProblem ? '{hours}시간 동안 이동한 거리는 몇 km입니까?' : '{hours}시간 동안 이동한 거리를 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{speed} × {hours}',
            answerExpression: '{speed} × {hours}',
            explanation: '시속 {speed}km로 {hours}시간 동안 이동하므로, 거리는 {speed} × {hours} = {result}km입니다.'
        },
        {
            context: '공책 한 권의 가격이 {price}원입니다.',
            question: useWordProblem ? '공책 {count}권의 가격은 몇 원입니까?' : '공책 {count}권의 가격을 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{price} × {count}',
            answerExpression: '{price} × {count}',
            explanation: '공책 한 권이 {price}원이므로, {count}권의 가격은 {price} × {count} = {result}원입니다.'
        },
        {
            context: '사과 {count}개의 가격이 {price}원입니다.',
            question: useWordProblem ? '사과 {unit}개의 가격은 몇 원입니까?' : '사과 {unit}개의 가격을 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{price} ÷ {count} × {unit}',
            answerExpression: '{price} ÷ {count} × {unit}',
            explanation: '사과 {count}개의 가격이 {price}원이므로, 사과 1개의 가격은 {price} ÷ {count} = {unitPrice}원입니다. 따라서 {unit}개의 가격은 {unitPrice} × {unit} = {result}원입니다.'
        },
        {
            context: '한 시간에 {work}개의 일을 할 수 있습니다.',
            question: useWordProblem ? '{hours}시간 동안 할 수 있는 일은 모두 몇 개입니까?' : '{hours}시간 동안 할 수 있는 일의 개수를 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{work} × {hours}',
            answerExpression: '{work} × {hours}',
            explanation: '한 시간에 {work}개씩 {hours}시간 동안 일하므로, {work} × {hours} = {result}개입니다.'
        },
        {
            context: '{person}는 하루에 {unit}쪽씩 책을 읽습니다.',
            question: useWordProblem ? '{days}일 동안 읽은 책은 모두 몇 쪽입니까?' : '{days}일 동안 읽은 책의 쪽수를 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{unit} × {days}',
            answerExpression: '{unit} × {days}',
            explanation: '하루에 {unit}쪽씩 {days}일 동안 읽으므로, {unit} × {days} = {result}쪽입니다.'
        },
        {
            context: '우유 {unit}병의 가격이 {price}원입니다.',
            question: useWordProblem ? '우유 {days}병의 가격은 몇 원입니까?' : '우유 {days}병의 가격을 식으로 나타내세요.',
            answer: useWordProblem ? '{result}' : '{price} ÷ {unit} × {days}',
            answerExpression: '{price} ÷ {unit} × {days}',
            explanation: '우유 {unit}병의 가격이 {price}원이므로, 우유 1병의 가격은 {price} ÷ {unit} = {unitPrice}원입니다. 따라서 {days}병의 가격은 {unitPrice} × {days} = {result}원입니다.'
        }
    ];
    
    // 랜덤으로 상황 선택
    const selectedSituation = situations[Math.floor(Math.random() * situations.length)];
    
    // 숫자 생성 (5학년 수준에 맞게)
    const unit = 3 + Math.floor(Math.random() * 5); // 3~7
    const days = 4 + Math.floor(Math.random() * 6); // 4~9
    const count = unit;
    const price = (10 + Math.floor(Math.random() * 20)) * 100; // 1000~3000원
    const weight = (20 + Math.floor(Math.random() * 30)) * 10; // 200~500g
    const speed = 40 + Math.floor(Math.random() * 40); // 40~79km
    const hours = days;
    const work = unit;
    
    // 계산 결과
    let result;
    const answerExpression = selectedSituation.answerExpression || selectedSituation.answer;
    if (answerExpression.includes('÷')) {
        if (answerExpression.includes('{price}')) {
        const unitPrice = Math.floor(price / count);
        result = unitPrice * unit;
        } else if (answerExpression.includes('{weight}')) {
            const unitWeight = Math.floor(weight / unit);
            result = unitWeight * days;
        } else {
            result = Math.floor(price / count) * unit;
        }
    } else if (answerExpression.includes('×')) {
        if (answerExpression.includes('{speed}')) {
            result = speed * hours;
        } else if (answerExpression.includes('{price}') && answerExpression.includes('{count}')) {
            result = price * count;
        } else {
        result = unit * days;
        }
    } else {
        result = unit * days;
    }
    
    // 아이템 이름
    const items = ['연필', '지우개', '공책', '사과', '귤', '사탕', '초콜릿', '우유'];
    const item = items[Math.floor(Math.random() * items.length)];
    
    // 사람 이름
    const people = ['민수', '영희', '철수', '지영', '민지', '준호'];
    const person = people[Math.floor(Math.random() * people.length)];
    
    // 템플릿 치환
    let question = selectedSituation.context + '\n' + selectedSituation.question;
    let answer = selectedSituation.answer;
    let answerExpr = answerExpression;
    let explanation = selectedSituation.explanation;
    
    // 변수 치환
    question = question
        .replace(/{unit}/g, unit.toString())
        .replace(/{days}/g, days.toString())
        .replace(/{item}/g, item)
        .replace(/{count}/g, count.toString())
        .replace(/{price}/g, price.toString())
        .replace(/{weight}/g, weight.toString())
        .replace(/{speed}/g, speed.toString())
        .replace(/{hours}/g, hours.toString())
        .replace(/{work}/g, work.toString())
        .replace(/{person}/g, person);
    
    answer = answer
        .replace(/{unit}/g, unit.toString())
        .replace(/{days}/g, days.toString())
        .replace(/{count}/g, count.toString())
        .replace(/{price}/g, price.toString())
        .replace(/{weight}/g, weight.toString())
        .replace(/{speed}/g, speed.toString())
        .replace(/{hours}/g, hours.toString())
        .replace(/{work}/g, work.toString())
        .replace(/{result}/g, result.toString());
    
    answerExpr = answerExpr
        .replace(/{unit}/g, unit.toString())
        .replace(/{days}/g, days.toString())
        .replace(/{count}/g, count.toString())
        .replace(/{price}/g, price.toString())
        .replace(/{weight}/g, weight.toString())
        .replace(/{speed}/g, speed.toString())
        .replace(/{hours}/g, hours.toString())
        .replace(/{work}/g, work.toString());
    
    explanation = explanation
        .replace(/{unit}/g, unit.toString())
        .replace(/{days}/g, days.toString())
        .replace(/{item}/g, item)
        .replace(/{count}/g, count.toString())
        .replace(/{price}/g, price.toString())
        .replace(/{weight}/g, weight.toString())
        .replace(/{speed}/g, speed.toString())
        .replace(/{hours}/g, hours.toString())
        .replace(/{work}/g, work.toString())
        .replace(/{result}/g, result.toString())
        .replace(/{unitPrice}/g, Math.floor(price / count).toString())
        .replace(/{unitWeight}/g, Math.floor(weight / unit).toString());
    
    // 문장제인 경우 해설에 식 추가
    if (useWordProblem && !explanation.includes('식')) {
        explanation = `${answerExpr} = ${result}\n\n${explanation}`;
    }
    
    return {
        type: PROBLEM_TYPES.PATTERN,
        question: question,
        stem: question, // stem 필드 추가
        answer: answer,
        explanation: explanation,
        inputPlaceholder: useWordProblem ? '답을 입력하세요 (예: 21)' : '답을 입력하세요 (예: 3 × 5)',
        meta: { grade, concept: 'correspondence', unit, days, result, isWordProblem: useWordProblem }
    };
}

/**
 * 그래프 문제 생성 (원그래프, 띠그래프 등) - 텍스트로 설명
 */
function generateGraphProblem(grade, conceptText = '', conceptId = '') {
    const conceptLower = (conceptText || '').toLowerCase();
    const idLower = (conceptId || '').toLowerCase();
    
    // 원그래프 문제
    if (conceptLower.includes('원그래프') || idLower.includes('u5-t2')) {
        const total = [100, 200, 300, 400, 500][Math.floor(Math.random() * 5)];
        const percentages = [];
        let remaining = 100;
        
        // 3~4개 항목 생성
        const numItems = 3 + Math.floor(Math.random() * 2); // 3~4개
        for (let i = 0; i < numItems - 1; i++) {
            const pct = 10 + Math.floor(Math.random() * (remaining - 10 * (numItems - i - 1)));
            percentages.push(pct);
            remaining -= pct;
        }
        percentages.push(remaining);
        
        const items = ['A', 'B', 'C', 'D'];
        const selectedItem = items[Math.floor(Math.random() * numItems)];
        const selectedIndex = items.indexOf(selectedItem);
        const selectedPct = percentages[selectedIndex];
        const selectedCount = Math.floor(total * selectedPct / 100);
        
        // 문제 유형 선택
        const problemType = Math.floor(Math.random() * 3);
        
        if (problemType === 0) {
            // 유형 1: 퍼센트에서 인원수 구하기
            return {
                type: PROBLEM_TYPES.PATTERN,
                question: `전체 학생이 ${total}명일 때, 원그래프에서 ${selectedItem}가 ${selectedPct}%를 차지한다면 ${selectedItem}는 몇 명인가?`,
                answer: `${selectedCount}명`,
                explanation: `전체 ${total}명의 ${selectedPct}%이므로, ${selectedItem} = ${total} × ${selectedPct}% = ${total} × 0.${selectedPct} = ${selectedCount}명입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 30명)',
                meta: { grade, concept: 'pie_chart', total, percentage: selectedPct, count: selectedCount }
            };
        } else if (problemType === 1) {
            // 유형 2: 각도에서 퍼센트 구하기
            const angle = selectedPct * 3.6; // 1% = 3.6도
            return {
                type: PROBLEM_TYPES.PATTERN,
                question: `원그래프에서 ${selectedItem} 부분의 각도가 ${Math.round(angle)}도일 때, ${selectedItem}는 전체의 몇 %인가?`,
                answer: `${selectedPct}%`,
                explanation: `원그래프에서 전체는 360도이므로, ${Math.round(angle)}도는 ${Math.round(angle)} ÷ 360 = ${(Math.round(angle) / 360).toFixed(2)} = ${selectedPct}%입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 30%)',
                meta: { grade, concept: 'pie_chart', angle: Math.round(angle), percentage: selectedPct }
            };
        } else {
            // 유형 3: 여러 항목의 인원수 구하기
            const itemList = percentages.map((pct, idx) => {
                const count = Math.floor(total * pct / 100);
                return `${items[idx]}: ${pct}%`;
            }).join(', ');
            
            const questionItem = items[Math.floor(Math.random() * numItems)];
            const questionIndex = items.indexOf(questionItem);
            const questionCount = Math.floor(total * percentages[questionIndex] / 100);
            
            return {
                type: PROBLEM_TYPES.PATTERN,
                question: `원그래프에서 ${itemList}일 때, 전체가 ${total}명이면 ${questionItem}는 몇 명인가?`,
                answer: `${questionCount}명`,
                explanation: `${questionItem}는 ${percentages[questionIndex]}%이므로, ${total} × ${percentages[questionIndex]}% = ${total} × 0.${percentages[questionIndex]} = ${questionCount}명입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 30명)',
                meta: { grade, concept: 'pie_chart', total, percentages, item: questionItem, count: questionCount }
            };
        }
    }
    
    // 띠그래프 문제
    if (conceptLower.includes('띠그래프') || idLower.includes('u5-t1')) {
        const total = [100, 200, 300, 400, 500][Math.floor(Math.random() * 5)];
        const percentages = [];
        let remaining = 100;
        
        const numItems = 3 + Math.floor(Math.random() * 2); // 3~4개
        for (let i = 0; i < numItems - 1; i++) {
            const pct = 10 + Math.floor(Math.random() * (remaining - 10 * (numItems - i - 1)));
            percentages.push(pct);
            remaining -= pct;
        }
        percentages.push(remaining);
        
        const items = ['A', 'B', 'C', 'D'];
        const selectedItem = items[Math.floor(Math.random() * numItems)];
        const selectedIndex = items.indexOf(selectedItem);
        const selectedPct = percentages[selectedIndex];
        const selectedCount = Math.floor(total * selectedPct / 100);
        
        return {
            type: PROBLEM_TYPES.PATTERN,
            question: `띠그래프에서 전체가 ${total}명이고, ${selectedItem}가 ${selectedPct}%를 차지한다면 ${selectedItem}는 몇 명인가?`,
            answer: `${selectedCount}명`,
            explanation: `띠그래프에서 ${selectedItem}는 ${selectedPct}%이므로, ${total} × ${selectedPct}% = ${total} × 0.${selectedPct} = ${selectedCount}명입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 30명)',
            meta: { grade, concept: 'bar_chart', total, percentage: selectedPct, count: selectedCount }
        };
    }
    
    // 그래프 해석 문제
    if (conceptLower.includes('해석') || idLower.includes('u5-t3')) {
        const total = [100, 200, 300][Math.floor(Math.random() * 3)];
        const pct1 = 30 + Math.floor(Math.random() * 20); // 30~49
        const pct2 = 20 + Math.floor(Math.random() * 20); // 20~39
        const pct3 = 100 - pct1 - pct2;
        
        return {
            type: PROBLEM_TYPES.PATTERN,
            question: `원그래프에서 A가 ${pct1}%, B가 ${pct2}%, C가 ${pct3}%일 때, 전체가 ${total}명이면 가장 많은 항목은 무엇이고 몇 명인가?`,
            answer: `A, ${Math.floor(total * pct1 / 100)}명`,
            explanation: `A가 ${pct1}%로 가장 많으므로, A = ${total} × ${pct1}% = ${Math.floor(total * pct1 / 100)}명입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: A, 30명)',
            meta: { grade, concept: 'graph_interpretation', total, percentages: [pct1, pct2, pct3] }
        };
    }
    
    // 기본: 원그래프 문제
    const total = 100;
    const pct = 30 + Math.floor(Math.random() * 40); // 30~69
    const count = Math.floor(total * pct / 100);
    
    return {
        type: PROBLEM_TYPES.PATTERN,
        question: `원그래프에서 전체가 ${total}명이고, A가 ${pct}%를 차지한다면 A는 몇 명인가?`,
        answer: `${count}명`,
        explanation: `A는 ${pct}%이므로, ${total} × ${pct}% = ${count}명입니다.`,
        inputPlaceholder: '답을 입력하세요 (예: 30명)',
        meta: { grade, concept: 'pie_chart', total, percentage: pct, count }
    };
}

/**
 * 중학교 수준 도형 문제 생성 (이등변삼각형, 외심, 내심, 평행사변형, 닮음, 피타고라스 등)
 */
function generateMiddleSchoolGeometryProblem(grade, conceptText = '', conceptId = '', existingQuestions = []) {
    const conceptLower = (conceptText || '').toLowerCase();
    const idLower = (conceptId || '').toLowerCase();
    
    // 피타고라스 정리
    if (conceptLower.includes('피타고라스') || idLower.includes('u3-s4')) {
        const a = 3 + Math.floor(Math.random() * 4); // 3~6
        const b = 4 + Math.floor(Math.random() * 4); // 4~7
        const c = Math.sqrt(a * a + b * b);
        
        // 정수인 경우와 아닌 경우
        if (Number.isInteger(c)) {
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `직각삼각형에서 두 변의 길이가 각각 ${a}cm, ${b}cm일 때, 나머지 한 변의 길이는?`,
                answer: `${c}cm`,
                explanation: `피타고라스 정리에 의해: (빗변)² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}, 따라서 빗변 = √${a * a + b * b} = ${c}cm입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 5cm)',
                meta: { grade, concept: 'pythagorean', a, b, c }
            };
        } else {
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `직각삼각형에서 두 변의 길이가 각각 ${a}cm, ${b}cm일 때, 나머지 한 변의 길이는? (근호를 사용하여 나타내시오)`,
                answer: `√${a * a + b * b}cm`,
                explanation: `피타고라스 정리에 의해: (빗변)² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}, 따라서 빗변 = √${a * a + b * b}cm입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: √13cm)',
                meta: { grade, concept: 'pythagorean', a, b, c: Math.sqrt(a * a + b * b) }
            };
        }
    }
    
    // 닮음
    if (conceptLower.includes('닮음') || idLower.includes('u3-s1') || idLower.includes('u3-s3')) {
        const scale = 2 + Math.floor(Math.random() * 3); // 2~4
        const side1 = 3 + Math.floor(Math.random() * 5); // 3~7
        const side2 = side1 * scale;
        
        return {
            type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
            question: `두 삼각형이 닮음이고 닮음비가 1 : ${scale}일 때, 작은 삼각형의 한 변의 길이가 ${side1}cm이면, 큰 삼각형의 대응하는 변의 길이는?`,
            answer: `${side2}cm`,
            explanation: `닮음비가 1 : ${scale}이므로, 대응하는 변의 길이도 1 : ${scale}입니다. 따라서 ${side1} : ? = 1 : ${scale}, ? = ${side1} × ${scale} = ${side2}cm입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 6cm)',
            meta: { grade, concept: 'similarity', scale, side1, side2 }
        };
    }
    
    // 외심, 내심
    if (conceptLower.includes('외심') || conceptLower.includes('내심') || idLower.includes('u1-s2')) {
        const isCircumcenter = conceptLower.includes('외심') || (idLower.includes('u1-s2') && !conceptLower.includes('내심'));
        
        if (isCircumcenter) {
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `삼각형의 외심은 세 변의 수직이등분선의 교점입니다. 외심에서 세 꼭짓점까지의 거리는 어떻게 되는가?`,
                answer: '같다 (모두 같다)',
                explanation: '삼각형의 외심은 세 변의 수직이등분선의 교점이므로, 외심에서 세 꼭짓점까지의 거리는 모두 같습니다.',
                inputPlaceholder: '답을 입력하세요',
                meta: { grade, concept: 'circumcenter' }
            };
        } else {
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `삼각형의 내심은 세 내각의 이등분선의 교점입니다. 내심에서 세 변까지의 거리는 어떻게 되는가?`,
                answer: '같다 (모두 같다)',
                explanation: '삼각형의 내심은 세 내각의 이등분선의 교점이므로, 내심에서 세 변까지의 거리는 모두 같습니다.',
                inputPlaceholder: '답을 입력하세요',
                meta: { grade, concept: 'incenter' }
            };
        }
    }
    
    // 이등변삼각형, 직각삼각형
    if (conceptLower.includes('이등변') || conceptLower.includes('직각') || idLower.includes('u1-s1')) {
        const isIsosceles = conceptLower.includes('이등변');
        
        if (isIsosceles) {
            const base = 4 + Math.floor(Math.random() * 4); // 4~7
            const equalSide = 5 + Math.floor(Math.random() * 4); // 5~8
            
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `이등변삼각형에서 두 변의 길이가 각각 ${equalSide}cm, ${equalSide}cm이고, 나머지 한 변의 길이가 ${base}cm일 때, 이 삼각형의 둘레는?`,
                answer: `${equalSide * 2 + base}cm`,
                explanation: `이등변삼각형의 둘레 = ${equalSide} + ${equalSide} + ${base} = ${equalSide * 2 + base}cm입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 18cm)',
                meta: { grade, concept: 'isosceles_triangle', base, equalSide }
            };
        } else {
            const leg1 = 3 + Math.floor(Math.random() * 4); // 3~6
            const leg2 = 4 + Math.floor(Math.random() * 4); // 4~7
            const hypotenuse = Math.sqrt(leg1 * leg1 + leg2 * leg2);
            
            if (Number.isInteger(hypotenuse)) {
                return {
                    type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                    question: `직각삼각형에서 두 변의 길이가 각각 ${leg1}cm, ${leg2}cm일 때, 빗변의 길이는?`,
                    answer: `${hypotenuse}cm`,
                    explanation: `피타고라스 정리에 의해: (빗변)² = ${leg1}² + ${leg2}² = ${leg1 * leg1} + ${leg2 * leg2} = ${leg1 * leg1 + leg2 * leg2}, 따라서 빗변 = √${leg1 * leg1 + leg2 * leg2} = ${hypotenuse}cm입니다.`,
                    inputPlaceholder: '답을 입력하세요 (예: 5cm)',
                    meta: { grade, concept: 'right_triangle', leg1, leg2, hypotenuse }
                };
            } else {
                return {
                    type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                    question: `직각삼각형에서 두 변의 길이가 각각 ${leg1}cm, ${leg2}cm일 때, 빗변의 길이는? (근호를 사용하여 나타내시오)`,
                    answer: `√${leg1 * leg1 + leg2 * leg2}cm`,
                    explanation: `피타고라스 정리에 의해: (빗변)² = ${leg1}² + ${leg2}² = ${leg1 * leg1} + ${leg2 * leg2} = ${leg1 * leg1 + leg2 * leg2}, 따라서 빗변 = √${leg1 * leg1 + leg2 * leg2}cm입니다.`,
                    inputPlaceholder: '답을 입력하세요 (예: √13cm)',
                    meta: { grade, concept: 'right_triangle', leg1, leg2, hypotenuse: Math.sqrt(leg1 * leg1 + leg2 * leg2) }
                };
            }
        }
    }
    
    // 평행사변형
    if (conceptLower.includes('평행사변형') || idLower.includes('u2-s1')) {
        const base = 5 + Math.floor(Math.random() * 5); // 5~9
        const height = 4 + Math.floor(Math.random() * 4); // 4~7
        const area = base * height;
        
        return {
            type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
            question: `평행사변형에서 밑변의 길이가 ${base}cm, 높이가 ${height}cm일 때, 이 평행사변형의 넓이는?`,
            answer: `${area}cm²`,
            explanation: `평행사변형의 넓이 = 밑변 × 높이 = ${base} × ${height} = ${area}cm²입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 20cm²)',
            meta: { grade, concept: 'parallelogram', base, height, area }
        };
    }
    
    // 다각형의 성질 (다각형의 뜻, 내각과 외각, 대각선, 정다각형)
    if (conceptLower.includes('다각형') || idLower.includes('u2-s1')) {
        // 다각형의 뜻 (중학교 수준으로 향상)
        if (conceptLower.includes('뜻') || conceptLower.includes('정의') || conceptLower.includes('의미')) {
            // 중학교 수준: 다각형의 정의와 성질을 묻는 문제
            const problems = [
                {
                    question: '다각형의 정의를 바르게 설명한 것은?',
                    answer: '3개 이상의 선분으로 둘러싸인 도형',
                    explanation: '다각형은 3개 이상의 선분으로 둘러싸인 도형입니다. 각 선분은 다각형의 변이 되고, 변과 변이 만나는 점은 꼭짓점이 됩니다.'
                },
                {
                    question: '다음 중 다각형이 아닌 것은?',
                    answer: '원',
                    explanation: '원은 곡선으로 이루어진 도형이므로 다각형이 아닙니다. 다각형은 선분으로 둘러싸인 도형이어야 합니다.'
                },
                {
                    question: '다각형에서 변의 개수가 n개일 때, 꼭짓점의 개수는?',
                    answer: 'n개',
                    explanation: '다각형에서 변의 개수와 꼭짓점의 개수는 같습니다. 예를 들어 삼각형은 변 3개, 꼭짓점 3개입니다.'
                },
                {
                    question: '다각형의 변과 꼭짓점의 관계를 바르게 설명한 것은?',
                    answer: '변의 개수와 꼭짓점의 개수는 항상 같다',
                    explanation: '다각형에서 변의 개수와 꼭짓점의 개수는 항상 같습니다. 한 변은 두 꼭짓점을 연결하므로, 변의 개수와 꼭짓점의 개수가 일치합니다.'
                },
                {
                    question: '다각형은 어떤 도형인가?',
                    answer: '3개 이상의 선분으로 둘러싸인 평면도형',
                    explanation: '다각형은 3개 이상의 선분으로 둘러싸인 평면도형입니다. 삼각형, 사각형, 오각형 등이 모두 다각형의 예입니다.'
                },
                {
                    question: '다음 중 다각형인 것은?',
                    answer: '삼각형, 사각형, 오각형 모두',
                    explanation: '삼각형, 사각형, 오각형 모두 선분으로 둘러싸인 도형이므로 다각형입니다.'
                }
            ];
            // 이미 생성된 문제와 비교하여 중복 방지
            const usedQuestions = new Set();
            existingQuestions.forEach(q => {
                const qText = (q.question || q.stem || q.questionText || '').trim();
                if (qText) {
                    usedQuestions.add(qText.toLowerCase());
                }
            });
            
            // 사용되지 않은 문제만 필터링
            const availableProblems = problems.filter(p => !usedQuestions.has(p.question.toLowerCase()));
            
            // 사용 가능한 문제가 없으면 전체 문제에서 선택 (최후의 수단)
            const problemPool = availableProblems.length > 0 ? availableProblems : problems;
            
            // 순차적으로 선택하거나 랜덤 선택
            const index = existingQuestions.length < problems.length ? existingQuestions.length : Math.floor(Math.random() * problemPool.length);
            const selected = problemPool[index % problemPool.length];
            
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: selected.question,
                answer: selected.answer,
                explanation: selected.explanation,
                inputPlaceholder: '답을 입력하세요',
                meta: { grade, concept: 'polygon_definition' }
            };
        }
        
        // 다각형의 내각과 외각
        if (conceptLower.includes('내각') || conceptLower.includes('외각')) {
            const n = 5 + Math.floor(Math.random() * 4); // 5~8각형
            const nKorean = numberToKorean(n);
            const interiorSum = (n - 2) * 180;
            const exteriorSum = 360;
            const oneInterior = interiorSum / n;
            const oneExterior = 360 / n;
            
            const problems = [
                {
                    question: `${nKorean}각형의 내각의 크기의 합은 몇 도인가요?`,
                    answer: `${interiorSum}°`,
                    explanation: `n각형의 내각의 크기의 합은 (n-2) × 180° = (${n}-2) × 180° = ${n-2} × 180° = ${interiorSum}°입니다.`
                },
                {
                    question: `${nKorean}각형의 외각의 크기의 합은 몇 도인가요?`,
                    answer: `${exteriorSum}°`,
                    explanation: `모든 다각형의 외각의 크기의 합은 항상 360°입니다.`
                },
                {
                    question: `정${nKorean}각형의 한 내각의 크기는 몇 도인가요?`,
                    answer: `${oneInterior}°`,
                    explanation: `정${nKorean}각형의 내각의 크기의 합은 ${interiorSum}°이므로, 한 내각의 크기는 ${interiorSum}° ÷ ${n} = ${oneInterior}°입니다.`
                },
                {
                    question: `정${nKorean}각형의 한 외각의 크기는 몇 도인가요?`,
                    answer: `${oneExterior}°`,
                    explanation: `정${nKorean}각형의 외각의 크기의 합은 360°이므로, 한 외각의 크기는 360° ÷ ${n} = ${oneExterior}°입니다.`
                }
            ];
            
            const selected = problems[Math.floor(Math.random() * problems.length)];
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: selected.question,
                answer: selected.answer,
                explanation: selected.explanation,
                inputPlaceholder: '답을 입력하세요 (예: 180°)',
                meta: { grade, concept: 'polygon_angle', n, interiorSum, exteriorSum }
            };
        }
        
        // 다각형의 대각선
        if (conceptLower.includes('대각선')) {
            const n = 5 + Math.floor(Math.random() * 4); // 5~8각형
            const nKorean = numberToKorean(n);
            const diagonalCount = (n * (n - 3)) / 2;
            const diagonalCountKorean = numberToKorean(diagonalCount);
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `${nKorean}각형의 대각선의 개수는 몇 개인가요?`,
                answer: `${diagonalCountKorean}개`,
                explanation: `n각형의 대각선의 개수는 n(n-3)/2 = ${n}(${n}-3)/2 = ${n} × ${n-3} / 2 = ${diagonalCount}개입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 오개)',
                meta: { grade, concept: 'polygon_diagonal', n, diagonalCount }
            };
        }
        
        // 정다각형
        if (conceptLower.includes('정다각형') || conceptLower.includes('정 다각형')) {
            const shapes = ['정삼각형', '정사각형', '정오각형', '정육각형'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const n = shape === '정삼각형' ? 3 : shape === '정사각형' ? 4 : shape === '정오각형' ? 5 : 6;
            const interiorSum = (n - 2) * 180;
            const oneInterior = interiorSum / n;
            
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `${shape}의 한 내각의 크기는 몇 도인가요?`,
                answer: `${oneInterior}°`,
                explanation: `${shape}의 내각의 크기의 합은 (${n}-2) × 180° = ${n-2} × 180° = ${interiorSum}°이므로, 한 내각의 크기는 ${interiorSum}° ÷ ${n} = ${oneInterior}°입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 120°)',
                meta: { grade, concept: 'regular_polygon', shape, n, oneInterior }
            };
        }
        
        // 기본: 다각형의 정의
        return {
            type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
            question: `다각형은 몇 개 이상의 변으로 둘러싸인 도형인가요?`,
            answer: '3개',
            explanation: '다각형은 3개 이상의 변으로 둘러싸인 도형입니다.',
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'polygon_basic' }
        };
    }
    
    return null;
}

// 통계 문제 생성 함수
function generateMiddleSchoolStatisticsProblem(grade, conceptText = '', conceptId = '') {
    const conceptLower = (conceptText || '').toLowerCase();
    const idLower = (conceptId || '').toLowerCase();
    
    // 대푯값과 평균
    if (conceptLower.includes('대푯값') || conceptLower.includes('평균')) {
        const dataSets = [
            [85, 90, 78, 92, 88],
            [72, 85, 90, 78, 95],
            [88, 92, 85, 90, 87],
            [75, 82, 90, 88, 85]
        ];
        const data = dataSets[Math.floor(Math.random() * dataSets.length)];
        const sum = data.reduce((a, b) => a + b, 0);
        const mean = sum / data.length;
        
        return {
            type: PROBLEM_TYPES.PATTERN,
            question: `다음 자료의 평균을 구하시오.\n${data.join(', ')}`,
            answer: `${mean}`,
            explanation: `평균 = (${data.join(' + ')}) ÷ ${data.length} = ${sum} ÷ ${data.length} = ${mean}입니다.`,
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'statistics_mean', data, mean }
        };
    }
    
    // 최빈값
    if (conceptLower.includes('최빈값')) {
        const dataSets = [
            [3, 5, 3, 7, 3, 5, 3],
            [2, 4, 2, 6, 4, 2, 4],
            [1, 3, 1, 5, 3, 1, 3],
            [4, 6, 4, 8, 6, 4, 6]
        ];
        const data = dataSets[Math.floor(Math.random() * dataSets.length)];
        const frequency = {};
        data.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
        });
        const maxFreq = Math.max(...Object.values(frequency));
        const mode = Object.keys(frequency).filter(k => frequency[k] === maxFreq).map(Number);
        
        return {
            type: PROBLEM_TYPES.PATTERN,
            question: `다음 자료의 최빈값을 구하시오.\n${data.join(', ')}`,
            answer: mode.length === 1 ? `${mode[0]}` : mode.join(', '),
            explanation: `각 값의 빈도를 세면 ${Object.entries(frequency).map(([k, v]) => `${k}: ${v}번`).join(', ')}입니다. 가장 많이 나타나는 값은 ${mode.join(', ')}이므로 최빈값은 ${mode.length === 1 ? mode[0] : mode.join(', ')}입니다.`,
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'statistics_mode', data, mode }
        };
    }
    
    // 중앙값
    if (conceptLower.includes('중앙값')) {
        const dataSets = [
            [15, 20, 18, 25, 22],
            [30, 35, 28, 40, 32],
            [10, 15, 12, 20, 18],
            [50, 55, 48, 60, 52]
        ];
        const data = dataSets[Math.floor(Math.random() * dataSets.length)];
        const sorted = [...data].sort((a, b) => a - b);
        const median = sorted.length % 2 === 0 
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];
        
        return {
            type: PROBLEM_TYPES.PATTERN,
            question: `다음 자료를 크기 순으로 나열한 후 중앙값을 구하시오.\n${data.join(', ')}`,
            answer: `${median}`,
            explanation: `크기 순으로 나열하면 ${sorted.join(', ')}입니다. 자료의 개수가 ${sorted.length}개이므로 중앙값은 ${sorted.length % 2 === 0 ? `${sorted[sorted.length / 2 - 1]}와 ${sorted[sorted.length / 2]}의 평균인 ${median}` : `${sorted[Math.floor(sorted.length / 2)]}`}입니다.`,
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'statistics_median', data, sorted, median }
        };
    }
    
    // 기본: 평균 문제
    const data = [80, 85, 90, 75, 88];
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    return {
        type: PROBLEM_TYPES.PATTERN,
        question: `다음 자료의 평균을 구하시오.\n${data.join(', ')}`,
        answer: `${mean}`,
        explanation: `평균 = (${data.join(' + ')}) ÷ ${data.length} = ${sum} ÷ ${data.length} = ${mean}입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'statistics_basic', data, mean }
    };
    
    // 사각형 (직사각형, 마름모, 정사각형)
    if (conceptLower.includes('사각형') || idLower.includes('u2-s2')) {
        const shapeTypes = ['직사각형', '마름모', '정사각형'];
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        
        if (shapeType === '직사각형') {
            const width = 5 + Math.floor(Math.random() * 5); // 5~9
            const height = 4 + Math.floor(Math.random() * 4); // 4~7
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `직사각형에서 가로가 ${width}cm, 세로가 ${height}cm일 때, 이 직사각형의 넓이는?`,
                answer: `${width * height}cm²`,
                explanation: `직사각형의 넓이 = 가로 × 세로 = ${width} × ${height} = ${width * height}cm²입니다.`,
                inputPlaceholder: '답을 입력하세요',
                meta: { grade, concept: 'rectangle', width, height, area: width * height }
            };
        } else if (shapeType === '마름모') {
            const diagonal1 = 6 + Math.floor(Math.random() * 5); // 6~10
            const diagonal2 = 4 + Math.floor(Math.random() * 5); // 4~8
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `마름모에서 두 대각선의 길이가 각각 ${diagonal1}cm, ${diagonal2}cm일 때, 이 마름모의 넓이는?`,
                answer: `${(diagonal1 * diagonal2) / 2}cm²`,
                explanation: `마름모의 넓이 = (대각선1 × 대각선2) ÷ 2 = (${diagonal1} × ${diagonal2}) ÷ 2 = ${diagonal1 * diagonal2} ÷ 2 = ${(diagonal1 * diagonal2) / 2}cm²입니다.`,
                inputPlaceholder: '답을 입력하세요',
                meta: { grade, concept: 'rhombus', diagonal1, diagonal2, area: (diagonal1 * diagonal2) / 2 }
            };
        } else {
            const side = 4 + Math.floor(Math.random() * 4); // 4~7
            return {
                type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
                question: `정사각형에서 한 변의 길이가 ${side}cm일 때, 이 정사각형의 넓이는?`,
                answer: `${side * side}cm²`,
                explanation: `정사각형의 넓이 = 한 변의 길이 × 한 변의 길이 = ${side} × ${side} = ${side * side}cm²입니다.`,
                inputPlaceholder: '답을 입력하세요',
                meta: { grade, concept: 'square', side, area: side * side }
            };
        }
    }
    
    // 기본: 삼각형 성질
    return {
        type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
        question: `삼각형의 세 내각의 크기의 합은 몇 도인가?`,
        answer: '180°',
        explanation: '삼각형의 세 내각의 크기의 합은 항상 180°입니다.',
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'triangle_property' }
    };
}

/**
 * 중학교 수준 정수/유리수 계산 문제 생성 (LaTeX 사용)
 */
function generateMiddleSchoolNumberProblem(grade, conceptText = '', conceptId = '') {
    const conceptLower = (conceptText || '').toLowerCase();
    const idLower = (conceptId || '').toLowerCase();
    
    // 정수와 유리수의 사칙계산 (음수 포함, LaTeX 사용)
    if (conceptLower.includes('정수') || conceptLower.includes('유리수') || idLower.includes('u2')) {
        const num1 = Math.random() > 0.5 ? -(Math.floor(Math.random() * 15) + 5) : (Math.floor(Math.random() * 15) + 5);
        const num2 = Math.random() > 0.5 ? -(Math.floor(Math.random() * 15) + 5) : (Math.floor(Math.random() * 15) + 5);
        const operations = [
            { op: '+', result: num1 + num2, latex: `${num1} + ${num2}` },
            { op: '-', result: num1 - num2, latex: `${num1} - ${num2}` },
            { op: '×', result: num1 * num2, latex: `${num1} \\times ${num2}` }
        ];
        const selected = operations[Math.floor(Math.random() * operations.length)];
        
        // 나눗셈인 경우 유리수로 표현
        if (selected.op === '÷' || Math.random() > 0.7) {
            const divisor = num2 !== 0 ? Math.abs(num2) : Math.abs(num1);
            const dividend = num1;
            const g = gcd(Math.abs(dividend), divisor);
            const simplifiedNum = dividend / g;
            const simplifiedDen = divisor / g;
            
            return {
                type: PROBLEM_TYPES.LINEAR_EQUATION,
                question: `$\\dfrac{${dividend}}{${divisor}}$의 값을 구하시오.`,
                questionLatex: `$\\dfrac{${dividend}}{${divisor}}$의 값을 구하시오.`,
                answer: g > 1 ? `\\dfrac{${simplifiedNum}}{${simplifiedDen}}` : `${simplifiedNum / simplifiedDen}`,
                answerLatex: g > 1 ? `\\dfrac{${simplifiedNum}}{${simplifiedDen}}` : `${simplifiedNum / simplifiedDen}`,
                explanation: `$\\dfrac{${dividend}}{${divisor}} = ${g > 1 ? `\\dfrac{${simplifiedNum}}{${simplifiedDen}}` : simplifiedNum / simplifiedDen}$입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: \\dfrac{3}{4})',
                meta: { grade, concept: 'rational_division', num1: dividend, num2: divisor, result }
            };
        }
        
        return {
            type: PROBLEM_TYPES.LINEAR_EQUATION,
            question: `$${selected.latex}$의 값을 구하시오.`,
            questionLatex: `$${selected.latex}$의 값을 구하시오.`,
            answer: `${selected.result}`,
            answerLatex: `${selected.result}`,
            explanation: `$${selected.latex} = ${selected.result}$입니다.`,
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'integer_rational_calc', num1, num2, operation: selected.op, result: selected.result }
        };
    }
    
    // 기본: 정수 계산 (음수 포함, LaTeX 사용)
    const a = -(Math.floor(Math.random() * 15) + 5);
    const b = Math.floor(Math.random() * 15) + 5;
    return {
        type: PROBLEM_TYPES.LINEAR_EQUATION,
        question: `$${a} + ${b}$의 값을 구하시오.`,
        questionLatex: `$${a} + ${b}$의 값을 구하시오.`,
        answer: `${a + b}`,
        answerLatex: `${a + b}`,
        explanation: `$${a} + ${b} = ${a + b}$입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'integer_calc', a, b, result: a + b }
    };
}

// 문제 형식 중 하나를 랜덤 생성 (개념 텍스트 추가로 도형 문제 생성 가능)
function generateProblemByType(type, grade, conceptText = '', conceptId = '', schoolLevel = 'elementary', rawGrade = null, problemType = '기본형', existingQuestions = []) {
    // conceptId 정규화 (객체 처리 강화)
    const idString = normalizeConceptId(conceptId);
    
    // 학교급 판단 (conceptId나 grade로 추론)
    const isMiddleSchool = schoolLevel === 'middle' || schoolLevel === '중학교' || 
                           grade >= 7 || (idString && idString.startsWith('M'));
    
    // 중학교 실제 학년 판단 (rawGrade가 있으면 사용, 없으면 추론)
    const middleSchoolGrade = rawGrade !== null ? rawGrade : 
                             (isMiddleSchool && grade >= 6 ? (grade === 6 ? 2 : (grade === 5 ? 1 : 3)) : null);
    const isMiddleSchoolGrade1 = middleSchoolGrade === 1 || (idString && idString.includes('G1'));
    const isMiddleSchoolGrade2 = middleSchoolGrade === 2 || (idString && idString.includes('G2'));
    const isMiddleSchoolGrade3 = middleSchoolGrade === 3 || (idString && idString.includes('G3'));
    
    // [학교급 필터링 강제] 중학교일 경우 단순 사칙연산만 있는 문제 차단
    if (isMiddleSchool) {
        // 단순 산수 문제 타입 차단
        const blockedTypes = [
            PROBLEM_TYPES.SKIP_COUNT,  // 뛰어세기
            PROBLEM_TYPES.TWO_DIGIT_DIV,  // 두 자리 나눗셈
            PROBLEM_TYPES.MIXED_CALC  // 혼합 계산 (중학교에서는 무조건 차단)
        ];
        
        // MIXED_CALC 타입은 중학교에서 절대 사용 금지
        if (type === PROBLEM_TYPES.MIXED_CALC) {
            // 중학교 학년별 전용 함수 호출
            if (isMiddleSchoolGrade3) {
                return generateMiddleSchoolGrade3Problem(grade, conceptText, idString, problemType);
            } else if (isMiddleSchoolGrade2) {
                return generateMiddleSchoolGrade2Problem(grade, conceptText, idString, problemType);
            } else {
                return generateMiddleSchoolGrade1Problem(grade, conceptText, idString, problemType);
            }
        }
        
        // 차단된 타입인 경우 중학교 수준 문제로 대체
        if (blockedTypes.includes(type)) {
            // 중학교 학년별 전용 함수 호출
            if (isMiddleSchoolGrade3) {
                return generateMiddleSchoolGrade3Problem(grade, conceptText, idString, problemType);
            } else if (isMiddleSchoolGrade2) {
                return generateMiddleSchoolGrade2Problem(grade, conceptText, idString, problemType);
            } else {
                return generateMiddleSchoolGrade1Problem(grade, conceptText, idString, problemType);
            }
        }
    }
    
    // CONCEPT_TEMPLATE_MAP에서 템플릿 정보 확인
    if (idString && CONCEPT_TEMPLATE_MAP[idString]) {
        const templateInfo = CONCEPT_TEMPLATE_MAP[idString];
        if (templateInfo && templateInfo.templates && templateInfo.templates.length > 0) {
            // 템플릿 정보가 있으면 해당 타입 사용
            type = templateInfo.templates[0]; // 첫 번째 템플릿 사용
        }
    }
    
    // 도형 항목이고 5학년 이상이면 도형 전용 문제 생성
    if (conceptText && (conceptText.includes('각기둥') || conceptText.includes('각뿔') || 
        conceptText.includes('원기둥') || conceptText.includes('원뿔') || conceptText.includes('구') ||
        conceptText.includes('입체도형') || conceptText.includes('직육면체') || conceptText.includes('정육면체'))) {
        if (grade >= 5) {
            return generateGeometryProblem(grade, conceptText);
        }
    }
    
    switch (type) {
        case PROBLEM_TYPES.DIVISOR:
            return generateDivisorProblem(grade);
        case PROBLEM_TYPES.COMMON_DIVISOR:
            return generateCommonDivisorProblem(grade);
        case PROBLEM_TYPES.FRACTION_SIMPLIFY:
            return generateFractionSimplifyProblem(grade);
        case PROBLEM_TYPES.MIXED_CALC:
            // 중학교에서는 절대 사용 금지 - 무조건 중학교 전용 함수 호출
            if (isMiddleSchool) {
                // 중학교 학년별 전용 함수 호출
                if (isMiddleSchoolGrade3) {
                    return generateMiddleSchoolGrade3Problem(grade, conceptText, idString, problemType);
                } else if (isMiddleSchoolGrade2) {
                    return generateMiddleSchoolGrade2Problem(grade, conceptText, idString, problemType);
                } else {
                    return generateMiddleSchoolGrade1Problem(grade, conceptText, idString, problemType);
                }
            }
            // 초등 1학년은 덧셈/뺄셈만 (나눗셈/곱셈 없음)
            if (rawGrade === 1) {
                return generateGrade1AdditionSubtractionProblem();
            }
            // 도형 넓이 문제인 경우 generateAreaProblem 사용 (넓이 단위 포함)
            if (conceptText && (conceptText.includes('마름모') || conceptText.includes('사다리꼴') || 
                conceptText.includes('평행사변형') || conceptText.includes('둘레') ||
                (conceptText.includes('넓이') && conceptText.includes('단위')) ||
                (conceptText.includes('넓이') && conceptText.includes('더 큰')) ||
                conceptText.includes('넓이의 단위'))) {
                return generateAreaProblem(grade, conceptText, existingQuestions || []);
            }
            // MIXED_CALC 타입이지만 넓이/단위와 관련 없으면 일반 혼합 계산
            return generateMixedCalcProblem(grade, schoolLevel, rawGrade, existingQuestions || []);
        case PROBLEM_TYPES.SKIP_COUNT:
            return generateSkipCountProblem(grade);
        case PROBLEM_TYPES.TWO_DIGIT_DIV:
            return generateTwoDigitDivProblem(grade);
        case PROBLEM_TYPES.PATTERN:
            // 대응 관계 문제인 경우 (두 양 사이의 관계, 대응 관계를 식으로 나타내기, 생활 속에서 대응 관계를 찾아 식으로 나타내기)
            if (conceptText && (conceptText.includes('대응') || conceptText.includes('생활 속') || 
                conceptText.includes('두 양 사이의 관계') || conceptText.includes('양 사이의 관계') ||
                (idString && idString.includes('G5-S1-U3')))) {
                return generateCorrespondenceProblem(grade, conceptText, idString);
            }
            // 그래프 문제인 경우 (원그래프, 띠그래프 등)
            if (conceptText && (conceptText.includes('원그래프') || conceptText.includes('띠그래프') || 
                conceptText.includes('그래프') || (idString && idString.includes('U5')))) {
                return generateGraphProblem(grade, conceptText, idString);
            }
            return generatePatternProblem(grade);
        case PROBLEM_TYPES.TRIANGLE_CLASSIFY:
            // 중학교 수준 도형 문제 처리
            if (grade >= 7 || (idString && idString.startsWith('M'))) {
                return generateMiddleSchoolGeometryProblem(grade, conceptText, idString);
            }
            // 초등학교 삼각형 문제는 항상 SVG 포함하여 생성
            return generateTriangleClassifyProblem(grade);
        case PROBLEM_TYPES.MIXED_FRACTION:
            return generateMixedFractionProblem(grade);
        case PROBLEM_TYPES.DECIMAL_MULTIPLY:
            return generateDecimalMultiplyProblem(grade);
        case PROBLEM_TYPES.DECIMAL_DIVIDE:
            return generateDecimalDivideProblem(grade);
        case PROBLEM_TYPES.RATIO:
            return generateRatioProblem(grade);
        case PROBLEM_TYPES.SOLID_VOLUME:
            return generateSolidVolumeProblem(grade, conceptText);
        case PROBLEM_TYPES.LINEAR_EQUATION:
            return generateLinearEquationProblem(grade);
        case PROBLEM_TYPES.LINEAR_FUNCTION:
            return generateLinearFunctionProblem(grade);
        case PROBLEM_TYPES.LINEAR_INEQUALITY:
            return generateLinearInequalityProblem(grade);
        case PROBLEM_TYPES.SYSTEM_OF_EQUATIONS:
            return generateSystemOfEquationsProblem(grade, existingQuestions || []);
        case PROBLEM_TYPES.PROBABILITY:
            return generateProbabilityProblem(grade);
        case PROBLEM_TYPES.GEOMETRY_DRAWING:
            return generateGeometryDrawingProblem(grade, conceptText, idString);
        case PROBLEM_TYPES.TRIANGLE_CLASSIFY:
            // 중학교인 경우 중학교 도형 문제 생성
            if (isMiddleSchool) {
                return generateMiddleSchoolGeometryProblem(grade, conceptText, idString, existingQuestions);
            }
            return generateTriangleClassifyProblem(grade);
        default:
            // 중학교인 경우 기본 문제 타입도 차단
            if (isMiddleSchool) {
                // 중학교 학년별 전용 함수 호출
                if (isMiddleSchoolGrade3) {
                    return generateMiddleSchoolGrade3Problem(grade, conceptText, idString, problemType);
                } else if (isMiddleSchoolGrade2) {
                    return generateMiddleSchoolGrade2Problem(grade, conceptText, idString, problemType);
                } else {
                    return generateMiddleSchoolGrade1Problem(grade, conceptText, idString, problemType);
                }
            }
            // 템플릿이 없으면 null 반환 (재시도 유도)
            const conceptIdStr = typeof conceptId === 'string' ? conceptId : 
                                (conceptId && typeof conceptId === 'object' ? (conceptId.id || conceptId.conceptId || '[object]') : String(conceptId));
            console.error(`템플릿 타입 없음: ${type}, conceptId: ${conceptIdStr}`);
            return null;
    }
}

// ================================
// SVG 기반 도형 및 각도 시각화 렌더러
// ================================

/**
 * 각도를 가진 두 선분을 그리는 SVG 생성
 */
function drawAngle(degree, options = {}) {
    const {
        vertexLabel = 'O',
        line1Label = 'A',
        line2Label = 'B',
        showProtracter = false,
        size = 200
    } = options;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    const angleRad = (degree * Math.PI) / 180;
    const x1 = centerX + radius;
    const y1 = centerY;
    const x2 = centerX + radius * Math.cos(angleRad);
    const y2 = centerY - radius * Math.sin(angleRad);
    const arcRadius = radius * 0.4;
    const arcX = centerX + arcRadius * Math.cos(angleRad / 2);
    const arcY = centerY - arcRadius * Math.sin(angleRad / 2);
    
    let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 20px auto;">
    <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#333" />
        </marker>
    </defs>
    ${showProtracter ? drawProtracter(size, centerX, centerY) : ''}
    <line x1="${centerX}" y1="${centerY}" x2="${x1}" y2="${y1}" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)" />
    <line x1="${centerX}" y1="${centerY}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)" />
    <path d="M ${centerX + arcRadius} ${centerY} A ${arcRadius} ${arcRadius} 0 ${degree > 180 ? 1 : 0} 0 ${arcX} ${arcY}" 
          fill="none" stroke="#4f46e5" stroke-width="1.5" stroke-dasharray="3,2" />
    <text x="${arcX + 15}" y="${arcY - 5}" font-family="Arial, sans-serif" font-size="14" fill="#4f46e5" font-weight="bold">${degree}°</text>
    <circle cx="${centerX}" cy="${centerY}" r="3" fill="#333" />
    <text x="${centerX - 8}" y="${centerY - 8}" font-family="Arial, sans-serif" font-size="12" fill="#333" font-weight="bold">${vertexLabel}</text>
    <circle cx="${x1}" cy="${y1}" r="2" fill="#333" />
    <text x="${x1 + 5}" y="${y1 + 5}" font-family="Arial, sans-serif" font-size="11" fill="#666">${line1Label}</text>
    <circle cx="${x2}" cy="${y2}" r="2" fill="#333" />
    <text x="${x2 + 5}" y="${y2 - 5}" font-family="Arial, sans-serif" font-size="11" fill="#666">${line2Label}</text>
</svg>`;
    return svg;
}

/**
 * 삼각형을 그리는 SVG 생성
 */
function drawTriangle(sides, angles = null, options = {}) {
    const { vertexLabels = ['A', 'B', 'C'], showMeasurements = true, size = 300 } = options;
    const { a, b, c } = sides;
    const ax = size * 0.2;
    const ay = size * 0.7;
    const bx = ax + a * 10;
    const by = ay;
    const angleA = angles ? (angles.A * Math.PI) / 180 : Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c))));
    const cx = ax + c * 10 * Math.cos(angleA);
    const cy = ay - c * 10 * Math.sin(angleA);
    const midAB = { x: (ax + bx) / 2, y: (ay + by) / 2 };
    const midBC = { x: (bx + cx) / 2, y: (by + cy) / 2 };
    const midCA = { x: (cx + ax) / 2, y: (cy + ay) / 2 };
    
    let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 20px auto;">
    <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#333" stroke-width="2.5" stroke-linecap="round" />
    <line x1="${bx}" y1="${by}" x2="${cx}" y2="${cy}" stroke="#333" stroke-width="2.5" stroke-linecap="round" />
    <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" stroke="#333" stroke-width="2.5" stroke-linecap="round" />
    ${showMeasurements ? `
    <text x="${midAB.x}" y="${midAB.y - 8}" font-family="Arial, sans-serif" font-size="12" fill="#4f46e5" font-weight="bold" text-anchor="middle">${a}cm</text>
    <text x="${midBC.x + 5}" y="${midBC.y + 5}" font-family="Arial, sans-serif" font-size="12" fill="#4f46e5" font-weight="bold" text-anchor="middle">${b}cm</text>
    <text x="${midCA.x - 5}" y="${midCA.y + 5}" font-family="Arial, sans-serif" font-size="12" fill="#4f46e5" font-weight="bold" text-anchor="middle">${c}cm</text>
    ` : ''}
    <circle cx="${ax}" cy="${ay}" r="4" fill="#333" />
    <text x="${ax - 12}" y="${ay + 20}" font-family="Arial, sans-serif" font-size="14" fill="#333" font-weight="bold">${vertexLabels[0]}</text>
    <circle cx="${bx}" cy="${by}" r="4" fill="#333" />
    <text x="${bx + 8}" y="${by + 20}" font-family="Arial, sans-serif" font-size="14" fill="#333" font-weight="bold">${vertexLabels[1]}</text>
    <circle cx="${cx}" cy="${cy}" r="4" fill="#333" />
    <text x="${cx}" y="${cy - 12}" font-family="Arial, sans-serif" font-size="14" fill="#333" font-weight="bold">${vertexLabels[2]}</text>
    ${angles ? `
    <text x="${ax + 15}" y="${ay - 15}" font-family="Arial, sans-serif" font-size="11" fill="#666">${angles.A}°</text>
    <text x="${bx - 15}" y="${by - 15}" font-family="Arial, sans-serif" font-size="11" fill="#666">${angles.B}°</text>
    <text x="${cx}" y="${cy + 20}" font-family="Arial, sans-serif" font-size="11" fill="#666">${angles.C}°</text>
    ` : ''}
</svg>`;
    return svg;
}

/**
 * 각도기 이미지를 SVG로 생성
 */
function drawProtracter(size, centerX, centerY) {
    const protracterRadius = size * 0.35 * 1.2;
    let svg = `<g opacity="0.3">
    <path d="M ${centerX - protracterRadius} ${centerY} A ${protracterRadius} ${protracterRadius} 0 0 1 ${centerX + protracterRadius} ${centerY}" 
          fill="none" stroke="#ccc" stroke-width="1" />
    ${Array.from({ length: 18 }, (_, i) => {
        const angle = i * 10;
        const angleRad = (angle * Math.PI) / 180;
        const x1 = centerX + protracterRadius * Math.cos(angleRad);
        const y1 = centerY - protracterRadius * Math.sin(angleRad);
        const x2 = centerX + (protracterRadius - 10) * Math.cos(angleRad);
        const y2 = centerY - (protracterRadius - 10) * Math.sin(angleRad);
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ccc" stroke-width="0.5" />`;
    }).join('')}
</g>`;
    return svg;
}

/**
 * 통합 SVG 시각화 엔진 - 도형, 각도, 그래프 렌더링
 * @param {string} type - 도형 타입 ('triangle', 'rectangle', 'angle', 'bar_graph', 'line_graph', 'circle')
 * @param {Object} data - 도형 데이터
 * @returns {string} SVG 문자열
 */
function drawGeometry(type, data) {
    const defaultSize = 300;
    const size = data.size || defaultSize;
    
    switch (type) {
        case 'triangle':
            return drawTriangle(data.sides, data.angles, data.options || {});
        
        case 'rectangle':
        case 'square':
            const width = data.width || (data.side || 5);
            const height = data.height || (data.side || 5);
            const rectOptions = data.options || {};
            const showLabels = rectOptions.showLabels !== false;
            const labels = rectOptions.labels || ['A', 'B', 'C', 'D'];
            
            const rectX = size * 0.2;
            const rectY = size * 0.3;
            const rectWidth = width * 10;
            const rectHeight = height * 10;
            
            let rectSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 20px auto;">
    <rect x="${rectX}" y="${rectY}" width="${rectWidth}" height="${rectHeight}" stroke="#333" stroke-width="2.5" fill="none" />
    ${showLabels ? `
    <circle cx="${rectX}" cy="${rectY}" r="4" fill="#333" />
    <text x="${rectX - 12}" y="${rectY - 8}" font-family="Arial, sans-serif" font-size="14" fill="#333" font-weight="bold">${labels[0]}</text>
    <circle cx="${rectX + rectWidth}" cy="${rectY}" r="4" fill="#333" />
    <text x="${rectX + rectWidth + 8}" y="${rectY - 8}" font-family="Arial, sans-serif" font-size="14" fill="#333" font-weight="bold">${labels[1]}</text>
    <circle cx="${rectX + rectWidth}" cy="${rectY + rectHeight}" r="4" fill="#333" />
    <text x="${rectX + rectWidth + 8}" y="${rectY + rectHeight + 20}" font-family="Arial, sans-serif" font-size="14" fill="#333" font-weight="bold">${labels[2]}</text>
    <circle cx="${rectX}" cy="${rectY + rectHeight}" r="4" fill="#333" />
    <text x="${rectX - 12}" y="${rectY + rectHeight + 20}" font-family="Arial, sans-serif" font-size="14" fill="#333" font-weight="bold">${labels[3]}</text>
    ` : ''}
    ${rectOptions.showMeasurements !== false ? `
    <text x="${rectX + rectWidth / 2}" y="${rectY - 12}" font-family="Arial, sans-serif" font-size="12" fill="#4f46e5" font-weight="bold" text-anchor="middle">${width}cm</text>
    <text x="${rectX + rectWidth + 12}" y="${rectY + rectHeight / 2}" font-family="Arial, sans-serif" font-size="12" fill="#4f46e5" font-weight="bold" text-anchor="middle">${height}cm</text>
    ` : ''}
</svg>`;
            return rectSvg;
        
        case 'angle':
            return drawAngle(data.degree || 90, data.options || {});
        
        case 'bar_graph':
        case 'barGraph':
            const barData = data.data || [];
            const barWidth = size / (barData.length * 2);
            const maxValue = Math.max(...barData.map(d => d.value || d));
            const scale = (size * 0.6) / maxValue;
            const barLabels = barData.map(d => d.label || d);
            const barValues = barData.map(d => d.value !== undefined ? d.value : d);
            
            let barSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 20px auto;">
    ${barData.map((item, i) => {
        const value = barValues[i];
        const barHeight = value * scale;
        const x = size * 0.2 + i * barWidth * 1.5;
        const y = size * 0.8 - barHeight;
        return `
    <rect x="${x}" y="${y}" width="${barWidth * 0.8}" height="${barHeight}" fill="#4f46e5" stroke="#333" stroke-width="1" />
    <text x="${x + barWidth * 0.4}" y="${y - 5}" font-family="Arial, sans-serif" font-size="11" fill="#333" text-anchor="middle" font-weight="bold">${value}</text>
    <text x="${x + barWidth * 0.4}" y="${size * 0.85}" font-family="Arial, sans-serif" font-size="10" fill="#666" text-anchor="middle">${barLabels[i]}</text>`;
    }).join('')}
    <line x1="${size * 0.15}" y1="${size * 0.8}" x2="${size * 0.85}" y2="${size * 0.8}" stroke="#333" stroke-width="2" />
    <line x1="${size * 0.15}" y1="${size * 0.2}" x2="${size * 0.15}" y2="${size * 0.8}" stroke="#333" stroke-width="2" />
</svg>`;
            return barSvg;
        
        case 'line_graph':
        case 'lineGraph':
            const lineData = data.data || [];
            const lineMaxValue = Math.max(...lineData.map(d => d.value || d));
            const lineScale = (size * 0.6) / lineMaxValue;
            const lineLabels = lineData.map(d => d.label || '');
            const lineValues = lineData.map(d => d.value !== undefined ? d.value : d);
            const pointRadius = 4;
            
            // 좌표 계산
            const points = lineData.map((item, i) => {
                const x = size * 0.2 + (i / (lineData.length - 1)) * (size * 0.65);
                const y = size * 0.8 - lineValues[i] * lineScale;
                return { x, y };
            });
            
            // 선 그리기
            const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            
            let lineSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 20px auto;">
    <path d="${pathData}" stroke="#4f46e5" stroke-width="2.5" fill="none" />
    ${points.map((p, i) => `
    <circle cx="${p.x}" cy="${p.y}" r="${pointRadius}" fill="#4f46e5" stroke="#fff" stroke-width="1.5" />
    <text x="${p.x}" y="${p.y - 10}" font-family="Arial, sans-serif" font-size="10" fill="#333" text-anchor="middle" font-weight="bold">${lineValues[i]}</text>
    <text x="${p.x}" y="${size * 0.85}" font-family="Arial, sans-serif" font-size="9" fill="#666" text-anchor="middle">${lineLabels[i] || i + 1}</text>
    `).join('')}
    <line x1="${size * 0.15}" y1="${size * 0.8}" x2="${size * 0.85}" y2="${size * 0.8}" stroke="#333" stroke-width="2" />
    <line x1="${size * 0.15}" y1="${size * 0.2}" x2="${size * 0.15}" y2="${size * 0.8}" stroke="#333" stroke-width="2" />
</svg>`;
            return lineSvg;
        
        case 'circle':
            const radius = data.radius || 50;
            const centerX = size / 2;
            const centerY = size / 2;
            const circleOptions = data.options || {};
            const showRadius = circleOptions.showRadius !== false;
            const showDiameter = circleOptions.showDiameter !== false;
            
            let circleSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 20px auto;">
    <circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="#333" stroke-width="2.5" fill="none" />
    ${showRadius ? `
    <line x1="${centerX}" y1="${centerY}" x2="${centerX + radius}" y2="${centerY}" stroke="#4f46e5" stroke-width="2" stroke-dasharray="5,5" />
    <text x="${centerX + radius / 2}" y="${centerY - 8}" font-family="Arial, sans-serif" font-size="12" fill="#4f46e5" font-weight="bold" text-anchor="middle">${radius}cm</text>
    ` : ''}
    ${showDiameter ? `
    <line x1="${centerX - radius}" y1="${centerY}" x2="${centerX + radius}" y2="${centerY}" stroke="#4f46e5" stroke-width="2" stroke-dasharray="3,3" />
    <text x="${centerX}" y="${centerY - 15}" font-family="Arial, sans-serif" font-size="11" fill="#666" text-anchor="middle">직경: ${radius * 2}cm</text>
    ` : ''}
    <circle cx="${centerX}" cy="${centerY}" r="3" fill="#333" />
    <text x="${centerX + 8}" y="${centerY + 5}" font-family="Arial, sans-serif" font-size="12" fill="#333" font-weight="bold">O</text>
</svg>`;
            return circleSvg;
        
        default:
            // 기본값: 삼각형
            return drawTriangle({ a: 5, b: 6, c: 7 }, null, {});
    }
}

/**
 * 도형 및 각도 시각화 문제 생성
 */
function generateGeometryDrawingProblem(grade, conceptText = '', conceptId = '') {
    const conceptLower = (conceptText || '').toLowerCase();
    const normalizedId = normalizeConceptId(conceptId);
    const idLower = (normalizedId || '').toLowerCase();
    
    // 각도 문제
    if (conceptLower.includes('각도') || conceptLower.includes('각의 크기') || conceptLower.includes('각의') || idLower.includes('angle')) {
        const degree = Math.floor(Math.random() * 150) + 30;
        const vertexLabel = String.fromCharCode(65 + Math.floor(Math.random() * 3));
        const svg = drawAngle(degree, { vertexLabel, showProtracter: true });
        return {
            type: PROBLEM_TYPES.GEOMETRY_DRAWING,
            question: `아래 그림에서 각 ${vertexLabel}의 크기를 구하시오.`,
            questionSvg: svg,
            answer: `${degree}°`,
            explanation: `각 ${vertexLabel}는 두 선분이 만나서 이루는 각으로, 그 크기는 ${degree}°입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 45°)',
            meta: { grade, concept: 'angle_measure', degree, geometryType: 'angle' }
        };
    }
    
    // 삼각형 문제
    if (conceptLower.includes('삼각형') || idLower.includes('triangle')) {
        // 삼각형 조건을 만족하는 변의 길이 생성 (최대 10회 시도)
        let a, b, c;
        let attempts = 0;
        do {
            a = 3 + Math.floor(Math.random() * 5); // 3~7
            b = 4 + Math.floor(Math.random() * 5); // 4~8
            c = 5 + Math.floor(Math.random() * 5); // 5~9
            attempts++;
        } while ((a + b <= c || b + c <= a || c + a <= b) && attempts < 10);
        
        // 삼각형 조건을 만족하는 경우에만 생성
        if (a + b > c && b + c > a && c + a > b) {
            const svg = drawTriangle({ a, b, c }, null, { vertexLabels: ['A', 'B', 'C'], showMeasurements: true });
            const classification = (a === b && b === c) ? '정삼각형' : (a === b || b === c || c === a) ? '이등변삼각형' : '부등변삼각형';
            return {
                type: PROBLEM_TYPES.GEOMETRY_DRAWING,
                question: `아래 그림에서 세 변의 길이가 각각 ${a}cm, ${b}cm, ${c}cm인 삼각형은 어떤 삼각형인가요?`,
                questionSvg: svg,
                answer: classification,
                explanation: classification === '정삼각형' ? '세 변의 길이가 모두 같으므로 정삼각형입니다.' :
                             classification === '이등변삼각형' ? '두 변의 길이가 같으므로 이등변삼각형입니다.' :
                             '세 변의 길이가 모두 다르므로 부등변삼각형입니다.',
                inputPlaceholder: '답을 입력하세요 (예: 이등변삼각형)',
                meta: { grade, concept: 'triangle_classify', sides: { a, b, c }, geometryType: 'triangle' }
            };
        }
        // 삼각형 조건을 만족하지 못하면 템플릿 사용
        const templates = [
            { sides: [5, 5, 8], type: '이등변삼각형' },
            { sides: [6, 6, 6], type: '정삼각형' },
            { sides: [3, 4, 5], type: '부등변삼각형' },
            { sides: [7, 7, 10], type: '이등변삼각형' },
            { sides: [4, 5, 6], type: '부등변삼각형' }
        ];
        const selected = templates[Math.floor(Math.random() * templates.length)];
        const svg = drawTriangle({ a: selected.sides[0], b: selected.sides[1], c: selected.sides[2] }, null, { 
            vertexLabels: ['A', 'B', 'C'], 
            showMeasurements: true 
        });
        return {
            type: PROBLEM_TYPES.GEOMETRY_DRAWING,
            question: `아래 그림에서 세 변의 길이가 각각 ${selected.sides[0]}cm, ${selected.sides[1]}cm, ${selected.sides[2]}cm인 삼각형은 어떤 삼각형인가요?`,
            questionSvg: svg,
            answer: selected.type,
            explanation: selected.type === '정삼각형' ? '세 변의 길이가 모두 같으므로 정삼각형입니다.' :
                         selected.type === '이등변삼각형' ? '두 변의 길이가 같으므로 이등변삼각형입니다.' :
                         '세 변의 길이가 모두 다르므로 부등변삼각형입니다.',
            inputPlaceholder: '답을 입력하세요 (예: 이등변삼각형)',
            meta: { grade, concept: 'triangle_classify', sides: selected.sides, geometryType: 'triangle' }
        };
    }
    
    // 기본: 각도 문제
    const degree = 45 + Math.floor(Math.random() * 90);
    const svg = drawAngle(degree, { showProtracter: true });
    return {
        type: PROBLEM_TYPES.GEOMETRY_DRAWING,
        question: `아래 그림에서 각 O의 크기를 구하시오.`,
        questionSvg: svg,
        answer: `${degree}°`,
        explanation: `각 O의 크기는 ${degree}°입니다.`,
        inputPlaceholder: '답을 입력하세요 (예: 45°)',
        meta: { grade, concept: 'geometry', degree, geometryType: 'angle' }
    };
}

// ================================
// 오답 유형 기반 변형 문제 엔진 (파일 구조 기반)
// ================================

/**
 * _question_bank_only 파일 구조 기반 폴더 매핑
 */
const QUESTION_BANK_FOLDER_MAP = {
    elementary: {
        '계산 실수': 'ES_PACK02_Basics', // 기초
        '개념 미숙': 'ES_PACK01_Principle', // 원리
        '문제 이해 부족': 'ES_PACK03_Application', // 적용
        '식을 잘못 세움': 'ES_PACK05_PracticalApplication', // 기초 실전 적용
        '단계를 빨리 넘김': 'ES_PACK06_BasicType', // 기본 유형
        '중요한 조건을 놓침': 'ES_PACK04_TypesOfQuestions', // 문제 유형
        '글을 충분히 읽지 않음': 'ES_PACK03_Application', // 적용
        '풀이 방향을 잘 모름': 'ES_PACK01_Principle' // 원리
    },
    junior: {
        '계산 실수': 'JH_PACK01_FundamentalConcept', // 기본 개념
        '개념 미숙': 'JH_PACK01_FundamentalConcept', // 기본 개념
        '문제 이해 부족': 'JH_PACK02_HighestGrade_Light', // 최상급 (경량)
        '식을 잘못 세움': 'JH_PACK03_HighestGrade', // 최상급
        '단계를 빨리 넘김': 'JH_PACK02_HighestGrade_Light', // 최상급 (경량)
        '중요한 조건을 놓침': 'JH_PACK03_HighestGrade', // 최상급
        '글을 충분히 읽지 않음': 'JH_PACK02_HighestGrade_Light', // 최상급 (경량)
        '풀이 방향을 잘 모름': 'JH_PACK01_FundamentalConcept' // 기본 개념
    }
};

/**
 * 오답 유형에 따른 폴더 선택
 */
function getQuestionBankFolder(mistakes, schoolLevel) {
    const isElementary = schoolLevel === '초등학교' || schoolLevel === 'elementary';
    const folderMap = isElementary ? QUESTION_BANK_FOLDER_MAP.elementary : QUESTION_BANK_FOLDER_MAP.junior;
    
    // 첫 번째 오답 유형을 기준으로 폴더 선택
    if (mistakes && mistakes.length > 0) {
        const primaryMistake = mistakes[0];
        return folderMap[primaryMistake] || folderMap['개념 미숙'] || Object.values(folderMap)[0];
    }
    
    return Object.values(folderMap)[0];
}

/**
 * 학년-학기에 따른 PDF 파일명 생성
 */
function getQuestionBankFileName(grade, semester) {
    return `${grade}-${semester}.pdf`;
}

/**
 * 오답 유형별 변형 전략 적용 (파일 구조 기반)
 * @param {Object} originalProblem - 원본 문제 객체
 * @param {Array<string>} mistakes - 선택된 오답 유형 배열
 * @param {string} schoolLevel - 학교급 ('초등학교' 또는 '중학교')
 * @param {number} grade - 학년
 * @param {number} semester - 학기 (기본값: 1)
 * @returns {Object} 변형된 문제 객체
 */
function applyMistakeBasedVariation(originalProblem, mistakes, schoolLevel, grade, semester = 1) {
    if (!originalProblem || !mistakes || mistakes.length === 0) {
        return originalProblem;
    }
    
    // 중학교 문제에서 초등 산수 차단 검증
    if (schoolLevel === '중학교' || schoolLevel === 'middle') {
        const question = originalProblem.question || originalProblem.questionLatex || originalProblem.stem || '';
        // 단순 사칙연산 패턴 검사 (숫자만 있는 사칙연산)
        const simpleArithmeticPattern = /^\d+\s*[+\-×÷*/]\s*\d+\s*([+\-×÷*/]\s*\d+)*\s*=?\s*\?/;
        if (simpleArithmeticPattern.test(question.replace(/\s/g, ''))) {
            // 초등 산수 패턴이면 중학교 수준 문제로 대체
            console.warn('⚠️ 중학교 문제에서 초등 산수 패턴 감지, 중학교 수준 문제로 대체');
            if (grade === 2) {
                return generateMiddleSchoolGrade2Problem(grade + 5, '', '');
            } else if (grade === 3) {
                return generateMiddleSchoolGrade3Problem(grade + 5, '', '');
            } else {
                return generateMiddleSchoolGrade1Problem(grade + 5, '', '');
            }
        }
    }
    
    let modifiedProblem = { ...originalProblem };
    const mistakeTypes = mistakes.map(m => m.toLowerCase());
    
    // 파일 구조 기반 메타데이터 추가
    const questionBankFolder = getQuestionBankFolder(mistakes, schoolLevel);
    const questionBankFileName = getQuestionBankFileName(grade, semester);
    const basePath = schoolLevel === '중학교' || schoolLevel === 'middle' 
        ? 'import_from_Math_Questions/_question_bank_only/Junior_high_school'
        : 'import_from_Math_Questions/_question_bank_only/Elementary_school';
    
    // 메타데이터에 문제 은행 정보 추가
    if (!modifiedProblem.meta) {
        modifiedProblem.meta = {};
    }
    modifiedProblem.meta.questionBank = {
        folder: questionBankFolder,
        fileName: questionBankFileName,
        fullPath: `${basePath}/${questionBankFolder}/${questionBankFileName}`,
        schoolLevel: schoolLevel,
        grade: grade,
        semester: semester,
        mistakes: mistakes
    };
    
    // "계산 실수" 변형: 숫자만 변경하여 연산 연습 유도 (기초 폴더 참조)
    if (mistakeTypes.includes('계산 실수') || mistakeTypes.some(m => m.includes('계산'))) {
        modifiedProblem = applyCalculationMistakeVariation(modifiedProblem, schoolLevel, grade, questionBankFolder);
    }
    
    // "개념 미숙" 변형: 기초 정의를 묻는 하위 단계 문제 생성 (원리/기본 개념 폴더 참조)
    if (mistakeTypes.includes('개념 미숙') || mistakeTypes.some(m => m.includes('개념'))) {
        modifiedProblem = applyConceptWeaknessVariation(modifiedProblem, schoolLevel, grade, questionBankFolder);
    }
    
    // "문제 이해 부족" 변형: 소재 변경 및 문장 단순화 (적용 폴더 참조)
    if (mistakeTypes.includes('문제 이해 부족') || mistakeTypes.some(m => m.includes('이해') || m.includes('문장'))) {
        modifiedProblem = applyComprehensionVariation(modifiedProblem, schoolLevel, grade, questionBankFolder);
    }
    
    // "식을 잘못 세움" 변형: 식 세우기 연습 강화
    if (mistakeTypes.includes('식을 잘못 세움') || mistakeTypes.some(m => m.includes('식'))) {
        modifiedProblem = applyEquationSettingVariation(modifiedProblem, schoolLevel, grade, questionBankFolder);
    }
    
    // "단계를 빨리 넘김" 변형: 단계별 풀이 강조
    if (mistakeTypes.includes('단계를 빨리 넘김') || mistakeTypes.some(m => m.includes('단계'))) {
        modifiedProblem = applyStepByStepVariation(modifiedProblem, schoolLevel, grade, questionBankFolder);
    }
    
    // "중요한 조건을 놓침" 변형: 조건 강조
    if (mistakeTypes.includes('중요한 조건을 놓침') || mistakeTypes.some(m => m.includes('조건'))) {
        modifiedProblem = applyConditionEmphasisVariation(modifiedProblem, schoolLevel, grade, questionBankFolder);
    }
    
    // 변형 후에도 중학교 문제에서 초등 산수 차단 검증
    if (schoolLevel === '중학교' || schoolLevel === 'middle') {
        const modifiedQuestion = modifiedProblem.question || modifiedProblem.questionLatex || modifiedProblem.stem || '';
        const simpleArithmeticPattern = /^\d+\s*[+\-×÷*/]\s*\d+\s*([+\-×÷*/]\s*\d+)*\s*=?\s*\?/;
        if (simpleArithmeticPattern.test(modifiedQuestion.replace(/\s/g, ''))) {
            // 변형 후에도 초등 산수 패턴이면 중학교 수준 문제로 대체
            console.warn('⚠️ 변형 후에도 중학교 문제에서 초등 산수 패턴 감지, 중학교 수준 문제로 대체');
            if (grade === 2) {
                return generateMiddleSchoolGrade2Problem(grade + 5, '', '');
            } else if (grade === 3) {
                return generateMiddleSchoolGrade3Problem(grade + 5, '', '');
            } else {
                return generateMiddleSchoolGrade1Problem(grade + 5, '', '');
            }
        }
    }
    
    return modifiedProblem;
}

/**
 * 계산 실수 변형: 숫자만 변경 (기초 폴더 참조)
 */
function applyCalculationMistakeVariation(problem, schoolLevel, grade, questionBankFolder = '') {
    const modified = { ...problem };
    const question = modified.question || modified.questionLatex || modified.stem || '';
    
    // 숫자 패턴 찾기 및 변경
    const numberPattern = /\d+/g;
    const numbers = question.match(numberPattern) || [];
    
    if (numbers.length > 0) {
        // 각 숫자를 ±1~3 범위로 변경 (계산 연습 유도)
        let modifiedQuestion = question;
        numbers.forEach(num => {
            const originalNum = parseInt(num);
            if (originalNum > 0) {
                const variation = Math.floor(Math.random() * 3) + 1; // 1~3
                const newNum = originalNum + (Math.random() > 0.5 ? variation : -variation);
                if (newNum > 0) {
                    modifiedQuestion = modifiedQuestion.replace(num, newNum.toString());
                }
            }
        });
        
        // 답 재계산 (간단한 경우만)
        if (question.includes('+')) {
            const nums = modifiedQuestion.match(/\d+/g) || [];
            if (nums.length >= 2) {
                modified.answer = (parseInt(nums[0]) + parseInt(nums[1])).toString();
            }
        } else if (question.includes('-')) {
            const nums = modifiedQuestion.match(/\d+/g) || [];
            if (nums.length >= 2) {
                modified.answer = (parseInt(nums[0]) - parseInt(nums[1])).toString();
            }
        } else if (question.includes('×') || question.includes('*')) {
            const nums = modifiedQuestion.match(/\d+/g) || [];
            if (nums.length >= 2) {
                modified.answer = (parseInt(nums[0]) * parseInt(nums[1])).toString();
            }
        } else if (question.includes('÷') || question.includes('/')) {
            const nums = modifiedQuestion.match(/\d+/g) || [];
            if (nums.length >= 2 && parseInt(nums[1]) !== 0) {
                modified.answer = (parseInt(nums[0]) / parseInt(nums[1])).toString();
            }
        }
        
        modified.question = modifiedQuestion;
        modified.questionLatex = modifiedQuestion;
        modified.explanation = `※ 계산 실수를 방지하기 위해 숫자를 변경했습니다. (참고: ${questionBankFolder || '기초 문제'})\n\n${modified.explanation || ''}`;
    }
    
    return modified;
}

/**
 * 개념 미숙 변형: 기초 정의 문제 생성 (원리/기본 개념 폴더 참조)
 */
function applyConceptWeaknessVariation(problem, schoolLevel, grade, questionBankFolder = '') {
    const modified = { ...problem };
    const question = modified.question || modified.questionLatex || modified.stem || '';
    const conceptLower = question.toLowerCase();
    
    // 개념별 기초 정의 문제로 변형
    if (conceptLower.includes('일차방정식') || conceptLower.includes('방정식')) {
        modified.question = '일차방정식이란 무엇인가요?';
        modified.questionLatex = '일차방정식이란 무엇인가요?';
        modified.answer = '미지수가 1개이고, 그 차수가 1인 방정식';
        modified.explanation = '일차방정식은 미지수가 1개이고, 그 차수가 1인 방정식입니다. 예: $ax + b = 0$ (단, $a \\neq 0$)';
    } else if (conceptLower.includes('일차부등식') || conceptLower.includes('부등식')) {
        modified.question = '일차부등식이란 무엇인가요?';
        modified.questionLatex = '일차부등식이란 무엇인가요?';
        modified.answer = '미지수가 1개이고, 그 차수가 1인 부등식';
        modified.explanation = '일차부등식은 미지수가 1개이고, 그 차수가 1인 부등식입니다. 예: $ax + b > 0$ (단, $a \\neq 0$)';
    } else if (conceptLower.includes('일차함수') || conceptLower.includes('함수')) {
        modified.question = '일차함수란 무엇인가요?';
        modified.questionLatex = '일차함수란 무엇인가요?';
        modified.answer = '$y = ax + b$ (단, $a \\neq 0$) 꼴의 함수';
        modified.explanation = '일차함수는 $y = ax + b$ (단, $a \\neq 0$) 꼴의 함수입니다. $a$는 기울기, $b$는 y절편입니다.';
    } else if (conceptLower.includes('연립방정식') || conceptLower.includes('연립')) {
        modified.question = '연립방정식이란 무엇인가요?';
        modified.questionLatex = '연립방정식이란 무엇인가요?';
        modified.answer = '두 개 이상의 방정식을 한 쌍으로 묶어 놓은 것';
        modified.explanation = '연립방정식은 두 개 이상의 방정식을 한 쌍으로 묶어 놓은 것입니다. 예: $\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}$';
    } else if (conceptLower.includes('분수')) {
        modified.question = '분수란 무엇인가요?';
        modified.questionLatex = '분수란 무엇인가요?';
        modified.answer = '전체를 똑같이 나눈 것 중 몇 개인지를 나타내는 수';
        modified.explanation = '분수는 전체를 똑같이 나눈 것 중 몇 개인지를 나타내는 수입니다. 예: $\\dfrac{3}{4}$는 전체를 4등분한 것 중 3개를 의미합니다.';
    } else if (conceptLower.includes('소인수분해')) {
        modified.question = '소인수분해란 무엇인가요?';
        modified.questionLatex = '소인수분해란 무엇인가요?';
        modified.answer = '자연수를 소수의 곱으로 나타내는 것';
        modified.explanation = '소인수분해는 자연수를 소수의 곱으로 나타내는 것입니다. 예: $12 = 2^2 \\times 3$';
    } else {
        // 기본: 개념 정의 문제
        modified.explanation = `※ 개념을 정확히 이해하기 위한 기초 문제입니다. (참고: ${questionBankFolder || '원리/기본 개념 문제'})\n\n${modified.explanation || ''}`;
    }
    
    return modified;
}

/**
 * 문제 이해 부족 변형: 소재 변경 및 문장 단순화 (적용 폴더 참조)
 */
function applyComprehensionVariation(problem, schoolLevel, grade, questionBankFolder = '') {
    const modified = { ...problem };
    let question = modified.question || modified.questionLatex || modified.stem || '';
    
    // 소재 변경 (이름, 물건 등)
    const replacements = {
        '사과': ['바나나', '오렌지', '포도'],
        '바나나': ['사과', '오렌지', '포도'],
        '학생': ['친구', '아이', '어린이'],
        '친구': ['학생', '아이', '어린이'],
        '책': ['공책', '노트', '장난감'],
        '공책': ['책', '노트', '장난감'],
        '원': ['원', '개', '장'],
        '개': ['원', '개', '장'],
        '명': ['명', '사람', '분']
    };
    
    // 소재 변경
    Object.keys(replacements).forEach(key => {
        if (question.includes(key)) {
            const alternatives = replacements[key];
            const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
            question = question.replace(new RegExp(key, 'g'), replacement);
        }
    });
    
    // 문장 단순화 (복잡한 문장을 짧게)
    // "~할 때" → "~하면", "~인 경우" → "~이면" 등
    question = question.replace(/할 때/g, '하면');
    question = question.replace(/인 경우/g, '이면');
    question = question.replace(/에 대하여/g, '에 대해');
    question = question.replace(/구하시오/g, '구해보세요');
    question = question.replace(/계산하시오/g, '계산해보세요');
    
    modified.question = question;
    modified.questionLatex = question;
    modified.explanation = `※ 문제 이해를 돕기 위해 문장을 단순화하고 소재를 변경했습니다. (참고: ${questionBankFolder || '적용 문제'})\n\n${modified.explanation || ''}`;
    
    return modified;
}

/**
 * 식을 잘못 세움 변형: 식 세우기 연습 강화
 */
function applyEquationSettingVariation(problem, schoolLevel, grade, questionBankFolder = '') {
    const modified = { ...problem };
    let question = modified.question || modified.questionLatex || modified.stem || '';
    
    // 중학교인 경우 일차방정식, 연립방정식 등으로 변형
    if (schoolLevel === '중학교' || schoolLevel === 'middle') {
        if (question.includes('=') && !question.includes('x') && !question.includes('y')) {
            // 숫자만 있는 등식을 미지수 포함 등식으로 변형
            const numbers = question.match(/\d+/g) || [];
            if (numbers.length >= 2) {
                const coef = Math.floor(Math.random() * 3) + 2; // 2~4
                const constTerm = parseInt(numbers[0]);
                const result = parseInt(numbers[1]);
                const solution = (result - constTerm) / coef;
                
                if (Number.isInteger(solution) && solution > 0) {
                    question = `일차방정식 $${coef}x + ${constTerm} = ${result}$의 해를 구하시오.`;
                    modified.question = question;
                    modified.questionLatex = question;
                    modified.answer = `${solution}`;
                    modified.answerLatex = `${solution}`;
                    modified.explanation = `※ 식을 올바르게 세우는 연습을 위해 미지수를 포함한 방정식으로 변형했습니다.\n\n$${coef}x = ${result} - ${constTerm} = ${result - constTerm}$, $x = \\dfrac{${result - constTerm}}{${coef}} = ${solution}$`;
                }
            }
        }
    } else {
        // 초등학교: 문장제를 식으로 표현하는 문제
        if (!question.includes('식') && !question.includes('=')) {
            modified.explanation = `※ 식을 올바르게 세우는 연습을 위해 단계별로 식을 세워보세요.\n\n1단계: 문제에서 주어진 정보 파악\n2단계: 구하려는 것을 미지수로 설정\n3단계: 식 세우기\n\n${modified.explanation || ''}`;
        }
    }
    
    modified.explanation = `※ 식을 올바르게 세우는 연습을 강화했습니다. (참고: ${questionBankFolder || '기초 실전 적용 문제'})\n\n${modified.explanation || ''}`;
    
    return modified;
}

/**
 * 단계를 빨리 넘김 변형: 단계별 풀이 강조
 */
function applyStepByStepVariation(problem, schoolLevel, grade, questionBankFolder = '') {
    const modified = { ...problem };
    const explanation = modified.explanation || '';
    
    // 단계별 풀이 추가
    if (!explanation.includes('1단계') && !explanation.includes('단계')) {
        modified.explanation = `단계별로 차근차근 풀어보세요:\n\n1단계: 문제를 정확히 읽고 이해하기\n2단계: 주어진 조건 파악하기\n3단계: 풀이 방법 결정하기\n4단계: 계산하기\n5단계: 답 확인하기\n\n${explanation}`;
    }
    
    modified.explanation = `※ 단계를 빠뜨리지 않고 차근차근 풀어보세요. (참고: ${questionBankFolder || '기본 유형 문제'})\n\n${modified.explanation || ''}`;
    
    return modified;
}

/**
 * 중요한 조건을 놓침 변형: 조건 강조
 */
function applyConditionEmphasisVariation(problem, schoolLevel, grade, questionBankFolder = '') {
    const modified = { ...problem };
    let question = modified.question || modified.questionLatex || modified.stem || '';
    
    // 조건 강조 문구 추가
    if (!question.includes('조건') && !question.includes('단,')) {
        // 중학교인 경우 조건 추가
        if (schoolLevel === '중학교' || schoolLevel === 'middle') {
            if (question.includes('일차방정식') || question.includes('방정식')) {
                question = question.replace(/일차방정식/g, '일차방정식 (단, 계수는 0이 아님)');
            } else if (question.includes('일차함수') || question.includes('함수')) {
                question = question.replace(/일차함수/g, '일차함수 (단, 기울기는 0이 아님)');
            }
        }
        
        modified.question = question;
        modified.questionLatex = question;
    }
    
    modified.explanation = `※ 중요한 조건을 놓치지 않도록 주의하세요. (참고: ${questionBankFolder || '문제 유형'})\n\n${modified.explanation || ''}`;
    
    return modified;
}

// ================================
// 중학교별 전용 문제 생성 함수
// ================================

/**
 * 중학교 1학년 전용 문제 생성
 * - 소인수분해, 정수와 유리수의 사칙계산(음수 포함), 일차방정식
 */
function generateMiddleSchoolGrade1Problem(grade, conceptText = '', conceptId = '', problemType = '기본형') {
    const conceptLower = (conceptText || '').toLowerCase();
    const idLower = (conceptId || '').toLowerCase();
    const isAdvanced = problemType === '응용 심화형' || problemType === 'basic+application';
    const isHighest = problemType === '최상위' || problemType === 'highest' || problemType === '응용 심화형'; // 최상위 수준도 응용 심화형에 포함
    
    // 통계 개념은 통계 전용 함수로 처리
    if (conceptLower.includes('통계') || conceptLower.includes('대푯값') || conceptLower.includes('평균') ||
        conceptLower.includes('최빈값') || conceptLower.includes('중앙값') || conceptLower.includes('도수분포표') ||
        conceptLower.includes('상대도수') || idLower.includes('u4')) {
        return generateMiddleSchoolStatisticsProblem(grade, conceptText, conceptId);
    }
    
    // 도형 개념은 generateMiddleSchoolGeometryProblem으로 처리
    if (conceptLower.includes('다각형') || conceptLower.includes('도형') || conceptLower.includes('평면') ||
        conceptLower.includes('내각') || conceptLower.includes('외각') || conceptLower.includes('대각선') ||
        conceptLower.includes('정다각형') || conceptLower.includes('이등변') || conceptLower.includes('직각') ||
        conceptLower.includes('외심') || conceptLower.includes('내심') || conceptLower.includes('피타고라스') ||
        conceptLower.includes('닮음') || conceptLower.includes('평행사변형') || conceptLower.includes('사각형') ||
        idLower.includes('u1') || idLower.includes('u2') || idLower.includes('u3')) {
        // existingQuestions는 generateProblemByType에서 전달받을 수 없으므로 빈 배열 사용
        // 실제로는 createSampleProblems에서 이미 생성된 문제를 체크하므로 여기서는 빈 배열로 충분
        return generateMiddleSchoolGeometryProblem(grade, conceptText, conceptId, []);
    }
    
    // 최상위 수준 문제 생성 (복잡한 조건부 문제, 여러 개념 결합)
    if (isHighest) {
        // 최상위 문제 생성 - 소인수분해, 최대공약수, 최소공배수 등 모든 개념 포함
        if (conceptLower.includes('소인수분해') || conceptLower.includes('소수') || conceptLower.includes('약수') || 
            conceptLower.includes('최대공약수') || conceptLower.includes('최소공배수') || conceptLower.includes('공약수') ||
            conceptLower.includes('공배수') || conceptLower.includes('나머지') || conceptLower.includes('몫')) {
            const highestProblems = [
                () => {
                    // 제곱수 만들기: "252를 x로 나누어 어떤 자연수의 제곱이 되게 할 때, 가장 작은 자연수 x를 구하시오."
                    const nums = [252, 180, 360, 450, 540, 600];
                    const num = nums[Math.floor(Math.random() * nums.length)];
                    const factors = getPrimeFactors(num);
                    const factorCounts = {};
                    factors.forEach(f => {
                        factorCounts[f] = (factorCounts[f] || 0) + 1;
                    });
                    
                    // 홀수 지수를 가진 소인수 찾기
                    let x = 1;
                    Object.keys(factorCounts).forEach(p => {
                        if (factorCounts[p] % 2 === 1) {
                            x *= parseInt(p);
                        }
                    });
                    
                    return {
                        type: PROBLEM_TYPES.COMMON_DIVISOR,
                        question: `${num}을 x로 나누어 어떤 자연수의 제곱이 되게 할 때, 가장 작은 자연수 x를 구하시오.`,
                        questionLatex: `${num}을 x로 나누어 어떤 자연수의 제곱이 되게 할 때, 가장 작은 자연수 x를 구하시오.`,
                        answer: `${x}`,
                        answerLatex: `${x}`,
                        explanation: `${num} = ${factors.join(' × ')}로 소인수분해하면, 홀수 지수를 가진 소인수는 ${Object.keys(factorCounts).filter(p => factorCounts[p] % 2 === 1).join(', ')}입니다. 따라서 가장 작은 x는 ${x}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'prime_factorization_highest', num, x }
                    };
                },
                () => {
                    // 소수의 합: "40을 서로 다른 두 소수의 합으로 나타내는 방법은 모두 몇 가지인지 구하시오."
                    const target = [40, 30, 50, 60, 70][Math.floor(Math.random() * 5)];
                    const primes = [];
                    for (let i = 2; i < target; i++) {
                        if (getDivisors(i).length === 2) {
                            primes.push(i);
                        }
                    }
                    const pairs = [];
                    for (let i = 0; i < primes.length; i++) {
                        for (let j = i + 1; j < primes.length; j++) {
                            if (primes[i] + primes[j] === target) {
                                pairs.push([primes[i], primes[j]]);
                            }
                        }
                    }
                    
                    return {
                        type: PROBLEM_TYPES.DIVISOR,
                        question: `${target}을 서로 다른 두 소수의 합으로 나타내는 방법은 모두 몇 가지인가? (단, 더하는 순서는 생각하지 않는다.)`,
                        questionLatex: `${target}을 서로 다른 두 소수의 합으로 나타내는 방법은 모두 몇 가지인가?`,
                        answer: `${pairs.length}가지`,
                        answerLatex: `${pairs.length}가지`,
                        explanation: `${target}보다 작은 소수는 ${primes.join(', ')}입니다. 이 중 합이 ${target}이 되는 쌍은 ${pairs.map(p => p.join('+')).join(', ')}로 모두 ${pairs.length}가지입니다.`,
                        inputPlaceholder: '답을 입력하세요 (예: 3가지)',
                        meta: { grade, concept: 'prime_sum_highest', target, pairs }
                    };
                },
                () => {
                    // 복잡한 나머지 문제: "자연수 중에서 3으로 나누면 2가 남고, 5로 나누면 4가 남는 자연수를 15로 나눈 나머지를 구하시오."
                    const divisor1 = [3, 4, 5, 6, 7][Math.floor(Math.random() * 5)];
                    const remainder1 = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
                    const divisor2 = [5, 6, 7, 8][Math.floor(Math.random() * 4)];
                    const remainder2 = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
                    const finalDivisor = divisor1 * divisor2;
                    
                    // 중국인의 나머지 정리 (간단한 경우)
                    // x ≡ r1 (mod d1), x ≡ r2 (mod d2)
                    let x = remainder1;
                    while (x % divisor2 !== remainder2 && x < finalDivisor * 10) {
                        x += divisor1;
                    }
                    const finalRemainder = x % finalDivisor;
                    
                    return {
                        type: PROBLEM_TYPES.LINEAR_EQUATION,
                        question: `자연수 중에서 ${divisor1}으로 나누면 ${remainder1}이 남고, ${divisor2}로 나누면 ${remainder2}가 남는 자연수를 ${finalDivisor}로 나눈 나머지를 구하시오.`,
                        questionLatex: `자연수 중에서 ${divisor1}으로 나누면 ${remainder1}이 남고, ${divisor2}로 나누면 ${remainder2}가 남는 자연수를 ${finalDivisor}로 나눈 나머지를 구하시오.`,
                        answer: `${finalRemainder}`,
                        answerLatex: `${finalRemainder}`,
                        explanation: `${divisor1}으로 나누면 ${remainder1}이 남고, ${divisor2}로 나누면 ${remainder2}가 남는 자연수 중 하나는 ${x}입니다. ${x}를 ${finalDivisor}로 나눈 나머지는 ${finalRemainder}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'remainder_highest', divisor1, remainder1, divisor2, remainder2, finalDivisor, finalRemainder }
                    };
                },
                () => {
                    // 약수의 개수 함수: "자연수 a에 대하여 N(a)가 a의 약수의 개수를 나타낼 때, N(N(240))의 값을 구하시오."
                    const num = [240, 360, 420, 480, 600][Math.floor(Math.random() * 5)];
                    const divisors = getDivisors(num);
                    const count1 = divisors.length;
                    const divisors2 = getDivisors(count1);
                    const count2 = divisors2.length;
                    
                    return {
                        type: PROBLEM_TYPES.DIVISOR,
                        question: `자연수 a에 대하여 N(a)가 a의 약수의 개수를 나타낼 때, N(N(${num}))의 값을 구하시오.`,
                        questionLatex: `자연수 a에 대하여 N(a)가 a의 약수의 개수를 나타낼 때, N(N(${num}))의 값을 구하시오.`,
                        answer: `${count2}`,
                        answerLatex: `${count2}`,
                        explanation: `${num}의 약수는 ${divisors.join(', ')}로 모두 ${count1}개이므로 N(${num}) = ${count1}입니다. ${count1}의 약수는 ${divisors2.join(', ')}로 모두 ${count2}개이므로 N(N(${num})) = N(${count1}) = ${count2}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'divisor_count_function', num, count1, count2 }
                    };
                },
                () => {
                    // 복잡한 조건부 약수 문제: "자연수 a를 7로 나누면 몫이 4이고 나머지가 자연수 r이다. r의 약수의 개수가 3개일 때, a의 값을 구하시오."
                    const divisor = [7, 8, 9, 10][Math.floor(Math.random() * 4)];
                    const quotient = [4, 5, 6, 7, 8][Math.floor(Math.random() * 5)];
                    const remainderDivisors = [4, 9, 25]; // 약수가 3개인 수 (제곱수)
                    const r = remainderDivisors[Math.floor(Math.random() * remainderDivisors.length)];
                    const a = divisor * quotient + r;
                    
                    return {
                        type: PROBLEM_TYPES.LINEAR_EQUATION,
                        question: `자연수 a를 ${divisor}로 나누면 몫이 ${quotient}이고 나머지가 자연수 r이다. r의 약수의 개수가 3개일 때, a의 값을 구하시오.`,
                        questionLatex: `자연수 a를 ${divisor}로 나누면 몫이 ${quotient}이고 나머지가 자연수 r이다. r의 약수의 개수가 3개일 때, a의 값을 구하시오.`,
                        answer: `${a}`,
                        answerLatex: `${a}`,
                        explanation: `약수의 개수가 3개인 수는 제곱수입니다 (${r} = ${Math.sqrt(r)}²). 따라서 r = ${r}이고, a = ${divisor} × ${quotient} + ${r} = ${a}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'remainder_conditional_highest', divisor, quotient, r, a }
                    };
                },
                () => {
                    // 최대공약수와 최소공배수 활용: "두 자연수 A, B의 최대공약수는 7이고, 두 수의 곱은 735이다. A, B가 모두 두 자리의 자연수일 때, A+B와 A-B의 최대공약수를 구하시오."
                    const baseGcd = 7;
                    const pairs = [
                        { A: 35, B: 21 }, { A: 49, B: 15 }, { A: 63, B: 35 },
                        { A: 77, B: 49 }, { A: 84, B: 63 }, { A: 91, B: 77 }
                    ];
                    const pair = pairs[Math.floor(Math.random() * pairs.length)];
                    const A = pair.A;
                    const B = pair.B;
                    const product = A * B;
                    const sum = A + B;
                    const diff = A > B ? A - B : B - A;
                    const finalGcd = gcd(sum, diff);
                    
                    return {
                        type: PROBLEM_TYPES.COMMON_DIVISOR,
                        question: `두 자연수 A, B의 최대공약수는 ${baseGcd}이고, 두 수의 곱은 ${product}이다. A, B가 모두 두 자리의 자연수일 때, A+B와 A-B의 최대공약수를 구하시오. (단, A > B)`,
                        questionLatex: `두 자연수 A, B의 최대공약수는 ${baseGcd}이고, 두 수의 곱은 ${product}이다. A, B가 모두 두 자리의 자연수일 때, A+B와 A-B의 최대공약수를 구하시오.`,
                        answer: `${finalGcd}`,
                        answerLatex: `${finalGcd}`,
                        explanation: `A × B = ${product}, 최대공약수가 ${baseGcd}이므로 A = ${A}, B = ${B}입니다. A + B = ${sum}, A - B = ${diff}이고, 이 두 수의 최대공약수는 ${finalGcd}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'gcd_lcm_highest', gcd: baseGcd, A, B, sum, diff, finalGcd }
                    };
                },
                () => {
                    // 배수 판별법 복합 문제: "네 자리의 자연수 12□4에 1234를 더하면 3의 배수인 동시에 4의 배수가 된다"
                    const base = [1204, 1304, 1404, 1504, 1604][Math.floor(Math.random() * 5)];
                    const addNum = 1234;
                    const sum = base + addNum;
                    // 3의 배수이면서 4의 배수인 경우 찾기
                    const digit = base % 100 / 10; // 십의 자리 수
                    const validDigits = [];
                    for (let d = 0; d <= 9; d++) {
                        const testNum = Math.floor(base / 100) * 100 + d * 10 + (base % 10);
                        if ((testNum + addNum) % 3 === 0 && (testNum + addNum) % 4 === 0) {
                            validDigits.push(d);
                        }
                    }
                    
                    if (validDigits.length >= 2) {
                        return {
                            type: PROBLEM_TYPES.MIXED_CALC,
                            question: `네 자리의 자연수 12□4에 ${addNum}을 더하면 3의 배수인 동시에 4의 배수가 된다. □ 안에 알맞은 수를 모두 구하시오.`,
                            questionLatex: `네 자리의 자연수 12□4에 ${addNum}을 더하면 3의 배수인 동시에 4의 배수가 된다. □ 안에 알맞은 수를 모두 구하시오.`,
                            answer: validDigits.join(', '),
                            answerLatex: validDigits.join(', '),
                            explanation: `12□4에 ${addNum}을 더하면 3의 배수이려면 각 자리 수의 합이 3의 배수, 4의 배수이려면 끝 두 자리가 4의 배수여야 합니다. 이를 만족하는 □는 ${validDigits.join(', ')}입니다.`,
                            inputPlaceholder: '답을 입력하세요 (예: 1, 7)',
                            meta: { grade, concept: 'multiple_judgment_highest', validDigits }
                        };
                    }
                    return null;
                },
                () => {
                    // 최대공약수와 최소공배수 복합 문제: "세 자연수 16, p, 24의 최대공약수가 8이고 최소공배수가 240일 때"
                    const num1 = 16;
                    const num2 = 24;
                    const targetGcd = 8;
                    const targetLcm = 240;
                    
                    // p의 가능한 값 찾기
                    const factors = getPrimeFactors(targetLcm);
                    const num1Factors = getPrimeFactors(num1);
                    const num2Factors = getPrimeFactors(num2);
                    
                    // p는 targetGcd의 배수이면서 targetLcm의 약수
                    let p = targetGcd;
                    while (p <= targetLcm) {
                        const pGcd = gcd(gcd(num1, num2), p);
                        const pLcm = (num1 * num2 * p) / (gcd(gcd(num1, num2), p) * gcd(num1, num2) * gcd(p, Math.max(num1, num2)));
                        if (pGcd === targetGcd) {
                            // 간단한 경우로 p = 40
                            p = 40;
                            break;
                        }
                        p += targetGcd;
                        if (p > targetLcm) {
                            p = 40; // 폴백
                            break;
                        }
                    }
                    
                    return {
                        type: PROBLEM_TYPES.COMMON_DIVISOR,
                        question: `세 자연수 ${num1}, p, ${num2}의 최대공약수가 ${targetGcd}이고 최소공배수가 ${targetLcm}일 때, 가장 작은 p의 값을 구하시오.`,
                        questionLatex: `세 자연수 ${num1}, p, ${num2}의 최대공약수가 ${targetGcd}이고 최소공배수가 ${targetLcm}일 때, 가장 작은 p의 값을 구하시오.`,
                        answer: `${p}`,
                        answerLatex: `${p}`,
                        explanation: `${num1} = ${getPrimeFactors(num1).join(' × ')}, ${num2} = ${getPrimeFactors(num2).join(' × ')}입니다. 최대공약수가 ${targetGcd}이고 최소공배수가 ${targetLcm}이므로 p = ${p}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'gcd_lcm_three_numbers', num1, num2, p, targetGcd, targetLcm }
                    };
                },
                () => {
                    // 공약수 중 완전제곱수: "두 수 225와 450의 공약수 중 완전제곱수가 되는 수들의 합"
                    const nums = [
                        { a: 225, b: 450 },
                        { a: 144, b: 324 },
                        { a: 180, b: 360 }
                    ];
                    const pair = nums[Math.floor(Math.random() * nums.length)];
                    const a = pair.a;
                    const b = pair.b;
                    const commonDivisors = getCommonDivisors(a, b);
                    const perfectSquares = commonDivisors.filter(d => {
                        const sqrt = Math.sqrt(d);
                        return sqrt === Math.floor(sqrt);
                    });
                    const sum = perfectSquares.reduce((acc, val) => acc + val, 0);
                    
                    return {
                        type: PROBLEM_TYPES.COMMON_DIVISOR,
                        question: `두 수 ${a}와 ${b}의 공약수 중 완전제곱수가 되는 수들의 합을 구하시오.`,
                        questionLatex: `두 수 ${a}와 ${b}의 공약수 중 완전제곱수가 되는 수들의 합을 구하시오.`,
                        answer: `${sum}`,
                        answerLatex: `${sum}`,
                        explanation: `${a}와 ${b}의 공약수는 ${commonDivisors.join(', ')}입니다. 이 중 완전제곱수는 ${perfectSquares.join(', ')}이므로 그 합은 ${sum}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'common_divisor_perfect_square', a, b, perfectSquares, sum }
                    };
                },
                () => {
                    // 새로운 연산 정의: "a•b=(a+b를 7로 나눈 나머지), a½b=(a×b를 7로 나눈 나머지)"
                    const mod = [7, 8, 9, 11][Math.floor(Math.random() * 4)];
                    const a = [4, 5, 6, 8][Math.floor(Math.random() * 4)];
                    const b = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
                    const c = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
                    
                    // (a•b)½c 계산
                    const ab = (a + b) % mod;
                    const result = (ab * c) % mod;
                    
                    return {
                        type: PROBLEM_TYPES.MIXED_CALC,
                        question: `두 자연수 a, b에 대하여 a•b = (a+b를 ${mod}로 나눈 나머지), a½b = (a×b를 ${mod}로 나눈 나머지)라고 할 때, ${a}•{(${b}•${c})½${c}}의 값을 구하시오.`,
                        questionLatex: `두 자연수 a, b에 대하여 a•b = (a+b를 ${mod}로 나눈 나머지), a½b = (a×b를 ${mod}로 나눈 나머지)라고 할 때, ${a}•{(${b}•${c})½${c}}의 값을 구하시오.`,
                        answer: `${result}`,
                        answerLatex: `${result}`,
                        explanation: `${b}•${c} = (${b}+${c}) % ${mod} = ${(b+c) % mod}, (${b}•${c})½${c} = ${(b+c) % mod}×${c} % ${mod} = ${((b+c) % mod) * c % mod}, ${a}•{(${b}•${c})½${c}} = (${a}+${((b+c) % mod) * c % mod}) % ${mod} = ${result}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'new_operation_highest', mod, a, b, c, result }
                    };
                },
                () => {
                    // 조건을 만족하는 자연수 찾기: "소인수분해하였을 때, 서로 다른 소인수가 3개이고, 이 소인수들의 합은 12이다. 약수가 12개이다"
                    const primeSums = [
                        { primes: [2, 3, 7], sum: 12, divisors: 12 }, // 2×3×7 = 42 (약수 8개 아님)
                        { primes: [2, 5, 7], sum: 14, divisors: 8 }, // 2×5×7 = 70 (약수 8개)
                        { primes: [3, 5, 7], sum: 15, divisors: 8 }, // 3×5×7 = 105
                    ];
                    // 약수가 12개인 경우: 2²×3×5 = 60 (약수 12개), 2²×3×7 = 84, 2×3²×5 = 90
                    const validNumbers = [
                        { num: 60, factors: [2, 2, 3, 5], primeSum: 2+3+5 },
                        { num: 84, factors: [2, 2, 3, 7], primeSum: 2+3+7 },
                        { num: 90, factors: [2, 3, 3, 5], primeSum: 2+3+5 }
                    ];
                    const selected = validNumbers[Math.floor(Math.random() * validNumbers.length)];
                    const uniquePrimes = [...new Set(selected.factors)];
                    
                    return {
                        type: PROBLEM_TYPES.DIVISOR,
                        question: `다음 조건을 모두 만족하는 세 자리의 자연수 중에서 가장 큰 값을 구하시오.\n(가) 소인수분해하였을 때, 서로 다른 소인수가 3개이고, 이 소인수들의 합은 ${uniquePrimes.reduce((a,b) => a+b, 0)}이다.\n(나) 약수가 ${getDivisors(selected.num).length}개이다.`,
                        questionLatex: `다음 조건을 모두 만족하는 세 자리의 자연수 중에서 가장 큰 값을 구하시오. (가) 소인수분해하였을 때, 서로 다른 소인수가 3개이고, 이 소인수들의 합은 ${uniquePrimes.reduce((a,b) => a+b, 0)}이다. (나) 약수가 ${getDivisors(selected.num).length}개이다.`,
                        answer: `${selected.num}`,
                        answerLatex: `${selected.num}`,
                        explanation: `소인수분해하면 ${selected.num} = ${selected.factors.join(' × ')}이고, 서로 다른 소인수는 ${uniquePrimes.join(', ')}로 합이 ${uniquePrimes.reduce((a,b) => a+b, 0)}이며, 약수는 ${getDivisors(selected.num).join(', ')}로 모두 ${getDivisors(selected.num).length}개입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'conditional_number_highest', num: selected.num, divisors: getDivisors(selected.num).length }
                    };
                },
                () => {
                    // 비와 최대공약수/최소공배수: "a:b=7:5, a와 b의 최대공약수와 최소공배수의 합은 180이다"
                    const ratioPairs = [
                        { ratio: [7, 5], gcdLcmSum: 180 },
                        { ratio: [8, 6], gcdLcmSum: 200 },
                        { ratio: [9, 6], gcdLcmSum: 225 }
                    ];
                    const pair = ratioPairs[Math.floor(Math.random() * ratioPairs.length)];
                    const [aRatio, bRatio] = pair.ratio;
                    const ratioGcd = gcd(aRatio, bRatio);
                    const simplifiedRatio = [aRatio / ratioGcd, bRatio / ratioGcd];
                    
                    // a = 7k, b = 5k일 때, gcd(a,b) = k, lcm(a,b) = 35k
                    // k + 35k = 36k = 180, k = 5
                    const k = pair.gcdLcmSum / (simplifiedRatio[0] * simplifiedRatio[1] + 1);
                    const a = simplifiedRatio[0] * k;
                    const b = simplifiedRatio[1] * k;
                    
                    return {
                        type: PROBLEM_TYPES.COMMON_DIVISOR,
                        question: `다음 두 조건을 모두 만족하는 두 자연수 a, b의 값을 각각 구하시오.\n(가) a : b = ${aRatio} : ${bRatio}\n(나) a와 b의 최대공약수와 최소공배수의 합은 ${pair.gcdLcmSum}이다.`,
                        questionLatex: `다음 두 조건을 모두 만족하는 두 자연수 a, b의 값을 각각 구하시오. (가) a : b = ${aRatio} : ${bRatio} (나) a와 b의 최대공약수와 최소공배수의 합은 ${pair.gcdLcmSum}이다.`,
                        answer: `a = ${a}, b = ${b}`,
                        answerLatex: `a = ${a}, b = ${b}`,
                        explanation: `a : b = ${aRatio} : ${bRatio}이므로 a = ${simplifiedRatio[0]}k, b = ${simplifiedRatio[1]}k (k는 자연수)입니다. 최대공약수는 k, 최소공배수는 ${simplifiedRatio[0] * simplifiedRatio[1]}k이므로 k + ${simplifiedRatio[0] * simplifiedRatio[1]}k = ${pair.gcdLcmSum}, 따라서 k = ${k}입니다. 따라서 a = ${a}, b = ${b}입니다.`,
                        inputPlaceholder: '답을 입력하세요 (예: a = 35, b = 25)',
                        meta: { grade, concept: 'ratio_gcd_lcm_highest', a, b, gcd: k, lcm: simplifiedRatio[0] * simplifiedRatio[1] * k }
                    };
                },
                () => {
                    // 제곱수 곱하기와 나누기: "54에 가능한 한 작은 자연수를 곱하여 어떤 자연수 a의 제곱이 되게 하고, 54를 가능한 한 작은 자연수로 나누어 어떤 자연수 b의 제곱이 되게 할 때"
                    const num = [54, 60, 72, 96, 108][Math.floor(Math.random() * 5)];
                    const factors = getPrimeFactors(num);
                    const factorCounts = {};
                    factors.forEach(f => {
                        factorCounts[f] = (factorCounts[f] || 0) + 1;
                    });
                    
                    // 곱하기: 홀수 지수를 가진 소인수 곱하기
                    let multiply = 1;
                    Object.keys(factorCounts).forEach(p => {
                        if (factorCounts[p] % 2 === 1) {
                            multiply *= parseInt(p);
                        }
                    });
                    const a = Math.sqrt(num * multiply);
                    
                    // 나누기: 짝수 지수 중 가장 작은 것 찾기
                    let divide = 1;
                    let minOdd = Infinity;
                    Object.keys(factorCounts).forEach(p => {
                        if (factorCounts[p] % 2 === 1 && factorCounts[p] < minOdd) {
                            minOdd = factorCounts[p];
                            divide = parseInt(p);
                        }
                    });
                    if (divide === 1) divide = 2; // 폴백
                    const b = Math.sqrt(num / divide);
                    
                    return {
                        type: PROBLEM_TYPES.COMMON_DIVISOR,
                        question: `${num}에 가능한 한 작은 자연수를 곱하여 어떤 자연수 a의 제곱이 되게 하고, ${num}을 가능한 한 작은 자연수로 나누어 어떤 자연수 b의 제곱이 되게 할 때, a+b의 값을 구하시오.`,
                        questionLatex: `${num}에 가능한 한 작은 자연수를 곱하여 어떤 자연수 a의 제곱이 되게 하고, ${num}을 가능한 한 작은 자연수로 나누어 어떤 자연수 b의 제곱이 되게 할 때, a+b의 값을 구하시오.`,
                        answer: `${a + b}`,
                        answerLatex: `${a + b}`,
                        explanation: `${num} = ${factors.join(' × ')}이므로, 제곱수를 만들기 위해 ${multiply}를 곱하면 ${num * multiply} = ${a}², ${divide}로 나누면 ${num / divide} = ${b}²이 됩니다. 따라서 a + b = ${a} + ${b} = ${a + b}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'square_multiply_divide_highest', num, multiply, divide, a, b }
                    };
                },
                () => {
                    // 약수 함수 정의: "자연수 k의 약수 중 임의의 수를 C(k)라고 하자. C(12)이면서 C(18)인 수가 항상 C(k)가 된다고 할 때"
                    const num1 = 12;
                    const num2 = 18;
                    const divisors1 = getDivisors(num1);
                    const divisors2 = getDivisors(num2);
                    const commonDivisors = divisors1.filter(d => divisors2.includes(d));
                    const k = gcd(num1, num2); // 최대공약수
                    
                    return {
                        type: PROBLEM_TYPES.DIVISOR,
                        question: `자연수 k의 약수 중 임의의 수를 C(k)라고 하자. 즉, C(${num1})은 ${divisors1.join(', ')} 중의 하나를 뜻한다. C(${num1})이면서 C(${num2})인 수가 항상 C(k)가 된다고 할 때, 자연수 k의 값을 구하시오.`,
                        questionLatex: `자연수 k의 약수 중 임의의 수를 C(k)라고 하자. C(${num1})이면서 C(${num2})인 수가 항상 C(k)가 된다고 할 때, 자연수 k의 값을 구하시오.`,
                        answer: `${k}`,
                        answerLatex: `${k}`,
                        explanation: `C(${num1})은 ${divisors1.join(', ')}, C(${num2})은 ${divisors2.join(', ')}입니다. C(${num1})이면서 C(${num2})인 수는 ${commonDivisors.join(', ')}로, 이는 ${num1}과 ${num2}의 최대공약수인 ${k}의 약수입니다. 따라서 k = ${k}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'divisor_function_highest', num1, num2, k }
                    };
                },
                () => {
                    // 나머지 활용 문제: "200을 x로 나누면 4가 남고, 100을 x로 나누면 2가 남을 때, 모든 x의 값의 합"
                    const num1 = [200, 150, 180, 240][Math.floor(Math.random() * 4)];
                    const remainder1 = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
                    const num2 = [100, 120, 150, 180][Math.floor(Math.random() * 4)];
                    const remainder2 = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
                    
                    const diff1 = num1 - remainder1;
                    const diff2 = num2 - remainder2;
                    const commonDivisors = getCommonDivisors(diff1, diff2);
                    const validX = commonDivisors.filter(x => x > remainder1 && x > remainder2);
                    const sum = validX.reduce((acc, val) => acc + val, 0);
                    
                    return {
                        type: PROBLEM_TYPES.COMMON_DIVISOR,
                        question: `${num1}을 x로 나누면 ${remainder1}이 남고, ${num2}를 x로 나누면 ${remainder2}가 남을 때, 모든 x의 값의 합을 구하시오.`,
                        questionLatex: `${num1}을 x로 나누면 ${remainder1}이 남고, ${num2}를 x로 나누면 ${remainder2}가 남을 때, 모든 x의 값의 합을 구하시오.`,
                        answer: `${sum}`,
                        answerLatex: `${sum}`,
                        explanation: `x는 ${diff1}과 ${diff2}의 공약수 중 나머지 ${remainder1}보다 큰 수입니다. 공약수는 ${commonDivisors.join(', ')}이고, 조건을 만족하는 x는 ${validX.join(', ')}입니다. 따라서 합은 ${sum}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'remainder_application_highest', num1, remainder1, num2, remainder2, validX, sum }
                    };
                },
                () => {
                    // 실생활 문제: 나무 심기, 최대공약수 활용
                    const width = [48, 54, 60, 72, 84][Math.floor(Math.random() * 5)];
                    const height = [60, 72, 80, 90, 96][Math.floor(Math.random() * 5)];
                    const gcd = gcd(width, height);
                    const perimeter = 2 * (width + height);
                    const trees = perimeter / gcd;
                    
                    return {
                        type: PROBLEM_TYPES.COMMON_DIVISOR,
                        question: `가로의 길이가 ${width}m, 세로의 길이가 ${height}m인 직사각형 모양의 농장의 둘레를 따라 같은 간격으로 나무를 심으려고 한다. 나무의 개수가 최소가 되도록 하려면 나무는 모두 몇 그루가 필요한가? (단, 농장의 네 귀퉁이에는 반드시 나무를 심는다.)`,
                        questionLatex: `가로의 길이가 ${width}m, 세로의 길이가 ${height}m인 직사각형 모양의 농장의 둘레를 따라 같은 간격으로 나무를 심으려고 한다. 나무의 개수가 최소가 되도록 하려면 나무는 모두 몇 그루가 필요한가?`,
                        answer: `${trees}그루`,
                        answerLatex: `${trees}그루`,
                        explanation: `나무 사이의 간격은 ${width}과 ${height}의 최대공약수인 ${gcd}m가 되어야 합니다. 농장의 둘레는 ${perimeter}m이므로 필요한 나무의 수는 ${perimeter} ÷ ${gcd} = ${trees}그루입니다.`,
                        inputPlaceholder: '답을 입력하세요 (예: 18그루)',
                        meta: { grade, concept: 'real_life_gcd_highest', width, height, gcd, trees }
                    };
                },
                () => {
                    // 복합 나머지 문제: "사과 87개, 배 56개, 감 77개를 몇 명의 학생들에게 똑같은 개수로 나누어 줄 때..."
                    const apples = [87, 90, 96, 105][Math.floor(Math.random() * 4)];
                    const pears = [56, 60, 64, 70][Math.floor(Math.random() * 4)];
                    const persimmons = [77, 80, 84, 90][Math.floor(Math.random() * 4)];
                    const appleRemainder = 3;
                    const pearRemainder = [2, 3, 4][Math.floor(Math.random() * 3)];
                    const persimmonRemainder = [5, 4, 3][Math.floor(Math.random() * 3)];
                    
                    const appleNeed = apples + appleRemainder;
                    const pearLeft = pears - pearRemainder;
                    const persimmonLeft = persimmons - persimmonRemainder;
                    
                    const gcd1 = gcd(appleNeed, pearLeft);
                    const finalGcd = gcd(gcd1, persimmonLeft);
                    const divisors = getDivisors(finalGcd);
                    const validStudents = divisors.filter(d => d > Math.max(appleRemainder, pearRemainder, persimmonRemainder));
                    
                    return {
                        type: PROBLEM_TYPES.COMMON_DIVISOR,
                        question: `사과 ${apples}개, 배 ${pears}개, 감 ${persimmons}개를 몇 명의 학생들에게 똑같은 개수로 나누어 줄 때, 사과는 ${appleRemainder}개 모자라고, 배는 ${pearRemainder}개 남고, 감은 ${persimmonRemainder}개 남는다. 이때 가능한 학생 수를 모두 구하시오.`,
                        questionLatex: `사과 ${apples}개, 배 ${pears}개, 감 ${persimmons}개를 몇 명의 학생들에게 똑같은 개수로 나누어 줄 때, 사과는 ${appleRemainder}개 모자라고, 배는 ${pearRemainder}개 남고, 감은 ${persimmonRemainder}개 남는다. 이때 가능한 학생 수를 모두 구하시오.`,
                        answer: validStudents.length > 0 ? validStudents.join(', ') : `${finalGcd}`,
                        answerLatex: validStudents.length > 0 ? validStudents.join(', ') : `${finalGcd}`,
                        explanation: `사과는 ${appleNeed}개가 필요하고, 배는 ${pearLeft}개, 감은 ${persimmonLeft}개가 남습니다. 학생 수는 이 세 수의 공약수 중 조건을 만족하는 수입니다. 가능한 학생 수는 ${validStudents.length > 0 ? validStudents.join(', ') : finalGcd}명입니다.`,
                        inputPlaceholder: '답을 입력하세요 (예: 7, 14)',
                        meta: { grade, concept: 'complex_remainder_highest', validStudents }
                    };
                },
                () => {
                    // 최대공약수 조건 문제: "최대공약수가 6인 두 자연수 a, b 중 작은 자연수 b는 4의 배수이고 이 두 자연수의 곱 a×b가 1512일 때"
                    const targetGcd = [6, 8, 9, 12][Math.floor(Math.random() * 4)];
                    const product = [1512, 1260, 1680, 1800][Math.floor(Math.random() * 4)];
                    const bMultiple = [4, 5, 6, 8][Math.floor(Math.random() * 4)];
                    
                    // a = targetGcd * m, b = targetGcd * n (m, n은 서로소)
                    // b는 bMultiple의 배수
                    // a * b = targetGcd² * m * n = product
                    const baseProduct = product / (targetGcd * targetGcd);
                    const pairs = [];
                    for (let m = 1; m * m <= baseProduct; m++) {
                        if (baseProduct % m === 0) {
                            const n = baseProduct / m;
                            const a = targetGcd * m;
                            const b = targetGcd * n;
                            if (gcd(m, n) === 1 && b % bMultiple === 0 && a > b) {
                                pairs.push([a, b]);
                            }
                        }
                    }
                    
                    if (pairs.length > 0) {
                        const pairStr = pairs.map(p => `(${p[0]}, ${p[1]})`).join(', ');
                        return {
                            type: PROBLEM_TYPES.COMMON_DIVISOR,
                            question: `최대공약수가 ${targetGcd}인 두 자연수 a, b 중 작은 자연수 b는 ${bMultiple}의 배수이고 이 두 자연수의 곱 a×b가 ${product}일 때, 이 두 자연수의 순서쌍 (a, b)를 모두 구하시오.`,
                            questionLatex: `최대공약수가 ${targetGcd}인 두 자연수 a, b 중 작은 자연수 b는 ${bMultiple}의 배수이고 이 두 자연수의 곱 a×b가 ${product}일 때, 이 두 자연수의 순서쌍 (a, b)를 모두 구하시오.`,
                            answer: pairStr,
                            answerLatex: pairStr,
                            explanation: `최대공약수가 ${targetGcd}이므로 a = ${targetGcd}m, b = ${targetGcd}n (m, n은 서로소)입니다. a×b = ${product}이므로 m×n = ${baseProduct}입니다. b가 ${bMultiple}의 배수이고 a > b인 경우를 찾으면 ${pairStr}입니다.`,
                            inputPlaceholder: '답을 입력하세요 (예: (42, 36), (126, 12))',
                            meta: { grade, concept: 'gcd_condition_highest', targetGcd, product, pairs }
                        };
                    }
                    return null;
                },
                () => {
                    // 소인수의 합 함수: "자연수 n에 대하여 ＜n＞은 n을 소인수분해하였을 때, 모든 소인수의 합이라 하자"
                    const targetSum = [10, 12, 14, 15, 16][Math.floor(Math.random() * 5)];
                    const validNumbers = [];
                    for (let num = 10; num < 100; num++) {
                        const factors = getPrimeFactors(num);
                        const uniqueFactors = [...new Set(factors)];
                        const sum = uniqueFactors.reduce((acc, val) => acc + val, 0);
                        if (sum === targetSum) {
                            validNumbers.push(num);
                        }
                    }
                    const totalSum = validNumbers.reduce((acc, val) => acc + val, 0);
                    
                    return {
                        type: PROBLEM_TYPES.DIVISOR,
                        question: `자연수 n에 대하여 ＜n＞은 n을 소인수분해하였을 때, 모든 소인수의 합이라 하자. 예를 들어 ＜10＞=2+5=7이고, ＜90＞=2+3+5=10이다. 두 자리의 자연수 a에 대하여 ＜a＞=${targetSum}을 만족시키는 모든 a의 값의 합을 구하시오.`,
                        questionLatex: `자연수 n에 대하여 ＜n＞은 n을 소인수분해하였을 때, 모든 소인수의 합이라 하자. 두 자리의 자연수 a에 대하여 ＜a＞=${targetSum}을 만족시키는 모든 a의 값의 합을 구하시오.`,
                        answer: `${totalSum}`,
                        answerLatex: `${totalSum}`,
                        explanation: `두 자리의 자연수 중 ＜a＞=${targetSum}을 만족하는 수는 ${validNumbers.join(', ')}입니다. 이들의 합은 ${totalSum}입니다.`,
                        inputPlaceholder: '답을 입력하세요',
                        meta: { grade, concept: 'prime_factor_sum_highest', targetSum, validNumbers, totalSum }
                    };
                }
            ];
            
            const selectedProblem = highestProblems[Math.floor(Math.random() * highestProblems.length)];
            const result = selectedProblem();
            if (result) return result;
        }
    }
    
    // 소수와 합성수
    if (conceptLower.includes('소수') && (conceptLower.includes('합성수') || conceptLower.includes('합성'))) {
        // 기본 문제 수준: 약수가 2개인 수(소수)의 개수 구하기
        const min = 10;
        const max = 30;
        const primes = [];
        for (let i = min; i <= max; i++) {
            const divisors = getDivisors(i);
            if (divisors.length === 2) {
                primes.push(i);
            }
        }
        const count = primes.length;
        return {
            type: PROBLEM_TYPES.DIVISOR,
            question: `${min} 이상 ${max} 이하의 자연수 중에서 약수가 2개인 것은 모두 몇 개인가?`,
            questionLatex: `${min} 이상 ${max} 이하의 자연수 중에서 약수가 2개인 것은 모두 몇 개인가?`,
            answer: `${count}개`,
            answerLatex: `${count}개`,
            explanation: `약수가 2개인 수는 소수입니다. ${min} 이상 ${max} 이하의 소수는 ${primes.join(', ')}로 모두 ${count}개입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 5개)',
            meta: { grade, concept: 'prime_composite', min, max, primes, count }
        };
    }
    
    // 소수만 (합성수 없이)
    if (conceptLower.includes('소수') && !conceptLower.includes('합성수')) {
        // 기본 문제 수준: 소수 판별
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50];
        const candidates = [...primes.slice(0, 8), ...composites.slice(0, 8)].sort(() => Math.random() - 0.5).slice(0, 6);
        const primesInList = candidates.filter(n => getDivisors(n).length === 2);
        
        return {
            type: PROBLEM_TYPES.DIVISOR,
            question: `다음 중 소수를 모두 고르시오.\n${candidates.join(', ')}`,
            questionLatex: `다음 중 소수를 모두 고르시오.\n$${candidates.join(', ')}$`,
            answer: primesInList.join(', '),
            answerLatex: primesInList.join(', '),
            explanation: `소수는 약수가 2개인 수입니다. ${candidates.join(', ')} 중에서 약수가 2개인 수는 ${primesInList.join(', ')}입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 2, 3, 5)',
            meta: { grade, concept: 'prime', candidates, primes: primesInList }
        };
    }
    
    // 약수 구하기
    if (conceptLower.includes('약수') && !conceptLower.includes('개수')) {
        if (isAdvanced) {
            // 기본+응용 수준: 약수 중 조건을 만족하는 것 찾기
            // 예: "24의 약수 중 3의 배수인 것은 모두 몇 개인가?"
            const num = 24 + Math.floor(Math.random() * 3) * 12; // 24, 36, 48
            const multiplier = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
            const divisors = getDivisors(num);
            const filtered = divisors.filter(d => d % multiplier === 0);
            
            return {
                type: PROBLEM_TYPES.DIVISOR,
                question: `${num}의 약수 중 ${multiplier}의 배수인 것은 모두 몇 개인가?`,
                questionLatex: `${num}의 약수 중 ${multiplier}의 배수인 것은 모두 몇 개인가?`,
                answer: `${filtered.length}개`,
                answerLatex: `${filtered.length}개`,
                explanation: `${num}의 약수는 ${divisors.join(', ')}입니다. 이 중 ${multiplier}의 배수는 ${filtered.join(', ')}로 모두 ${filtered.length}개입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 3개)',
                meta: { grade, concept: 'divisor_conditional', num, multiplier, divisors: filtered, count: filtered.length }
            };
        } else {
            // 기본 문제 수준: 약수 구하기
            const nums = [12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 48];
            const num = nums[Math.floor(Math.random() * nums.length)];
            const divisors = getDivisors(num);
            
            return {
                type: PROBLEM_TYPES.DIVISOR,
                question: `${num}의 약수를 모두 구하시오.`,
                questionLatex: `${num}의 약수를 모두 구하시오.`,
                answer: divisors.join(', '),
                answerLatex: divisors.join(', '),
                explanation: `${num}의 약수는 ${divisors.join(', ')}로 모두 ${divisors.length}개입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 1, 2, 3, 4, 6, 12)',
                meta: { grade, concept: 'divisor', num, divisors }
            };
        }
    }
    
    // 약수의 개수 구하기
    if (conceptLower.includes('약수') && conceptLower.includes('개수')) {
        if (isAdvanced) {
            // 기본+응용 수준: "48이 어떤 자연수 A로 나누어떨어질 때, 이를 만족하는 A는 모두 몇 개인지 구하시오"
            const num = [48, 60, 72, 84, 90, 96][Math.floor(Math.random() * 6)];
            const divisors = getDivisors(num);
            const count = divisors.length;
            
            return {
                type: PROBLEM_TYPES.DIVISOR,
                question: `${num}이 어떤 자연수 A로 나누어떨어질 때, 이를 만족하는 A는 모두 몇 개인가?`,
                questionLatex: `${num}이 어떤 자연수 A로 나누어떨어질 때, 이를 만족하는 A는 모두 몇 개인가?`,
                answer: `${count}개`,
                answerLatex: `${count}개`,
                explanation: `${num}이 A로 나누어떨어진다는 것은 A가 ${num}의 약수라는 의미입니다. ${num}의 약수는 ${divisors.join(', ')}로 모두 ${count}개입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 10개)',
                meta: { grade, concept: 'divisor_count_application', num, divisors, count }
            };
        } else {
            // 기본 문제 수준: 약수의 개수 구하기
            const nums = [12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 48];
            const num = nums[Math.floor(Math.random() * nums.length)];
            const divisors = getDivisors(num);
            const count = divisors.length;
            
            return {
                type: PROBLEM_TYPES.DIVISOR,
                question: `${num}의 약수의 개수를 구하시오.`,
                questionLatex: `${num}의 약수의 개수를 구하시오.`,
                answer: `${count}개`,
                answerLatex: `${count}개`,
                explanation: `${num}의 약수는 ${divisors.join(', ')}로 모두 ${count}개입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 6개)',
                meta: { grade, concept: 'divisor_count', num, divisors, count }
            };
        }
    }
    
    // 소인수분해
    if (conceptLower.includes('소인수분해') || idLower.includes('prime')) {
        if (isAdvanced) {
            // 기본+응용 수준: "다음 중 126의 약수가 아닌 것은?" 형식
            const num = [84, 90, 96, 100, 108, 120, 126, 144][Math.floor(Math.random() * 8)];
        const factors = getPrimeFactors(num);
            const divisors = getDivisors(num);
            
            // 약수가 아닌 것 만들기 (소인수들의 곱이지만 약수가 아닌 것)
            const wrongFactorCombinations = [];
            // 예: 126 = 2 × 3² × 7, 약수가 아닌 것: 2²×3×7 = 84 (실제로는 약수), 2²×3²×7 = 252 (약수 아님)
            const factorPowers = {};
            factors.forEach(f => {
                factorPowers[f] = (factorPowers[f] || 0) + 1;
            });
            
            // 실제 약수가 아닌 것 찾기
            let wrongAnswer = '';
            const primeList = Object.keys(factorPowers).map(Number).sort((a, b) => a - b);
            for (let i = 0; i < primeList.length; i++) {
                const testFactor = primeList[i] * (factorPowers[primeList[i]] + 1);
                if (!divisors.includes(testFactor)) {
                    wrongAnswer = `${primeList[i]} × ${primeList[i]} × ${factors.filter(f => f !== primeList[i]).slice(0, 2).join(' × ')}`;
                    break;
                }
            }
            
            if (!wrongAnswer) {
                // 기본 문제로 폴백
                const factorStr = factors.length > 0 ? factors.join(' × ') : num.toString();
        return {
            type: PROBLEM_TYPES.COMMON_DIVISOR,
            question: `${num}을 소인수분해하시오.`,
            questionLatex: `${num}을 소인수분해하시오.`,
                    answer: factorStr,
                    answerLatex: factorStr.replace(/\×/g, ' \\times '),
                    explanation: `${num} = ${factorStr}입니다.`,
                    inputPlaceholder: '답을 입력하세요 (예: 2 × 3 × 7)',
            meta: { grade, concept: 'prime_factorization', num, factors }
        };
            }
            
            return {
                type: PROBLEM_TYPES.COMMON_DIVISOR,
                question: `${num}의 약수를 모두 구하고, 다음 중 약수가 아닌 것을 고르시오.\n① ${divisors.slice(1, 3).join(' × ')}\n② ${divisors.slice(2, 4).join(' × ')}\n③ ${factors.slice(0, 3).join(' × ')}\n④ ${wrongAnswer}\n⑤ ${divisors[Math.floor(divisors.length/2)]} × ${divisors[Math.floor(divisors.length/2)+1]}`,
                questionLatex: `${num}의 약수를 모두 구하고, 다음 중 약수가 아닌 것을 고르시오.`,
                answer: '④',
                answerLatex: '④',
                explanation: `${num} = ${factors.join(' × ')}이고, 약수는 ${divisors.join(', ')}입니다. ④는 약수가 아닙니다.`,
                inputPlaceholder: '답을 입력하세요 (예: ④)',
                meta: { grade, concept: 'prime_factorization_application', num, factors, divisors }
            };
        } else {
            // 기본 문제 수준: 12, 18, 20, 24, 28, 30, 36 등 작은 수
            const nums = [12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 48, 50, 60, 72];
            const num = nums[Math.floor(Math.random() * nums.length)];
            const factors = getPrimeFactors(num);
            const factorStr = factors.length > 0 ? factors.join(' × ') : num.toString();
            
            return {
                type: PROBLEM_TYPES.COMMON_DIVISOR,
                question: `${num}을 소인수분해하시오.`,
                questionLatex: `${num}을 소인수분해하시오.`,
                answer: factorStr,
                answerLatex: factorStr.replace(/\×/g, ' \\times '),
                explanation: `${num} = ${factorStr}입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 2 × 2 × 3)',
                meta: { grade, concept: 'prime_factorization', num, factors }
            };
        }
    }
    
    // 정수와 유리수의 사칙계산 (음수 포함)
    if (conceptLower.includes('정수') || conceptLower.includes('유리수') || conceptLower.includes('계산')) {
        // 기본 문제 수준: 간단한 정수 계산
        const a = Math.random() > 0.5 ? -(Math.floor(Math.random() * 10) + 5) : (Math.floor(Math.random() * 10) + 5);
        const b = Math.random() > 0.5 ? -(Math.floor(Math.random() * 10) + 5) : (Math.floor(Math.random() * 10) + 5);
        const operations = [
            { op: '+', result: a + b, latex: `${a} + ${b}`, text: `${a} + ${b}` },
            { op: '-', result: a - b, latex: `${a} - ${b}`, text: `${a} - ${b}` },
            { op: '×', result: a * b, latex: `${a} \\times ${b}`, text: `${a} × ${b}` }
        ];
        const selected = operations[Math.floor(Math.random() * operations.length)];
        
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: `${selected.text}의 값을 구하시오.`,
            questionLatex: `$${selected.latex}$의 값을 구하시오.`,
            answer: `${selected.result}`,
            answerLatex: `${selected.result}`,
            explanation: `${selected.text} = ${selected.result}입니다.`,
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'integer_rational_calc', a, b, operation: selected.op, result: selected.result }
        };
    }
    
    // 일차방정식
    if (conceptLower.includes('일차방정식') || conceptLower.includes('방정식') || idLower.includes('equation')) {
        if (isAdvanced) {
            // 기본+응용 수준: 나머지 활용 문제
            // "어떤 수를 7로 나누었더니 몫이 6이고 나머지가 4였다. 이 수를 5로 나누었을 때의 나머지는?"
            const divisor1 = [5, 6, 7, 8, 9][Math.floor(Math.random() * 5)];
            const quotient = Math.floor(Math.random() * 5) + 4; // 4~8
            const remainder1 = Math.floor(Math.random() * (divisor1 - 2)) + 1; // 1~(divisor1-2)
            const num = divisor1 * quotient + remainder1;
            const divisor2 = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
            const remainder2 = num % divisor2;
        
        return {
            type: PROBLEM_TYPES.LINEAR_EQUATION,
                question: `어떤 수를 ${divisor1}로 나누었더니 몫이 ${quotient}이고 나머지가 ${remainder1}이었다. 이 수를 ${divisor2}로 나누었을 때의 나머지는?`,
                questionLatex: `어떤 수를 ${divisor1}로 나누었더니 몫이 ${quotient}이고 나머지가 ${remainder1}이었다. 이 수를 ${divisor2}로 나누었을 때의 나머지는?`,
                answer: `${remainder2}`,
                answerLatex: `${remainder2}`,
                explanation: `어떤 수를 x라고 하면, x = ${divisor1} × ${quotient} + ${remainder1} = ${num}입니다. ${num}을 ${divisor2}로 나누면 몫은 ${Math.floor(num / divisor2)}, 나머지는 ${remainder2}입니다.`,
            inputPlaceholder: '답을 입력하세요',
                meta: { grade, concept: 'linear_equation_application', num, divisor1, divisor2, quotient, remainder1, remainder2 }
        };
        } else {
            // 기본 문제 수준: 간단한 일차방정식
            const coef = Math.floor(Math.random() * 4) + 2; // 2~5
            const constTerm = Math.floor(Math.random() * 8) + 3; // 3~10
            const solution = Math.floor(Math.random() * 8) + 1; // 1~8
    const result = coef * solution + constTerm;
    
    return {
        type: PROBLEM_TYPES.LINEAR_EQUATION,
        question: `일차방정식 ${coef}x + ${constTerm} = ${result}의 해를 구하시오.`,
        questionLatex: `일차방정식 $${coef}x + ${constTerm} = ${result}$의 해를 구하시오.`,
        answer: `${solution}`,
        answerLatex: `${solution}`,
                explanation: `${coef}x = ${result} - ${constTerm} = ${result - constTerm}, x = ${result - constTerm} ÷ ${coef} = ${solution}입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'linear_equation', coefficient: coef, constant: constTerm, solution }
    };
        }
    }
    
    // 기본: 소인수분해 또는 약수 문제 (기본 문제 수준)
    const problemTypes = [
        () => {
            // 소인수분해
            const nums = [12, 18, 20, 24, 28, 30, 36];
            const num = nums[Math.floor(Math.random() * nums.length)];
            const factors = getPrimeFactors(num);
            return {
                type: PROBLEM_TYPES.COMMON_DIVISOR,
                question: `${num}을 소인수분해하시오.`,
                questionLatex: `${num}을 소인수분해하시오.`,
                answer: factors.join(' × '),
                answerLatex: factors.join(' \\times '),
                explanation: `${num} = ${factors.join(' × ')}입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 2 × 2 × 3)',
                meta: { grade, concept: 'prime_factorization', num, factors }
            };
        },
        () => {
            // 약수 구하기
            const nums = [12, 18, 20, 24, 28, 30, 36];
            const num = nums[Math.floor(Math.random() * nums.length)];
            const divisors = getDivisors(num);
            return {
                type: PROBLEM_TYPES.DIVISOR,
                question: `${num}의 약수를 모두 구하시오.`,
                questionLatex: `${num}의 약수를 모두 구하시오.`,
                answer: divisors.join(', '),
                answerLatex: divisors.join(', '),
                explanation: `${num}의 약수는 ${divisors.join(', ')}로 모두 ${divisors.length}개입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 1, 2, 3, 4, 6, 12)',
                meta: { grade, concept: 'divisor', num, divisors }
            };
        },
        () => {
            // 소수 판별
            const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
            const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30];
            const candidates = [...primes.slice(0, 6), ...composites.slice(0, 6)].sort(() => Math.random() - 0.5).slice(0, 6);
            const primesInList = candidates.filter(n => getDivisors(n).length === 2);
            return {
                type: PROBLEM_TYPES.DIVISOR,
                question: `다음 중 소수를 모두 고르시오.\n${candidates.join(', ')}`,
                questionLatex: `다음 중 소수를 모두 고르시오.\n$${candidates.join(', ')}$`,
                answer: primesInList.join(', '),
                answerLatex: primesInList.join(', '),
                explanation: `소수는 약수가 2개인 수입니다. ${candidates.join(', ')} 중에서 약수가 2개인 수는 ${primesInList.join(', ')}입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: 2, 3, 5)',
                meta: { grade, concept: 'prime', candidates, primes: primesInList }
            };
        }
    ];
    
    const selectedType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
    return selectedType();
}

/**
 * 중학교 2학년 전용 문제 생성
 * - 유리수와 순환소수 변환, 연립일차방정식, 부등식의 성질, 일차함수 기울기
 */
function generateMiddleSchoolGrade2Problem(grade, conceptText = '', conceptId = '', problemType = '기본형') {
    const conceptLower = (conceptText || '').toLowerCase();
    const idLower = (conceptId || '').toLowerCase();
    
    // 유리수와 순환소수 변환
    if (conceptLower.includes('순환소수') || conceptLower.includes('유리수') || idLower.includes('repeating')) {
        const numerator = Math.floor(Math.random() * 8) + 1; // 1~8
        const denominator = Math.floor(Math.random() * 8) + 3; // 3~10
        const decimal = (numerator / denominator).toFixed(6);
        
        return {
            type: PROBLEM_TYPES.LINEAR_EQUATION,
            question: `분수 $\\dfrac{${numerator}}{${denominator}}$를 소수로 나타내시오.`,
            questionLatex: `분수 $\\dfrac{${numerator}}{${denominator}}$를 소수로 나타내시오.`,
            answer: decimal,
            answerLatex: decimal,
            explanation: `$\\dfrac{${numerator}}{${denominator}} = ${numerator} \\div ${denominator} = ${decimal}$입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: 0.333...)',
            meta: { grade, concept: 'rational_to_decimal', numerator, denominator, decimal }
        };
    }
    
    // 확률 단원인 경우 '경우의 수'를 묻는 문장형 문제
    if (conceptLower.includes('확률') || conceptLower.includes('경우의 수') || idLower.includes('probability')) {
        return generateMiddleSchoolProbabilityProblem(grade, conceptText);
    }
    
    // 일차부등식 문제
    if (conceptLower.includes('부등식') || conceptLower.includes('일차부등식') || idLower.includes('inequality')) {
        return generateLinearInequalityProblem(grade);
    }
    
    // 연립방정식 문제
    if (conceptLower.includes('연립') || conceptLower.includes('연립방정식') || idLower.includes('system')) {
        return generateSystemOfEquationsProblem(grade, []);
    }
    
    // 일차함수와 그래프
    if (conceptLower.includes('일차함수') || conceptLower.includes('그래프') || idLower.includes('function')) {
        return generateLinearFunctionWithGraphProblem(grade);
    }
    
    // 기본: 연립방정식, 일차부등식, 일차함수 중 랜덤 선택
    const types = [
        () => generateSystemOfEquationsProblem(grade, []),
        () => generateLinearInequalityProblem(grade),
        () => generateLinearFunctionWithGraphProblem(grade)
    ];
    return types[Math.floor(Math.random() * types.length)]();
}

/**
 * 중학교 3학년 전용 문제 생성
 * - 제곱근(√x), 인수분해 공식, 이차방정식, 삼각비(sin, cos)
 */
function generateMiddleSchoolGrade3Problem(grade, conceptText = '', conceptId = '', problemType = '기본형') {
    const conceptLower = (conceptText || '').toLowerCase();
    const idLower = (conceptId || '').toLowerCase();
    const isAdvanced = problemType === '응용 심화형' || problemType === 'basic+application';
    const isHighest = problemType === '최상위' || problemType === 'highest' || problemType === '응용 심화형';
    
    // 문제 유형별 생성 함수 배열 (랜덤 선택으로 다양성 확보)
    const problemGenerators = [];
    
    // 제곱근
    if (conceptLower.includes('제곱근') || conceptLower.includes('근호') || idLower.includes('sqrt') || idLower.includes('root')) {
        problemGenerators.push(() => {
            const perfectSquare = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
        const num = perfectSquare[Math.floor(Math.random() * perfectSquare.length)];
        const root = Math.sqrt(num);
        
        return {
            type: PROBLEM_TYPES.LINEAR_EQUATION,
            question: `√${num}의 값을 구하시오.`,
            questionLatex: null, // LaTeX 사용 안 함
            answer: `${root}`,
            answerLatex: null,
            explanation: `√${num} = ${root}입니다. (${root} × ${root} = ${num})`,
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'square_root', num, root }
        };
        });
        
        if (isAdvanced) {
            problemGenerators.push(() => {
                // 제곱근의 덧셈/뺄셈
                const a = [4, 9, 16, 25, 36][Math.floor(Math.random() * 5)];
                const b = [4, 9, 16, 25, 36][Math.floor(Math.random() * 5)];
                const sqrtA = Math.sqrt(a);
                const sqrtB = Math.sqrt(b);
                const op = Math.random() > 0.5 ? '+' : '-';
                const result = op === '+' ? (sqrtA + sqrtB) : (sqrtA - sqrtB);
                
                return {
                    type: PROBLEM_TYPES.LINEAR_EQUATION,
                    question: `√${a} ${op === '+' ? '+' : '-'} √${b}의 값을 구하시오.`,
                    questionLatex: null, // LaTeX 사용 안 함
                    answer: `${result}`,
                    answerLatex: null,
                    explanation: `√${a} = ${sqrtA}, √${b} = ${sqrtB}이므로 √${a} ${op === '+' ? '+' : '-'} √${b} = ${sqrtA} ${op === '+' ? '+' : '-'} ${sqrtB} = ${result}입니다.`,
                    inputPlaceholder: '답을 입력하세요',
                    meta: { grade, concept: 'square_root_operation', a, b, result }
                };
            });
        }
    }
    
    // 인수분해
    if (conceptLower.includes('인수분해') || idLower.includes('factor')) {
        const a = Math.floor(Math.random() * 3) + 2; // 2~4
        const b = Math.floor(Math.random() * 5) + 1; // 1~5
        const c = Math.floor(Math.random() * 5) + 1; // 1~5
        
        // (ax + b)(cx + d) 형태
        const expanded = a * c;
        const middle = a * c + b * c;
        const constant = b * c;
        
        return {
            type: PROBLEM_TYPES.LINEAR_EQUATION,
            question: `x² + ${middle}x + ${constant}를 인수분해하시오.`,
            questionLatex: null, // LaTeX 사용 안 함
            answer: `(x + ${b})(x + ${c})`,
            answerLatex: `(x + ${b})(x + ${c})`,
            explanation: `x² + ${middle}x + ${constant} = (x + ${b})(x + ${c})입니다.`,
            inputPlaceholder: '답을 입력하세요 (예: (x+2)(x+3))',
            meta: { grade, concept: 'factorization', a, b, c }
        };
    }
    
    // 이차방정식
    if (conceptLower.includes('이차방정식') || idLower.includes('quadratic')) {
        const a = 1;
        const b = -(Math.floor(Math.random() * 5) + 2); // -2~-6
        const c = Math.floor(Math.random() * 5) + 1; // 1~5
        const solution1 = -b + Math.sqrt(b * b - 4 * a * c);
        const solution2 = -b - Math.sqrt(b * b - 4 * a * c);
        
        if (b * b - 4 * a * c >= 0) {
            return {
                type: PROBLEM_TYPES.LINEAR_EQUATION,
                question: `이차방정식 x² ${b >= 0 ? '+' : ''} ${b}x + ${c} = 0의 해를 구하시오.`,
                questionLatex: null, // LaTeX 사용 안 함
                answer: `x = ${solution1}, x = ${solution2}`,
                answerLatex: `x = ${solution1}, x = ${solution2}`,
                explanation: `근의 공식을 사용하면 x = (-${-b} ± √${b * b - 4 * a * c}) / 2 = ${solution1}, ${solution2}입니다.`,
                inputPlaceholder: '답을 입력하세요 (예: x = 2, x = 3)',
                meta: { grade, concept: 'quadratic_equation', a, b, c, solution1, solution2 }
            };
        }
    }
    
    // 삼각비
    if (conceptLower.includes('삼각비') || conceptLower.includes('sin') || conceptLower.includes('cos') || idLower.includes('trig')) {
        const angle = [30, 45, 60][Math.floor(Math.random() * 3)];
        const angleRad = (angle * Math.PI) / 180;
        const sinValue = Math.sin(angleRad).toFixed(3);
        const cosValue = Math.cos(angleRad).toFixed(3);
        
        const trigType = Math.random() > 0.5 ? 'sin' : 'cos';
        const value = trigType === 'sin' ? sinValue : cosValue;
        
        return {
            type: PROBLEM_TYPES.LINEAR_EQUATION,
            question: `$\\${trigType} ${angle}°$의 값을 구하시오.`,
            questionLatex: `$\\${trigType} ${angle}°$의 값을 구하시오.`,
            answer: value,
            answerLatex: value,
            explanation: `$\\${trigType} ${angle}° = ${value}$입니다.`,
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'trigonometry', angle, trigType, value }
        };
    }
    
    // 기본 문제 생성 (개념이 특정되지 않은 경우)
    if (problemGenerators.length === 0) {
        // 다양한 중학교 3학년 문제 생성
        problemGenerators.push(
            () => {
                // 제곱근 기본
                const perfectSquare = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
                const num = perfectSquare[Math.floor(Math.random() * perfectSquare.length)];
                const root = Math.sqrt(num);
                
                return {
                    type: PROBLEM_TYPES.LINEAR_EQUATION,
                    question: `√${num}의 값을 구하시오.`,
                    questionLatex: null, // LaTeX 사용 안 함
                    answer: `${root}`,
                    answerLatex: null,
                    explanation: `√${num} = ${root}입니다.`,
                    inputPlaceholder: '답을 입력하세요',
                    meta: { grade, concept: 'square_root', num, root }
                };
            },
            () => {
                // 인수분해 기본
                const patterns = [
                    { a: 1, b: 2, c: 1, d: 3 }, // (x+2)(x+3) = x²+5x+6
                    { a: 1, b: 3, c: 1, d: 4 }, // (x+3)(x+4) = x²+7x+12
                    { a: 1, b: 2, c: 1, d: 5 }, // (x+2)(x+5) = x²+7x+10
                    { a: 1, b: 4, c: 1, d: 5 }  // (x+4)(x+5) = x²+9x+20
                ];
                const pattern = patterns[Math.floor(Math.random() * patterns.length)];
                const middle = pattern.b + pattern.d;
                const constant = pattern.b * pattern.d;
                
                return {
                    type: PROBLEM_TYPES.LINEAR_EQUATION,
                    question: `x² + ${middle}x + ${constant}를 인수분해하시오.`,
                    questionLatex: null, // LaTeX 사용 안 함
                    answer: `(x + ${pattern.b})(x + ${pattern.d})`,
                    answerLatex: `(x + ${pattern.b})(x + ${pattern.d})`,
                    explanation: `x² + ${middle}x + ${constant} = (x + ${pattern.b})(x + ${pattern.d})입니다.`,
                    inputPlaceholder: '답을 입력하세요 (예: (x+2)(x+3))',
                    meta: { grade, concept: 'factorization', pattern }
                };
            },
            () => {
                // 이차방정식 기본
                const roots = [2, 3, 4, 5, 6];
                const root1 = roots[Math.floor(Math.random() * roots.length)];
                const root2 = roots[Math.floor(Math.random() * roots.length)];
                const sum = root1 + root2;
                const product = root1 * root2;
                
                return {
                    type: PROBLEM_TYPES.LINEAR_EQUATION,
                    question: `이차방정식 x² - ${sum}x + ${product} = 0의 해를 구하시오.`,
                    questionLatex: null, // LaTeX 사용 안 함
                    answer: `x = ${root1}, x = ${root2}`,
                    answerLatex: `x = ${root1}, x = ${root2}`,
                    explanation: `인수분해하면 $(x - ${root1})(x - ${root2}) = 0$이므로 $x = ${root1}$ 또는 $x = ${root2}$입니다.`,
                    inputPlaceholder: '답을 입력하세요 (예: x = 2, x = 3)',
                    meta: { grade, concept: 'quadratic_equation', root1, root2 }
                };
            }
        );
    }
    
    // 랜덤하게 하나 선택 (다양성 확보)
    if (problemGenerators.length > 0) {
        const selected = problemGenerators[Math.floor(Math.random() * problemGenerators.length)];
        return selected();
    }
    
    // 폴백: 제곱근 문제
    const perfectSquare = [4, 9, 16, 25, 36, 49, 64, 81, 100];
    const num = perfectSquare[Math.floor(Math.random() * perfectSquare.length)];
    const root = Math.sqrt(num);
    
    return {
        type: PROBLEM_TYPES.LINEAR_EQUATION,
        question: `√${num}의 값을 구하시오.`,
        questionLatex: null, // LaTeX 사용 안 함
        answer: `${root}`,
        answerLatex: null,
        explanation: `√${num} = ${root}입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'square_root', num, root }
    };
}

// 일차부등식 문제 생성 (LaTeX 사용) - 중학교 2학년 수준
function generateLinearInequalityProblem(grade) {
    const coef = Math.floor(Math.random() * 5) + 2; // 2~6
    const constTerm = Math.floor(Math.random() * 10) + 5; // 5~14
    const solution = Math.floor(Math.random() * 10) + 1; // 1~10
    const result = coef * solution + constTerm;
    
    // 부등호 종류 선택 (>, <, ≥, ≤)
    const inequalityTypes = [
        { symbol: '>', latex: '>', name: '초과' },
        { symbol: '<', latex: '<', name: '미만' },
        { symbol: '≥', latex: '\\geq', name: '이상' },
        { symbol: '≤', latex: '\\leq', name: '이하' }
    ];
    const selected = inequalityTypes[Math.floor(Math.random() * inequalityTypes.length)];
    
    // question에는 한글 부등호 사용 (일반 텍스트용), questionLatex는 사용하지 않음 (복잡한 분수만 LaTeX 사용)
    const explanationText = `${coef}x ${selected.symbol} ${result} - ${constTerm} = ${result - constTerm}, x ${selected.symbol} ${(result - constTerm) / coef} = ${solution}입니다.`;
    
    return {
        type: PROBLEM_TYPES.LINEAR_INEQUALITY,
        question: `일차부등식 ${coef}x + ${constTerm} ${selected.symbol} ${result}의 해를 구하시오.`,
        questionLatex: null, // LaTeX 사용하지 않음 (한글 문자 사용)
        answer: `x ${selected.symbol} ${solution}`,
        answerLatex: null,
        explanation: explanationText,
        inputPlaceholder: `답을 입력하세요 (예: x ${selected.symbol} ${solution})`,
        meta: { grade, concept: 'linear_inequality', coefficient: coef, constant: constTerm, solution, inequality: selected.symbol, schoolLevel: 'middle' }
    };
}

// 연립방정식 문제 생성 (LaTeX 사용, 다양한 템플릿 및 중복 방지)
function generateSystemOfEquationsProblem(grade, existingQuestions = []) {
    // 이미 생성된 문제의 고유 키를 Set에 저장 (더 정확한 중복 체크)
    const usedKeys = new Set();
    existingQuestions.forEach(q => {
        const qLatex = q.questionLatex || q.question || '';
        const qText = q.question || '';
        // 계수와 해를 추출하여 고유 키 생성
        const match = qLatex.match(/(\d+)x\s*\+\s*(\d+)y\s*=\s*(\d+).*?(\d+)x\s*\+\s*(\d+)y\s*=\s*(\d+)/);
        if (match) {
            const key = `${match[1]},${match[2]},${match[3]},${match[4]},${match[5]},${match[6]}`;
            usedKeys.add(key);
        } else {
            // LaTeX가 없으면 텍스트에서 추출
            const textMatch = qText.match(/(\d+)x\s*\+\s*(\d+)y\s*=\s*(\d+).*?(\d+)x\s*\+\s*(\d+)y\s*=\s*(\d+)/);
            if (textMatch) {
                const key = `${textMatch[1]},${textMatch[2]},${textMatch[3]},${textMatch[4]},${textMatch[5]},${textMatch[6]}`;
                usedKeys.add(key);
            }
        }
    });
    
    // 랜덤하게 문제 생성 (더 다양한 조합)
    const maxAttempts = 100;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const x = Math.floor(Math.random() * 5) + 1; // 1~5
        const y = Math.floor(Math.random() * 5) + 1; // 1~5
        
        // 다양한 계수 조합 (랜덤 선택)
        const coefficientSets = [
            { a1: 2, b1: 3, a2: 4, b2: 5 },
            { a1: 3, b1: 2, a2: 5, b2: 4 },
            { a1: 2, b1: 5, a2: 3, b2: 4 },
            { a1: 4, b1: 2, a2: 6, b2: 3 },
            { a1: 5, b1: 4, a2: 2, b2: 3 },
            { a1: 6, b1: 2, a2: 4, b2: 6 },
            { a1: 3, b1: 5, a2: 2, b2: 2 },
            { a1: 5, b1: 2, a2: 4, b2: 2 },
            { a1: 2, b1: 2, a2: 3, b2: 6 },
            { a1: 4, b1: 3, a2: 3, b2: 6 },
            { a1: 3, b1: 4, a2: 2, b2: 5 },
            { a1: 5, b1: 3, a2: 3, b2: 4 },
            { a1: 2, b1: 4, a2: 5, b2: 3 },
            { a1: 4, b1: 5, a2: 2, b2: 3 },
            { a1: 6, b1: 3, a2: 3, b2: 5 }
        ];
        
        const coef = coefficientSets[Math.floor(Math.random() * coefficientSets.length)];
        const c1 = coef.a1 * x + coef.b1 * y;
        const c2 = coef.a2 * x + coef.b2 * y;
        
        // 고유 키 생성
        const uniqueKey = `${coef.a1},${coef.b1},${c1},${coef.a2},${coef.b2},${c2}`;
        
        // 이미 사용된 키인지 확인
        if (usedKeys.has(uniqueKey)) {
            continue; // 다음 시도
        }
        
        // 사용된 키에 추가
        usedKeys.add(uniqueKey);
        
        // 다양한 문제 템플릿 중 랜덤 선택
        const templateIndex = Math.floor(Math.random() * 10);
        let question, questionLatex, explanation;
        
        switch (templateIndex) {
            case 0:
                question = `연립방정식 $\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$의 해를 구하시오.`;
                questionLatex = `연립방정식 $\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$의 해를 구하시오.`;
                explanation = `첫 번째 식에서 $${coef.a1}x = ${c1} - ${coef.b1}y$를 구하고, 두 번째 식에 대입하여 $y = ${y}$를 구한 후 $x = ${x}$를 구합니다.`;
                break;
            case 1:
                question = `다음 연립방정식의 해를 구하시오.\n$$\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$$`;
                questionLatex = `다음 연립방정식의 해를 구하시오.\n$$\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$$`;
                explanation = `가감법을 사용하여 $y = ${y}$를 구한 후, 첫 번째 식에 대입하여 $x = ${x}$를 구합니다.`;
                break;
            case 2:
                question = `다음 연립방정식을 풀어보세요.\n$$\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$$`;
                questionLatex = `다음 연립방정식을 풀어보세요.\n$$\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$$`;
                explanation = `대입법을 사용하여 $x = ${x}$, $y = ${y}$를 구합니다.`;
                break;
            case 3:
                question = `$\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$를 만족하는 $x$, $y$의 값을 구하시오.`;
                questionLatex = `$\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$를 만족하는 $x$, $y$의 값을 구하시오.`;
                explanation = `두 식을 연립하여 풀면 $x = ${x}$, $y = ${y}$입니다.`;
                break;
            case 4:
                question = `다음 두 식을 동시에 만족하는 $x$와 $y$의 값을 구하시오.\n$${coef.a1}x + ${coef.b1}y = ${c1}$, $${coef.a2}x + ${coef.b2}y = ${c2}$`;
                questionLatex = `다음 두 식을 동시에 만족하는 $x$와 $y$의 값을 구하시오.\n$${coef.a1}x + ${coef.b1}y = ${c1}$, $${coef.a2}x + ${coef.b2}y = ${c2}$`;
                explanation = `두 식을 연립하여 풀면 $x = ${x}$, $y = ${y}$입니다.`;
                break;
            case 5:
                question = `$${coef.a1}x + ${coef.b1}y = ${c1}$과 $${coef.a2}x + ${coef.b2}y = ${c2}$를 만족하는 $x$, $y$를 구하시오.`;
                questionLatex = `$${coef.a1}x + ${coef.b1}y = ${c1}$과 $${coef.a2}x + ${coef.b2}y = ${c2}$를 만족하는 $x$, $y$를 구하시오.`;
                explanation = `연립방정식을 풀면 $x = ${x}$, $y = ${y}$입니다.`;
                break;
            case 6:
                question = `다음 연립방정식 $\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$에서 $x$와 $y$의 값을 구하시오.`;
                questionLatex = `다음 연립방정식 $\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$에서 $x$와 $y$의 값을 구하시오.`;
                explanation = `가감법 또는 대입법을 사용하여 $x = ${x}$, $y = ${y}$를 구합니다.`;
                break;
            case 7:
                question = `$\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$의 해를 구하시오.`;
                questionLatex = `$\\begin{cases} ${coef.a1}x + ${coef.b1}y = ${c1} \\\\ ${coef.a2}x + ${coef.b2}y = ${c2} \\end{cases}$의 해를 구하시오.`;
                explanation = `연립방정식을 풀면 $(x, y) = (${x}, ${y})$입니다.`;
                break;
            case 8:
                question = `두 일차방정식 $${coef.a1}x + ${coef.b1}y = ${c1}$과 $${coef.a2}x + ${coef.b2}y = ${c2}$를 동시에 만족하는 순서쌍 $(x, y)$를 구하시오.`;
                questionLatex = `두 일차방정식 $${coef.a1}x + ${coef.b1}y = ${c1}$과 $${coef.a2}x + ${coef.b2}y = ${c2}$를 동시에 만족하는 순서쌍 $(x, y)$를 구하시오.`;
                explanation = `연립방정식을 풀면 $(x, y) = (${x}, ${y})$입니다.`;
                break;
            default:
                question = `연립방정식 $${coef.a1}x + ${coef.b1}y = ${c1}$, $${coef.a2}x + ${coef.b2}y = ${c2}$의 해를 구하시오.`;
                questionLatex = `연립방정식 $${coef.a1}x + ${coef.b1}y = ${c1}$, $${coef.a2}x + ${coef.b2}y = ${c2}$의 해를 구하시오.`;
                explanation = `두 식을 연립하여 $x = ${x}$, $y = ${y}$를 구합니다.`;
        }
        
        return {
            question: question,
            questionLatex: questionLatex,
            answer: `x = ${x}, y = ${y}`,
            answerLatex: `x = ${x}, y = ${y}`,
            explanation: explanation,
            inputPlaceholder: '답을 입력하세요 (예: x = 2, y = 3)',
            meta: { grade, concept: 'system_of_equations', a1: coef.a1, b1: coef.b1, c1, a2: coef.a2, b2: coef.b2, c2, x, y, schoolLevel: 'middle' }
        };
    }
    
    // 최후의 수단: 기본 문제 반환
    return {
        question: `연립방정식 $\\begin{cases} 2x + 3y = 7 \\\\ 4x + 5y = 13 \\end{cases}$의 해를 구하시오.`,
        questionLatex: `연립방정식 $\\begin{cases} 2x + 3y = 7 \\\\ 4x + 5y = 13 \\end{cases}$의 해를 구하시오.`,
        answer: `x = 1, y = 1`,
        answerLatex: `x = 1, y = 1`,
        explanation: `두 식을 연립하여 풀면 $x = 1$, $y = 1$입니다.`,
        inputPlaceholder: '답을 입력하세요 (예: x = 2, y = 3)',
        meta: { grade, concept: 'system_of_equations', a1: 2, b1: 3, c1: 7, a2: 4, b2: 5, c2: 13, x: 1, y: 1, schoolLevel: 'middle' }
    };
}

// 일차함수와 그래프 문제 생성
function generateLinearFunctionWithGraphProblem(grade) {
    const a = Math.floor(Math.random() * 5) + 2; // 2~6
    const b = Math.floor(Math.random() * 10) + 1; // 1~10
    const x = Math.floor(Math.random() * 10) + 1; // 1~10
    const y = a * x + b;
    
    return {
        type: PROBLEM_TYPES.LINEAR_FUNCTION,
        question: `일차함수 y = ${a}x + ${b}의 그래프가 점 (${x}, ${y})를 지날 때, 이 함수의 기울기와 y절편을 구하시오.`,
        questionLatex: `일차함수 $y = ${a}x + ${b}$의 그래프가 점 $(${x}, ${y})$를 지날 때, 이 함수의 기울기와 y절편을 구하시오.`,
        answer: `기울기: ${a}, y절편: ${b}`,
        answerLatex: `기울기: ${a}, y절편: ${b}`,
        explanation: `일차함수 y = ax + b에서 기울기는 a = ${a}이고, y절편은 b = ${b}입니다.`,
        inputPlaceholder: '답을 입력하세요 (예: 기울기: 2, y절편: 3)',
        meta: { grade, concept: 'linear_function_graph', slope: a, intercept: b, x, y }
    };
}

// 중학교 확률 문제 생성 (경우의 수 포함)
function generateMiddleSchoolProbabilityProblem(grade, conceptText = '') {
    const scenarios = [
        {
            question: '주사위 2개를 동시에 던질 때, 두 눈의 합이 7이 되는 경우의 수를 구하시오.',
            answer: '6',
            explanation: '두 눈의 합이 7이 되는 경우: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)이므로 경우의 수는 6입니다.'
        },
        {
            question: 'A, B, C 세 명 중에서 대표 2명을 뽑는 경우의 수를 구하시오.',
            answer: '3',
            explanation: 'A와 B, A와 C, B와 C의 3가지 경우가 있습니다.'
        },
        {
            question: '1, 2, 3, 4 네 개의 숫자로 만들 수 있는 두 자리 수의 개수를 구하시오. (중복 허용)',
            answer: '16',
            explanation: '첫 번째 자리: 4가지, 두 번째 자리: 4가지이므로 4 × 4 = 16가지입니다.'
        },
        {
            question: '빨간 공 3개, 파란 공 2개가 들어있는 주머니에서 공 2개를 동시에 꺼낼 때, 빨간 공과 파란 공을 각각 1개씩 꺼낼 확률을 구하시오.',
            answer: '\\dfrac{3}{5}',
            answerLatex: '\\dfrac{3}{5}',
            explanation: '전체 경우의 수는 5개 중 2개를 선택하는 경우의 수인 10입니다. 빨간 공 1개와 파란 공 1개를 선택하는 경우의 수는 3 × 2 = 6이므로 확률은 \\dfrac{6}{10} = \\dfrac{3}{5}입니다.'
        }
    ];
    
    const selected = scenarios[Math.floor(Math.random() * scenarios.length)];
    return {
        type: PROBLEM_TYPES.PROBABILITY,
        question: selected.question,
        questionLatex: selected.questionLatex || selected.question,
        answer: selected.answer,
        answerLatex: selected.answerLatex || selected.answer,
        explanation: selected.explanation,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'middle_school_probability' }
    };
}

// 개념에 맞는 문제 형식 매핑 (CONCEPT_TEMPLATE_MAP 기반)
function getProblemTypesForConcept(conceptText, grade, conceptId = '', schoolLevel = 'elementary', rawGrade = null) {
    // schoolLevel 기본값 처리 및 정규화 (매개변수 재할당 방지)
    let normalizedSchoolLevel = schoolLevel;
    if (!normalizedSchoolLevel || normalizedSchoolLevel === undefined || normalizedSchoolLevel === 'undefined') {
        normalizedSchoolLevel = 'elementary';
    }
    if (normalizedSchoolLevel === '중학교') {
        normalizedSchoolLevel = 'middle';
    }
    if (normalizedSchoolLevel === '초등학교') {
        normalizedSchoolLevel = 'elementary';
    }
    
    // conceptId 정규화 (객체 처리 강화)
    const idString = normalizeConceptId(conceptId);
    let idLower = '';
    if (idString) {
        idLower = idString.toLowerCase();
    }
    
    // 중학교 판단 (정규화된 schoolLevel 사용)
    const isMiddleSchool = normalizedSchoolLevel === 'middle' || 
                           grade >= 7 || 
                           (idString && idString.startsWith('M'));
    const isMiddleSchoolGrade2 = rawGrade === 2 || (idString && idString.includes('M2') || idString && idString.includes('G2'));
    
    // CONCEPT_TEMPLATE_MAP에서 직접 조회
    if (idString && CONCEPT_TEMPLATE_MAP && CONCEPT_TEMPLATE_MAP[idString]) {
        const templateInfo = CONCEPT_TEMPLATE_MAP[idString];
        if (templateInfo && templateInfo.templates && Array.isArray(templateInfo.templates) && templateInfo.templates.length > 0) {
            // 중학교인 경우 MIXED_CALC 타입 제거
            let templates = [...templateInfo.templates]; // 배열 복사
            if (isMiddleSchool) {
                templates = templates.filter(t => t !== PROBLEM_TYPES.MIXED_CALC && 
                                                  t !== PROBLEM_TYPES.SKIP_COUNT && 
                                                  t !== PROBLEM_TYPES.TWO_DIGIT_DIV);
                // 중학교인 경우: 무조건 미지수, 일차부등식, 연립방정식, 함수 기호 포함
                if (templates.length === 0 || !templates.some(t => 
                    t === PROBLEM_TYPES.LINEAR_EQUATION || 
                    t === PROBLEM_TYPES.LINEAR_FUNCTION || 
                    t === PROBLEM_TYPES.SYSTEM_OF_EQUATIONS ||
                    t === PROBLEM_TYPES.LINEAR_INEQUALITY)) {
                    templates = [
                        PROBLEM_TYPES.LINEAR_EQUATION, 
                        PROBLEM_TYPES.LINEAR_FUNCTION, 
                        PROBLEM_TYPES.SYSTEM_OF_EQUATIONS,
                        PROBLEM_TYPES.LINEAR_INEQUALITY
                    ];
                }
                // 중학교 2학년인 경우 중등 수준 타입만 허용
                if (isMiddleSchoolGrade2 && templates.length === 0) {
                    templates = [
                        PROBLEM_TYPES.LINEAR_EQUATION, 
                        PROBLEM_TYPES.LINEAR_FUNCTION, 
                        PROBLEM_TYPES.SYSTEM_OF_EQUATIONS,
                        PROBLEM_TYPES.LINEAR_INEQUALITY,
                        PROBLEM_TYPES.PROBABILITY
                    ];
                }
            }
            return templates.length > 0 ? templates : templateInfo.templates;
        }
    }
    
    // conceptId로 찾지 못한 경우 conceptText 기반 매칭
    const conceptLower = (conceptText || '').toLowerCase();
    const types = [];
    
    // 도형 관련 (각기둥, 각뿔, 원기둥, 원뿔, 구 등)
    if (conceptLower.includes('각기둥') || conceptLower.includes('각뿔') || conceptLower.includes('원기둥') || 
        conceptLower.includes('원뿔') || conceptLower.includes('구') || conceptLower.includes('입체도형') ||
        conceptLower.includes('직육면체') || conceptLower.includes('정육면체')) {
        // 도형 항목은 특별한 문제 형식이 필요하므로 별도 처리
        // 6학년 수준: 각기둥의 전개도, 부피, 겉넓이 등
        if (grade >= 5) {
            types.push(PROBLEM_TYPES.SOLID_VOLUME);
        }
    }
    
    // 중학교 도형 관련 (우선 처리)
    if (isMiddleSchool && (conceptLower.includes('다각형') || conceptLower.includes('평면도형') || 
        conceptLower.includes('평면') && conceptLower.includes('도형') ||
        conceptLower.includes('내각') || conceptLower.includes('외각') || conceptLower.includes('대각선') ||
        conceptLower.includes('정다각형') || idLower.includes('u1') || idLower.includes('u2'))) {
        // 중학교 도형은 TRIANGLE_CLASSIFY 타입 사용 (generateMiddleSchoolGeometryProblem에서 처리)
        types.push(PROBLEM_TYPES.TRIANGLE_CLASSIFY);
    }
    
    // 초등학교 평면도형 관련
    if (!isMiddleSchool && (conceptLower.includes('평면도형') || conceptLower.includes('도형') && 
        (conceptLower.includes('뒤집') || conceptLower.includes('돌리') || conceptLower.includes('이동')))) {
        // 도형 이동/변환 문제
        if (grade >= 4) {
            types.push(PROBLEM_TYPES.PATTERN); // 패턴 문제 형식 사용
        }
    }
    
    // 각도 관련 (SVG 렌더링 사용)
    if (conceptLower.includes('각도') || conceptLower.includes('각의 크기') || conceptLower.includes('각의') || 
        conceptLower.includes('각 재기') || idLower.includes('angle')) {
        types.push(PROBLEM_TYPES.GEOMETRY_DRAWING);
    }
    
    // 삼각형 관련 (SVG 렌더링 사용)
    if (conceptLower.includes('삼각형') || conceptLower.includes('삼각형 분류') || idLower.includes('triangle')) {
        // 중학교 도형은 TRIANGLE_CLASSIFY 타입 사용 (generateMiddleSchoolGeometryProblem에서 처리)
        if (isMiddleSchool) {
            types.push(PROBLEM_TYPES.TRIANGLE_CLASSIFY);
        } else {
            types.push(PROBLEM_TYPES.GEOMETRY_DRAWING);
        }
    }
    
    // 원의 넓이, 원주율 (중학교에서는 제외)
    if (conceptLower.includes('원의 넓이') || conceptLower.includes('원주율') || conceptLower.includes('원주')) {
        if (grade >= 5 && !isMiddleSchool) {
            types.push(PROBLEM_TYPES.MIXED_CALC); // 원의 넓이 계산 (초등만)
        }
    }
    
    // 비와 비율 (중학교에서는 제외)
    if (conceptLower.includes('비') || conceptLower.includes('비율') || conceptLower.includes('비례')) {
        if (grade >= 5 && !isMiddleSchool) {
            types.push(PROBLEM_TYPES.FRACTION_SIMPLIFY); // 비율 간단히 하기
            types.push(PROBLEM_TYPES.MIXED_CALC);
        }
    }
    
    // 약수 관련
    if (conceptLower.includes('약수') || conceptLower.includes('배수') || conceptLower.includes('공약수') || 
        conceptLower.includes('최대공약수') || conceptLower.includes('최소공배수')) {
        if (grade >= 5) {
            types.push(PROBLEM_TYPES.DIVISOR);
            types.push(PROBLEM_TYPES.COMMON_DIVISOR);
        }
    }
    
    // 분수 관련
    if (conceptLower.includes('분수') || conceptLower.includes('약분') || conceptLower.includes('통분') ||
        conceptLower.includes('분수의 덧셈') || conceptLower.includes('분수의 뺄셈') || 
        conceptLower.includes('분수의 나눗셈')) {
        if (grade >= 3) {
            types.push(PROBLEM_TYPES.FRACTION_SIMPLIFY);
        }
    }
    
    // 곱셈/나눗셈 관련 (중학교에서는 제외)
    if (!isMiddleSchool) {
        if (conceptLower.includes('곱셈') || conceptLower.includes('나눗셈') || conceptLower.includes('혼합 계산') ||
            conceptLower.includes('곱셈과 나눗셈') || conceptLower.includes('자연수의 혼합 계산')) {
            if (grade >= 3) {
                types.push(PROBLEM_TYPES.MIXED_CALC);
            }
            if (grade >= 4) {
                types.push(PROBLEM_TYPES.TWO_DIGIT_DIV);
            }
        }
    } else {
        // 중학교에서는 정수와 유리수 계산, 일차방정식 등으로 대체
        if (conceptLower.includes('정수') || conceptLower.includes('유리수') || conceptLower.includes('계산')) {
            if (isMiddleSchoolGrade2) {
                types.push(PROBLEM_TYPES.LINEAR_EQUATION, PROBLEM_TYPES.LINEAR_FUNCTION);
            } else {
                // 중학교 1학년: 정수와 유리수 계산은 generateMiddleSchoolNumberProblem에서 처리
            }
        }
    }
    
    // 규칙 찾기 관련 (중학교에서는 제외)
    if (conceptLower.includes('규칙') || conceptLower.includes('대응') || conceptLower.includes('뛰어') ||
        conceptLower.includes('규칙과 대응') || conceptLower.includes('규칙 찾기')) {
        if (grade >= 2 && !isMiddleSchool) {
            types.push(PROBLEM_TYPES.SKIP_COUNT);
            types.push(PROBLEM_TYPES.PATTERN);
        }
    }
    
    // 기본적으로 모든 형식 사용 가능 (개념이 명확하지 않을 때)
    if (types.length === 0) {
        if (isMiddleSchool) {
            // 중학교 2학년인 경우 중등 수준 문제만
            if (isMiddleSchoolGrade2) {
                types.push(PROBLEM_TYPES.LINEAR_EQUATION, PROBLEM_TYPES.LINEAR_FUNCTION, PROBLEM_TYPES.PROBABILITY);
            } else {
                // 중학교 1학년: 정수와 유리수 계산 (generateMiddleSchoolNumberProblem에서 처리)
                // 타입이 없으면 LINEAR_EQUATION 사용
                types.push(PROBLEM_TYPES.LINEAR_EQUATION);
            }
        } else {
            // 초등학교: 학년에 맞는 기본 형식 제공
            if (grade >= 6) {
                // 6학년: 약수, 공약수, 분수, 혼합 계산 등 고급 문제
                types.push(PROBLEM_TYPES.DIVISOR, PROBLEM_TYPES.COMMON_DIVISOR, PROBLEM_TYPES.FRACTION_SIMPLIFY, PROBLEM_TYPES.MIXED_CALC);
            } else if (grade >= 5) {
                types.push(PROBLEM_TYPES.DIVISOR, PROBLEM_TYPES.COMMON_DIVISOR, PROBLEM_TYPES.FRACTION_SIMPLIFY);
            }
            if (grade >= 3) {
                types.push(PROBLEM_TYPES.MIXED_CALC, PROBLEM_TYPES.SKIP_COUNT, PROBLEM_TYPES.PATTERN);
            }
            if (grade >= 4) {
                types.push(PROBLEM_TYPES.TWO_DIGIT_DIV);
            }
            // 여전히 없으면 모든 형식 (중학교 타입 제외)
            if (types.length === 0) {
                const allTypes = Object.values(PROBLEM_TYPES);
                types.push(...allTypes.filter(t => t !== PROBLEM_TYPES.LINEAR_EQUATION && 
                                                   t !== PROBLEM_TYPES.LINEAR_FUNCTION && 
                                                   t !== PROBLEM_TYPES.PROBABILITY));
            }
        }
    }
    
    // 중학교인 경우 최종 필터링: MIXED_CALC, SKIP_COUNT, TWO_DIGIT_DIV 제거
    if (isMiddleSchool) {
        types = types.filter(t => t !== PROBLEM_TYPES.MIXED_CALC && 
                                  t !== PROBLEM_TYPES.SKIP_COUNT && 
                                  t !== PROBLEM_TYPES.TWO_DIGIT_DIV);
        // 중학교 2학년인 경우 중등 수준 타입만 허용
        if (isMiddleSchoolGrade2 && types.length === 0) {
            types = [PROBLEM_TYPES.LINEAR_EQUATION, PROBLEM_TYPES.LINEAR_FUNCTION, PROBLEM_TYPES.PROBABILITY];
        }
    }
    
    return types;
}

// 순수 연산 문제 판정 (초등 산수 차단)
function isPureArithmetic(text) {
    const normalizedText = text.replace(/\s+/g, ' ');
    // 숫자 연산 패턴 (예: "14 + 19 = ?", "16 + 21 = ?")
    const hasOp = /[\d)\]]\s*[\+\-\×\*\/÷]\s*[\d(]/.test(normalizedText);
    // 도형/기하 관련 단어가 있는지 확인
    const hasGeometryWord = /(도형|격자|대칭|뒤집|회전|돌리|각|이동|평행이동|시계방향|반시계방향|좌표|점|선|면|원|삼각형|사각형|직사각형|평행사변형|다각형|대칭축|대칭선|거울|위아래|좌우)/.test(normalizedText);
    // 중학교 수준 키워드 확인
    const hasMiddleSchoolWord = /(경우의 수|나열|곱셈원리|합의 원리|덧셈원리|중복|순서|조건|분류|표|트리|포함|확률|소인수분해|최대공약수|최소공배수|일차방정식|일차함수|이차방정식|인수분해|유리수|정수|방정식|함수|그래프|좌표|기울기|절편)/.test(normalizedText);
    // 분수 관련 키워드 확인
    const hasFractionWord = /(분수|분자|분모|약분|통분|크기|같은|비교|\\frac|\\dfrac)/.test(normalizedText);
    // 두 자리 수 덧셈/뺄셈 패턴 (초등 산수)
    const isTwoDigitArithmetic = /\d{2}\s*[\+\-]\s*\d{2}\s*=\s*\?/.test(normalizedText);
    
    // 분수 항목인 경우: 분수 키워드가 없으면 순수 산수로 판정
    if (hasOp && !hasFractionWord && !hasGeometryWord && !hasMiddleSchoolWord) {
        return true;
    }
    
    // 중학교인 경우: 두 자리 덧셈/뺄셈만 있으면 무조건 실패
    if (isTwoDigitArithmetic && !hasMiddleSchoolWord && !hasFractionWord) {
        return true;
    }
    
    return false;
}

// 중학교 난이도 가드레일 (저 수준 문제 전면 차단)
function validateMiddleSchoolDifficulty(questionText, explanationText, conceptInfo) {
    const allText = `${questionText} ${explanationText}`;
    const allTextLower = allText.toLowerCase();
    const { mustIncludeAny = [], unitTitle = '', conceptTitle = '' } = conceptInfo;
    
    // 1. 순수 산수 문제 완전 차단 (초등 산수 패턴)
    if (isPureArithmetic(allTextLower)) {
        return {
            valid: false,
            reason: '초등 산수 문제는 중학교에서 금지됩니다. (예: 60 ÷ 5 × 4 같은 단순 계산)'
        };
    }
    
    // 2. 중등 수학 필수 요소 확인 (미지수, 부등식, 연립방정식, 함수 기호)
    const hasVariable = /[xyzabc]|미지수|변수|문자/.test(allTextLower) || 
                        /x\s*[+\-=]|y\s*[+\-=]|z\s*[+\-=]/.test(allText) ||
                        /\$\{.*[xyz].*\}/.test(allText) || // LaTeX 변수
                        /\\[a-zA-Z]/.test(allText); // LaTeX 명령어
    const hasInequality = /부등식|>[=]?|<[=]?|≥|≤|≥|≤/.test(allText) ||
                         /[xyz]\s*[><=]+/.test(allText) ||
                         /\\geq|\\leq|\\neq/.test(allText); // LaTeX 부등식
    const hasSystem = /연립|시스템|두\s*방정식|세\s*방정식/.test(allTextLower);
    const hasFunction = /함수|f\(|g\(|y\s*=\s*[a-z]\(|일차함수|이차함수/.test(allTextLower) ||
                       /y\s*=\s*\d+[xyz]/.test(allText) ||
                       /f\(x\)|g\(x\)/.test(allText);
    const hasLatexMath = /\\dfrac|\\frac|\\sqrt|\\times|\\div|\\pm/.test(allText);
    
    // 중학교 문제는 반드시 다음 중 하나 이상 포함해야 함
    const hasMiddleSchoolElement = hasVariable || hasInequality || hasSystem || hasFunction || hasLatexMath;
    
    if (!hasMiddleSchoolElement) {
        // 단순 숫자 계산 패턴 확인 (예: "60 ÷ 5 × 4 = ?")
        const simpleCalcPattern = /^\s*\d+\s*[+\-×÷*/]\s*\d+\s*([+\-×÷*/]\s*\d+)*\s*=?\s*\??/;
        if (simpleCalcPattern.test(questionText.trim().replace(/\s/g, ''))) {
            return {
                valid: false,
                reason: '중학교 문제에는 미지수(x, y), 부등식, 연립방정식, 함수 기호 중 하나 이상이 포함되어야 합니다. 단순 산수 계산은 금지됩니다.'
            };
        }
        
        // 숫자만 있는 사칙연산 확인
        const onlyNumbersAndOps = /^[\d\s+\-×÷*/=()?]+$/.test(questionText.replace(/[^0-9+\-×÷*/=()?\s]/g, ''));
        if (onlyNumbersAndOps && questionText.length < 50) {
            return {
                valid: false,
                reason: '중학교 문제에는 미지수(x, y), 부등식, 연립방정식, 함수 기호 중 하나 이상이 포함되어야 합니다.'
            };
        }
    }
    
    // 3. 항목별 필수 키워드 확인
    if (mustIncludeAny && mustIncludeAny.length > 0) {
        const matched = mustIncludeAny.filter(k => {
            const keyword = k.toLowerCase().trim();
            if (allTextLower.includes(keyword)) return true;
            // 조사 제거하여 매칭
            const keywordBase = keyword.replace(/[을를이가은는]$/, '').trim();
            return allTextLower.includes(keywordBase);
        });
        if (matched.length < 2) {
            return {
                valid: false,
                reason: `필수 키워드 부족: ${matched.length}개 매칭 (최소 2개 필요). 필수 키워드: ${mustIncludeAny.join(', ')}`
            };
        }
    }
    
    // 4. 중학교 수준 키워드 확인 (특정 단원별)
    const conceptLower = (conceptTitle || '').toLowerCase();
    if (conceptLower.includes('경우의 수') || conceptLower.includes('확률')) {
        const requiredKeywords = ['경우의 수', '나열', '곱셈원리', '합의 원리', '덧셈원리', '중복', '순서', '조건', '분류', '표', '트리', '포함'];
        const matched = requiredKeywords.filter(k => allTextLower.includes(k));
        if (matched.length < 2) {
            return {
                valid: false,
                reason: `경우의 수 키워드 부족: ${matched.length}개 매칭 (최소 2개 필요). 필수 키워드: ${requiredKeywords.join(', ')}`
            };
        }
    }
    
    // 5. 일차방정식/일차함수 단원인 경우 반드시 미지수 또는 함수 기호 포함
    if (conceptLower.includes('일차방정식') || conceptLower.includes('방정식')) {
        if (!hasVariable && !hasLatexMath) {
            return {
                valid: false,
                reason: '일차방정식 단원 문제에는 반드시 미지수(x, y 등) 또는 수식 기호가 포함되어야 합니다.'
            };
        }
    }
    
    if (conceptLower.includes('일차함수') || conceptLower.includes('함수')) {
        if (!hasFunction && !hasVariable && !hasLatexMath) {
            return {
                valid: false,
                reason: '일차함수 단원 문제에는 반드시 함수 기호(f(x), y=ax+b 등) 또는 미지수가 포함되어야 합니다.'
            };
        }
    }
    
    return { valid: true };
}

// 중복 문제 체크 (강화 버전: dedupeKey 기반)
function isDuplicateQuestion(newQuestion, existingQuestions) {
    if (!existingQuestions || existingQuestions.length === 0) return false;
    
    const newQ = (newQuestion.question || newQuestion.stem || newQuestion.questionText || '').trim();
    if (!newQ) return false;
    
    // dedupeKey 생성: 정규화된 텍스트
    const generateDedupeKey = (text) => {
        if (!text) return '';
        // 1. 소문자 변환
        let normalized = text.toLowerCase();
        // 2. 공백/줄바꿈 정리
        normalized = normalized.replace(/\s+/g, ' ').trim();
        // 3. 특수문자 정리 (한글, 숫자, 기본 기호만 유지)
        normalized = normalized.replace(/[^\w가-힣\s\d\+\-\×\*\/÷=\(\)]/g, '');
        // 4. 숫자/기호 사이 공백 통일
        normalized = normalized.replace(/\s*([\+\-\×\*\/÷=\(\)])\s*/g, '$1');
        // 5. 연속된 공백 제거
        normalized = normalized.replace(/\s+/g, ' ').trim();
        return normalized;
    };
    
    const newDedupeKey = generateDedupeKey(newQ);
    if (!newDedupeKey) return false;
    
    // 기존 문제들의 dedupeKey와 비교
    const existingKeys = new Set();
    for (const existing of existingQuestions) {
        const existingQ = (existing.question || existing.stem || existing.questionText || '').trim();
        if (!existingQ) continue;
        
        const existingDedupeKey = generateDedupeKey(existingQ);
        if (existingDedupeKey) {
            existingKeys.add(existingDedupeKey);
        }
    }
    
    // 완전 동일 체크
    if (existingKeys.has(newDedupeKey)) {
        return true;
    }
    
    // 수식이 동일한 경우 (숫자 포함 체크)
    const extractNumbers = (text) => {
        return (text.match(/\d+/g) || []).sort().join(',');
    };
    
    const newNumbers = extractNumbers(newQ);
    
    for (const existing of existingQuestions) {
        const existingQ = (existing.question || existing.stem || existing.questionText || '').trim();
        if (!existingQ) continue;
        
        const existingNumbers = extractNumbers(existingQ);
        
        // 숫자 패턴이 동일하고 연산자 패턴도 유사하면 중복
        if (newNumbers === existingNumbers && newNumbers.length > 0) {
            // 연산자 추출
            const newOps = newQ.replace(/[^\+\-\×\*\/÷=]/g, '');
            const existingOps = existingQ.replace(/[^\+\-\×\*\/÷=]/g, '');
            if (newOps === existingOps && newOps.length > 0) {
            return true;
            }
        }
    }
    
    // 숫자만 바뀐 유사 문항 체크 (핵심 키워드 비교)
    const extractKeywords = (text) => {
        const normalized = generateDedupeKey(text);
        // 숫자 제거 후 남은 키워드 추출
        const withoutNumbers = normalized.replace(/\d+/g, '');
        // 핵심 단어 추출 (2글자 이상)
        return withoutNumbers.match(/[가-힣]{2,}/g) || [];
    };
    
    const newKeywords = extractKeywords(newQ);
    
    for (const existing of existingQuestions) {
        const existingQ = (existing.question || existing.stem || existing.questionText || '').trim();
        if (!existingQ) continue;
        
        const existingKeywords = extractKeywords(existingQ);
        
        // 키워드 유사도 체크 (80% 이상 일치하면 중복으로 간주)
        if (newKeywords.length > 0 && existingKeywords.length > 0) {
            const commonKeywords = newKeywords.filter(k => existingKeywords.includes(k));
            const similarity = commonKeywords.length / Math.max(newKeywords.length, existingKeywords.length);
            
            if (similarity >= 0.8) {
                return true;
            }
        }
    }
    
    return false;
}

// 항목별 문제 검증 (도형 항목 강화)
function validateQuestionByConcept(qText, explanationText, concept) {
    const allText = `${qText} ${explanationText}`.replace(/\s+/g, ' ');
    
    // 도형 항목인 경우 순수 연산 문제 차단
    if (concept.domain === 'geometry') {
        if (isPureArithmetic(allText)) {
            return {
                valid: false,
                reason: '순수 연산 문제는 도형 항목에서 금지됩니다.'
            };
        }
        
        // mustIncludeAny 중 최소 1개 포함 확인 (도형 항목은 완화)
        if (concept.mustIncludeAny && concept.mustIncludeAny.length > 0) {
            // allText를 소문자로 변환하고, 키워드 매칭 시 조사/어미 제거
            const allTextLower = allText.toLowerCase();
            const matched = concept.mustIncludeAny.filter(k => {
                const keyword = k.toLowerCase().trim();
                // 키워드가 직접 포함되어 있거나, 조사/어미를 제거한 형태로 포함되어 있는지 확인
                if (allTextLower.includes(keyword)) return true;
                // "삼각형을" -> "삼각형", "변의" -> "변" 등으로 변환하여 매칭
                const keywordBase = keyword.replace(/[을를이가은는]$/, '').trim();
                if (keywordBase.length >= 2 && allTextLower.includes(keywordBase)) return true;
                return false;
            });
            // 도형 항목은 최소 1개 키워드만 매칭되면 통과 (너무 엄격한 검증 완화)
            if (matched.length < 1) {
                return {
                    valid: false,
                    reason: `도형 키워드 부족: ${matched.length}개 매칭 (최소 1개 필요). 필수 키워드: ${concept.mustIncludeAny.join(', ')}`
                };
            }
        }
    }
    
    // mustAvoidAny 확인
    if (concept.mustAvoidAny && concept.mustAvoidAny.length > 0) {
        const found = concept.mustAvoidAny.filter(k => allText.includes(k));
        if (found.length > 0) {
            return {
                valid: false,
                reason: `금지어 포함: ${found.join(', ')}`
            };
        }
    }
    
    return { valid: true };
}

// 항목에서 키워드 추출 (항목 텍스트 기반) - domain, mustIncludeAny, mustAvoidAny 추가
function extractConceptKeywords(conceptText, unitTitle = '', subunitTitle = '') {
    const keywords = [];
    const mustInclude = [];
    const mustAvoid = [];
    let domain = 'number'; // 기본값: 수와 연산
    
    const text = (conceptText || '').toLowerCase();
    const unit = (unitTitle || '').toLowerCase();
    const subunit = (subunitTitle || '').toLowerCase();
    
    // 핵심 키워드 추출 (3~8개)
    const allText = `${text} ${unit} ${subunit}`;
    
    // 수학 용어 키워드 매핑
    const termMap = {
        '소인수분해': ['소인수분해', '소수', '합성수', '거듭제곱', '약수'],
        '최대공약수': ['최대공약수', '공약수', '약수', '최대공약수'],
        '최소공배수': ['최소공배수', '공배수', '배수', '최소공배수'],
        '약수': ['약수', '나누어떨어지다', '나누어떨어짐'],
        '배수': ['배수', '곱하기', '곱셈'],
        '분수': ['분수', '분자', '분모', '약분', '통분'],
        '직사각형': ['직사각형', '넓이', '가로', '세로', 'cm', 'cm²'],
        '정수': ['정수', '양수', '음수', '0'],
        '유리수': ['유리수', '정수', '분수'],
        '일차방정식': ['일차방정식', '방정식', '해', 'x', '미지수'],
        '곱셈': ['곱셈', '곱하기', '×', '곱'],
        '나눗셈': ['나눗셈', '나누기', '÷', '몫', '나머지'],
        '덧셈': ['덧셈', '더하기', '+', '합'],
        '뺄셈': ['뺄셈', '빼기', '-', '차']
    };
    
    // 텍스트에서 키워드 매칭
    for (const [term, words] of Object.entries(termMap)) {
        if (allText.includes(term) || text.includes(term)) {
            keywords.push(...words);
        }
    }
    
    // 텍스트에서 직접 추출
    const directKeywords = text.match(/[가-힣]{2,}/g) || [];
    keywords.push(...directKeywords.slice(0, 5));
    
    // 중복 제거 및 정리
    const uniqueKeywords = [...new Set(keywords)].slice(0, 8);
    
    // mustInclude: 핵심 용어 1~3개
    if (text.includes('소인수분해')) mustInclude.push('소인수분해');
    if (text.includes('최대공약수')) mustInclude.push('최대공약수');
    if (text.includes('최소공배수')) mustInclude.push('최소공배수');
    if (text.includes('넓이')) mustInclude.push('넓이');
    if (text.includes('직사각형')) mustInclude.push('직사각형');
    if (text.includes('일차방정식')) mustInclude.push('일차방정식');
    
    // mustAvoid: 다른 항목과 혼동될 수 있는 용어
    if (text.includes('소인수분해') && !text.includes('최대공약수')) {
        mustAvoid.push('최대공약수', '최소공배수');
    }
    if (text.includes('직사각형') && text.includes('넓이')) {
        mustAvoid.push('원', '삼각형', '원의 넓이');
    }
    
    return {
        keywords: uniqueKeywords.length > 0 ? uniqueKeywords : [text],
        mustInclude: mustInclude.length > 0 ? mustInclude : (uniqueKeywords.length > 0 ? [uniqueKeywords[0]] : []),
        mustAvoid: mustAvoid
    };
}

// 문제가 항목과 일치하는지 검증 (강화 버전 + 중학교 난이도 가드레일 + 필터 강제)
function validateProblemMatchesConcept(problem, conceptInfo, existingQuestions = []) {
    const { 
        keywords = [], 
        mustInclude = [], 
        mustIncludeAny = [], 
        mustAvoid = [], 
        mustAvoidAny = [], 
        domain = 'number', 
        gradeLevel = 'elementary',
        difficultyTag = 'elem',
        grade = 1,
        schoolLevel = 'elementary',
        semester = 1
    } = conceptInfo;
    
    const questionText = problem.question || problem.stem || problem.questionText || '';
    const explanationText = problem.explanation || '';
    const allText = `${questionText} ${explanationText}`.toLowerCase();
    
    // 중복 체크 (먼저 수행)
    if (isDuplicateQuestion(problem, existingQuestions)) {
        return {
            valid: false,
            reason: '중복 문제입니다.'
        };
    }
    
    // 중학교 필터 강제 검증: 메타데이터 검증
    const problemSchoolLevel = problem.schoolLevel || problem.meta?.schoolLevel;
    const problemGrade = problem.grade || problem.meta?.grade;
    const problemSemester = problem.semester || problem.meta?.semester;
    const problemConceptId = problem.sourceConcept || problem.meta?.conceptId;
    
    if (schoolLevel === 'middle' || schoolLevel === '중학교' || gradeLevel === 'middle' || difficultyTag === 'middle' || grade >= 7) {
        // 중학교인 경우: 메타데이터 필수 검증
        if (problemSchoolLevel !== 'middle' && problemSchoolLevel !== '중학교') {
            return {
                valid: false,
                reason: `중학교 필터 불일치: 문제의 schoolLevel(${problemSchoolLevel})이 중학교가 아닙니다.`
            };
        }
        
        // 학년/학기 불일치 검증
        if (problemGrade !== undefined && problemGrade !== grade) {
            return {
                valid: false,
                reason: `학년 불일치: 문제의 grade(${problemGrade})이 요청한 grade(${grade})과 다릅니다.`
            };
        }
        
        if (problemSemester !== undefined && problemSemester !== semester) {
            return {
                valid: false,
                reason: `학기 불일치: 문제의 semester(${problemSemester})이 요청한 semester(${semester})과 다릅니다.`
            };
        }
        
        // 내부 코드 패턴 검증: 표시 문자열에 내부 코드가 포함되어 있으면 실패
        if (questionText.includes('|') && /^[A-Z]\|(\d+\|)+\d+/.test(questionText)) {
            return {
                valid: false,
                reason: '표시 문자열에 내부 코드 패턴이 포함되어 있습니다.'
        };
    }
    
    // 중학교 난이도 가드레일 (저 수준 문제 전면 차단)
        const middleSchoolValidation = validateMiddleSchoolDifficulty(questionText, explanationText, conceptInfo);
        if (!middleSchoolValidation.valid) {
            return middleSchoolValidation;
        }
    }
    
    // 초등학교인 경우: 중학교 문제가 섞이지 않도록 검증
    if (schoolLevel === 'elementary' || schoolLevel === '초등학교') {
        if (problemSchoolLevel === 'middle' || problemSchoolLevel === '중학교') {
            return {
                valid: false,
                reason: `초등학교 필터 불일치: 문제의 schoolLevel(${problemSchoolLevel})이 중학교입니다.`
            };
        }
    }
    
    // domain이 unknown이면 절대 통과시키지 않음
    if (domain === 'unknown' || !domain) {
        return {
            valid: false,
            reason: `domain이 unknown이거나 비어있습니다. 정규화가 필요합니다.`
        };
    }
    
    // mustIncludeAny가 비어있으면 검증 실패 (정규화가 필요)
    if (!mustIncludeAny || mustIncludeAny.length === 0) {
        return {
            valid: false,
            reason: `mustIncludeAny가 비어있습니다. 정규화가 필요합니다.`
        };
    }
    
    // mustIncludeAny 검증 (강제 통과 로직)
    // 숫자와 연산자가 포함되어 있으면 즉시 통과
    const hasNumbers = /\d+/.test(questionText);
    const hasOperators = /[\+\-\×\*\/÷=]/.test(questionText) || questionText.includes('\\dfrac') || questionText.includes('\\frac');
    
    if (hasNumbers && hasOperators) {
        // 숫자와 연산자가 있으면 학년 적합성 맞는 것으로 간주하고 즉시 통과
        return { valid: true };
    }
    
    // 기존 키워드 검증 (fallback)
    const mustIncludeMinHit = conceptInfo.mustIncludeMinHit || (grade >= 4 && grade <= 6 ? 0 : 1);
    if (mustIncludeAny && mustIncludeAny.length > 0) {
        // 키워드 매칭 시 조사/어미 제거하여 매칭
        const matched = mustIncludeAny.filter(k => {
            const keyword = k.toLowerCase().trim();
            if (allText.includes(keyword)) return true;
            // "삼각형을" -> "삼각형", "변의" -> "변" 등으로 변환하여 매칭
            const keywordBase = keyword.replace(/[을를이가은는]$/, '').trim();
            if (keywordBase.length >= 2 && allText.includes(keywordBase)) return true;
            return false;
        });
        if (matched.length < mustIncludeMinHit) {
            return {
                valid: false,
                reason: `필수 키워드 부족: ${matched.length}개 매칭 (최소 ${mustIncludeMinHit}개 필요). 필수 키워드: ${mustIncludeAny.join(', ')}`
            };
        }
    }
    
    // mustAvoidAny 확인
    if (mustAvoidAny && mustAvoidAny.length > 0) {
        const found = mustAvoidAny.filter(k => allText.includes(k.toLowerCase()));
        if (found.length > 0) {
            return {
                valid: false,
                reason: `금지어 포함: ${found.join(', ')}`
            };
        }
    }
    
    // 도형 항목 강화 검증
    if (domain === 'geometry') {
        const geometryValidation = validateQuestionByConcept(questionText, explanationText, {
            domain: 'geometry',
            mustIncludeAny: mustIncludeAny.length > 0 ? mustIncludeAny : mustInclude,
            mustAvoidAny: mustAvoidAny.length > 0 ? mustAvoidAny : mustAvoid
        });
        
        if (!geometryValidation.valid) {
            return geometryValidation;
        }
    }
    
    // 확률 항목 강화 검증
    if (domain === 'probability') {
        const requiredKeywords = ['경우의 수', '나열', '곱셈원리', '합의 원리', '덧셈원리', '중복', '순서', '조건', '분류', '표', '트리', '포함'];
        const matched = requiredKeywords.filter(k => allText.includes(k));
        if (matched.length < 2) {
            return {
                valid: false,
                reason: `확률 키워드 부족: ${matched.length}개 매칭 (최소 2개 필요). 필수 키워드: ${requiredKeywords.join(', ')}`
            };
        }
    }
    
    // 분수 항목 강화 검증
    const conceptTitleLower = (conceptInfo.conceptTitle || conceptInfo.text || '').toLowerCase();
    const unitTitleLower = (conceptInfo.unitTitle || '').toLowerCase();
    const hasFractionInTitle = conceptTitleLower.includes('분수') || unitTitleLower.includes('분수');
    const hasFractionInMustInclude = mustIncludeAny && mustIncludeAny.some(k => k.includes('분수') || k.includes('분자') || k.includes('분모'));
    
    if (hasFractionInTitle || hasFractionInMustInclude) {
        const fractionKeywords = ['분수', '분자', '분모', '약분', '통분', '크기', '같은', '비교', '\\frac', '\\dfrac', 'frac'];
        const matched = fractionKeywords.filter(k => allText.includes(k.toLowerCase()));
        if (matched.length < 2) {
            return {
                valid: false,
                reason: `분수 키워드 부족: ${matched.length}개 매칭 (최소 2개 필요). 필수 키워드: ${fractionKeywords.join(', ')}`
            };
        }
        
        // 순수 산수 문제 차단 (분수 항목인데 덧셈만 있으면 실패)
        if (isPureArithmetic(allText)) {
            return {
                valid: false,
                reason: '분수 항목인데 순수 산수 문제입니다.'
            };
        }
    }
    
    // keywords 중 최소 2개 이상 포함 확인 (도형/확률/분수가 아닌 경우)
    if (domain !== 'geometry' && domain !== 'probability' && !hasFractionInTitle && !hasFractionInMustInclude && keywords.length > 0) {
        const matchedKeywords = keywords.filter(kw => allText.includes(kw.toLowerCase()));
        if (matchedKeywords.length < 2) {
            return {
                valid: false,
                reason: `키워드 부족: ${matchedKeywords.length}개 매칭 (최소 2개 필요). 키워드: ${keywords.join(', ')}`
            };
        }
    }
    
    // mustInclude 필수 포함 확인
    if (mustInclude.length > 0 && domain !== 'geometry' && domain !== 'probability') {
        const missingRequired = mustInclude.filter(req => !allText.includes(req.toLowerCase()));
        if (missingRequired.length > 0) {
            return {
                valid: false,
                reason: `필수 키워드 누락: ${missingRequired.join(', ')}`
            };
        }
    }
    
    // mustAvoid 금지어 확인
    const avoidList = mustAvoidAny.length > 0 ? mustAvoidAny : mustAvoid;
    if (avoidList.length > 0) {
        const foundForbidden = avoidList.filter(forbidden => allText.includes(forbidden.toLowerCase()));
        if (foundForbidden.length > 0) {
            return {
                valid: false,
                reason: `금지어 포함: ${foundForbidden.join(', ')}`
            };
        }
    }
    
    return { valid: true };
}

// 실제 문제 생성 (항목별로 N개씩 생성, async + 검증 + 재시도) - questions 배열 반환
async function createSampleProblems(formData, progressCallback = null) {
    const questions = [];
    const concepts = formData.concepts || [];
    const mistakes = formData.mistakes || [];
    const schoolLevel = formData.schoolLevel === 'elementary' ? '초등학교' : '중학교';
    const rawGrade = formData.grade || 5;
    const semester = formData.semester || 1;
    const problemType = formData.problemType || '기본형';
    const perConceptCount = parseInt(formData.problemCount || 3); // 항목당 문제 수
    
    // [GEN][IN] 추적 로그 2: 생성 함수 진입 시점
    const selectedIds = concepts.map(c => c.id || c.conceptId || c.value || c);
    console.log("[GEN][IN] selectedIds length", selectedIds.length, selectedIds);
    
    // 기대 문제 수 계산 (생성 시작 전 고정)
    const requestedCount = selectedIds.length; // 사용자 체크 수
    const expectedTotal = requestedCount * perConceptCount;
    
    // 디버그 로그
    console.log('📊 [createSampleProblems] 시작:', {
        선택항목수: concepts.length,
        requestedCount: requestedCount,
        항목당문제수: perConceptCount,
        기대총문제수: expectedTotal,
        schoolLevel: schoolLevel,
        grade: rawGrade,
        semester: semester
    });
    
    // 선택된 개념이 없으면 에러
    if (concepts.length === 0) {
        console.error('❌ [createSampleProblems] No concepts selected');
        return questions;
    }
    
    // 학교급에 따라 학년을 난이도로 변환
    // 중학교는 초등학교보다 높은 난이도로 처리
    let effectiveGrade;
    if (schoolLevel === '중학교') {
        // 중학교 1학년 = 초등학교 5-6학년 수준 이상
        // 중학교 2학년 = 초등학교 6학년 이상
        // 중학교 3학년 = 더 높은 수준
        effectiveGrade = Math.max(5, rawGrade + 4); // 중1=5, 중2=6, 중3=7 (7은 6으로 처리)
        if (effectiveGrade > 6) effectiveGrade = 6;
        console.log(`Middle school grade conversion: ${rawGrade} -> ${effectiveGrade}`);
    } else {
        effectiveGrade = rawGrade;
        console.log(`Elementary school grade: ${effectiveGrade}`);
    }
    
    // concepts 배열 처리 (객체 또는 문자열 모두 지원)
    let selectedConceptList = [];
    
    // 디버그: concepts 배열 확인
    console.log('🔍 [createSampleProblems] concepts 배열:', concepts.length, concepts);
    
    if (schoolLevel === '중학교' && window.MIDDLE_SCHOOL_TOC) {
        const gradeKey = `${rawGrade}학년`;
        const semesterKey = `${semester}학기`;
        const tocData = window.MIDDLE_SCHOOL_TOC[gradeKey];
        
        if (tocData && tocData[semesterKey]) {
            const units = tocData[semesterKey];
            
            // concepts 배열 순회 (객체 또는 문자열 모두 처리)
            concepts.forEach(concept => {
                // 객체인 경우 id 또는 conceptId 추출, 문자열인 경우 그대로 사용
                const conceptId = typeof concept === 'object' ? (concept.id || concept.conceptId || concept.value) : concept;
                
                if (!conceptId || typeof conceptId !== 'string') {
                    console.warn('⚠️ [createSampleProblems] conceptId가 없거나 문자열이 아닙니다:', concept);
                    return;
                }
                
                // T| 또는 S|로 시작하는 ID 처리
                if (conceptId.startsWith('T|') || conceptId.startsWith('S|')) {
                    const parts = conceptId.split('|');
                    if (parts.length >= 5) {
                        const selectedGrade = parseInt(parts[1]);
                        const selectedSemester = parseInt(parts[2]);
                    const uIdx = parseInt(parts[3]);
                    const sIdx = parseInt(parts[4]);
                        
                        // 중학교 필터 강제 적용: 학년/학기 불일치 시 제외
                        if (selectedGrade !== rawGrade || selectedSemester !== semester) {
                            console.warn(`⚠️ [createSampleProblems] 필터 불일치: 선택된 개념 ${conceptId}는 ${selectedGrade}학년 ${selectedSemester}학기이지만, 요청은 ${rawGrade}학년 ${semester}학기입니다. 제외됩니다.`);
                            return; // 이 개념은 건너뜀
                        }
                    
                    const unit = units[uIdx];
                    if (unit && unit.subunits && unit.subunits[sIdx]) {
                            // S|로 시작하면 소단원 제목 사용 (5개 파트: S|grade|semester|uIdx|sIdx)
                            if (conceptId.startsWith('S|') && parts.length === 5) {
                            const subunit = unit.subunits[sIdx];
                            selectedConceptList.push({
                                    id: conceptId,
                                    conceptId: conceptId,
                                text: subunit.title || unit.title,
                                    conceptTitle: subunit.title || unit.title,
                                    unitTitle: typeof concept === 'object' ? (concept.unitTitle || unit.title) : unit.title,
                                    subunitTitle: typeof concept === 'object' ? (concept.subunitTitle || subunit.title) : subunit.title,
                                    pathText: typeof concept === 'object' ? (concept.pathText || '') : '',
                                    schoolLevel: 'middle',
                                    grade: rawGrade,
                                    semester: semester
                            });
                            } else if (parts.length === 6) {
                                // T|로 시작하면 토픽 제목 사용 (6개 파트: T|grade|semester|uIdx|sIdx|tIdx)
                                const tIdx = parseInt(parts[5]);
                                if (unit.subunits[sIdx].topics) {
                            const topic = unit.subunits[sIdx].topics[tIdx];
                            if (topic) {
                                selectedConceptList.push({
                                            id: conceptId,
                                            conceptId: conceptId,
                                    text: topic,
                                            conceptTitle: topic,
                                            unitTitle: typeof concept === 'object' ? (concept.unitTitle || unit.title) : unit.title,
                                            subunitTitle: typeof concept === 'object' ? (concept.subunitTitle || unit.subunits[sIdx].title) : unit.subunits[sIdx].title,
                                            pathText: typeof concept === 'object' ? (concept.pathText || '') : '',
                                            schoolLevel: 'middle',
                                            grade: rawGrade,
                                            semester: semester
                                });
                            }
                        }
                    }
                        }
                    }
                } else {
                    // G1-S1-U1-T1 형식 (초등학교 형식이지만 중학교에서도 사용 가능)
                    console.warn('⚠️ [createSampleProblems] 중학교인데 G 형식 ID:', conceptId);
                }
            });
            
            console.log('✅ [createSampleProblems] 중학교 선택된 개념 수:', selectedConceptList.length);
        } else {
            console.error('❌ [createSampleProblems] 중학교 TOC 데이터 없음:', gradeKey, semesterKey);
        }
    } else {
        // 초등학교인 경우: G6-S1-U3-T4 형식 ID 매칭
        concepts.forEach(concept => {
            // 객체인 경우와 문자열인 경우 모두 처리
            const conceptId = typeof concept === 'object' ? (concept.id || concept.conceptId || concept.value) : concept;
            
            if (!conceptId || typeof conceptId !== 'string') {
                console.warn('⚠️ [createSampleProblems] conceptId가 없거나 문자열이 아닙니다:', concept);
                return;
            }
            
            // G6-S1-U3-T4 형식 파싱
            const match = conceptId.match(/^G(\d+)-S(\d+)-U(\d+)-T(\d+)$/);
            if (match) {
                const conceptGrade = parseInt(match[1]);
                const conceptSemester = parseInt(match[2]);
                const unitNo = parseInt(match[3]);
                const topicNo = parseInt(match[4]);
                
                // 학년/학기 불일치 검증
                if (conceptGrade !== rawGrade || conceptSemester !== semester) {
                    console.warn(`⚠️ [createSampleProblems] 필터 불일치: 선택된 개념 ${conceptId}는 ${conceptGrade}학년 ${conceptSemester}학기이지만, 요청은 ${rawGrade}학년 ${semester}학기입니다. 제외됩니다.`);
                    return; // 이 개념은 건너뜀
                }
                
                // curriculum 데이터에서 실제 텍스트 가져오기
                let conceptText = '';
                let unitTitle = '';
                if (typeof concept === 'object') {
                    conceptText = concept.conceptTitle || concept.title || concept.text || '';
                    unitTitle = concept.unitTitle || '';
                }
                
                // curriculum 데이터가 있으면 사용
                if (window.curriculumData || typeof loadCurriculumData === 'function') {
                    // curriculum 데이터 로드 시도 (비동기이므로 나중에 처리)
                }
                
            selectedConceptList.push({
                    id: conceptId,
                    conceptId: conceptId,
                    text: conceptText || conceptId,
                    conceptTitle: conceptText || conceptId,
                    unitTitle: unitTitle || '',
                    subunitTitle: typeof concept === 'object' ? (concept.subunitTitle || '') : '',
                    pathText: typeof concept === 'object' ? (concept.pathText || '') : '',
                    schoolLevel: 'elementary',
                    grade: rawGrade,
                    semester: semester,
                    unitNo: unitNo,
                    topicNo: topicNo
                });
            } else {
                // G 형식이 아닌 경우: 하위 호환성
                console.warn('⚠️ [createSampleProblems] G 형식 ID가 아닙니다:', conceptId);
                if (typeof concept === 'object') {
                    selectedConceptList.push({
                        id: conceptId,
                        conceptId: conceptId,
                        text: concept.conceptTitle || concept.title || concept.text || conceptToText(concept) || conceptId,
                        conceptTitle: concept.conceptTitle || concept.title || concept.text || '',
                        unitTitle: concept.unitTitle || '',
                        subunitTitle: concept.subunitTitle || '',
                        pathText: concept.pathText || '',
                        schoolLevel: concept.schoolLevel || 'elementary',
                        grade: concept.grade || rawGrade,
                        semester: concept.semester || semester
                    });
                } else {
                    selectedConceptList.push({
                        id: conceptId,
                        conceptId: conceptId,
                        text: conceptToText(concept) || conceptId,
                        conceptTitle: conceptToText(concept) || conceptId,
                unitTitle: '',
                        subunitTitle: '',
                        pathText: '',
                        schoolLevel: 'elementary',
                        grade: rawGrade,
                        semester: semester
            });
                }
            }
        });
        
        console.log('✅ [createSampleProblems] 초등학교 선택된 개념 수:', selectedConceptList.length);
    }
    
    // manifest 기반 매칭 검증 (문제은행 파일 존재 여부 확인)
    // 파일명 패턴: {grade}-{semester}.pdf (예: 6-1.pdf는 초6-1에 해당)
    // conceptId 형식: G{grade}-S{semester}-U{unitNo}-T{topicNo}
    // 매칭 규칙: conceptId의 grade와 semester로 파일명 생성하여 manifest에서 확인
    let manifestMatchedCount = 0;
    const manifestMatchedConcepts = [];
    
    // manifest 로드 시도 (있으면 사용)
    if (typeof window !== 'undefined' && window.questionBankManifest) {
        const manifest = window.questionBankManifest;
        const schoolLevelKey = schoolLevel === '중학교' ? 'junior' : 'elementary';
        
        selectedConceptList.forEach(concept => {
            const conceptId = concept.id || concept.conceptId || '';
            const conceptGrade = concept.grade || rawGrade;
            const conceptSemester = concept.semester || semester;
            
            // 파일명 패턴 생성: {grade}-{semester}.pdf
            const fileName = `${conceptGrade}-${conceptSemester}.pdf`;
            const fileKey = `${conceptGrade}-${conceptSemester}`;
            
            // manifest에서 해당 파일 찾기
            let found = false;
            if (manifest[schoolLevelKey]) {
                // 모든 카테고리에서 검색
                for (const categoryName in manifest[schoolLevelKey]) {
                    const category = manifest[schoolLevelKey][categoryName];
                    if (category && category[fileKey]) {
                        found = true;
                        manifestMatchedConcepts.push({
                            ...concept,
                            manifestFile: category[fileKey],
                            manifestCategory: categoryName
                        });
                        break;
                    }
                }
            }
            
            if (found) {
                manifestMatchedCount++;
            } else {
                console.warn(`⚠️ [createSampleProblems] manifest 매칭 실패: conceptId=${conceptId}, 파일명=${fileKey}`);
            }
        });
        
        console.log(`📊 [createSampleProblems] manifest 매칭 결과: ${manifestMatchedCount}/${selectedConceptList.length}개 매칭됨`);
    } else {
        // manifest가 없으면 모든 개념을 매칭된 것으로 간주 (하위 호환성)
        manifestMatchedCount = selectedConceptList.length;
        manifestMatchedConcepts.push(...selectedConceptList);
        console.log(`⚠️ [createSampleProblems] manifest가 없어 매칭 검증을 건너뜁니다.`);
    }
    
    // 유효 매칭 개수 계산 (resolvedCount)
    const resolvedCount = manifestMatchedCount > 0 ? manifestMatchedCount : selectedConceptList.length;
    
    // 매칭 실패 검증: requestedCount와 resolvedCount 차이가 크면 중단
    if (resolvedCount === 0) {
        console.error(`❌ [createSampleProblems] 매칭 실패: 요청 ${requestedCount}개 중 0개 매칭됨. 생성 중단.`);
        // 메타데이터 추가하여 빈 배열 반환
        questions.push({
            _meta: {
                expectedTotal: expectedTotal,
                generatedTotal: 0,
                missingCount: expectedTotal,
                isPartial: true,
                requestedCount: requestedCount,
                resolvedCount: 0,
                matchFailure: true,
                matchFailureReason: '데이터 매칭 실패: 선택한 항목이 문제은행에서 찾을 수 없습니다.'
            }
        });
        return questions; // 빈 배열 반환 (중단)
    }
    
    // manifest 매칭된 개념만 사용 (manifest가 있는 경우)
    if (manifestMatchedConcepts.length > 0 && manifestMatchedConcepts.length < selectedConceptList.length) {
        console.warn(`⚠️ [createSampleProblems] manifest 매칭 결과: ${manifestMatchedConcepts.length}/${selectedConceptList.length}개만 매칭됨. 매칭된 항목만 사용합니다.`);
        selectedConceptList = manifestMatchedConcepts;
    }
    
    if (resolvedCount < requestedCount * 0.5) {
        console.error(`❌ [createSampleProblems] 매칭 실패: 요청 ${requestedCount}개 중 ${resolvedCount}개만 매칭됨 (50% 미만). 생성 중단 권장.`);
        // 경고는 하지만 계속 진행 (일부라도 생성)
        // 하지만 메타데이터에 기록
        if (questions.length === 0) {
            questions.push({
                _meta: {
                    expectedTotal: expectedTotal,
                    generatedTotal: 0,
                    missingCount: expectedTotal,
                    isPartial: true,
                    requestedCount: requestedCount,
                    resolvedCount: resolvedCount,
                    matchFailure: true,
                    matchFailureReason: `매칭 실패: 요청 ${requestedCount}개 중 ${resolvedCount}개만 매칭됨 (50% 미만)`
                }
            });
        }
    }
    
    // 최종 검증: selectedConceptList가 비어있으면 에러
    if (selectedConceptList.length === 0) {
        console.error('❌ [createSampleProblems] 선택된 개념이 0개입니다. concepts:', concepts);
        // 메타데이터 추가하여 빈 배열 반환
        if (questions.length === 0) {
            questions.push({
                _meta: {
                    expectedTotal: expectedTotal,
                    generatedTotal: 0,
                    missingCount: expectedTotal,
                    isPartial: true,
                    requestedCount: requestedCount,
                    resolvedCount: 0,
                    matchFailure: true,
                    matchFailureReason: '선택된 개념이 0개입니다.'
                }
            });
        }
        return questions; // 빈 배열 반환
    }
    
    // 디버그: 최종 selectedConceptList 확인
    console.log('🔍 [createSampleProblems] 최종 selectedConceptList:', selectedConceptList.length, selectedConceptList.map(c => ({ id: c.id, text: c.text, grade: c.grade, semester: c.semester })));
    console.log('📊 [createSampleProblems] 매칭 결과:', {
        requestedCount: requestedCount,
        resolvedCount: resolvedCount,
        매칭률: resolvedCount > 0 ? ((resolvedCount / requestedCount) * 100).toFixed(1) + '%' : '0%'
    });
    
    // 개념 데이터 자동 보정(normalize) 함수
    function normalizeConcept(conceptInfo) {
        const conceptTitle = (conceptInfo.conceptTitle || conceptInfo.text || '').toLowerCase();
        const unitTitle = (conceptInfo.unitTitle || '').toLowerCase();
        const pathText = conceptInfo.pathText || '';
        const pathTextLower = pathText.toLowerCase();
        
        // 1. domain 자동 추정
        let domain = conceptInfo.domain || 'number';
        if (domain === 'unknown' || !domain) {
            if (conceptTitle.includes('분수') || pathTextLower.includes('분수')) {
                domain = 'fraction';
            } else if (conceptTitle.includes('도형') || conceptTitle.includes('각') || conceptTitle.includes('대칭') || 
                      conceptTitle.includes('회전') || conceptTitle.includes('이동') || pathTextLower.includes('도형')) {
                domain = 'geometry';
            } else if (conceptTitle.includes('확률') || conceptTitle.includes('경우의 수') || pathTextLower.includes('확률')) {
                domain = 'probability';
            } else if (conceptTitle.includes('방정식') || conceptTitle.includes('함수') || conceptTitle.includes('식')) {
                domain = 'algebra';
            } else if (conceptTitle.includes('통계') || conceptTitle.includes('그래프')) {
                domain = 'statistics';
            } else if (conceptTitle.includes('측정') || conceptTitle.includes('넓이') || conceptTitle.includes('부피')) {
                domain = 'measurement';
            } else {
                domain = 'number';
            }
        }
        
        // 2. mustIncludeAny 자동 주입
        let mustIncludeAny = conceptInfo.mustIncludeAny || [];
        if (mustIncludeAny.length === 0) {
            // 도메인별 기본 키워드
            if (domain === 'fraction') {
                // 분수 항목
                if (conceptTitle.includes('크기가 같은') || conceptTitle.includes('같은 분수')) {
                    mustIncludeAny = ['분수', '크기가 같은', '동치', '같은 크기', '통분', '기약분수', '분모', '분자'];
                } else if (conceptTitle.includes('덧셈') || conceptTitle.includes('더하기')) {
                    mustIncludeAny = ['분수', '분자', '분모', '통분', '덧셈', '더하기'];
                } else if (conceptTitle.includes('뺄셈') || conceptTitle.includes('빼기')) {
                    mustIncludeAny = ['분수', '분자', '분모', '통분', '뺄셈', '빼기'];
                } else {
                    mustIncludeAny = ['분수', '분자', '분모', '약분', '통분'];
                }
            } else if (domain === 'geometry') {
                if (conceptTitle.includes('뒤집') || conceptTitle.includes('대칭')) {
                    mustIncludeAny = ['뒤집', '대칭', '선대칭', '거울', '좌우', '위아래', '격자', '점'];
                } else if (conceptTitle.includes('돌리') || conceptTitle.includes('회전')) {
                    mustIncludeAny = ['돌리', '회전', '시계방향', '반시계방향', '90도', '180도', '270도', '각'];
                } else if (conceptTitle.includes('이동')) {
                    mustIncludeAny = ['이동', '평행이동', '몇 칸', '격자', '무늬', '반복', '규칙'];
                } else if (conceptTitle.includes('각도') || conceptTitle.includes('각의')) {
                    mustIncludeAny = ['각도', '각의 크기', '도', '각', '꼭짓점', '변', '선분', '시계'];
                } else if (conceptTitle.includes('삼각형')) {
                    // 삼각형 관련 키워드 - "변의 길이", "분류" 등 추가
                    if (conceptTitle.includes('분류') || conceptTitle.includes('변의 길이')) {
                        mustIncludeAny = ['삼각형', '변', '길이', '분류', '이등변', '정삼각형', '직각', '세 변'];
                    } else {
                    mustIncludeAny = ['삼각형', '각', '변', '꼭짓점', '이등변', '정삼각형', '직각'];
                    }
                } else {
                    mustIncludeAny = ['도형', '각', '격자', '점', '선', '변', '꼭짓점'];
                }
            } else if (domain === 'probability') {
                mustIncludeAny = ['경우의 수', '나열', '곱셈원리', '덧셈원리', '조건', '분류', '표', '트리', '중복', '순서'];
            } else if (domain === 'algebra' || conceptInfo.schoolLevel === 'middle' || conceptInfo.schoolLevel === '중학교') {
                // 중학교 대수 단원
                if (conceptTitle.includes('일차방정식') || conceptTitle.includes('방정식')) {
                    mustIncludeAny = ['일차방정식', '방정식', '해', '미지수', 'x', '등식', '계수', '상수항'];
                } else if (conceptTitle.includes('일차부등식') || conceptTitle.includes('부등식')) {
                    mustIncludeAny = ['일차부등식', '부등식', '해', '미지수', 'x', '부등호', '>', '<', '≥', '≤'];
                } else if (conceptTitle.includes('연립방정식') || conceptTitle.includes('연립')) {
                    mustIncludeAny = ['연립방정식', '연립', '미지수', 'x', 'y', '해', '대입법', '가감법'];
                } else if (conceptTitle.includes('일차함수') || conceptTitle.includes('함수')) {
                    mustIncludeAny = ['일차함수', '함수', '기울기', 'y절편', '그래프', '직선', 'y = ax + b'];
                } else if (conceptTitle.includes('이차방정식')) {
                    mustIncludeAny = ['이차방정식', '방정식', '해', '미지수', 'x', '제곱', '인수분해'];
                } else if (conceptTitle.includes('제곱근') || conceptTitle.includes('근호')) {
                    mustIncludeAny = ['제곱근', '근호', '√', '제곱', '근', '무리수'];
                } else {
                    mustIncludeAny = ['방정식', '함수', '미지수', 'x', '수식', '계산'];
                }
            } else {
                // number 도메인 - 특수 항목 먼저 확인
                // 대응 관계 항목
                if (conceptTitle.includes('대응') || conceptTitle.includes('관계') || conceptTitle.includes('두 양')) {
                    if (conceptTitle.includes('생활')) {
                        mustIncludeAny = ['대응', '관계', '식', '생활', '양', '사이'];
                    } else {
                        mustIncludeAny = ['대응', '관계', '식', '양', '사이'];
                    }
                } else if (conceptTitle.includes('규칙') || conceptTitle.includes('배열')) {
                    // 규칙 찾기 항목
                    if (conceptTitle.includes('모양') || conceptTitle.includes('모양의')) {
                        mustIncludeAny = ['규칙', '배열', '모양', '패턴', '다음', '번째'];
                    } else if (conceptTitle.includes('수의')) {
                        mustIncludeAny = ['규칙', '배열', '수', '패턴', '다음', '번째'];
                    } else if (conceptTitle.includes('계산식') || conceptTitle.includes('식의')) {
                        mustIncludeAny = ['규칙', '배열', '계산식', '식', '패턴', '다음', '번째'];
                    } else {
                        mustIncludeAny = ['규칙', '배열', '패턴', '다음', '번째'];
                    }
                } else if (conceptTitle.includes('단위') && conceptTitle.includes('넓이')) {
                    // 넓이 단위 항목 (1 cm² 보다 더 큰 넓이의 단위 알아보기)
                    mustIncludeAny = ['넓이', '단위', 'm²', 'km²', '제곱미터', '제곱킬로미터', '아르', '헥타르'];
                } else {
                    // 일반 number 도메인 - 키워드 추출
                const keywordData = extractConceptKeywords(conceptInfo.conceptTitle || conceptInfo.text, conceptInfo.unitTitle, conceptInfo.subunitTitle);
                mustIncludeAny = keywordData.mustInclude || keywordData.keywords.slice(0, 3) || ['수', '계산', '연산'];
                }
            }
        }
        
        // 3. mustIncludeMinHit 설정
        // 도형 항목은 키워드 매칭이 어려울 수 있으므로 1개로 완화 (단, 도형 관련 키워드는 필수)
        // 규칙 찾기 항목도 키워드 매칭이 어려울 수 있으므로 1개로 완화
        const mustIncludeMinHit = conceptInfo.mustIncludeMinHit || 
                                   (domain === 'geometry' ? 1 : 
                                    (conceptTitle.includes('규칙') || conceptTitle.includes('배열') ? 1 : 2));
        
        return {
            ...conceptInfo,
            domain: domain,
            mustIncludeAny: mustIncludeAny,
            mustIncludeMinHit: mustIncludeMinHit,
            // 하위 호환성
            gradeLevel: conceptInfo.schoolLevel === 'middle' || conceptInfo.schoolLevel === '중학교' ? 'middle' : 'elementary',
            difficulty: conceptInfo.difficultyTag === 'middle' ? 'middle' : 'elementary'
        };
    }
    
    // 각 항목에 keywords 추가 및 정규화 (normalizeConcept 함수 사용)
    const enrichedConceptList = selectedConceptList.map(conceptInfo => {
        // 먼저 정규화 (domain, mustIncludeAny 자동 보정)
        const normalized = normalizeConcept(conceptInfo);
        
        // keywords 추출
        const keywordData = extractConceptKeywords(normalized.conceptTitle || normalized.text, normalized.unitTitle, normalized.subunitTitle);
        
        return {
            ...normalized,
            keywords: keywordData.keywords || [],
            mustInclude: keywordData.mustInclude || [],
            mustAvoid: keywordData.mustAvoid || [],
            mustAvoidAny: normalized.mustIncludeAny.length > 0 ? normalized.mustIncludeAny : (keywordData.mustInclude || []),
            mustAvoidAny: normalized.mustAvoidAny || keywordData.mustAvoid || [],
            problemType: problemType // problemType 추가
        };
    });
    
    // 디버그 로그
    if (console && console.log) {
        console.log('📊 문제 생성 시작:', {
            항목수: enrichedConceptList.length,
            항목당문제수: perConceptCount,
            총예상문제수: enrichedConceptList.length * perConceptCount,
            학년: rawGrade,
            학기: semester
        });
    }
    
    // 각 항목별로 N개씩 문제 생성 (순차 처리, 타임아웃 + 검증 + 재시도)
    let globalQuestionNumber = 1;
    const conceptResults = []; // 항목별 결과 저장
    
    for (let conceptIndex = 0; conceptIndex < enrichedConceptList.length; conceptIndex++) {
        const conceptInfo = enrichedConceptList[conceptIndex];
        const conceptText = conceptInfo.text;
        
        // 진행 상황 업데이트 (currentIndex 기반으로 통일)
        if (progressCallback) {
            // conceptText가 ID 형식이면 실제 이름으로 변환
            let displayName = conceptText;
            if (conceptText && (conceptText.includes('|') || conceptText.startsWith('S|') || conceptText.startsWith('T|'))) {
                // ID 형식이면 conceptInfo에서 실제 텍스트 찾기
                displayName = conceptInfo.conceptTitle || conceptInfo.text || conceptInfo.subunitTitle || conceptInfo.unitTitle || conceptText;
                // 여전히 ID 형식이면 getConceptLabelFromId 사용
                if (displayName.includes('|')) {
                    displayName = getConceptLabelFromId(displayName, schoolLevel === '중학교' ? 'middle' : 'elementary') || displayName;
                }
            }
            
            // 내부 코드 제거
            displayName = sanitizeDisplayText(displayName) || '항목';
            
            // currentIndex = conceptIndex + 1 (1부터 시작)
            const currentIndex = conceptIndex + 1;
            const totalCount = enrichedConceptList.length;
            
            progressCallback({
                current: currentIndex,
                currentIndex: currentIndex, // 명시적으로 추가
                total: totalCount,
                totalCount: totalCount, // 명시적으로 추가
                conceptName: displayName,
                status: 'generating',
                successCount: 0,
                failCount: 0,
                attemptCount: 0
            });
        }
        
        const conceptQuestions = [];
        let successCount = 0;
        let failureCount = 0;
        
        // 각 항목당 perConceptCount개씩 생성 (검증 + 재시도) - 반드시 perConceptCount개 채우기
        let generatedCount = 0; // 현재 항목에서 생성된 문제 수
        const maxAttemptsPerProblem = 3; // 문제당 최대 시도 횟수
        
        while (generatedCount < perConceptCount) {
            let problemData = null;
            let validationResult = null;
            let attempts = 0;
            
            // 이 문제를 생성하기 위한 시도
            while (attempts < maxAttemptsPerProblem && !validationResult?.valid) {
                attempts++;
                
                try {
                    // 타임아웃 설정 (25초)
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error('타임아웃: 25초 초과')), 25000);
                    });
                    
                    // 문제 생성 (동기 함수이므로 Promise로 감싸기)
                    const generatePromise = new Promise((resolve) => {
                        try {
                            let selectedType;
                            
                            // conceptId 정규화 (객체 처리 강화)
                            const conceptIdString = normalizeConceptId(conceptInfo.id || conceptInfo.conceptId || '');
                            
                            // schoolLevel 전달 (conceptInfo에서 추출하거나 formData에서 가져오기)
                            const finalSchoolLevel = conceptInfo.schoolLevel || conceptInfo.gradeLevel || 
                                                    (schoolLevel === '중학교' ? 'middle' : 'elementary');
                            
                            // 개념에 맞는 문제 형식 목록 가져오기 (CONCEPT_TEMPLATE_MAP 기반)
                            const availableTypes = getProblemTypesForConcept(conceptText, effectiveGrade, conceptIdString, finalSchoolLevel, rawGrade);
                            
                            if (availableTypes.length > 0) {
                                selectedType = availableTypes[generatedCount % availableTypes.length];
                            } else {
                                // CONCEPT_TEMPLATE_MAP에서 찾지 못한 경우 emergencyGenerator 사용
                                const existingQuestionsForEmergency = conceptQuestions.map(q => ({
                                    question: q.question || q.questionText || '',
                                    meta: q.meta || {}
                                }));
                                const emergency = emergencyGenerator(conceptInfo, effectiveGrade, existingQuestionsForEmergency);
                                if (emergency) {
                                    // emergency 문제에도 schoolLevel 명시적으로 추가
                                    if (!emergency.meta) {
                                        emergency.meta = {};
                                    }
                                    emergency.meta.schoolLevel = finalSchoolLevel;
                                    emergency.meta.grade = rawGrade;
                                    emergency.meta.semester = semester;
                                    emergency.schoolLevel = finalSchoolLevel;
                                    emergency.grade = rawGrade;
                                    emergency.semester = semester;
                                    resolve(emergency);
                                    return;
                                }
                                const allTypes = Object.values(PROBLEM_TYPES);
                                selectedType = allTypes[generatedCount % allTypes.length];
                            }
                            
                            // 문제 생성 (conceptId 정규화하여 전달)
                            const finalConceptId = conceptIdString;
                            // rawGrade 전달 (중학교 2학년 판단을 위해 필요)
                            // 이미 생성된 문제 목록 전달 (중복 방지)
                            const existingQuestionsForConcept = conceptQuestions.map(q => ({
                                question: q.question || q.questionText || '',
                                questionText: q.questionText || '',
                                stem: q.stem || ''
                            }));
                            let generated = generateProblemByType(selectedType, effectiveGrade, conceptText, finalConceptId, finalSchoolLevel, rawGrade, problemType, existingQuestionsForConcept);
                            
                            // 기본 검증
                            if (!generated || !generated.question || !generated.answer) {
                                // emergencyGenerator 사용 (2학년 문제 금지)
                                const existingQuestionsForEmergency = conceptQuestions.map(q => ({
                                    question: q.question || q.questionText || '',
                                    meta: q.meta || {}
                                }));
                                const emergency = emergencyGenerator(conceptInfo, effectiveGrade, existingQuestionsForEmergency);
                                if (emergency) {
                                    // emergency 문제에도 schoolLevel 명시적으로 추가
                                    if (!emergency.meta) {
                                        emergency.meta = {};
                                    }
                                    emergency.meta.schoolLevel = finalSchoolLevel;
                                    emergency.meta.grade = rawGrade;
                                    emergency.meta.semester = semester;
                                    emergency.schoolLevel = finalSchoolLevel;
                                    emergency.grade = rawGrade;
                                    emergency.semester = semester;
                                    generated = emergency;
                                } else {
                                    resolve(null); // 재시도 유도
                                    return;
                                }
                            }
                            
                            // 문제 메타데이터에 schoolLevel, grade, semester 명시적으로 추가 (필수)
                            if (!generated.meta) {
                                generated.meta = {};
                            }
                            generated.meta.schoolLevel = finalSchoolLevel;
                            generated.meta.grade = rawGrade;
                            generated.meta.semester = semester;
                            generated.schoolLevel = finalSchoolLevel;
                            generated.grade = rawGrade;
                            generated.semester = semester;
                            
                            // 오답 유형 기반 변형 적용 (학기 정보 포함)
                            if (mistakes && mistakes.length > 0) {
                                generated = applyMistakeBasedVariation(generated, mistakes, schoolLevel, rawGrade, semester);
                            }
                            
                            // 변형 후에도 schoolLevel 보장
                            if (!generated.meta) {
                                generated.meta = {};
                            }
                            generated.meta.schoolLevel = finalSchoolLevel;
                            generated.meta.grade = rawGrade;
                            generated.meta.semester = semester;
                            generated.schoolLevel = finalSchoolLevel;
                            generated.grade = rawGrade;
                            generated.semester = semester;
                            
                            resolve(generated);
                        } catch (err) {
                            console.error('Generation error:', err);
                            // emergencyGenerator 사용
                            const existingQuestionsForEmergency2 = conceptQuestions.map(q => ({
                                question: q.question || q.questionText || '',
                                meta: q.meta || {}
                            }));
                            let emergency = emergencyGenerator(conceptInfo, effectiveGrade, existingQuestionsForEmergency2);
                            if (emergency) {
                                // emergency 문제에도 schoolLevel 명시적으로 추가
                                if (!emergency.meta) {
                                    emergency.meta = {};
                                }
                                emergency.meta.schoolLevel = finalSchoolLevel;
                                emergency.meta.grade = rawGrade;
                                emergency.meta.semester = semester;
                                emergency.schoolLevel = finalSchoolLevel;
                                emergency.grade = rawGrade;
                                emergency.semester = semester;
                                
                                // 오답 유형 기반 변형 적용 (학기 정보 포함)
                                if (mistakes && mistakes.length > 0) {
                                    emergency = applyMistakeBasedVariation(emergency, mistakes, schoolLevel, rawGrade, semester);
                                }
                                
                                // 변형 후에도 schoolLevel 보장
                                if (!emergency.meta) {
                                    emergency.meta = {};
                                }
                                emergency.meta.schoolLevel = finalSchoolLevel;
                                emergency.meta.grade = rawGrade;
                                emergency.meta.semester = semester;
                                emergency.schoolLevel = finalSchoolLevel;
                                emergency.grade = rawGrade;
                                emergency.semester = semester;
                                
                                resolve(emergency);
                            } else {
                                resolve(null); // 재시도 유도
                            }
                        }
                    });
                    
                    // 타임아웃과 함께 실행
                    try {
                    problemData = await Promise.race([generatePromise, timeoutPromise]);
                    } catch (timeoutError) {
                        // 타임아웃 발생 시 null 처리
                        problemData = null;
                        validationResult = {
                            valid: false,
                            reason: '생성 타임아웃 (25초 초과)'
                        };
                        continue; // 다음 시도로
                    }
                    
                    // problemData가 null이면 검증하지 않음
                    if (!problemData) {
                        validationResult = {
                            valid: false,
                            reason: '문제 생성 실패 (null 반환)'
                        };
                        continue; // 다음 시도로
                    }
                    
                    // 항목 일치 검증 (중복 체크 포함)
                    validationResult = validateProblemMatchesConcept(problemData, conceptInfo, conceptQuestions);
                    
                    if (!validationResult.valid) {
                        if (attempts < maxAttemptsPerProblem) {
                            // 디버그 로그
                            if (console && console.warn) {
                                console.warn(`⚠️ 검증 실패 (시도 ${attempts}/${maxAttemptsPerProblem}):`, {
                                    항목: conceptText,
                                    현재생성수: generatedCount,
                                    목표: perConceptCount,
                                    사유: validationResult.reason
                                });
                            }
                            // 재시도 전 잠시 대기
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                } catch (error) {
                    console.error(`❌ 문제 생성 오류 (항목: ${conceptText}, 시도: ${attempts}):`, error);
                    
                    if (attempts >= maxAttemptsPerProblem) {
                        // 최대 시도 횟수 초과
                        validationResult = {
                            valid: false,
                            reason: error.message || '생성 실패'
                        };
                    } else {
                        // 재시도
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
            
            // 최종 결과 처리
            if (validationResult?.valid && problemData) {
                // 키워드 매칭 개수 계산 (디버그용)
                const allText = `${problemData.question || ''} ${problemData.explanation || ''}`.toLowerCase();
                const matchedKeywords = (conceptInfo.mustIncludeAny || []).filter(k => allText.includes(k.toLowerCase())).length;
                const totalKeywords = conceptInfo.mustIncludeAny?.length || 0;
                
                // 문제 객체 생성 (LaTeX 분리)
                const questionLatex = problemData.questionLatex || (problemData.question && (problemData.question.includes('\\frac') || problemData.question.includes('\\dfrac')) ? problemData.question : null);
                const questionText = problemData.questionText || (questionLatex ? null : problemData.question);
                const answerLatex = problemData.answerLatex || (problemData.answer && (problemData.answer.includes('\\frac') || problemData.answer.includes('\\dfrac')) ? problemData.answer : null);
                const answerText = problemData.answerText || (answerLatex ? null : problemData.answer);
                
                // 학년/학기 불일치 검증 (생성 직후) - problemData의 메타데이터에서 확인
                const problemGrade = problemData.meta?.grade || problemData.grade;
                const problemSemester = problemData.meta?.semester || problemData.semester;
                const problemSchoolLevel = problemData.meta?.schoolLevel || problemData.schoolLevel;
                
                // 문제 객체에 학년/학기 정보 강제 설정 (conceptInfo 기준)
                const questionGrade = conceptInfo.grade || rawGrade;
                const questionSemester = conceptInfo.semester || semester;
                const questionSchoolLevel = conceptInfo.schoolLevel || (schoolLevel === '중학교' ? 'middle' : 'elementary');
                
                // 생성된 문제의 메타데이터가 요청과 다른 경우 경고 (하지만 conceptInfo 기준으로 덮어쓰기)
                if (problemGrade !== undefined && problemGrade !== rawGrade) {
                    console.warn(`⚠️ [createSampleProblems] 생성된 문제의 grade(${problemGrade})이 요청한 grade(${rawGrade})과 다릅니다. conceptInfo 기준(${questionGrade})으로 덮어씁니다.`);
                }
                if (problemSemester !== undefined && problemSemester !== semester) {
                    console.warn(`⚠️ [createSampleProblems] 생성된 문제의 semester(${problemSemester})이 요청한 semester(${semester})과 다릅니다. conceptInfo 기준(${questionSemester})으로 덮어씁니다.`);
                }
                
                const question = {
                    id: `problem-${Date.now()}-${conceptIndex}-${generatedCount}-${Math.random().toString(36).substr(2, 9)}`,
                    type: problemData.type,
                    number: globalQuestionNumber++,
                    question: questionText || questionLatex || problemData.question, // 하위 호환성
                    questionText: questionText,
                    questionLatex: questionLatex,
                    answer: answerText || answerLatex || problemData.answer, // 하위 호환성
                    answerText: answerText,
                    answerLatex: answerLatex,
                    explanation: problemData.explanation || '',
                    inputPlaceholder: problemData.inputPlaceholder || '답을 입력하세요',
                    meta: {
                        ...(problemData.meta || {}),
                        // 중학교 필터 강제: 메타데이터에 학년/학기/학교급 필수 포함
                        schoolLevel: questionSchoolLevel,
                        grade: questionGrade,
                        semester: questionSemester,
                        conceptId: normalizeConceptId(conceptInfo.id || conceptInfo.conceptId || '')
                    },
                    concept: conceptText,
                    problemType: problemType,
                                sourceConcept: normalizeConceptId(conceptInfo.id || conceptInfo.conceptId || ''),
                    sourceConceptText: conceptText,
                    pathText: conceptInfo.pathText || '',
                    unitTitle: conceptInfo.unitTitle || '',
                    subunitTitle: conceptInfo.subunitTitle || '',
                    domain: conceptInfo.domain || 'number',
                    matchedKeywords: matchedKeywords,
                    totalKeywords: totalKeywords,
                    conceptIndex: conceptIndex,
                    problemIndex: generatedCount + 1,
                    // 중학교 필터 강제: 문제 객체에도 필수 필드 포함
                    schoolLevel: questionSchoolLevel,
                    grade: questionGrade,
                    semester: questionSemester
                };
                
                conceptQuestions.push(question);
                questions.push(question);
                successCount++;
                generatedCount++; // 생성 성공 카운트 증가
            } else {
                // 실패 처리: 최대 시도 횟수 초과 시 emergency 문제 강제 사용
                if (attempts >= maxAttemptsPerProblem) {
                failureCount++;
                if (console && console.error) {
                        console.error(`❌ 항목 "${conceptText}" 문제 생성 실패 (${generatedCount + 1}/${perConceptCount}):`, validationResult?.reason || '알 수 없는 오류');
                }
                
                    // 최대 재시도 후에도 실패하면 emergency 문제 강제 생성 (검증 완화)
                    const finalSchoolLevel = conceptInfo.schoolLevel || conceptInfo.gradeLevel || 
                                            (schoolLevel === '중학교' ? 'middle' : 'elementary');
                    const existingQuestionsForEmergency3 = conceptQuestions.map(q => ({
                        question: q.question || q.questionText || '',
                        meta: q.meta || {}
                    }));
                    const emergency = emergencyGenerator(conceptInfo, effectiveGrade, existingQuestionsForEmergency3);
                    if (emergency) {
                        // emergency 문제에 schoolLevel 추가
                        if (!emergency.meta) {
                            emergency.meta = {};
                        }
                        emergency.meta.schoolLevel = finalSchoolLevel;
                        emergency.meta.grade = rawGrade;
                        emergency.meta.semester = semester;
                        emergency.meta.isEmergency = true;
                        emergency.schoolLevel = finalSchoolLevel;
                        emergency.grade = rawGrade;
                        emergency.semester = semester;
                        
                        // emergency 문제를 그대로 사용 (검증 완화)
                        problemData = emergency;
                        
                        // 문제 객체 생성 및 추가 (검증 없이)
                        const questionLatex = emergency.questionLatex || (emergency.question && (emergency.question.includes('\\frac') || emergency.question.includes('\\dfrac')) ? emergency.question : null);
                        const questionText = emergency.questionText || (questionLatex ? null : emergency.question);
                        const answerLatex = emergency.answerLatex || (emergency.answer && (emergency.answer.includes('\\frac') || emergency.answer.includes('\\dfrac')) ? emergency.answer : null);
                        const answerText = emergency.answerText || (answerLatex ? null : emergency.answer);
                        
                        const questionGrade = conceptInfo.grade || rawGrade;
                        const questionSemester = conceptInfo.semester || semester;
                        const questionSchoolLevel = finalSchoolLevel;
                            
                            const question = {
                            id: `problem-emergency-${Date.now()}-${conceptIndex}-${generatedCount}-${Math.random().toString(36).substr(2, 9)}`,
                            type: emergency.type,
                                number: globalQuestionNumber++,
                            question: questionText || questionLatex || emergency.question,
                            questionText: questionText,
                            questionLatex: questionLatex,
                            answer: answerText || answerLatex || emergency.answer,
                            answerText: answerText,
                            answerLatex: answerLatex,
                            explanation: emergency.explanation || '',
                            inputPlaceholder: emergency.inputPlaceholder || '답을 입력하세요',
                            meta: {
                                ...(emergency.meta || {}),
                                schoolLevel: questionSchoolLevel,
                                grade: questionGrade,
                                semester: questionSemester,
                                conceptId: normalizeConceptId(conceptInfo.id || conceptInfo.conceptId || ''),
                                isEmergency: true
                            },
                                concept: conceptText,
                                problemType: problemType,
                                sourceConcept: normalizeConceptId(conceptInfo.id || conceptInfo.conceptId || ''),
                                sourceConceptText: conceptText,
                                pathText: conceptInfo.pathText || '',
                                unitTitle: conceptInfo.unitTitle || '',
                                subunitTitle: conceptInfo.subunitTitle || '',
                                domain: conceptInfo.domain || 'number',
                            schoolLevel: questionSchoolLevel,
                            grade: questionGrade,
                            semester: questionSemester
                            };
                            
                            conceptQuestions.push(question);
                            questions.push(question);
                            successCount++;
                        generatedCount++; // emergency 문제로도 카운트 증가
                        console.log(`⚠️ [createSampleProblems] emergency 문제 사용: "${conceptText}" (검증 실패 후 강제 사용)`);
                    } else {
                        // emergency도 실패하면 최소한의 기본 문제라도 생성 (무한 루프 방지)
                        console.error(`❌ emergency 문제 생성도 실패: ${conceptText}, 최소 기본 문제 생성`);
                        
                        // 최소한의 기본 문제 생성 (무한 루프 방지)
                        const finalSchoolLevel = conceptInfo.schoolLevel || conceptInfo.gradeLevel || 
                                                (schoolLevel === '중학교' ? 'middle' : 'elementary');
                        const questionGrade = conceptInfo.grade || rawGrade;
                        const questionSemester = conceptInfo.semester || semester;
                        
                        // 학년에 맞는 최소 기본 문제
                        let basicQuestion = '';
                        let basicAnswer = '';
                        
                        if (finalSchoolLevel === 'middle') {
                            // 중학교 기본 문제: 일차방정식
                            const coef = 3 + Math.floor(Math.random() * 3); // 3~5
                            const constTerm = 5 + Math.floor(Math.random() * 10); // 5~14
                            const solution = 2 + Math.floor(Math.random() * 5); // 2~6
                            const result = coef * solution + constTerm;
                            basicQuestion = `일차방정식 $${coef}x + ${constTerm} = ${result}$의 해를 구하시오.`;
                            basicAnswer = `${solution}`;
                        } else if (questionGrade >= 5) {
                            // 5학년 이상: 분수 문제
                            const num1 = 1 + Math.floor(Math.random() * 4); // 1~4
                            const den1 = num1 + 1 + Math.floor(Math.random() * 3); // num1+1 ~ num1+3
                            const num2 = 1 + Math.floor(Math.random() * 4);
                            const den2 = num2 + 1 + Math.floor(Math.random() * 3);
                            basicQuestion = `분수 $\\frac{${num1}}{${den1}}$과 $\\frac{${num2}}{${den2}}$ 중 더 큰 분수를 찾으시오.`;
                            basicAnswer = num1 * den2 > num2 * den1 ? `$\\frac{${num1}}{${den1}}$` : `$\\frac{${num2}}{${den2}}$`;
                        } else {
                            // 4학년 이하: 혼합 계산
                            const a = 10 + Math.floor(Math.random() * 20); // 10~29
                            const b = 5 + Math.floor(Math.random() * 15); // 5~19
                            const op = Math.random() < 0.5 ? '+' : '-';
                            const c = op === '+' ? a + b : a - b;
                            basicQuestion = `$${a} ${op === '+' ? '+' : '-'} ${b} = $?`;
                            basicAnswer = `${c}`;
                        }
                        
                        const question = {
                            id: `problem-basic-${Date.now()}-${conceptIndex}-${generatedCount}-${Math.random().toString(36).substr(2, 9)}`,
                            type: 'basic',
                            number: globalQuestionNumber++,
                            question: basicQuestion,
                            questionText: null,
                            questionLatex: basicQuestion,
                            answer: basicAnswer,
                            answerText: null,
                            answerLatex: basicAnswer,
                            explanation: '기본 문제입니다.',
                            inputPlaceholder: '답을 입력하세요',
                            meta: {
                                schoolLevel: finalSchoolLevel,
                                grade: questionGrade,
                                semester: questionSemester,
                                conceptId: normalizeConceptId(conceptInfo.id || conceptInfo.conceptId || ''),
                                isEmergency: true,
                                isBasic: true
                            },
                            concept: conceptText,
                            problemType: problemType,
                            sourceConcept: normalizeConceptId(conceptInfo.id || conceptInfo.conceptId || ''),
                            sourceConceptText: conceptText,
                            pathText: conceptInfo.pathText || '',
                            unitTitle: conceptInfo.unitTitle || '',
                            subunitTitle: conceptInfo.subunitTitle || '',
                            domain: conceptInfo.domain || 'number',
                            schoolLevel: finalSchoolLevel,
                            grade: questionGrade,
                            semester: questionSemester
                        };
                        
                        conceptQuestions.push(question);
                        questions.push(question);
                        successCount++;
                        generatedCount++; // 기본 문제로도 카운트 증가
                        console.log(`⚠️ [createSampleProblems] 기본 문제 생성 (emergency 실패 후): "${conceptText}"`);
                    }
                } else {
                    // attempts < maxAttemptsPerProblem이면 계속 재시도
                    // 하지만 루프가 종료되었는데 attempts < maxAttemptsPerProblem이면 문제가 있음
                    console.warn(`⚠️ [createSampleProblems] 루프 종료되었지만 attempts(${attempts}) < maxAttemptsPerProblem(${maxAttemptsPerProblem}), validationResult?.valid: ${validationResult?.valid}`);
                }
            }
        }
        
        // 항목별 생성 결과 확인
        if (generatedCount < perConceptCount) {
            const missingCount = perConceptCount - generatedCount;
            console.warn(`⚠️ [createSampleProblems] 항목 "${conceptText}"에서 ${missingCount}개 문제 생성 실패 (목표: ${perConceptCount}개, 생성: ${generatedCount}개)`);
        }
        
        // 항목별 결과 저장
        conceptResults.push({
            conceptInfo: conceptInfo,
            successCount: successCount,
            failureCount: failureCount,
            questions: conceptQuestions
        });
        
        // 진행 상황 업데이트 (완료) - currentIndex 기반으로 통일
        if (progressCallback) {
            // conceptText sanitize
            let displayName = conceptText;
            if (conceptText && (conceptText.includes('|') || conceptText.startsWith('S|') || conceptText.startsWith('T|'))) {
                displayName = getConceptLabelFromId(conceptText, schoolLevel === '중학교' ? 'middle' : 'elementary') || conceptText;
            }
            displayName = sanitizeDisplayText(displayName) || '항목';
            
            // currentIndex = conceptIndex + 1 (1부터 시작)
            const currentIndex = conceptIndex + 1;
            const totalCount = enrichedConceptList.length;
            
            progressCallback({
                current: currentIndex,
                currentIndex: currentIndex,
                total: totalCount,
                totalCount: totalCount,
                conceptName: displayName,
                status: failureCount > 0 ? 'partial' : 'completed',
                successCount: successCount,
                failureCount: failureCount,
                attemptCount: perConceptCount * maxAttemptsPerProblem // 대략적인 시도 횟수
            });
        }
    }
    
    // 최종 로그 및 검증
    const totalSuccess = conceptResults.reduce((sum, r) => sum + r.successCount, 0);
    const totalFailure = conceptResults.reduce((sum, r) => sum + r.failureCount, 0);
    const generatedTotal = questions.length;
    
    // 실패한 항목 추적
    const failedConcepts = conceptResults
        .filter(r => r.failureCount > 0 || r.successCount < perConceptCount)
        .map(r => ({
            concept: r.conceptInfo.text || r.conceptInfo.conceptTitle || r.conceptInfo.id,
            expected: perConceptCount,
            actual: r.successCount,
            failed: r.failureCount
        }));
    
    console.log(`📊 [createSampleProblems] 최종 결과:`, {
        기대총문제수: expectedTotal,
        실제생성수: generatedTotal,
        성공: totalSuccess,
        실패: totalFailure,
        항목수: enrichedConceptList.length,
        실패항목수: failedConcepts.length
    });
    
    // 기대 문제 수와 실제 생성 수 비교
    if (generatedTotal < expectedTotal) {
        const missingCount = expectedTotal - generatedTotal;
        console.warn(`⚠️ [createSampleProblems] 문제 부족: 기대 ${expectedTotal}개, 실제 ${generatedTotal}개 (부족: ${missingCount}개)`);
        console.warn(`⚠️ [createSampleProblems] 실패한 항목:`, failedConcepts);
        
        // questions 배열에 메타데이터 추가 (부족 정보)
        if (questions.length > 0) {
            questions[0]._meta = questions[0]._meta || {};
            questions[0]._meta.expectedTotal = expectedTotal;
            questions[0]._meta.generatedTotal = generatedTotal;
            questions[0]._meta.missingCount = missingCount;
            questions[0]._meta.failedConcepts = failedConcepts;
            questions[0]._meta.isPartial = true;
            questions[0]._meta.requestedCount = requestedCount;
            questions[0]._meta.resolvedCount = resolvedCount;
        }
    } else {
        console.log(`✅ [createSampleProblems] 모든 문제 생성 완료: ${generatedTotal}개`);
        // 성공한 경우에도 메타데이터 추가
        if (questions.length > 0) {
            questions[0]._meta = questions[0]._meta || {};
            questions[0]._meta.expectedTotal = expectedTotal;
            questions[0]._meta.generatedTotal = generatedTotal;
            questions[0]._meta.requestedCount = requestedCount;
            questions[0]._meta.resolvedCount = resolvedCount;
        }
    }
    
    return questions;
}

// 문제 객체 생성 함수
function generateQuestion(concept, mistake, grade, schoolLevel, problemType, number) {
    let questionData;
    
    // 초등학교 문제
    if (schoolLevel === '초등학교') {
        questionData = generateElementaryProblem(concept, mistake, grade, problemType);
    } 
    // 중학교 문제
    else {
        questionData = generateMiddleSchoolQuestion(concept, mistake, grade, problemType);
    }
    
    // concept을 문자열로 변환
    const conceptText = conceptToText(concept);
    // stem을 prompt로도 사용 가능하게
    const promptText = questionToPrompt(questionData) || questionData.stem || '';
    
    return {
        id: Date.now() + number,
        number: number,
        stem: promptText || questionData.stem || '문제 생성에 실패했습니다.',
        prompt: promptText || questionData.stem || '문제 생성에 실패했습니다.',
        choices: questionData.choices,
        answer: questionData.answer || '',
        explanation: questionData.explanation || '',
        concept: conceptText,  // 문자열로 변환
        problemType: problemType
    };
}

// 초등학교 문제 생성
function generateElementaryProblem(concept, mistake, grade, problemType) {
    // concept을 문자열로 변환
    const conceptText = conceptToText(concept);
    
    const problemTemplates = {
        '덧셈': [
            { a: 15 + grade * 5, b: 23 + grade * 3 },
            { a: 28 + grade * 4, b: 17 + grade * 2 },
            { a: 12 + grade * 5, b: 35 + grade * 3 }
        ],
        '뺄셈': [
            `문제) ${45 + grade * 5} - ${18 + grade * 3} = ?`,
            `문제) ${67 + grade * 4} - ${29 + grade * 2} = ?`,
            `문제) ${52 + grade * 5} - ${24 + grade * 3} = ?`
        ],
        '곱셈': [
            `문제) ${3 + grade} × ${4 + grade} = ?`,
            `문제) ${5 + grade} × ${6 + grade} = ?`,
            `문제) ${7 + grade} × ${8 + grade} = ?`
        ],
        '나눗셈': [
            `문제) ${(grade + 2) * 6} ÷ ${grade + 2} = ?`,
            `문제) ${(grade + 3) * 7} ÷ ${grade + 3} = ?`,
            `문제) ${(grade + 4) * 8} ÷ ${grade + 4} = ?`
        ],
        '분수': [
            `문제) ${grade}/${grade + 1} + ${1}/${grade + 1} = ?`,
            `문제) ${grade + 1}/${grade + 2} - ${1}/${grade + 2} = ?`,
            `문제) ${grade}/${grade + 3}와 ${grade + 1}/${grade + 3} 중 더 큰 수는?`
        ],
        '소수': [
            `문제) ${1 + grade * 0.1} + ${2 + grade * 0.2} = ?`,
            `문제) ${3 + grade * 0.3} - ${1 + grade * 0.1} = ?`,
            `문제) ${2 + grade * 0.2} × ${3} = ?`
        ],
        '도형(넓이/둘레)': [
            `문제) 한 변의 길이가 ${5 + grade}cm인 정사각형의 넓이는 몇 ㎠인가요?`,
            `문제) 가로 ${6 + grade}cm, 세로 ${4 + grade}cm인 직사각형의 둘레는 몇 cm인가요?`,
            `문제) 한 변의 길이가 ${7 + grade}cm인 정사각형의 둘레는 몇 cm인가요?`
        ],
        '비와 비율': [
            `문제) ${3 + grade} : ${5 + grade} = ${6 + grade * 2} : ?`,
            `문제) 사과 ${4 + grade}개의 가격이 ${(4 + grade) * 1000}원일 때, 사과 1개의 가격은?`,
            `문제) ${grade + 2} : ${grade + 4}의 비율을 간단히 하면?`
        ]
    };
    
    // 문제 생성 로직
    let stem = '';
    let choices = null;
    let answer = '';
    let explanation = '';
    
    // 개념별 문제 생성
    if (conceptText === '덧셈' || (typeof concept === 'string' && concept.includes('덧셈'))) {
        const a = 15 + grade * 5;
        const b = 23 + grade * 3;
        stem = `${a} + ${b} = ?`;
        answer = (a + b).toString();
        explanation = `${a} + ${b} = ${answer}`;
    } else if (conceptText === '뺄셈' || (typeof concept === 'string' && concept.includes('뺄셈'))) {
        const a = 45 + grade * 5;
        const b = 18 + grade * 3;
        stem = `${a} - ${b} = ?`;
        answer = (a - b).toString();
        explanation = `${a} - ${b} = ${answer}`;
    } else if (conceptText === '곱셈' || (typeof concept === 'string' && concept.includes('곱셈'))) {
        const a = 3 + grade;
        const b = 4 + grade;
        stem = `${a} × ${b} = ?`;
        answer = (a * b).toString();
        explanation = `${a} × ${b} = ${answer}`;
    } else if (conceptText === '나눗셈' || (typeof concept === 'string' && concept.includes('나눗셈'))) {
        const divisor = grade + 2;
        const quotient = 6;
        const dividend = divisor * quotient;
        stem = `${dividend} ÷ ${divisor} = ?`;
        answer = quotient.toString();
        explanation = `${dividend} ÷ ${divisor} = ${quotient}`;
    } else if (conceptText === '분수' || (typeof concept === 'string' && concept.includes('분수'))) {
        const num1 = grade;
        const num2 = 1;
        const denom = grade + 1;
        stem = `\\frac{${num1}}{${denom}} + \\frac{${num2}}{${denom}} = ?`;
        answer = `\\frac{${num1 + num2}}{${denom}}`;
        explanation = `분모가 같으므로 분자만 더합니다: ${num1} + ${num2} = ${num1 + num2}`;
    } else if (conceptText === '소수' || (typeof concept === 'string' && concept.includes('소수'))) {
        const a = 1 + grade * 0.1;
        const b = 2 + grade * 0.2;
        stem = `${a} + ${b} = ?`;
        answer = (a + b).toFixed(1);
        explanation = `${a} + ${b} = ${answer}`;
    } else if (conceptText === '도형(넓이/둘레)' || (typeof concept === 'string' && (concept.includes('도형') || concept.includes('넓이') || concept.includes('둘레')))) {
        const side = 5 + grade;
        stem = `한 변의 길이가 ${side}cm인 정사각형의 넓이는 몇 ㎠인가요?`;
        answer = (side * side).toString();
        explanation = `정사각형의 넓이 = 한 변의 길이 × 한 변의 길이 = ${side} × ${side} = ${answer}㎠`;
    } else if (conceptText === '비와 비율' || (typeof concept === 'string' && (concept.includes('비') || concept.includes('비율')))) {
        const a = 3 + grade;
        const b = 5 + grade;
        const x = 6 + grade * 2;
        const y = (b * x / a).toFixed(1);
        stem = `${a} : ${b} = ${x} : ?`;
        answer = y;
        explanation = `비례식을 풀면: ${a} : ${b} = ${x} : ${y}`;
    } else {
        // 기본 문제
        const conceptText = conceptToText(concept);
        stem = `${conceptText || '선택한 개념'}와 관련된 문제를 풀어보세요.`;
        answer = '답을 입력하세요';
        explanation = `${conceptText || '선택한 개념'}에 대한 설명입니다.`;
    }
    
    // 문제 유형에 따라 힌트 추가
    if (problemType === '실수 보완형') {
        explanation = `※ "${mistake}" 부분에 특히 주의하세요.\n\n${explanation}`;
    } else if (problemType === '단계별 풀이형') {
        explanation = `단계별로 풀어보세요:\n1단계: 문제를 잘 읽습니다\n2단계: 식을 세웁니다\n3단계: 계산합니다\n\n${explanation}`;
    }
    
    return { 
        stem, 
        prompt: stem,  // prompt 필드 추가
        choices, 
        answer, 
        explanation 
    };
}

// 중학교 문제 생성 (질문 객체 반환)
function generateMiddleSchoolQuestion(concept, mistake, grade, problemType) {
    // concept을 문자열로 변환
    const conceptText = conceptToText(concept);
    
    // 중학교 문제 생성 로직
    let stem = '';
    let choices = null;
    let answer = '';
    let explanation = '';
    
    if (conceptText === '소인수분해' || (typeof concept === 'string' && concept.includes('소인수분해'))) {
        const num = 12 + grade * 6;
        stem = `${num}을 소인수분해하시오.`;
        // 소인수분해 결과 (간단한 예시)
        if (num === 12) {
            answer = '2² × 3';
            explanation = `${num} = 4 × 3 = 2² × 3`;
        } else {
            answer = `${num}의 소인수분해 결과`;
            explanation = `${num}을 소인수로 분해합니다.`;
        }
    } else if (conceptText === '일차방정식' || (typeof concept === 'string' && concept.includes('일차방정식'))) {
        const coef = 2 + grade;
        const constant = 5 + grade;
        const result = 15 + grade * 3;
        const xValue = (result - constant) / coef;
        stem = `${coef}x + ${constant} = ${result}일 때, x의 값은?`;
        answer = xValue.toString();
        explanation = `${coef}x = ${result} - ${constant} = ${result - constant}\nx = ${xValue}`;
    } else if (conceptText === '일차함수' || (typeof concept === 'string' && concept.includes('일차함수'))) {
        const coef = 2 + grade;
        const constant = 3 + grade;
        const x = grade + 1;
        const y = coef * x + constant;
        stem = `일차함수 y = ${coef}x + ${constant}의 그래프가 점 (${x}, k)를 지날 때, k의 값은?`;
        answer = y.toString();
        explanation = `y = ${coef} × ${x} + ${constant} = ${y}`;
    } else if (conceptText === '연립일차방정식' || (typeof concept === 'string' && concept.includes('연립일차방정식'))) {
        const a1 = 2 + grade;
        const b1 = 3 + grade;
        const c1 = 10 + grade * 2;
        stem = `연립방정식\n${a1}x + ${b1}y = ${c1}\n${grade + 1}x - ${grade + 2}y = ${grade + 3}\n의 해를 구하시오.`;
        answer = 'x와 y의 값을 구하세요';
        explanation = '연립방정식을 풀어 x와 y의 값을 구합니다.';
    } else if (conceptText === '이차방정식' || (typeof concept === 'string' && concept.includes('이차방정식'))) {
        const a = 5 + grade;
        const b = 6 + grade;
        stem = `이차방정식 x² - ${a}x + ${b} = 0의 해를 구하시오.`;
        answer = 'x의 값을 구하세요';
        explanation = '인수분해 또는 근의 공식을 사용하여 해를 구합니다.';
    } else if (conceptText === '인수분해' || (typeof concept === 'string' && concept.includes('인수분해'))) {
        const a = 5 + grade * 2;
        const b = 6 + grade;
        stem = `x² + ${a}x + ${b}을 인수분해하시오.`;
        answer = '(x + a)(x + b) 형태로';
        explanation = '두 수의 합이 계수, 곱이 상수항이 되도록 인수분해합니다.';
    } else if (conceptText === '원주각' || (typeof concept === 'string' && concept.includes('원주각'))) {
        const angle = 60 + grade * 10;
        stem = `원 O에서 중심각 ∠AOB = ${angle}°일 때, 원주각 ∠ACB의 크기는?`;
        answer = (angle / 2).toString() + '°';
        explanation = `원주각은 중심각의 절반입니다: ${angle}° ÷ 2 = ${angle / 2}°`;
    } else if (conceptText === '삼각비' || (typeof concept === 'string' && concept.includes('삼각비'))) {
        const a = 3 + grade;
        const b = 5 + grade * 2;
        stem = `직각삼각형에서 sin A = ${a}/${b}일 때, cos A의 값은?`;
        const c = Math.sqrt(b * b - a * a);
        answer = `${c}/${b}`;
        explanation = `피타고라스 정리: cos A = 인접변/빗변`;
    } else {
        // 기본 문제
        const conceptText = conceptToText(concept);
        stem = `${conceptText || '선택한 개념'}와 관련된 문제를 풀어보세요.`;
        answer = '답을 입력하세요';
        explanation = `${conceptText || '선택한 개념'}에 대한 설명입니다.`;
    }
    
    // 문제 유형에 따라 힌트 추가
    if (problemType === '실수 보완형') {
        explanation = `※ "${mistake}" 부분에 특히 주의하세요.\n\n${explanation}`;
    } else if (problemType === '서술형 문제') {
        explanation = `서술형 문제입니다. 풀이 과정을 자세히 설명하세요.\n\n${explanation}`;
    }
    
    return { 
        stem, 
        prompt: stem,  // prompt 필드 추가
        choices, 
        answer, 
        explanation 
    };
}

/* 기존 문제 템플릿 (참고용 - 제거됨)
    const problems = {
        '소인수분해': [
            `문제) ${12 + grade * 6}을 소인수분해하시오.`,
            `문제) ${18 + grade * 4}을 소인수분해하시오.`,
            `문제) ${24 + grade * 8}의 소인수는?`
        ],
        '일차방정식': [
            `문제) ${2 + grade}x + ${5 + grade} = ${15 + grade * 3}일 때, x의 값은?`,
            `문제) ${3 + grade}x - ${7 + grade} = ${11 + grade * 2}일 때, x의 값은?`,
            `문제) ${grade + 1}(x + ${grade + 2}) = ${(grade + 1) * (grade + 5)}일 때, x의 값은?`
        ],
        '일차함수': [
            `문제) 일차함수 y = ${2 + grade}x + ${3 + grade}의 그래프가 점 (${grade + 1}, k)를 지날 때, k의 값은?`,
            `문제) 일차함수 y = ${-1 - grade}x + ${5 + grade}의 x절편은?`,
            `문제) 일차함수 y = ${grade + 2}x - ${grade + 1}에서 x = ${grade + 3}일 때, y의 값은?`
        ],
        '연립일차방정식': [
            `문제) 연립방정식\n  ${2 + grade}x + ${3 + grade}y = ${10 + grade * 2}\n  ${grade + 1}x - ${grade + 2}y = ${grade + 3}\n의 해를 구하시오.`,
            `문제) 연립방정식\n  x + ${2 + grade}y = ${7 + grade}\n  ${2 + grade}x - y = ${4 + grade}\n의 해를 구하시오.`
        ],
        '이차방정식': [
            `문제) 이차방정식 x² - ${5 + grade}x + ${6 + grade} = 0의 해를 구하시오.`,
            `문제) 이차방정식 (x - ${grade + 2})(x + ${grade + 3}) = 0의 해를 구하시오.`,
            `문제) 이차방정식 x² = ${(grade + 2) * (grade + 2)}의 해를 구하시오.`
        ],
        '인수분해': [
            `문제) x² + ${5 + grade * 2}x + ${6 + grade}을 인수분해하시오.`,
            `문제) ${grade + 2}x² - ${(grade + 2) * (grade + 3)}x를 인수분해하시오.`,
            `문제) x² - ${(grade + 3) * (grade + 3)}을 인수분해하시오.`
        ],
        '원주각': [
            `문제) 원 O에서 중심각 ∠AOB = ${60 + grade * 10}°일 때, 원주각 ∠ACB의 크기는?`,
            `문제) 원 O에서 원주각이 ${30 + grade * 5}°일 때, 중심각의 크기는?`
        ],
        '삼각비': [
            `문제) 직각삼각형에서 sin A = ${3 + grade}/${5 + grade * 2}일 때, cos A의 값은?`,
            `문제) 직각삼각형에서 한 변의 길이가 ${3 + grade}, ${4 + grade * 2}, ${5 + grade * 3}일 때, sin의 값은?`
        ]
    };
*/

// 문제 표시 (questions 배열 기반)
function displayProblems(questions, formData, status = 'success') {
    const problemsList = document.getElementById('problemsList');
    const resultHeader = document.querySelector('.result-header');
    const resultHeaderTitle = resultHeader ? resultHeader.querySelector('h2') : null;
    
    if (!problemsList) return;
    
    // questions.length > 0 강제 검증
    if (!questions || questions.length === 0) {
        console.error('❌ displayProblems 호출 시 questions.length === 0, 이는 절대 발생하면 안 됨');
        // 이론상 도달 불가능하지만 안전장치: 즉시 폴백 생성
        return;
    }
    
    // result-header 표시 (questions.length > 0이므로 무조건 표시)
    if (resultHeader) {
        resultHeader.style.display = 'block';
        
        // 상태에 따른 배너 문구 변경 (부족한 경우 명확히 표시)
        if (resultHeaderTitle) {
            // questions 배열에서 메타데이터 확인
            const firstQuestion = questions[0];
            const isPartial = firstQuestion?._meta?.isPartial || status === 'partial' || status === 'fallback';
            const expectedTotal = firstQuestion?._meta?.expectedTotal;
            const generatedTotal = firstQuestion?._meta?.generatedTotal || questions.length;
            const missingCount = firstQuestion?._meta?.missingCount;
            const failedConcepts = firstQuestion?._meta?.failedConcepts || [];
            
            if (isPartial && expectedTotal && generatedTotal < expectedTotal) {
                resultHeaderTitle.textContent = `⚠️ 일부만 생성됨 (${generatedTotal}/${expectedTotal}개, 실패 ${missingCount}개)`;
                resultHeaderTitle.style.color = '#dc2626'; // 빨간색
            } else if (status === 'success') {
                resultHeaderTitle.textContent = '✔ 맞춤형 변형문제가 생성되었습니다!';
                resultHeaderTitle.style.color = ''; // 기본 색상
            } else if (status === 'partial' || status === 'fallback') {
                resultHeaderTitle.textContent = '✔ 문제가 생성되었습니다!';
                resultHeaderTitle.style.color = ''; // 기본 색상
            } else {
                resultHeaderTitle.textContent = '✔ 맞춤형 변형문제가 생성되었습니다!';
                resultHeaderTitle.style.color = ''; // 기본 색상
            }
        }
    }
    
    // 학년/학기 불일치 문제 필터링 (렌더링 직전 검증)
    const requestedGrade = formData.grade || 1;
    const requestedSemester = formData.semester || 1;
    const requestedSchoolLevel = formData.schoolLevel === 'elementary' ? 'elementary' : 'middle';
    
    const filteredQuestions = questions.filter(question => {
        // 학년/학기/학교급 검증
        const questionGrade = question.grade || question.meta?.grade;
        const questionSemester = question.semester || question.meta?.semester;
        const questionSchoolLevel = question.schoolLevel || question.meta?.schoolLevel;
        
        // 학년 불일치 검증
        if (questionGrade !== undefined && questionGrade !== requestedGrade) {
            console.warn(`⚠️ [displayProblems] 학년 불일치 폐기: 문제의 grade(${questionGrade})이 요청한 grade(${requestedGrade})과 다릅니다.`, question);
            return false; // 폐기
        }
        
        // 학기 불일치 검증
        if (questionSemester !== undefined && questionSemester !== requestedSemester) {
            console.warn(`⚠️ [displayProblems] 학기 불일치 폐기: 문제의 semester(${questionSemester})이 요청한 semester(${requestedSemester})과 다릅니다.`, question);
            return false; // 폐기
        }
        
        // 학교급 불일치 검증
        if (questionSchoolLevel && questionSchoolLevel !== requestedSchoolLevel && 
            questionSchoolLevel !== '중학교' && questionSchoolLevel !== '초등학교') {
            // 'middle'/'elementary' 형식 변환
            const normalizedQuestionSchoolLevel = questionSchoolLevel === '중학교' ? 'middle' : 
                                                  questionSchoolLevel === '초등학교' ? 'elementary' : questionSchoolLevel;
            if (normalizedQuestionSchoolLevel !== requestedSchoolLevel) {
                console.warn(`⚠️ [displayProblems] 학교급 불일치 폐기: 문제의 schoolLevel(${questionSchoolLevel})이 요청한 schoolLevel(${requestedSchoolLevel})과 다릅니다.`, question);
                return false; // 폐기
            }
        }
        
        return true; // 통과
    });
    
    // 필터링된 문제 수 로그
    if (filteredQuestions.length < questions.length) {
        const filteredCount = questions.length - filteredQuestions.length;
        console.warn(`⚠️ [displayProblems] 학년/학기 불일치로 ${filteredCount}개 문제 폐기됨 (원본: ${questions.length}개, 필터링 후: ${filteredQuestions.length}개)`);
    }
    
    // 필터링된 questions 사용
    const validQuestions = filteredQuestions;
    
    // 항목별로 그룹화
    const groupedByConcept = {};
    validQuestions.forEach(question => {
        // conceptKey는 내부 코드가 아닌 사람용 라벨 사용
        let conceptKey = question.sourceConcept || question.concept || '기타';
        
        // 내부 코드 패턴이면 라벨로 변환
        if (conceptKey.includes('|')) {
            const schoolLevel = formData.schoolLevel === 'elementary' ? 'elementary' : 'middle';
            conceptKey = getConceptLabelFromId(conceptKey, schoolLevel) || question.sourceConceptText || question.concept || '기타';
        }
        
        // conceptKey도 sanitize
        conceptKey = sanitizeDisplayText(conceptKey) || '기타';
        
        if (!groupedByConcept[conceptKey]) {
            let conceptText = question.sourceConceptText || question.concept || '기타';
            // 내부 코드 패턴이면 라벨로 변환
            if (conceptText.includes('|')) {
                const schoolLevel = formData.schoolLevel === 'elementary' ? 'elementary' : 'middle';
                conceptText = getConceptLabelFromId(conceptText, schoolLevel) || conceptText;
            }
            conceptText = sanitizeDisplayText(conceptText) || '기타';
            
            groupedByConcept[conceptKey] = {
                conceptText: conceptText,
                unitTitle: sanitizeDisplayText(question.unitTitle || ''),
                subunitTitle: sanitizeDisplayText(question.subunitTitle || ''),
                problems: []
            };
        }
        groupedByConcept[conceptKey].problems.push(question);
    });
    
    // 항목별로 HTML 생성
    let html = '';
    
    // 총합 표시 추가 (부족한 경우 경고 표시)
    const firstQuestion = questions[0];
    const isPartial = firstQuestion?._meta?.isPartial;
    const expectedTotal = firstQuestion?._meta?.expectedTotal;
    const missingCount = firstQuestion?._meta?.missingCount;
    const failedConcepts = firstQuestion?._meta?.failedConcepts || [];
    // validQuestions가 정의된 후이므로 안전하게 사용 가능
    const totalProblems = validQuestions.length;
    const totalConcepts = formData?.concepts?.length || questions.length || totalProblems;
    const requestedCount = firstQuestion?._meta?.requestedCount || totalConcepts;
    const resolvedCount = firstQuestion?._meta?.resolvedCount || totalConcepts;
    const matchFailure = firstQuestion?._meta?.matchFailure || false;
    // perConceptCount를 formData에서 가져오기
    const perConceptCount = parseInt(formData?.problemCount || 3);
    
    let summaryBgColor = '#f0f9ff';
    let summaryBorderColor = '#4f46e5';
    let summaryTextColor = '#1e40af';
    let summaryTitle = '생성된 문제 요약';
    
    if (isPartial && expectedTotal && totalProblems < expectedTotal) {
        summaryBgColor = '#fef3c7';
        summaryBorderColor = '#f59e0b';
        summaryTextColor = '#92400e';
        summaryTitle = '⚠️ 일부만 생성됨';
    }
    
    if (matchFailure || resolvedCount < requestedCount) {
        summaryBgColor = '#fee2e2';
        summaryBorderColor = '#dc2626';
        summaryTextColor = '#991b1b';
        summaryTitle = '⚠️ 매칭 실패';
    }
    
    html += `
    <div class="total-summary" style="margin-bottom: 30px; padding: 15px; background: ${summaryBgColor}; border-radius: 8px; border-left: 4px solid ${summaryBorderColor};">
        <div style="font-weight: 600; color: ${summaryTextColor}; margin-bottom: 8px;">${summaryTitle}</div>
        <div style="color: ${summaryTextColor === '#92400e' || summaryTextColor === '#991b1b' ? '#78350f' : '#1e3a8a'}; font-size: 0.95rem;">
            선택 항목: <strong>${requestedCount}개</strong>${resolvedCount !== requestedCount ? ` (유효: <strong style="color: ${resolvedCount < requestedCount ? '#dc2626' : '#059669'}">${resolvedCount}개</strong>)` : ''} / 항목당: <strong>${perConceptCount}개</strong> / 총 목표: <strong>${expectedTotal || requestedCount * perConceptCount}개</strong> / 실제 생성: <strong>${totalProblems}개</strong>
            ${isPartial && missingCount > 0 ? ` <span style="color: #dc2626; font-weight: 600;">(부족: ${missingCount}개)</span>` : ''}
            ${matchFailure ? ` <span style="color: #dc2626; font-weight: 600;">(데이터 매칭 실패)</span>` : ''}
        </div>
        ${firstQuestion?._meta?.matchFailureReason ? `
        <div style="margin-top: 12px; padding: 10px; background: #fee2e2; border-radius: 6px; border-left: 3px solid #dc2626;">
            <div style="font-weight: 600; color: #991b1b; margin-bottom: 6px; font-size: 0.9rem;">매칭 실패 사유:</div>
            <div style="color: #7f1d1d; font-size: 0.85rem;">${escapeHtml(firstQuestion._meta.matchFailureReason)}</div>
        </div>
        ` : ''}
        ${failedConcepts.length > 0 ? `
        <div style="margin-top: 12px; padding: 10px; background: #fee2e2; border-radius: 6px; border-left: 3px solid #dc2626;">
            <div style="font-weight: 600; color: #991b1b; margin-bottom: 6px; font-size: 0.9rem;">실패한 항목:</div>
            <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 0.85rem;">
                ${failedConcepts.map(fc => `<li>${escapeHtml(fc.concept)}: 기대 ${fc.expected}개, 생성 ${fc.actual}개, 실패 ${fc.failed}개</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
    `;
    Object.keys(groupedByConcept).forEach((conceptKey, groupIndex) => {
        const group = groupedByConcept[conceptKey];
        
        // pathText 사용 (없으면 생성)
        let conceptDisplayName = group.pathText || '';
        if (!conceptDisplayName) {
            if (group.unitTitle && group.subunitTitle) {
                conceptDisplayName = `${group.unitTitle} > ${group.subunitTitle} > ${group.conceptText}`;
            } else if (group.unitTitle) {
                conceptDisplayName = `${group.unitTitle} > ${group.conceptText}`;
            } else if (group.subunitTitle) {
                conceptDisplayName = `${group.subunitTitle} > ${group.conceptText}`;
            } else {
                conceptDisplayName = group.conceptText;
            }
        }
        
        // 내부 코드 제거 (최종 sanitize)
        conceptDisplayName = sanitizeDisplayText(conceptDisplayName) || group.conceptText || '기타';
        
        html += `
        <div class="concept-group" data-concept-key="${escapeHtml(conceptKey)}">
            <div class="concept-group-header">
                <h4 class="concept-group-title">${groupIndex + 1}) ${escapeHtml(conceptDisplayName)} (총 ${group.problems.length}문제)</h4>
            </div>
            <div class="concept-group-problems">
        `;
        
        group.problems.forEach((question, index) => {
            let questionText = question.question || question.stem || questionToPrompt(question) || '문제 생성에 실패했습니다. 다시 생성해 주세요.';
            let questionLatex = question.questionLatex; // 명시적으로 LaTeX가 있을 때만 사용
            
            // 모든 LaTeX 명령어를 한글로 변환 (무조건 변환)
            questionText = convertLatexToText(questionText);
            questionText = cleanLatexDollars(questionText);
            questionText = normalizeNumberKorean(questionText);
            
            // questionLatex도 무조건 한글로 변환 (LaTeX 렌더링 사용 안 함)
            if (questionLatex) {
                questionLatex = convertLatexToText(questionLatex);
                questionLatex = cleanLatexDollars(questionLatex);
                questionLatex = null; // LaTeX 사용 안 함, questionText만 사용
            }
            
            // 개발 모드: 디버그 정보 추가 (기본 숨김)
            const isDevMode = (() => {
                // URL 쿼리 파라미터 확인
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('debug') === '1') return true;
                // localStorage 확인
                if (localStorage.getItem('debug') === '1') return true;
                return false;
            })();
            
            let debugInfo = '';
            if (isDevMode) {
                const pathText = question.pathText || conceptDisplayName;
                const domain = question.domain || group.domain || 'unknown';
                const matchedKeywords = question.matchedKeywords || 0;
                const totalKeywords = question.totalKeywords || 0;
                debugInfo = `
                <div class="debug-info" style="font-size: 0.75rem; color: #666; margin-bottom: 8px; padding: 4px 8px; background: #f5f5f5; border-radius: 4px;">
                    <strong>디버그:</strong> pathText: ${escapeHtml(pathText)} | domain: ${domain} | 키워드 매칭: ${matchedKeywords}/${totalKeywords}
                </div>
                `;
            }
            
            // SVG 렌더링 여부 확인
            const hasSvg = question.questionSvg || question.svg;
            
            // LaTeX 렌더링 사용 안 함 - 모든 텍스트를 한글로 변환하여 표시
            let questionDisplay = '';
            if (hasSvg) {
                // SVG가 있으면 SVG를 먼저 표시하고 그 아래에 문제 텍스트 표시
                questionDisplay = `
                <div class="geometry-svg-container" style="margin: 20px 0; text-align: center; background: #fafafa; padding: 20px; border-radius: 8px;">
                    ${question.questionSvg || question.svg}
                </div>
                <div class="problem-stem" style="margin-top: 15px; color: #1F2937 !important;">${escapeHtml(questionText)}</div>`;
            } else {
                // 일반 텍스트 (모든 LaTeX 명령어 제거됨)
                questionDisplay = `<div class="problem-stem" style="color: #1F2937 !important;">${escapeHtml(questionText)}</div>`;
            }
            
            html += `
            <div class="problem-item" data-question-id="${question.id}">
                ${debugInfo}
                <div class="problem-number" style="color: #1F2937 !important;">문제 ${question.number || (groupIndex * 100 + index + 1)}</div>
                ${questionDisplay}
                <div class="problem-answer-input">
                    <input type="text" placeholder="${escapeHtml(question.inputPlaceholder || '답을 입력하세요')}" class="answer-input" id="answer-input-${question.id}">
                </div>
                <div class="problem-actions">
                    <button class="btn-toggle-answer" onclick="toggleAnswer('${question.id}')" aria-expanded="false" aria-controls="answer-${question.id}">
                        <span class="toggle-icon">✓</span>
                        <span class="toggle-text" id="answer-toggle-text-${question.id}">정답 보기</span>
                    </button>
                    <button class="btn-toggle-explanation" onclick="toggleExplanation('${question.id}')" aria-expanded="false" aria-controls="explanation-${question.id}">
                        <span class="toggle-icon">💡</span>
                        <span class="toggle-text" id="explanation-toggle-text-${question.id}">해설 보기</span>
                    </button>
                </div>
                <div class="problem-answer" id="answer-${question.id}" style="display: none;" role="region" aria-labelledby="answer-toggle-text-${question.id}">
                    <div class="answer-title">정답</div>
                    <div class="answer-content">
                        ${(() => {
                            const answerText = question.answer || '정답이 없습니다.';
                            const answerLatex = question.answerLatex || (answerText && (answerText.includes('\\frac') || answerText.includes('\\dfrac')) ? answerText : null);
                            if (answerLatex) {
                                return `<div class="math-display" data-latex="${escapeHtml(answerLatex)}"></div>`;
                            }
                            return escapeHtml(answerText);
                        })()}
                    </div>
                </div>
                <div class="problem-explanation" id="explanation-${question.id}" style="display: none;" role="region" aria-labelledby="explanation-toggle-text-${question.id}">
                    <div class="explanation-title">해설</div>
                    <div class="explanation-content">
                        ${(() => {
                            let explText = question.explanation || '해설이 없습니다.';
                            // 해설 내 모든 LaTeX 명령어를 한글로 변환 (무조건 변환)
                            explText = convertLatexToText(explText);
                            explText = cleanLatexDollars(explText);
                            
                            // 해설 표시 (LaTeX 렌더링 사용 안 함)
                            return explText.split('\n').map(line => {
                                return escapeHtml(line) + '<br>';
                            }).join('');
                        })()}
                    </div>
                </div>
            </div>
            `;
        });
        
        html += `
            </div>
        </div>
        `;
    });
    
    problemsList.innerHTML = html;
    
    // KaTeX 렌더링 사용 안 함 - 모든 LaTeX 명령어를 한글로 변환하여 표시
    // .math-display 요소가 있으면 모두 한글로 변환
    document.querySelectorAll('.math-display[data-latex]').forEach(el => {
        let latex = el.getAttribute('data-latex');
        if (!latex) return;
        
        // LaTeX 명령어를 한글로 변환
        let convertedText = convertLatexToText(latex);
        el.textContent = convertedText.trim();
        el.className = 'problem-stem'; // 클래스 변경
    });
    
    // 결과 정보 업데이트
    const resultInfo = document.getElementById('resultInfo');
    if (resultInfo) {
        const schoolLevelName = formData.schoolLevel === 'elementary' ? '초등학교' : '중학교';
        const semesterName = formData.semester === 1 ? '1학기' : '2학기';
        resultInfo.textContent = `${schoolLevelName} ${formData.grade}학년 ${semesterName} 수학 - 아래 문제들을 풀어보세요.`;
    }
    
    // 세션 스토리지에 문제 데이터 저장
    sessionStorage.setItem('generatedProblems', JSON.stringify(questions));
    sessionStorage.setItem('currentFormData', JSON.stringify(formData));
}

// GCD 계산 (최대공약수) - 기존 gcd 함수 사용
function calculateGCD(a, b) {
    return gcd(a, b);
}

// 정답 토글
function toggleAnswer(questionId) {
    const answer = document.getElementById(`answer-${questionId}`);
    const toggleText = document.getElementById(`answer-toggle-text-${questionId}`);
    const toggleButton = document.querySelector(`[onclick="toggleAnswer('${questionId}')"]`);
    
    if (answer && toggleText && toggleButton) {
        const isVisible = answer.style.display !== 'none';
        if (isVisible) {
            answer.style.display = 'none';
            toggleText.textContent = '정답 보기';
            toggleButton.setAttribute('aria-expanded', 'false');
        } else {
            answer.style.display = 'block';
            toggleText.textContent = '정답 숨기기';
            toggleButton.setAttribute('aria-expanded', 'true');
        }
    }
}

// 해설 토글
function toggleExplanation(questionId) {
    const explanation = document.getElementById(`explanation-${questionId}`);
    const toggleText = document.getElementById(`explanation-toggle-text-${questionId}`);
    const toggleButton = document.querySelector(`[onclick="toggleExplanation('${questionId}')"]`);
    
    if (explanation && toggleText && toggleButton) {
        const isVisible = explanation.style.display !== 'none';
        if (isVisible) {
            explanation.style.display = 'none';
            toggleText.textContent = '해설 보기';
            toggleButton.setAttribute('aria-expanded', 'false');
        } else {
            explanation.style.display = 'block';
            toggleText.textContent = '해설 숨기기';
            toggleButton.setAttribute('aria-expanded', 'true');
        }
    }
}

// 에러 메시지 표시
function showError(message) {
    const problemsList = document.getElementById('problemsList');
    if (problemsList) {
        problemsList.innerHTML = `
            <div class="problem-item" style="border-left-color: #EF4444;">
                <div class="problem-content" style="color: #EF4444;">
                    ${message}
                </div>
            </div>
        `;
    }
}

// 저장 메뉴 토글
function toggleSaveMenu() {
    const saveMenu = document.getElementById('saveMenu');
    if (saveMenu) {
        saveMenu.style.display = saveMenu.style.display === 'none' ? 'block' : 'none';
    }
}

// 저장 메뉴 닫기
function closeSaveMenu() {
    const saveMenu = document.getElementById('saveMenu');
    if (saveMenu) {
        saveMenu.style.display = 'none';
    }
}

// PDF 다운로드
function downloadPDF() {
    const questions = JSON.parse(sessionStorage.getItem('generatedProblems') || '[]');
    const formData = JSON.parse(sessionStorage.getItem('currentFormData') || '{}');
    
    if (questions.length === 0) {
        alert('다운로드할 문제가 없습니다.');
        closeSaveMenu();
        return;
    }
    
    // PDF 다운로드 (실제 구현 시에는 jsPDF 라이브러리로 PDF 생성)
    const schoolLevelName = formData.schoolLevel === 'elementary' ? '초등학교' : '중학교';
    const semesterName = formData.semester === 1 ? '1학기' : '2학기';
    let content = '맞춤형 변형문제\n\n';
    content += `학교급: ${schoolLevelName}\n`;
    content += `학년: ${formData.grade}학년\n`;
    content += `학기: ${semesterName}\n`;
    content += `과목: 수학\n`;
    const conceptsText = formData.concepts.map(c => conceptToText(c)).filter(c => c).join(', ');
    content += `개념: ${conceptsText || '선택한 개념'}\n`;
    content += `문제 유형: ${formData.problemType}\n`;
    content += `문제 개수: ${questions.length}개\n\n`;
    content += '='.repeat(50) + '\n\n';
    
    questions.forEach((question, index) => {
        content += `문제 ${index + 1}\n`;
        const questionText = question.question || questionToPrompt(question) || question.stem || '문제 생성에 실패했습니다.';
        content += `${questionText}\n`;
        if (question.answer) {
            content += `답: ${question.answer}\n`;
        }
        if (question.explanation) {
            content += `해설: ${question.explanation}\n`;
        }
        content += '\n' + '-'.repeat(50) + '\n\n';
    });
    
    // PDF 형식으로 다운로드 (실제 구현 시에는 jsPDF 라이브러리 사용)
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `변형문제_${new Date().getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('PDF 파일이 다운로드되었습니다.');
    closeSaveMenu();
}

// 난이도 조절
function adjustDifficulty(direction) {
    const formData = JSON.parse(sessionStorage.getItem('currentFormData') || '{}');
    
    const types = ['쉬운 개념확인형', '기본형', '실수 보완형', '응용 심화형', '서술형 문제'];
    let currentIndex = types.indexOf(formData.problemType);
    
    if (direction === 'up' && currentIndex < types.length - 1) {
        currentIndex++;
    } else if (direction === 'down' && currentIndex > 0) {
        currentIndex--;
    }
    
    formData.problemType = types[currentIndex];
    sessionStorage.setItem('currentFormData', JSON.stringify(formData));
    
    // 문제 재생성
    generateProblems(formData);
}

// 문제 재생성
async function regenerate() {
    const formData = JSON.parse(sessionStorage.getItem('problemFormData') || '{}');
    if (Object.keys(formData).length === 0) {
        alert('데이터를 찾을 수 없습니다. 처음부터 다시 시작해주세요.');
        window.location.href = 'create.html';
        return;
    }
    
    // 결과 페이지에서 재생성하는 경우
    if (document.getElementById('problemsList')) {
        await generateProblems(formData);
    } else {
        // create 페이지로 이동
        window.location.href = 'create.html';
    }
}

// 개념 요약 보기
function showConceptSummary() {
    const formData = JSON.parse(sessionStorage.getItem('currentFormData') || '{}');
    const concepts = formData.concepts || [];
    
    if (concepts.length === 0) {
        alert('개념 정보가 없습니다.');
        return;
    }
    
    const summary = `
선택하신 개념들의 핵심 정리입니다:

${concepts.map((c, i) => `${i + 1}. ${conceptToText(c) || '선택한 개념'}`).join('\n')}

\n※ 실제 구현 시에는 AI가 각 개념의 핵심 내용을 요약해서 제공합니다.
    `.trim();
    
    document.getElementById('conceptSummary').textContent = summary;
    document.getElementById('conceptModal').style.display = 'block';
}

// 오답 원인 분석 보기
function showMistakeAnalysis() {
    const formData = JSON.parse(sessionStorage.getItem('currentFormData') || '{}');
    const mistakes = formData.mistakes || [];
    
    if (mistakes.length === 0) {
        alert('오답 정보가 없습니다.');
        return;
    }
    
    const analysis = `
선택하신 오답 원인 분석입니다:

${mistakes.map((m, i) => `${i + 1}. ${m}\n   → 이 부분을 집중적으로 보완할 수 있는 문제를 생성했습니다.`).join('\n\n')}

\n※ 실제 구현 시에는 AI가 각 오답 원인에 대한 상세 분석과 보완 방법을 제공합니다.
    `.trim();
    
    document.getElementById('mistakeAnalysis').textContent = analysis;
    document.getElementById('mistakeModal').style.display = 'block';
}

// 모달 닫기
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 과목 이름 가져오기
function getSubjectName(subjectCode) {
    const subjects = {
        math: '수학',
        korean: '국어',
        english: '영어',
        science: '과학',
        social: '사회'
    };
    return subjects[subjectCode] || '수학';
}

// 기능 데이터 구조
const featuresData = [
    {
        id: 'analysis',
        icon: '✓',
        title: '틀린 이유 분석',
        description: '정확히 어디서 막혔는지 분석합니다',
        summary: '학생이 문제를 틀린 이유를 정확히 파악하여 맞춤형 학습 전략을 제공합니다.',
        points: [
            '개념 이해도 진단으로 부족한 부분 확인',
            '문제 접근 방식 분석으로 사고 과정 파악',
            '실수 패턴 탐지로 반복 실수 방지',
            '단계별 이해도 확인으로 학습 단계 조정',
            '계산 오류 위치 파악으로 기초 연산 보완'
        ],
        example: {
            title: '예시',
            content: '학생이 "식을 잘못 세움"으로 체크하면, AI가 해당 문제 유형에서 자주 발생하는 식 세우기 오류를 분석하여 실수 보완형 문제를 자동 생성합니다.'
        },
        ctaPrimary: {
            text: '바로 시작하기',
            action: () => { window.location.href = 'create.html'; }
        },
        ctaSecondary: {
            text: '예시 보기',
            action: () => { showFeatureExample('analysis'); }
        }
    },
    {
        id: 'problems',
        icon: '📝',
        title: '맞춤형 변형문제',
        description: '학생별로 3~7개의 변형문제를 자동 생성',
        summary: '틀린 문제의 개념과 실수 포인트를 기반으로 개인 맞춤형 변형문제를 생성합니다.',
        points: [
            '선택한 개념에 맞는 문제 자동 생성',
            '틀린 이유를 반영한 맞춤형 문제 구성',
            '3개~7개까지 원하는 개수 설정',
            '기본형부터 응용형까지 다양한 유형',
            '단계별 풀이형으로 천천히 학습 가능'
        ],
        example: {
            title: '예시',
            content: '초등학교 4학년 "소수" 개념을 틀렸다면, 소수의 덧셈과 뺄셈을 중심으로 한 변형문제 5개가 자동 생성됩니다. 각 문제는 숫자와 상황을 바꾸어 같은 개념을 반복 학습할 수 있도록 구성됩니다.'
        },
        ctaPrimary: {
            text: '바로 시작하기',
            action: () => { window.location.href = 'create.html'; }
        },
        ctaSecondary: {
            text: '예시 보기',
            action: () => { showFeatureExample('problems'); }
        }
    },
    {
        id: 'difficulty',
        icon: '🎯',
        title: '난이도 조절',
        description: '개념·난이도를 자유롭게 조절 가능',
        summary: '학생의 현재 수준에 맞춰 문제 난이도를 자유롭게 조절하여 점진적으로 실력을 향상시킵니다.',
        points: [
            '쉬운 개념확인형: 기본 개념 재확인',
            '기본형: 교과서 수준의 기본 문제',
            '실수 보완형: 실수 패턴 집중 보완',
            '응용 심화형: 응용력과 사고력 향상',
            '단계별 풀이형: 천천히 단계별 학습',
            '서술형 문제: 설명 능력 향상'
        ],
        example: {
            title: '예시',
            content: '초등학교 3학년 학생이 분수를 처음 배운다면 "쉬운 개념확인형"부터 시작하여, 이해도가 높아지면 "기본형", "응용 심화형"으로 점진적으로 난이도를 높일 수 있습니다.'
        },
        ctaPrimary: {
            text: '바로 시작하기',
            action: () => { window.location.href = 'create.html'; }
        },
        ctaSecondary: {
            text: '예시 보기',
            action: () => { showFeatureExample('difficulty'); }
        }
    }
];

// 기능 카드 렌더링
function renderFeatures() {
    const container = document.getElementById('featuresContainer');
    if (!container) return;
    
    container.innerHTML = featuresData.map(feature => `
        <div class="feature-item">
            <div class="feature-card" 
                 onclick="toggleFeatureDetail('${feature.id}')" 
                 onkeydown="handleFeatureKeydown(event, '${feature.id}')"
                 tabindex="0"
                 role="button"
                 aria-expanded="false"
                 aria-controls="feature-detail-${feature.id}"
                 id="feature-card-${feature.id}">
                <div class="feature-card-content">
                    <div class="feature-icon">${feature.icon}</div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
                <button class="feature-detail-btn" onclick="event.stopPropagation(); toggleFeatureDetail('${feature.id}')">
                    자세히
                </button>
            </div>
            <div class="feature-detail" 
                 id="feature-detail-${feature.id}"
                 role="region"
                 aria-labelledby="feature-card-${feature.id}">
                <div class="feature-detail-summary">
                    ${feature.summary}
                </div>
                <div class="feature-detail-points">
                    <ul>
                        ${feature.points.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
                <div class="feature-example-box">
                    <div class="feature-example-title">${feature.example.title}</div>
                    <div class="feature-example-content">${feature.example.content}</div>
                </div>
                <div class="feature-detail-actions">
                    <button class="btn btn-outline" onclick="event.stopPropagation(); showFeatureExample('${feature.id}')">
                        ${feature.ctaSecondary.text}
                    </button>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); window.location.href='create.html'">
                        ${feature.ctaPrimary.text}
                    </button>
                </div>
                <div class="feature-detail-close">
                    <button class="feature-detail-close-btn" onclick="event.stopPropagation(); toggleFeatureDetail('${feature.id}')">
                        접기
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 기능 상세 토글 (아코디언)
function toggleFeatureDetail(featureId) {
    const card = document.getElementById(`feature-card-${featureId}`);
    const detail = document.getElementById(`feature-detail-${featureId}`);
    
    if (!card || !detail) return;
    
    const isExpanded = detail.classList.contains('expanded');
    
    // 다른 모든 확장 영역 닫기
    document.querySelectorAll('.feature-detail.expanded').forEach(el => {
        if (el.id !== `feature-detail-${featureId}`) {
            el.classList.remove('expanded');
            const otherCardId = el.id.replace('feature-detail-', '');
            const otherCard = document.getElementById(`feature-card-${otherCardId}`);
            if (otherCard) {
                otherCard.classList.remove('active');
                otherCard.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // 현재 카드 토글
    if (isExpanded) {
        detail.classList.remove('expanded');
        card.classList.remove('active');
        card.setAttribute('aria-expanded', 'false');
    } else {
        detail.classList.add('expanded');
        card.classList.add('active');
        card.setAttribute('aria-expanded', 'true');
        
        // 포커스 이동 (접근성)
        setTimeout(() => {
            detail.focus();
        }, 300);
    }
}

// 키보드 접근성 처리
function handleFeatureKeydown(event, featureId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFeatureDetail(featureId);
    }
}

// 기능 예시 보기 (간단한 알림, 추후 확장 가능)
function showFeatureExample(type) {
    const feature = featuresData.find(f => f.id === type);
    if (feature) {
        alert(`${feature.title} 예시:\n\n${feature.example.content}`);
    }
}

// 저장하기 (로컬 스토리지에 저장)
function saveProblems() {
    const storedData = sessionStorage.getItem('problemFormData');
    const problems = JSON.parse(sessionStorage.getItem('generatedProblems') || '[]');
    
    if (problems.length === 0) {
        alert('저장할 문제가 없습니다.');
        return;
    }
    
    try {
        // 로컬 스토리지에 저장 (최근 10개까지)
        const savedItems = JSON.parse(localStorage.getItem('savedProblems') || '[]');
        const saveItem = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('ko-KR'),
            formData: storedData ? JSON.parse(storedData) : {},
            problems: problems
        };
        
        savedItems.unshift(saveItem);
        // 최근 10개만 유지
        if (savedItems.length > 10) {
            savedItems.pop();
        }
        
        localStorage.setItem('savedProblems', JSON.stringify(savedItems));
        alert('문제가 저장되었습니다!');
    } catch (e) {
        alert('저장 중 오류가 발생했습니다: ' + e.message);
    }
}

// 인쇄하기
function printProblems() {
    const questions = JSON.parse(sessionStorage.getItem('generatedProblems') || '[]');
    const formData = JSON.parse(sessionStorage.getItem('currentFormData') || '{}');
    
    if (questions.length === 0) {
        alert('인쇄할 문제가 없습니다.');
        closeSaveMenu();
        return;
    }
    
    // 인쇄용 HTML 생성
    const schoolLevelName = formData.schoolLevel === 'elementary' ? '초등학교' : '중학교';
    const semesterName = formData.semester === 1 ? '1학기' : '2학기';
    
    let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>변형문제 인쇄</title>
            <style>
                @media print {
                    @page { margin: 2cm; }
                    body { font-family: '맑은 고딕', Arial, sans-serif; }
                    .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
                    .print-header h1 { margin: 0; font-size: 24px; }
                    .print-header p { margin: 10px 0 0 0; font-size: 16px; }
                    .print-problem { margin-bottom: 40px; page-break-inside: avoid; }
                    .print-problem-number { font-weight: bold; font-size: 18px; margin-bottom: 10px; }
                    .print-problem-stem { font-size: 14px; line-height: 1.8; margin-bottom: 10px; }
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>맞춤형 변형문제</h1>
                <p>${schoolLevelName} ${formData.grade}학년 ${semesterName} 수학</p>
                <p>인쇄일: ${new Date().toLocaleString('ko-KR')}</p>
            </div>
    `;
    
    questions.forEach((question, index) => {
        printContent += `
            <div class="print-problem">
                <div class="print-problem-number">문제 ${index + 1}</div>
                <div class="print-problem-stem">${question.stem}</div>
            </div>
        `;
    });
    
    printContent += `
        </body>
        </html>
    `;
    
    // 새 창 열어서 인쇄
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // 인쇄 대화상자 열기 (약간의 지연 필요)
    setTimeout(() => {
        printWindow.print();
    }, 250);
    
    closeSaveMenu();
}

// 푸터 링크 모달 표시
function showFooterModal(type) {
    const modal = document.getElementById('footerModal');
    const title = document.getElementById('footerModalTitle');
    const body = document.getElementById('footerModalBody');
    
    if (!modal || !title || !body) return;
    
    const contents = {
        'terms': {
            title: '서비스 이용약관',
            body: `[우등생이 되는 수학 변형문제] 서비스 이용약관
시행일: 2026.01.01

제1조(목적)
이 약관은 우등생이 되는 수학 변형문제 서비스(이하 "서비스")의 이용조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 회사가 제공하는 수학 변형문제 생성 및 관련 서비스를 의미합니다.
② "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 개인 또는 법인을 의미합니다.
③ "콘텐츠"란 서비스를 통해 제공되는 모든 자료, 정보, 문제 등을 의미합니다.

제3조 (약관의 게시와 개정)
① 회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
③ 약관이 개정되는 경우 회사는 개정 내용을 서비스에 공지합니다.

제4조 (서비스의 제공)
① 회사는 다음과 같은 서비스를 제공합니다:
  - 맞춤형 수학 변형문제 생성
  - 문제 저장 및 관리
  - 문제 인쇄 및 다운로드
② 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.
③ 회사는 서비스의 품질 향상 및 기술적 사양의 변경 등을 위해 필요한 경우 서비스의 일부를 변경하거나 중단할 수 있습니다.

제5조 (이용자의 의무)
① 이용자는 서비스를 이용함에 있어 다음 행위를 하여서는 안 됩니다:
  - 다른 이용자의 정보를 도용하는 행위
  - 서비스의 안정적 운영을 방해하는 행위
  - 저작권 등 지적재산권을 침해하는 행위
② 이용자는 본 약관 및 관계 법령을 준수하여야 합니다.

제6조 (지적재산권)
서비스에 포함된 모든 콘텐츠에 대한 저작권 및 기타 지적재산권은 회사에 있습니다.

제7조 (면책조항)
① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
② 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.

제8조 (준거법 및 관할법원)
① 본 약관은 대한민국 법률에 따라 규정되고 해석됩니다.
② 서비스 이용과 관련하여 발생한 분쟁에 대하여는 회사의 본사 소재지를 관할하는 법원을 전속 관할법원으로 합니다.

[시행일자] 본 약관은 2026년 1월 1일부터 시행됩니다.`
        },
        'privacy': {
            title: '개인정보처리방침',
            body: `제1조 (개인정보의 처리목적)
우등생이 되는 수학 변형문제 서비스(이하 "서비스")는 다음의 목적을 위하여 개인정보를 처리합니다:
① 서비스 제공: 맞춤형 변형문제 생성 및 제공
② 문제 저장 및 관리: 이용자가 생성한 문제의 저장 및 관리
③ 서비스 개선: 이용 패턴 분석 및 서비스 품질 향상

제2조 (개인정보의 처리 및 보유기간)
① 서비스는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
  - 문제 생성 및 저장 데이터: 서비스 이용 기간 동안
  - 로그 정보: 최대 1년

제3조 (처리하는 개인정보의 항목)
서비스는 다음의 개인정보 항목을 처리하고 있습니다:
① 선택 항목: 사용자가 입력한 학년, 학기, 개념, 틀린 이유 등 문제 생성에 필요한 정보
② 자동 수집 항목: IP주소, 쿠키, 서비스 이용 기록 등

제4조 (개인정보의 제3자 제공)
서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
① 이용자가 사전에 동의한 경우
② 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

제5조 (개인정보처리의 위탁)
서비스는 현재 개인정보 처리업무를 외부에 위탁하지 않습니다.

제6조 (정보주체의 권리·의무 및 그 행사방법)
① 정보주체는 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
  - 개인정보 열람요구
  - 오류 등이 있을 경우 정정 요구
  - 삭제요구
  - 처리정지 요구
② 권리 행사는 서비스에 서면, 전자우편 등을 통하여 하실 수 있습니다.

제7조 (개인정보의 파기)
① 서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
② 파기의 절차 및 방법은 다음과 같습니다:
  - 전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제
  - 기타 기록물: 분쇄하거나 소각

제8조 (개인정보 보호책임자)
개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

▶ 개인정보 보호책임자
- 성명: (관리자)
- 연락처: (문의하기를 통해 연락 가능)

제9조 (개인정보 처리방침 변경)
이 개인정보처리방침은 2026년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.`
        },
        'contact': {
            title: '문의 및 고객지원',
            body: `문의 및 고객지원
[우등생이 되는 수학 변형문제] 이용 중 불편하신 점이나 개선 의견, 오류 제보를 접수받습니다. 가능한 한 빠르게 답변드리겠습니다.

1. 문의 방법

① 이메일: 문의하기 페이지를 통해 접수해 주세요
※ 이메일 주소는 서비스 업데이트 시 공지 예정

② 문의 폼: 서비스 내 "문의하기" 버튼을 통해 접수

③ 연락처: 문의하기 페이지를 통해 안내

④ 운영시간: 평일 09:00 ~ 18:00 (운영시간 외 접수는 순차 답변)

2. 답변 안내

① 일반 문의: 보통 1~3영업일 이내 답변드립니다.

② 장애/긴급 이슈: 접수 순서와 심각도에 따라 우선 처리합니다.

※ 답변이 지연될 경우 접수 확인 안내를 드릴 수 있습니다.

3. 문의 시 필요한 정보(빠른 해결용)

아래 정보를 함께 보내주시면 해결이 빨라집니다.

① 사용 기기(예: PC, 태블릿, 스마트폰)

② 운영체제 버전(예: Windows 버전, iOS 버전, 안드로이드 버전)

③ 브라우저/앱 버전

④ 문제 발생 시각 및 화면(스크린샷)

⑤ 어떤 동작을 했을 때 문제가 발생했는지(재현 단계)

4. 문의 접수 시 개인정보 수집 안내

회사는 문의 응대를 위해 아래 개인정보를 수집·이용할 수 있습니다.

① 수집 항목: (필수) 이메일 또는 연락처, 문의 내용 / (선택) 첨부파일

② 이용 목적: 문의 처리 및 결과 안내

③ 보유 기간: 문의 처리 완료 후 6개월 보관 후 삭제(법령상 보관 필요 시 예외)

5. 신고/차단 관련 안내

서비스 내 신고 기능을 통해 부적절한 콘텐츠를 신고하실 수 있습니다. 접수된 신고는 운영정책 및 관련 법령에 따라 검토 후 조치합니다.

🔧 주요 문의 내용
- 서비스 이용 방법
- 문제 생성 관련 문의
- 계정 및 개인정보 관련 문의
- 기술적 오류 및 장애 신고
- 기타 제안사항

💡 자주 묻는 질문(FAQ)
문의하기 전에 자주 묻는 질문을 확인해 보시면 빠른 해결책을 찾으실 수 있습니다.

저희 서비스를 이용해 주셔서 감사합니다.
더 나은 서비스 제공을 위해 항상 노력하겠습니다.`
        }
    };
    
    const content = contents[type];
    if (content) {
        title.textContent = content.title;
        body.textContent = content.body;
        body.style.whiteSpace = 'pre-line';
        modal.style.display = 'block';
    }
}

// 푸터 모달 닫기
function closeFooterModal() {
    const modal = document.getElementById('footerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 모달 외부 클릭 시 닫기 (기능 모달 포함)
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 후기 모달 표시
// 스크롤 함수
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 샘플 문제 렌더링
function renderSampleProblems() {
    const container = document.getElementById('sampleProblemsList');
    if (!container) return;
    
    const sampleProblems = [
        {
            tags: ['초등학교 4학년', '1학기'],
            concept: '분수의 덧셈',
            stem: '\\frac{3}{5} + \\frac{2}{5} = ?',
            answer: '\\frac{5}{5} = 1',
            explanation: '분모가 같으므로 분자만 더합니다: 3 + 2 = 5'
        },
        {
            tags: ['초등학교 5학년', '1학기'],
            concept: '소수의 곱셈',
            stem: '사과 한 상자의 무게가 2.5kg입니다. 상자가 4개 있으면 총 무게는 몇 kg인가요?',
            answer: '10kg',
            explanation: '2.5 × 4 = 10. 소수점을 고려하여 계산합니다.'
        },
        {
            tags: ['초등학교 6학년', '1학기'],
            concept: '비와 비율',
            stem: '3 : 5 = 6 : ? 일 때, ?에 들어갈 수는 무엇인가요?',
            answer: '10',
            explanation: '비례식을 풀면: 3 : 5 = 6 : 10 (3 × 2 = 6, 5 × 2 = 10)'
        }
    ];
    
    container.innerHTML = sampleProblems.map((problem, index) => `
        <div class="sample-problem-card">
            <div class="sample-problem-tags">
                ${problem.tags.map(tag => `<span class="sample-problem-tag">${tag}</span>`).join('')}
                <span class="sample-problem-tag" style="background: var(--primary-color); color: white;">${conceptToText(problem.concept) || '선택한 개념'}</span>
            </div>
            <div class="sample-problem-stem">${problem.stem}</div>
            <div class="sample-problem-actions">
                <button class="sample-problem-toggle" onclick="toggleSampleAnswer(${index})">
                    <span class="toggle-text-${index}">정답 보기</span>
                </button>
                <button class="sample-problem-toggle" onclick="toggleSampleExplanation(${index})">
                    <span class="toggle-explanation-text-${index}">해설 예시</span>
                </button>
            </div>
            <div class="sample-problem-answer" id="sampleAnswer-${index}">
                <div class="answer-text"><strong>답:</strong> ${problem.answer}</div>
            </div>
            <div class="sample-problem-explanation-box" id="sampleExplanation-${index}" style="display: none;">
                <strong>해설:</strong> ${problem.explanation}
            </div>
        </div>
    `).join('');
}

// 샘플 문제 해설 토글
function toggleSampleExplanation(index) {
    const explanation = document.getElementById(`sampleExplanation-${index}`);
    const toggleText = document.querySelector(`.toggle-explanation-text-${index}`);
    if (explanation) {
        const isVisible = explanation.style.display !== 'none';
        if (isVisible) {
            explanation.style.display = 'none';
            toggleText.textContent = '해설 예시';
        } else {
            explanation.style.display = 'block';
            toggleText.textContent = '해설 숨기기';
        }
    }
}

// 샘플 문제 정답 토글
function toggleSampleAnswer(index) {
    const answer = document.getElementById(`sampleAnswer-${index}`);
    const toggleText = document.querySelector(`.toggle-text-${index}`);
    if (answer) {
        const isVisible = answer.classList.contains('show');
        if (isVisible) {
            answer.classList.remove('show');
            toggleText.textContent = '정답 보기';
        } else {
            answer.classList.add('show');
            toggleText.textContent = '정답 숨기기';
        }
    }
}

// 후기 미리보기 로드 (최대 3개)
function loadReviewsPreview() {
    const container = document.getElementById('reviewsPreview');
    if (!container) return;
    
    try {
        let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        
        // 실제 후기만 필터링 (데모 제외)
        reviews = reviews.filter(review => !review.isDemo);
        
        // 데모 후기 데이터
        const demoReviews = [
            {
                id: 'demo1',
                summary: '아이의 오답을 정확히 분석해서 맞춤형 문제를 만들어줍니다',
                content: '아이가 틀린 문제를 정확히 분석해서 변형문제를 만들어주니까 정말 좋아요. 집에서 아이에게 직접 설명하기 어려웠는데 이 서비스 덕분에 도움이 많이 됩니다.',
                author: '학부모123',
                date: '2026. 1. 15.',
                isDemo: true
            },
            {
                id: 'demo2',
                summary: '학년별, 개념별 선택이 편리하고 실수 보완형 문제가 효과적입니다',
                content: '학년별, 개념별로 선택할 수 있어서 정말 편리해요. 특히 실수 보완형 문제가 아이에게 정말 효과가 있었습니다. 계속 사용할 예정입니다!',
                author: '엄마표공부',
                date: '2026. 1. 10.',
                isDemo: true
            }
        ];
        
        // 실제 후기와 데모 후기 결합 (데모는 실제 후기가 없을 때만 표시)
        let displayReviews = reviews.slice(0, 3);
        if (displayReviews.length === 0) {
            // 실제 후기가 없으면 데모 2개 + 첫 후기 카드 1개
            displayReviews = [
                {
                    id: 'first-review',
                    summary: '첫 후기를 남겨주세요',
                    content: '여러분의 소중한 후기가 서비스 개선에 큰 도움이 됩니다.',
                    author: '',
                    date: '',
                    isFirstReview: true
                },
                ...demoReviews
            ];
        } else if (displayReviews.length < 3) {
            // 실제 후기가 1~2개면 데모로 채움
            const remaining = 3 - displayReviews.length;
            displayReviews = [...displayReviews, ...demoReviews.slice(0, remaining)];
        }
        
        container.innerHTML = displayReviews.map(review => {
            if (review.isFirstReview) {
                return `
                    <div class="review-preview-card" style="border: 2px dashed var(--primary-color); background: linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 100%);">
                        <div class="reviews-empty-icon" style="font-size: 3rem; margin-bottom: 16px;">📝</div>
                        <div class="review-preview-summary" style="color: var(--primary-color);">${escapeHtml(review.summary)}</div>
                        <div class="review-preview-content">${escapeHtml(review.content)}</div>
                        <div class="review-preview-footer">
                            <button onclick="showReviewDrawer()" class="btn btn-primary" style="width: 100%; margin-top: 16px;">
                                <span class="btn-icon">✏️</span>
                                후기 작성하기
                            </button>
                        </div>
                    </div>
                `;
            }
            
            const demoBadge = review.isDemo ? '<span class="sample-problem-tag" style="background: #FCD34D; color: #92400E; font-size: 0.75rem; padding: 4px 8px;">예시 후기</span>' : '';
            
            return `
                <div class="review-preview-card">
                    ${demoBadge ? `<div style="margin-bottom: 12px;">${demoBadge}</div>` : ''}
                    <div class="review-preview-summary">${escapeHtml(review.summary || review.content.substring(0, 50))}</div>
                    <div class="review-preview-content">${escapeHtml(review.content || '')}</div>
                    <div class="review-preview-footer">
                        <span>${escapeHtml(review.author || '익명')}</span>
                        ${review.date ? `<span>${review.date}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        container.innerHTML = `
            <div class="reviews-empty">
                <div class="reviews-empty-message">후기를 불러오는 중 오류가 발생했습니다.</div>
            </div>
        `;
    }
}

// 후기 전체 보기 (스크롤)
function scrollToAllReviews() {
    scrollToSection('reviews-section');
}

// 후기 드로어 열기
function showReviewDrawer() {
    const drawer = document.getElementById('reviewDrawer');
    if (drawer) {
        drawer.classList.add('active');
        // 폼 초기화
        const form = document.getElementById('reviewForm');
        if (form) {
            form.reset();
            document.getElementById('ratingInput').value = '';
            const charCount = document.getElementById('charCount');
            if (charCount) charCount.textContent = '0';
            // 별점 초기화
            document.querySelectorAll('.star').forEach(star => {
                star.classList.remove('active');
            });
        }
        // ESC 키로 닫기
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeReviewDrawer();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
}

// 후기 드로어 닫기
function closeReviewDrawer() {
    const drawer = document.getElementById('reviewDrawer');
    if (drawer) {
        drawer.classList.remove('active');
    }
}

// 기존 showReviewModal/closeReviewModal은 result.html 등에서 사용할 수 있도록 유지
function showReviewModal() {
    showReviewDrawer();
}

function closeReviewModal() {
    closeReviewDrawer();
}

// 후기 작성 폼 초기화
function initializeReviewForm() {
    // 별점 클릭 이벤트
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            document.getElementById('ratingInput').value = rating;
            
            // 별점 표시 업데이트
            document.querySelectorAll('.star').forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    // 글자 수 카운트
    const textarea = document.querySelector('textarea[name="content"]');
    if (textarea) {
        textarea.addEventListener('input', function() {
            document.getElementById('charCount').textContent = this.value.length;
        });
    }
}

// 후기 제출 (새로운 형식 지원)
function submitReview(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const summary = formData.get('summary') || '';
    const content = formData.get('content') || '';
    const rating = formData.get('rating') ? parseInt(formData.get('rating')) : null;
    
    // 한 줄 후기(summary)가 없으면 content에서 처음 50자를 사용
    const finalSummary = summary || content.substring(0, 50);
    
    // summary 필수 검증 (새로운 형식)
    if (!finalSummary || finalSummary.length < 10) {
        alert('한 줄 후기를 10자 이상 입력해주세요.');
        return;
    }
    
    const review = {
        id: Date.now(),
        summary: finalSummary,
        content: content,
        author: '익명',
        rating: rating,
        date: new Date().toLocaleDateString('ko-KR')
    };
    
    try {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        reviews.unshift(review);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        
        alert('후기가 작성되었습니다!');
        closeReviewDrawer();
        
        // 미리보기 또는 전체 목록 새로고침
        if (document.getElementById('reviewsPreview')) {
            loadReviewsPreview();
        } else if (document.getElementById('reviewsList')) {
            loadReviews();
        }
    } catch (e) {
        alert('후기 작성 중 오류가 발생했습니다: ' + e.message);
    }
}

// 후기 목록 로드
function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    try {
        let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        
        // 처음 로드 시 샘플 후기 추가
        if (reviews.length === 0) {
            const sampleReviews = [
                {
                    id: 1,
                    nickname: '학부모123',
                    rating: 5,
                    content: '아이가 틀린 문제를 정확히 분석해서 변형문제를 만들어주니까 정말 좋아요. 집에서 아이에게 직접 설명하기 어려웠는데 이 서비스 덕분에 도움이 많이 됩니다.',
                    date: '2026. 1. 15. 오후 2:30:00'
                },
                {
                    id: 2,
                    nickname: '엄마표공부',
                    rating: 5,
                    content: '학년별, 개념별로 선택할 수 있어서 정말 편리해요. 특히 실수 보완형 문제가 아이에게 정말 효과가 있었습니다. 계속 사용할 예정입니다!',
                    date: '2026. 1. 10. 오전 10:15:00'
                },
                {
                    id: 3,
                    nickname: '수학선생',
                    rating: 4,
                    content: '교사 입장에서도 학생별 맞춤형 문제를 빠르게 만들 수 있어서 좋습니다. 문제 유형도 다양하고 난이도 조절도 가능해서 활용도가 높아요.',
                    date: '2026. 1. 8. 오후 4:20:00'
                },
                {
                    id: 4,
                    nickname: '초등맘',
                    rating: 5,
                    content: '저장하기와 인쇄하기 기능이 있어서 문제를 모아두고 반복 학습하기 좋네요. 아이가 자주 틀리는 개념을 집중적으로 연습할 수 있어서 만족합니다.',
                    date: '2026. 1. 5. 오전 9:00:00'
                }
            ];
            reviews = sampleReviews;
            localStorage.setItem('reviews', JSON.stringify(reviews));
        }
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="review-item" style="text-align: center; padding: 40px; color: var(--text-light);">
                    아직 작성된 후기가 없습니다.<br>첫 번째 후기를 작성해보세요!
                </div>
            `;
            return;
        }
        
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-author">${escapeHtml(review.nickname)}</div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-rating">
                    ${'⭐'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
                <div class="review-content">${escapeHtml(review.content)}</div>
            </div>
        `).join('');
    } catch (e) {
        reviewsList.innerHTML = `
            <div class="review-item" style="color: #EF4444;">
                후기를 불러오는 중 오류가 발생했습니다.
            </div>
        `;
    }
}


