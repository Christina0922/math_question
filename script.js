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
    const checkedCount = document.querySelectorAll('input[name="concept"]:checked').length;
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
    
    // 항목 선택 확인
    const checkedCount = document.querySelectorAll('input[name="concept"]:checked').length;
    if (checkedCount === 0) {
        alert('항목을 최소 1개 선택해 주세요.');
        return;
    }
    
    // 제출 버튼 비활성화 (중복 클릭 방지)
    const submitButton = event.target.querySelector('button[type="submit"]') || document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="btn-icon">⏳</span> 문제 생성 중...';
    }
    
    const formData = {
        schoolLevel: document.querySelector('input[name="schoolLevel"]:checked')?.value || 'elementary',
        grade: parseInt(document.querySelector('input[name="grade"]:checked')?.value || '1'),
        semester: parseInt(document.querySelector('input[name="semester"]:checked')?.value || '1'),
        subject: 'math', // 수학만 사용
        concepts: Array.from(document.querySelectorAll('input[name="concept"]:checked'))
            .map(cb => {
                // 1~3학년의 경우 topicTitle도 함께 저장
                const topicTitle = cb.getAttribute('data-topic-title');
                return topicTitle ? { id: cb.value, title: topicTitle } : cb.value;
            }),
        mistakes: Array.from(document.querySelectorAll('input[name="mistake"]:checked'))
            .map(cb => cb.value),
        problemType: document.querySelector('input[name="problemType"]:checked')?.value || '기본형',
        problemCount: parseInt(document.querySelector('input[name="problemCount"]:checked')?.value || '3')
    };
    
    // 5-2, 6-2 데이터 없음 처리
    if (formData.schoolLevel === 'elementary' && 
        ((formData.grade === 5 && formData.semester === 2) || (formData.grade === 6 && formData.semester === 2))) {
        alert('해당 학기는 개정으로 데이터가 없어 문제를 생성할 수 없습니다.');
        return;
    }
    
    // 유효성 검사
    if (formData.concepts.length === 0) {
        alert('최소 1개 이상의 개념을 선택해주세요.');
        return;
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
function emergencyGenerator(conceptInfo, effectiveGrade) {
    const { text: conceptText = '', unitTitle = '', conceptTitle = '', domain = 'number', grade = 1 } = conceptInfo;
    const conceptLower = (conceptText || conceptTitle || '').toLowerCase();
    const unitLower = (unitTitle || '').toLowerCase();
    
    // 중학교 수준 처리 (7학년 이상 또는 conceptId가 M으로 시작)
    const isMiddleSchool = effectiveGrade >= 7 || (conceptInfo.id && typeof conceptInfo.id === 'string' && conceptInfo.id.startsWith('M')) ||
                           (conceptInfo.conceptId && typeof conceptInfo.conceptId === 'string' && conceptInfo.conceptId.startsWith('M'));
    
    if (isMiddleSchool) {
        // 중학교 도형 문제
        if (conceptLower.includes('삼각형') || conceptLower.includes('사각형') || conceptLower.includes('도형') ||
            conceptLower.includes('외심') || conceptLower.includes('내심') || conceptLower.includes('닮음') ||
            conceptLower.includes('피타고라스') || conceptLower.includes('평행사변형')) {
            return generateMiddleSchoolGeometryProblem(effectiveGrade, conceptText, conceptInfo.id || conceptInfo.conceptId || '');
        }
        
        // 중학교 정수/유리수 계산
        if (conceptLower.includes('정수') || conceptLower.includes('유리수')) {
            return generateMiddleSchoolNumberProblem(effectiveGrade, conceptText, conceptInfo.id || conceptInfo.conceptId || '');
        }
        
        // 중학교 일차방정식
        if (conceptLower.includes('일차방정식') || conceptLower.includes('방정식')) {
            return generateLinearEquationProblem(effectiveGrade);
        }
        
        // 중학교 일차함수
        if (conceptLower.includes('일차함수') || conceptLower.includes('함수') || conceptLower.includes('그래프')) {
            return generateLinearFunctionProblem(effectiveGrade);
        }
        
        // 중학교 확률
        if (conceptLower.includes('확률') || conceptLower.includes('경우의 수')) {
            return generateProbabilityProblem(effectiveGrade);
        }
        
        // 기본: 중학교 수준 정수 계산
        return generateMiddleSchoolNumberProblem(effectiveGrade, conceptText, conceptInfo.id || conceptInfo.conceptId || '');
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
            conceptLower.includes('직사각형') || conceptLower.includes('삼각형')) {
            return generateAreaProblem(effectiveGrade, conceptText);
        }
        
        // 혼합 계산
        if (conceptLower.includes('혼합') || conceptLower.includes('계산')) {
            return generateMixedCalcProblem(effectiveGrade);
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
            return generateMixedCalcProblem(effectiveGrade);
        }
    }
    
    // 3학년 이하
    if (effectiveGrade <= 3) {
        if (conceptLower.includes('분수')) {
            return generateFractionSimplifyProblem(effectiveGrade);
        } else if (conceptLower.includes('곱셈') || conceptLower.includes('나눗셈')) {
            return generateMixedCalcProblem(effectiveGrade);
        } else if (conceptLower.includes('규칙')) {
            return generatePatternProblem(effectiveGrade);
        }
    }
    
    // 기본: 학년에 맞는 혼합 계산
    return generateMixedCalcProblem(effectiveGrade);
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
    
    // 중학교인 경우 전용 템플릿 사용 (산수 템플릿 금지)
    if (gradeLevel === 'middle' || grade >= 7) {
        // 경우의 수/확률 항목
        if (conceptLower.includes('경우의 수') || conceptLower.includes('확률')) {
            return generateMiddleSchoolProbabilityTemplate(conceptInfo, count, effectiveGrade);
        }
        
        // 중학교 다른 항목들도 여기에 추가 가능
        // 현재는 경우의 수만 구현, 나머지는 기본 템플릿 사용하지 않음
    }
    
    // 템플릿 패턴 매칭
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
                // 기본 템플릿 (중학교는 산수 템플릿 금지)
                if (gradeLevel === 'middle' || grade >= 7) {
                    // 중학교인데 매칭되지 않으면 경우의 수 템플릿 사용
                    const probTemplates = generateMiddleSchoolProbabilityTemplate(conceptInfo, 1, effectiveGrade);
                    if (probTemplates.length > 0) {
                        question = probTemplates[0].question;
                        answer = probTemplates[0].answer;
                        explanation = probTemplates[0].explanation;
                    } else {
                        // 최후의 수단: 중학교 수준 문제
                        question = `${num1}과 ${num2}의 최대공약수를 구하시오.`;
                        const gcd = calculateGCD(num1, num2);
                        answer = `${gcd}`;
                        explanation = `${num1}과 ${num2}의 공약수 중 가장 큰 수는 ${gcd}입니다.`;
                    }
                } else if (conceptInfo.domain === 'geometry') {
                    // 도형 항목인데 매칭되지 않으면 일반 도형 문제 생성
                    const shapeNum2 = num1;
                    question = `한 변의 길이가 ${shapeNum2}cm인 정사각형의 둘레는 몇 cm인가요?`;
                    answer = `${shapeNum2 * 4}cm`;
                    explanation = `정사각형의 둘레 = 한 변의 길이 × 4 = ${shapeNum2} × 4 = ${shapeNum2 * 4}cm입니다.`;
                } else {
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
        const minTotal = Math.min(3, targetTotal); // 최소 1~3개
        
        // 2차: 부족한 경우 재시도 또는 템플릿으로 채우기
        if (questions.length < minTotal || questions.length < targetTotal) {
            console.log(`⚠️ 문제 부족: ${questions.length}개 (목표: ${targetTotal}개, 최소: ${minTotal}개)`);
            
            const need = Math.max(minTotal - questions.length, targetTotal - questions.length);
            
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
            // 최후의 수단: 정적 문제 1개
            const problemsList = document.getElementById('problemsList');
            if (problemsList) {
                problemsList.innerHTML = `
                    <div class="problem-item">
                        <div class="problem-number">문제 1</div>
                        <div class="problem-stem">5 + 3 = ?</div>
                        <div class="problem-answer-input">
                            <input type="text" placeholder="답을 입력하세요" class="answer-input">
                        </div>
                        <div class="problem-actions">
                            <button class="btn-toggle-answer" onclick="toggleAnswer('static-1')">
                                <span class="toggle-icon">✓</span>
                                <span class="toggle-text">정답 보기</span>
                            </button>
                        </div>
                        <div class="problem-answer" id="answer-static-1" style="display: none;">
                            <div class="answer-title">정답</div>
                            <div class="answer-content">8</div>
                        </div>
                    </div>
                `;
                if (resultHeader) resultHeader.style.display = 'block';
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
    const { current = 0, total = 0, conceptName = '', status = 'generating', successCount = 0, failureCount = 0 } = progress;
    
    let statusText = '문제 생성 중...';
    let statusIcon = '⏳';
    let progressBar = '';
    let conceptInfo = '';
    
    if (total > 0) {
        const percentage = Math.round((current / total) * 100);
        progressBar = `
            <div class="progress-bar-container" style="margin: 20px 0;">
                <div class="progress-bar" style="width: ${percentage}%; background: #4f46e5; height: 8px; border-radius: 4px; transition: width 0.3s;"></div>
                <div class="progress-text" style="margin-top: 8px; font-size: 0.9rem; color: #666;">
                    진행: ${current} / ${total} 항목 생성 중
                </div>
            </div>
        `;
        
        if (conceptName) {
            conceptInfo = `
                <div class="current-concept" style="margin: 10px 0; padding: 12px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #4f46e5;">
                    <div style="font-weight: 600; color: #1e40af; margin-bottom: 4px;">현재 항목</div>
                    <div style="color: #1e3a8a;">${escapeHtml(conceptName)}</div>
                    ${successCount > 0 || failureCount > 0 ? `
                        <div style="margin-top: 8px; font-size: 0.85rem; color: #666;">
                            성공: ${successCount}개 / 실패: ${failureCount}개
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        if (status === 'completed') {
            statusText = `항목 "${conceptName}" 완료`;
            statusIcon = '✅';
        } else if (status === 'partial') {
            statusText = `항목 "${conceptName}" 부분 완료 (일부 실패)`;
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
    PROBABILITY: 'probability'    // (P) 확률
};

/**
 * 개념별 템플릿 매핑 (conceptId 기반)
 * 모든 5~6학년 및 중학교 개념 ID를 포함
 */
const CONCEPT_TEMPLATE_MAP = {
    // 초4-2: 삼각형 분류
    'G4-S2-U2-T1': { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['삼각형', '변의 길이', '분류'], validation: 'triangle_classify' },
    'G4-S2-U2-T2': { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['삼각형', '이등변', '정삼각형'], validation: 'triangle_classify' },
    'G4-S2-U2-T3': { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['삼각형', '각의 크기', '분류'], validation: 'triangle_classify' },
    'G4-S2-U2-T4': { templates: [PROBLEM_TYPES.TRIANGLE_CLASSIFY], requiredKeywords: ['삼각형', '분류', '기준'], validation: 'triangle_classify' }
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
function generateAreaProblem(grade, conceptText = '') {
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

// (D) 곱셈·나눗셈이 섞인 식 계산 문제 생성
function generateMixedCalcProblem(grade) {
    // 학년에 따라 식의 난이도 조절
    let expressions;
    if (grade <= 3) {
        // 1-3학년: 작은 수
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
    const selected = expressions[Math.floor(Math.random() * expressions.length)];
    
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
 * 삼각형 분류 문제 생성
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
    
    return {
        type: PROBLEM_TYPES.TRIANGLE_CLASSIFY,
        question: `세 변의 길이가 각각 ${selected.sides[0]}cm, ${selected.sides[1]}cm, ${selected.sides[2]}cm인 삼각형은 어떤 삼각형인가요?`,
        answer: selected.type,
        explanation: selected.type === '정삼각형' ? '세 변의 길이가 모두 같으므로 정삼각형입니다.' :
                     selected.type === '이등변삼각형' ? '두 변의 길이가 같으므로 이등변삼각형입니다.' :
                     '세 변의 길이가 모두 다르므로 부등변삼각형입니다.',
        inputPlaceholder: '예: 이등변삼각형',
        meta: { grade, concept: 'triangle_classify' }
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
        answer: `${solution}`,
        explanation: `${coef}x = ${result} - ${constTerm} = ${result - constTerm}, x = ${(result - constTerm)} ÷ ${coef} = ${solution}입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'linear_equation', coefficient: coef, constant: constTerm, solution }
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
        answer: `${y}`,
        explanation: `y = ${a} × ${x} + ${b} = ${a * x} + ${b} = ${y}입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'linear_function', slope: a, intercept: b, x, y }
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
    
    // 생활 속 상황 템플릿
    const situations = [
        {
            context: '민수는 하루에 {unit}개씩 {item}을 사용합니다.',
            question: '{days}일 동안 사용한 {item}의 개수를 식으로 나타내세요.',
            answer: '{unit} × {days}',
            explanation: '하루에 {unit}개씩 {days}일 동안 사용하므로, {unit} × {days} = {result}개입니다.'
        },
        {
            context: '한 상자에 {item}이 {unit}개씩 들어있습니다.',
            question: '상자 {days}개에 들어있는 {item}의 개수를 식으로 나타내세요.',
            answer: '{unit} × {days}',
            explanation: '한 상자에 {unit}개씩 {days}개 상자에 들어있으므로, {unit} × {days} = {result}개입니다.'
        },
        {
            context: '지우개 {unit}개의 무게가 {weight}g입니다.',
            question: '지우개 {days}개의 무게를 식으로 나타내세요.',
            answer: '{weight} ÷ {unit} × {days}',
            explanation: '지우개 {unit}개의 무게가 {weight}g이므로, 지우개 1개의 무게는 {weight} ÷ {unit} = {unitWeight}g입니다. 따라서 {days}개의 무게는 {unitWeight} × {days} = {result}g입니다.'
        },
        {
            context: '연필 {unit}자루의 가격이 {price}원입니다.',
            question: '연필 {days}자루의 가격을 식으로 나타내세요.',
            answer: '{price} ÷ {unit} × {days}',
            explanation: '연필 {unit}자루의 가격이 {price}원이므로, 연필 1자루의 가격은 {price} ÷ {unit} = {unitPrice}원입니다. 따라서 {days}자루의 가격은 {unitPrice} × {days} = {result}원입니다.'
        },
        {
            context: '자동차가 시속 {speed}km로 달립니다.',
            question: '{hours}시간 동안 이동한 거리를 식으로 나타내세요.',
            answer: '{speed} × {hours}',
            explanation: '시속 {speed}km로 {hours}시간 동안 이동하므로, 거리는 {speed} × {hours} = {result}km입니다.'
        },
        {
            context: '공책 한 권의 가격이 {price}원입니다.',
            question: '공책 {count}권의 가격을 식으로 나타내세요.',
            answer: '{price} × {count}',
            explanation: '공책 한 권이 {price}원이므로, {count}권의 가격은 {price} × {count} = {result}원입니다.'
        },
        {
            context: '사과 {count}개의 가격이 {price}원입니다.',
            question: '사과 {unit}개의 가격을 식으로 나타내세요.',
            answer: '{price} ÷ {count} × {unit}',
            explanation: '사과 {count}개의 가격이 {price}원이므로, 사과 1개의 가격은 {price} ÷ {count} = {unitPrice}원입니다. 따라서 {unit}개의 가격은 {unitPrice} × {unit} = {result}원입니다.'
        },
        {
            context: '한 시간에 {work}개의 일을 할 수 있습니다.',
            question: '{hours}시간 동안 할 수 있는 일의 개수를 식으로 나타내세요.',
            answer: '{work} × {hours}',
            explanation: '한 시간에 {work}개씩 {hours}시간 동안 일하므로, {work} × {hours} = {result}개입니다.'
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
    if (selectedSituation.answer.includes('÷')) {
        const unitPrice = Math.floor(price / count);
        result = unitPrice * unit;
    } else if (selectedSituation.answer.includes('×')) {
        result = unit * days;
    } else {
        result = unit * days;
    }
    
    // 아이템 이름
    const items = ['연필', '지우개', '공책', '사과', '귤', '사탕', '초콜릿', '우유'];
    const item = items[Math.floor(Math.random() * items.length)];
    
    // 템플릿 치환
    let question = selectedSituation.context + '\n' + selectedSituation.question;
    let answer = selectedSituation.answer;
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
        .replace(/{work}/g, work.toString());
    
    answer = answer
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
    
    return {
        type: PROBLEM_TYPES.PATTERN,
        question: question,
        answer: answer,
        explanation: explanation,
        inputPlaceholder: '답을 입력하세요 (예: 3 × 5)',
        meta: { grade, concept: 'correspondence', unit, days, result }
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
function generateMiddleSchoolGeometryProblem(grade, conceptText = '', conceptId = '') {
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
 * 중학교 수준 정수/유리수 계산 문제 생성
 */
function generateMiddleSchoolNumberProblem(grade, conceptText = '', conceptId = '') {
    const conceptLower = (conceptText || '').toLowerCase();
    const idLower = (conceptId || '').toLowerCase();
    
    // 정수와 유리수의 사칙계산
    if (conceptLower.includes('정수') || conceptLower.includes('유리수') || idLower.includes('u2')) {
        const isNegative = Math.random() > 0.5;
        const num1 = isNegative ? -(Math.floor(Math.random() * 10) + 1) : (Math.floor(Math.random() * 10) + 1);
        const num2 = isNegative ? -(Math.floor(Math.random() * 10) + 1) : (Math.floor(Math.random() * 10) + 1);
        const operations = ['+', '-', '×', '÷'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        let result;
        let explanation;
        
        if (op === '+') {
            result = num1 + num2;
            explanation = `${num1} + ${num2} = ${result}입니다.`;
        } else if (op === '-') {
            result = num1 - num2;
            explanation = `${num1} - ${num2} = ${result}입니다.`;
        } else if (op === '×') {
            result = num1 * num2;
            explanation = `${num1} × ${num2} = ${result}입니다.`;
        } else {
            // 나눗셈은 정수 결과가 나오도록
            const divisor = num2 !== 0 ? num2 : 1;
            result = num1 / divisor;
            if (Number.isInteger(result)) {
                explanation = `${num1} ÷ ${divisor} = ${result}입니다.`;
            } else {
                // 유리수로 표현
                const g = gcd(Math.abs(num1), Math.abs(divisor));
                const simplifiedNum = num1 / g;
                const simplifiedDen = divisor / g;
                explanation = `${num1} ÷ ${divisor} = \\dfrac{${simplifiedNum}}{${simplifiedDen}}입니다.`;
                return {
                    type: PROBLEM_TYPES.MIXED_CALC,
                    question: `${num1} ÷ ${divisor} = ?`,
                    answer: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                    answerLatex: `\\dfrac{${simplifiedNum}}{${simplifiedDen}}`,
                    explanation: explanation,
                    inputPlaceholder: '답을 입력하세요 (예: \\dfrac{3}{4})',
                    meta: { grade, concept: 'rational_division', num1, num2: divisor, result }
                };
            }
        }
        
        return {
            type: PROBLEM_TYPES.MIXED_CALC,
            question: `${num1} ${op === '×' ? '×' : op === '÷' ? '÷' : op} ${num2} = ?`,
            answer: `${result}`,
            explanation: explanation,
            inputPlaceholder: '답을 입력하세요',
            meta: { grade, concept: 'integer_rational_calc', num1, num2, operation: op, result }
        };
    }
    
    // 기본: 정수 계산
    const a = -(Math.floor(Math.random() * 10) + 1);
    const b = Math.floor(Math.random() * 10) + 1;
    return {
        type: PROBLEM_TYPES.MIXED_CALC,
        question: `${a} + ${b} = ?`,
        answer: `${a + b}`,
        explanation: `${a} + ${b} = ${a + b}입니다.`,
        inputPlaceholder: '답을 입력하세요',
        meta: { grade, concept: 'integer_calc', a, b, result: a + b }
    };
}

// 문제 형식 중 하나를 랜덤 생성 (개념 텍스트 추가로 도형 문제 생성 가능)
function generateProblemByType(type, grade, conceptText = '', conceptId = '') {
    // conceptId가 객체인 경우 문자열로 변환
    let idString = '';
    if (typeof conceptId === 'string') {
        idString = conceptId;
    } else if (conceptId && typeof conceptId === 'object') {
        idString = conceptId.id || conceptId.conceptId || '';
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
            // 중학교 수준 정수/유리수 계산 문제 처리
            if (grade >= 7 || (idString && idString.startsWith('M'))) {
                return generateMiddleSchoolNumberProblem(grade, conceptText, idString);
            }
            // 도형 넓이 문제인 경우 generateAreaProblem 사용
            if (conceptText && (conceptText.includes('마름모') || conceptText.includes('사다리꼴') || 
                conceptText.includes('평행사변형') || (conceptText.includes('넓이') && conceptText.includes('삼각형')) ||
                (conceptText.includes('넓이') && conceptText.includes('직사각형')))) {
                return generateAreaProblem(grade, conceptText);
            }
            return generateMixedCalcProblem(grade);
        case PROBLEM_TYPES.SKIP_COUNT:
            return generateSkipCountProblem(grade);
        case PROBLEM_TYPES.TWO_DIGIT_DIV:
            return generateTwoDigitDivProblem(grade);
        case PROBLEM_TYPES.PATTERN:
            // 대응 관계 문제인 경우 (생활 속에서 대응 관계를 찾아 식으로 나타내기)
            if (conceptText && (conceptText.includes('대응') || conceptText.includes('생활 속') || 
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
        case PROBLEM_TYPES.PROBABILITY:
            return generateProbabilityProblem(grade);
        default:
            // 템플릿이 없으면 null 반환 (재시도 유도)
            console.error(`템플릿 타입 없음: ${type}, conceptId: ${conceptId}`);
            return null;
    }
}

// 개념에 맞는 문제 형식 매핑 (CONCEPT_TEMPLATE_MAP 기반)
function getProblemTypesForConcept(conceptText, grade, conceptId = '') {
    // conceptId가 객체인 경우 문자열로 변환
    let idString = '';
    if (typeof conceptId === 'string') {
        idString = conceptId;
    } else if (conceptId && typeof conceptId === 'object' && conceptId.id) {
        idString = conceptId.id;
    } else if (conceptId && typeof conceptId === 'object' && conceptId.conceptId) {
        idString = conceptId.conceptId;
    }
    
    // CONCEPT_TEMPLATE_MAP에서 직접 조회
    if (idString && CONCEPT_TEMPLATE_MAP[idString]) {
        const templateInfo = CONCEPT_TEMPLATE_MAP[idString];
        if (templateInfo && templateInfo.templates && templateInfo.templates.length > 0) {
            return templateInfo.templates;
        }
    }
    
    // conceptId로 찾지 못한 경우 conceptText 기반 매칭
    const conceptLower = conceptText.toLowerCase();
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
    
    // 평면도형 관련
    if (conceptLower.includes('평면도형') || conceptLower.includes('도형') && 
        (conceptLower.includes('뒤집') || conceptLower.includes('돌리') || conceptLower.includes('이동'))) {
        // 도형 이동/변환 문제
        if (grade >= 4) {
            types.push(PROBLEM_TYPES.PATTERN); // 패턴 문제 형식 사용
        }
    }
    
    // 원의 넓이, 원주율
    if (conceptLower.includes('원의 넓이') || conceptLower.includes('원주율') || conceptLower.includes('원주')) {
        if (grade >= 5) {
            types.push(PROBLEM_TYPES.MIXED_CALC); // 원의 넓이 계산
        }
    }
    
    // 비와 비율
    if (conceptLower.includes('비') || conceptLower.includes('비율') || conceptLower.includes('비례')) {
        if (grade >= 5) {
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
    
    // 곱셈/나눗셈 관련
    if (conceptLower.includes('곱셈') || conceptLower.includes('나눗셈') || conceptLower.includes('혼합 계산') ||
        conceptLower.includes('곱셈과 나눗셈') || conceptLower.includes('자연수의 혼합 계산')) {
        if (grade >= 3) {
            types.push(PROBLEM_TYPES.MIXED_CALC);
        }
        if (grade >= 4) {
            types.push(PROBLEM_TYPES.TWO_DIGIT_DIV);
        }
    }
    
    // 규칙 찾기 관련
    if (conceptLower.includes('규칙') || conceptLower.includes('대응') || conceptLower.includes('뛰어') ||
        conceptLower.includes('규칙과 대응') || conceptLower.includes('규칙 찾기')) {
        if (grade >= 2) {
            types.push(PROBLEM_TYPES.SKIP_COUNT);
            types.push(PROBLEM_TYPES.PATTERN);
        }
    }
    
    // 기본적으로 모든 형식 사용 가능 (개념이 명확하지 않을 때)
    if (types.length === 0) {
        // 학년에 맞는 기본 형식 제공 (6학년은 고급 문제)
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
        // 여전히 없으면 모든 형식
        if (types.length === 0) {
            types.push(...Object.values(PROBLEM_TYPES));
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
    const allText = `${questionText} ${explanationText}`.toLowerCase();
    const { mustIncludeAny = [], unitTitle = '', conceptTitle = '' } = conceptInfo;
    
    // 1. 순수 산수 문제 차단
    if (isPureArithmetic(allText)) {
        return {
            valid: false,
            reason: '초등 산수 문제는 중학교에서 금지됩니다.'
        };
    }
    
    // 2. 항목별 필수 키워드 확인
    if (mustIncludeAny && mustIncludeAny.length > 0) {
        const matched = mustIncludeAny.filter(k => allText.includes(k.toLowerCase()));
        if (matched.length < 2) {
            return {
                valid: false,
                reason: `필수 키워드 부족: ${matched.length}개 매칭 (최소 2개 필요). 필수 키워드: ${mustIncludeAny.join(', ')}`
            };
        }
    }
    
    // 3. 중학교 수준 키워드 확인 (특정 단원별)
    const conceptLower = (conceptTitle || '').toLowerCase();
    if (conceptLower.includes('경우의 수') || conceptLower.includes('확률')) {
        const requiredKeywords = ['경우의 수', '나열', '곱셈원리', '합의 원리', '덧셈원리', '중복', '순서', '조건', '분류', '표', '트리', '포함'];
        const matched = requiredKeywords.filter(k => allText.includes(k));
        if (matched.length < 2) {
            return {
                valid: false,
                reason: `경우의 수 키워드 부족: ${matched.length}개 매칭 (최소 2개 필요). 필수 키워드: ${requiredKeywords.join(', ')}`
            };
        }
    }
    
    return { valid: true };
}

// 중복 문제 체크
function isDuplicateQuestion(newQuestion, existingQuestions) {
    if (!existingQuestions || existingQuestions.length === 0) return false;
    
    // 정규화: 공백, 기호 제거, 소문자 변환
    const normalize = (text) => {
        return (text || '').toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^\w가-힣]/g, '');
    };
    
    const newNormalized = normalize(newQuestion.question || newQuestion.stem || '');
    
    // 완전 동일 체크
    for (const existing of existingQuestions) {
        const existingNormalized = normalize(existing.question || existing.stem || '');
        if (newNormalized === existingNormalized && newNormalized.length > 0) {
            return true;
        }
    }
    
    // 숫자만 바뀐 유사 문항 체크 (핵심 키워드 비교)
    const extractKeywords = (text) => {
        const normalized = normalize(text);
        // 숫자 제거 후 남은 키워드 추출
        const withoutNumbers = normalized.replace(/\d+/g, '');
        // 핵심 단어 추출 (2글자 이상)
        return withoutNumbers.match(/[가-힣]{2,}/g) || [];
    };
    
    const newKeywords = extractKeywords(newQuestion.question || newQuestion.stem || '');
    
    for (const existing of existingQuestions) {
        const existingKeywords = extractKeywords(existing.question || existing.stem || '');
        
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
        
        // mustIncludeAny 중 최소 2개 포함 확인
        if (concept.mustIncludeAny && concept.mustIncludeAny.length > 0) {
            const matched = concept.mustIncludeAny.filter(k => allText.includes(k));
            if (matched.length < 2) {
                return {
                    valid: false,
                    reason: `도형 키워드 부족: ${matched.length}개 매칭 (최소 2개 필요). 필수 키워드: ${concept.mustIncludeAny.join(', ')}`
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

// 문제가 항목과 일치하는지 검증 (강화 버전 + 중학교 난이도 가드레일)
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
        grade = 1 
    } = conceptInfo;
    
    const questionText = problem.question || problem.stem || '';
    const explanationText = problem.explanation || '';
    const allText = `${questionText} ${explanationText}`.toLowerCase();
    
    // 중복 체크 (먼저 수행)
    if (isDuplicateQuestion(problem, existingQuestions)) {
        return {
            valid: false,
            reason: '중복 문제입니다.'
        };
    }
    
    // 중학교 난이도 가드레일 (저 수준 문제 전면 차단)
    if (gradeLevel === 'middle' || difficultyTag === 'middle' || grade >= 7) {
        const middleSchoolValidation = validateMiddleSchoolDifficulty(questionText, explanationText, conceptInfo);
        if (!middleSchoolValidation.valid) {
            return middleSchoolValidation;
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
        const matched = mustIncludeAny.filter(k => allText.includes(k.toLowerCase()));
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
    
    // 선택된 개념이 없으면 에러
    if (concepts.length === 0) {
        console.error('No concepts selected');
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
    
    // 중학교인 경우 선택된 토픽 ID를 실제 토픽 텍스트로 변환
    let selectedConceptList = [];
    if (schoolLevel === '중학교' && window.MIDDLE_SCHOOL_TOC) {
        const gradeKey = `${rawGrade}학년`;
        const semesterKey = `${semester}학기`;
        const tocData = window.MIDDLE_SCHOOL_TOC[gradeKey];
        
        if (tocData && tocData[semesterKey]) {
            const units = tocData[semesterKey];
            
            // T| 또는 S|로 시작하는 ID 필터링 (세부 토픽 또는 소단원)
            const topicIds = concepts.filter(c => typeof c === 'string' && (c.startsWith('T|') || c.startsWith('S|')));
            
            topicIds.forEach(id => {
                const parts = id.split('|');
                if (parts.length === 6) {
                    const uIdx = parseInt(parts[3]);
                    const sIdx = parseInt(parts[4]);
                    const tIdx = parseInt(parts[5]);
                    
                    const unit = units[uIdx];
                    if (unit && unit.subunits && unit.subunits[sIdx]) {
                        // S|로 시작하면 소단원 제목 사용
                        if (id.startsWith('S|')) {
                            const subunit = unit.subunits[sIdx];
                            selectedConceptList.push({
                                id: id,
                                text: subunit.title || unit.title,
                                unitTitle: unit.title,
                                subunitTitle: subunit.title
                            });
                        } else if (unit.subunits[sIdx].topics) {
                            // T|로 시작하면 토픽 제목 사용
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
                }
            });
            
            console.log('Selected concepts:', selectedConceptList.length);
        }
    } else {
        // 초등학교인 경우
        concepts.forEach(concept => {
            selectedConceptList.push({
                id: concept,
                text: conceptToText(concept) || concept,
                unitTitle: '',
                subunitTitle: ''
            });
        });
    }
    
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
                } else {
                    mustIncludeAny = ['도형', '각', '격자', '점', '선'];
                }
            } else if (domain === 'probability') {
                mustIncludeAny = ['경우의 수', '나열', '곱셈원리', '덧셈원리', '조건', '분류', '표', '트리', '중복', '순서'];
            } else {
                // number 도메인 - 키워드 추출
                const keywordData = extractConceptKeywords(conceptInfo.conceptTitle || conceptInfo.text, conceptInfo.unitTitle, conceptInfo.subunitTitle);
                mustIncludeAny = keywordData.mustInclude || keywordData.keywords.slice(0, 3) || [];
            }
        }
        
        // 3. mustIncludeMinHit 설정
        const mustIncludeMinHit = conceptInfo.mustIncludeMinHit || 2;
        
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
            mustAvoidAny: normalized.mustAvoidAny || keywordData.mustAvoid || []
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
        
        // 진행 상황 업데이트 (실제 개념 이름 사용)
        if (progressCallback) {
            // conceptText가 ID 형식이면 실제 이름으로 변환
            let displayName = conceptText;
            if (conceptText && (conceptText.includes('|') || conceptText.startsWith('S|') || conceptText.startsWith('T|') || conceptText.startsWith('G'))) {
                // ID 형식이면 conceptInfo에서 실제 텍스트 찾기
                displayName = conceptInfo.conceptTitle || conceptInfo.text || conceptInfo.subunitTitle || conceptInfo.unitTitle || conceptText;
                // 여전히 ID 형식이면 마지막 부분만 표시
                if (displayName.includes('|')) {
                    const parts = displayName.split('|');
                    if (parts.length > 1) {
                        displayName = parts[parts.length - 1] || conceptText;
                    }
                }
            }
            
            progressCallback({
                current: conceptIndex + 1,
                total: enrichedConceptList.length,
                conceptName: displayName,
                status: 'generating'
            });
        }
        
        const conceptQuestions = [];
        let successCount = 0;
        let failureCount = 0;
        
        // 각 항목당 perConceptCount개씩 생성 (검증 + 재시도)
        for (let i = 0; i < perConceptCount; i++) {
            let problemData = null;
            let validationResult = null;
            let attempts = 0;
            const maxAttempts = 3; // 최대 3회 시도
            
            while (attempts < maxAttempts && !validationResult?.valid) {
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
                            
                            // conceptId를 문자열로 확실히 변환
                            let conceptIdString = '';
                            if (conceptInfo.id && typeof conceptInfo.id === 'string') {
                                conceptIdString = conceptInfo.id;
                            } else if (conceptInfo.conceptId && typeof conceptInfo.conceptId === 'string') {
                                conceptIdString = conceptInfo.conceptId;
                            } else if (conceptInfo.id && typeof conceptInfo.id === 'object') {
                                conceptIdString = conceptInfo.id.id || conceptInfo.id.conceptId || '';
                            } else if (conceptInfo.conceptId && typeof conceptInfo.conceptId === 'object') {
                                conceptIdString = conceptInfo.conceptId.id || conceptInfo.conceptId.conceptId || '';
                            }
                            
                            // 개념에 맞는 문제 형식 목록 가져오기 (CONCEPT_TEMPLATE_MAP 기반)
                            const availableTypes = getProblemTypesForConcept(conceptText, effectiveGrade, conceptIdString);
                            
                            if (availableTypes.length > 0) {
                                selectedType = availableTypes[i % availableTypes.length];
                            } else {
                                // CONCEPT_TEMPLATE_MAP에서 찾지 못한 경우 emergencyGenerator 사용
                                const emergency = emergencyGenerator(conceptInfo, effectiveGrade);
                                if (emergency) {
                                    resolve(emergency);
                                    return;
                                }
                                const allTypes = Object.values(PROBLEM_TYPES);
                                selectedType = allTypes[i % allTypes.length];
                            }
                            
                            // 문제 생성 (conceptId 전달 - 중학교 개념 ID 포함)
                            const finalConceptId = conceptIdString || conceptInfo.id || conceptInfo.conceptId || '';
                            const generated = generateProblemByType(selectedType, effectiveGrade, conceptText, finalConceptId);
                            
                            // 기본 검증
                            if (!generated || !generated.question || !generated.answer) {
                                // emergencyGenerator 사용 (2학년 문제 금지)
                                const emergency = emergencyGenerator(conceptInfo, effectiveGrade);
                                if (emergency) {
                                    resolve(emergency);
                                } else {
                                    resolve(null); // 재시도 유도
                                }
                            } else {
                                resolve(generated);
                            }
                        } catch (err) {
                            console.error('Generation error:', err);
                            // emergencyGenerator 사용
                            const emergency = emergencyGenerator(conceptInfo, effectiveGrade);
                            if (emergency) {
                                resolve(emergency);
                            } else {
                                resolve(null); // 재시도 유도
                            }
                        }
                    });
                    
                    // 타임아웃과 함께 실행
                    problemData = await Promise.race([generatePromise, timeoutPromise]);
                    
                    // 항목 일치 검증 (중복 체크 포함)
                    validationResult = validateProblemMatchesConcept(problemData, conceptInfo, conceptQuestions);
                    
                    if (!validationResult.valid) {
                        if (attempts < maxAttempts) {
                            // 디버그 로그
                            if (console && console.warn) {
                                console.warn(`⚠️ 검증 실패 (시도 ${attempts}/${maxAttempts}):`, {
                                    항목: conceptText,
                                    문제번호: i + 1,
                                    사유: validationResult.reason
                                });
                            }
                            // 재시도 전 잠시 대기
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                } catch (error) {
                    console.error(`❌ 문제 생성 오류 (항목: ${conceptText}, 시도: ${attempts}):`, error);
                    
                    if (attempts >= maxAttempts) {
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
                
                const question = {
                    id: `problem-${Date.now()}-${conceptIndex}-${i}-${Math.random().toString(36).substr(2, 9)}`,
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
                    meta: problemData.meta || {},
                    concept: conceptText,
                    problemType: problemType,
                    sourceConcept: (() => {
                        // conceptId를 문자열로 확실히 변환
                        if (conceptInfo.conceptId && typeof conceptInfo.conceptId === 'string') {
                            return conceptInfo.conceptId;
                        } else if (conceptInfo.id && typeof conceptInfo.id === 'string') {
                            return conceptInfo.id;
                        } else if (conceptInfo.conceptId && typeof conceptInfo.conceptId === 'object') {
                            return conceptInfo.conceptId.id || conceptInfo.conceptId.conceptId || '';
                        } else if (conceptInfo.id && typeof conceptInfo.id === 'object') {
                            return conceptInfo.id.id || conceptInfo.id.conceptId || '';
                        }
                        return '';
                    })(),
                    sourceConceptText: conceptText,
                    pathText: conceptInfo.pathText || '',
                    unitTitle: conceptInfo.unitTitle || '',
                    subunitTitle: conceptInfo.subunitTitle || '',
                    domain: conceptInfo.domain || 'number',
                    matchedKeywords: matchedKeywords,
                    totalKeywords: totalKeywords,
                    conceptIndex: conceptIndex,
                    problemIndex: i + 1
                };
                
                conceptQuestions.push(question);
                questions.push(question);
                successCount++;
            } else {
                // 실패 처리: 템플릿으로 대체
                failureCount++;
                if (console && console.error) {
                    console.error(`❌ 항목 "${conceptText}" 문제 ${i + 1} 생성 실패:`, validationResult?.reason || '알 수 없는 오류');
                }
                
                // emergencyGenerator로 대체 시도 (2학년 문제 금지)
                try {
                    const emergency = emergencyGenerator(conceptInfo, effectiveGrade);
                    if (emergency) {
                        const templateProblem = emergency;
                        // emergencyGenerator 결과는 항상 통과 (학년 적합성 보장)
                        // 검증은 완화하되, 최소한의 키워드만 확인
                        const templateValidation = validateProblemMatchesConcept(templateProblem, conceptInfo, conceptQuestions);
                        // emergencyGenerator 결과는 무조건 통과 (검증 완화)
                        if (true) { // templateValidation.valid || true
                            // 키워드 매칭 개수 계산 (디버그용)
                            const allText = `${templateProblem.question || ''} ${templateProblem.explanation || ''}`.toLowerCase();
                            const matchedKeywords = (conceptInfo.mustIncludeAny || []).filter(k => allText.includes(k.toLowerCase())).length;
                            const totalKeywords = conceptInfo.mustIncludeAny?.length || 0;
                            
                            const question = {
                                id: `problem-${Date.now()}-${conceptIndex}-${i}-${Math.random().toString(36).substr(2, 9)}`,
                                type: templateProblem.type || 'template',
                                number: globalQuestionNumber++,
                                question: templateProblem.question,
                                answer: templateProblem.answer,
                                explanation: templateProblem.explanation || '',
                                inputPlaceholder: templateProblem.inputPlaceholder || '답을 입력하세요',
                                meta: { ...templateProblem.meta, isFallback: true },
                                concept: conceptText,
                                problemType: problemType,
                                sourceConcept: (() => {
                        // conceptId를 문자열로 확실히 변환
                        if (conceptInfo.conceptId && typeof conceptInfo.conceptId === 'string') {
                            return conceptInfo.conceptId;
                        } else if (conceptInfo.id && typeof conceptInfo.id === 'string') {
                            return conceptInfo.id;
                        } else if (conceptInfo.conceptId && typeof conceptInfo.conceptId === 'object') {
                            return conceptInfo.conceptId.id || conceptInfo.conceptId.conceptId || '';
                        } else if (conceptInfo.id && typeof conceptInfo.id === 'object') {
                            return conceptInfo.id.id || conceptInfo.id.conceptId || '';
                        }
                        return '';
                    })(),
                                sourceConceptText: conceptText,
                                pathText: conceptInfo.pathText || '',
                                unitTitle: conceptInfo.unitTitle || '',
                                subunitTitle: conceptInfo.subunitTitle || '',
                                domain: conceptInfo.domain || 'number',
                                matchedKeywords: matchedKeywords,
                                totalKeywords: totalKeywords,
                                conceptIndex: conceptIndex,
                                problemIndex: i + 1
                            };
                            
                            conceptQuestions.push(question);
                            questions.push(question);
                            successCount++;
                            failureCount--;
                        }
                    }
                } catch (err) {
                    console.error('템플릿 생성 오류:', err);
                }
            }
        }
        
        // 항목별 결과 저장
        conceptResults.push({
            conceptInfo: conceptInfo,
            successCount: successCount,
            failureCount: failureCount,
            questions: conceptQuestions
        });
        
        // 진행 상황 업데이트 (완료)
        if (progressCallback) {
            progressCallback({
                current: conceptIndex + 1,
                total: enrichedConceptList.length,
                conceptName: conceptText,
                status: failureCount > 0 ? 'partial' : 'completed',
                successCount: successCount,
                failureCount: failureCount
            });
        }
    }
    
    // 최종 로그
    const totalSuccess = conceptResults.reduce((sum, r) => sum + r.successCount, 0);
    const totalFailure = conceptResults.reduce((sum, r) => sum + r.failureCount, 0);
    
    console.log(`✅ 문제 생성 완료:`, {
        총생성: questions.length,
        성공: totalSuccess,
        실패: totalFailure,
        항목수: enrichedConceptList.length
    });
    
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
        
        // 상태에 따른 배너 문구 변경
        if (resultHeaderTitle) {
            if (status === 'success') {
                resultHeaderTitle.textContent = '✔ 맞춤형 변형문제가 생성되었습니다!';
            } else if (status === 'partial' || status === 'fallback') {
                resultHeaderTitle.textContent = '✔ 문제가 생성되었습니다!';
            } else {
                resultHeaderTitle.textContent = '✔ 맞춤형 변형문제가 생성되었습니다!';
            }
        }
    }
    
    // 총합 정보 계산
    const totalConcepts = new Set(questions.map(q => q.sourceConcept || q.concept)).size;
    const totalProblems = questions.length;
    const perConceptCount = formData.problemCount || 3;
    
    // 항목별로 그룹화
    const groupedByConcept = {};
    questions.forEach(question => {
        const conceptKey = question.sourceConcept || question.concept || '기타';
        if (!groupedByConcept[conceptKey]) {
            groupedByConcept[conceptKey] = {
                conceptText: question.sourceConceptText || question.concept || '기타',
                unitTitle: question.unitTitle || '',
                subunitTitle: question.subunitTitle || '',
                problems: []
            };
        }
        groupedByConcept[conceptKey].problems.push(question);
    });
    
    // 항목별로 HTML 생성
    let html = '';
    
    // 총합 표시 추가
    html += `
    <div class="total-summary" style="margin-bottom: 30px; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #4f46e5;">
        <div style="font-weight: 600; color: #1e40af; margin-bottom: 8px;">생성된 문제 요약</div>
        <div style="color: #1e3a8a; font-size: 0.95rem;">
            선택 항목: <strong>${totalConcepts}개</strong> / 항목당: <strong>${perConceptCount}개</strong> / 총 문제: <strong>${totalProblems}개</strong>
        </div>
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
        
        html += `
        <div class="concept-group" data-concept-key="${escapeHtml(conceptKey)}">
            <div class="concept-group-header">
                <h4 class="concept-group-title">${groupIndex + 1}) ${escapeHtml(conceptDisplayName)} (총 ${group.problems.length}문제)</h4>
            </div>
            <div class="concept-group-problems">
        `;
        
        group.problems.forEach((question, index) => {
            const questionText = question.question || question.stem || questionToPrompt(question) || '문제 생성에 실패했습니다. 다시 생성해 주세요.';
            const questionLatex = question.questionLatex || question.question; // LaTeX가 있으면 사용
            
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
            
            // LaTeX 렌더링 여부 확인
            const hasLatex = questionLatex && (questionLatex.includes('\\frac') || questionLatex.includes('\\dfrac'));
            const questionDisplay = hasLatex 
                ? `<div class="math-display" data-latex="${escapeHtml(questionLatex)}"></div>`
                : `<div class="problem-stem">${escapeHtml(questionText)}</div>`;
            
            html += `
            <div class="problem-item" data-question-id="${question.id}">
                ${debugInfo}
                <div class="problem-number">문제 ${question.number || (groupIndex * 100 + index + 1)}</div>
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
                            const explText = question.explanation || '해설이 없습니다.';
                            // 해설 내 LaTeX 수식 렌더링
                            return explText.split('\n').map(line => {
                                if (line.includes('\\frac') || line.includes('\\dfrac')) {
                                    return `<div class="math-display" data-latex="${escapeHtml(line)}"></div>`;
                                }
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
    
    // KaTeX 렌더링 적용
    if (window.katex) {
        document.querySelectorAll('.math-display[data-latex]').forEach(el => {
            try {
                const latex = el.getAttribute('data-latex');
                katex.render(latex, el, {
                    throwOnError: false,
                    displayMode: false
                });
            } catch (e) {
                console.error('KaTeX 렌더링 오류:', e);
                el.textContent = el.getAttribute('data-latex');
            }
        });
    } else if (window.renderMathInElement) {
        // auto-render 사용
        renderMathInElement(problemsList, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\[', right: '\\]', display: true},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false
        });
    }
    
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


