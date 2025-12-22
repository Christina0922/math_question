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
            updateSemesterUI(); // 학기 UI 업데이트
            await updateConceptList();
        });
    });
    
    // 학기 UI 업데이트
    updateSemesterUI();
}

// 학기 UI 업데이트 함수 (5·6학년에서만 2학기 숨김)
function getSelectedGrade() {
    const el = document.querySelector('input[name="grade"]:checked');
    return el ? String(el.value) : null;
}

function updateSemesterUI() {
    const grade = getSelectedGrade();
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
    
    // 1~6학년 새로운 curriculum 데이터 사용
    if (schoolLevel === 'elementary' && grade >= 1 && grade <= 6) {
        try {
            const data = await loadCurriculumData();
            if (!data) {
                console.error('Failed to load curriculum data, using fallback');
                // 데이터 로드 실패 시 기존 방식 사용
                const concepts = elementaryMathConcepts[grade] || elementaryMathConcepts[1];
                conceptGroup.innerHTML = concepts.map((concept, idx) => {
                    const conceptId = `concept-fallback-${grade}-${idx}`;
                    return createSelectableCard({
                        id: conceptId,
                        type: 'checkbox',
                        name: 'concept',
                        value: concept,
                        checked: false,
                        label: escapeHtml(concept),
                        onChange: 'updateConceptCount()',
                        className: ''
                    });
                }).join('');
                updateConceptCount();
                setTimeout(() => {
                  if (window.rebuildConceptGroupToUnitGrid) {
                    window.rebuildConceptGroupToUnitGrid();
                  }
                }, 0);
                return;
            }
            
            const gradeKey = `${grade}학년`;
            const semesterKey = `${semester}학기`;
            
            console.log('Looking for:', gradeKey, semesterKey);
            console.log('Available keys:', Object.keys(data));
            
            if (!data[gradeKey] || !data[gradeKey][semesterKey]) {
                console.error('Data not found for:', gradeKey, semesterKey);
                conceptGroup.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">해당 학년/학기의 데이터가 없습니다. (' + gradeKey + ' ' + semesterKey + ')</div>';
                return;
            }
            
            const units = data[gradeKey][semesterKey];
            console.log('Found units:', units.length);
            
            // STEP 3/5와 동일한 레이아웃 규칙 적용: 전체 래퍼 width: 100%
            let html = '<div style="width: 100%; box-sizing: border-box;">';
            
            // 전체 선택/해제 버튼줄: STEP 3/5와 동일한 폭 규칙 (width: 100%)
            html += '<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 15px; width: 100%; box-sizing: border-box;">';
            html += '<button type="button" onclick="selectAllConcepts()" style="padding: 6px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;">전체 선택</button>';
            html += '<button type="button" onclick="clearAllConcepts()" style="padding: 6px 12px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 4px; cursor: pointer;">전체 해제</button>';
            html += '<div style="margin-left: auto; font-size: 13px; opacity: 0.8;" id="conceptCount">선택됨: 0개</div>';
            html += '</div>';
            
            // 단원별로 렌더링 (단원별 컨테이너 구조: unit-block > unit-title + unit-items)
            units.forEach((unit, uIdx) => {
                const unitNo = pickUnitNo(unit.unit, uIdx + 1);
                const escapedUnit = escapeHtml(unit.unit);
                
                // 단원 블록 컨테이너
                html += '<div class="unit-block" style="margin-bottom: 24px; width: 100%; box-sizing: border-box;">';
                
                // 단원 제목 (2칸 전체 사용)
                html += '<div class="unit-title" style="font-weight: 700; margin-bottom: 12px; font-size: 16px; color: #4F46E5; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; width: 100%;">' + escapedUnit + '</div>';
                
                // 단원 내부 체크박스 컨테이너 (2열 그리드)
                html += '<div class="unit-items">';
                
                unit.topics.forEach((topic, tIdx) => {
                    const topicNo = pickTopicNo(topic, tIdx + 1);
                    const conceptId = 'G' + grade + '-S' + semester + '-U' + unitNo + '-T' + topicNo;
                    const escapedTopic = escapeHtml(topic);
                    
                    // 프로젝트 표준: label이 컨테이너, id+htmlFor 사용
                    html += createSelectableCard({
                        id: conceptId,
                        type: 'checkbox',
                        name: 'concept',
                        value: conceptId,
                        checked: false,
                        label: escapedTopic,
                        onChange: 'updateConceptCount()',
                        className: '',
                        dataAttributes: { 'topic-title': escapedTopic }
                    });
                });
                
                html += '</div></div>'; // unit-items 닫기, unit-block 닫기
            });
            
            html += '</div>';
            conceptGroup.innerHTML = html;
            updateConceptCount();
            setTimeout(() => {
              if (window.rebuildConceptGroupToUnitGrid) {
                window.rebuildConceptGroupToUnitGrid();
              }
            }, 0);
            return;
        } catch (error) {
            console.error('Error in updateConceptList:', error);
            conceptGroup.innerHTML = '<div style="padding: 20px; text-align: center; color: #f00;">오류가 발생했습니다: ' + escapeHtml(error.message) + '</div>';
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
    
    conceptGroup.innerHTML = concepts.map((concept, idx) => {
        const conceptId = `concept-fallback-${grade}-${idx}`;
        return createSelectableCard({
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
    }).join('');
    // fallback의 경우 단원이 없을 수 있으므로 rebuildConceptGroupToUnitGrid는 호출하지 않음
    updateConceptCount();
}

// 선택된 개념 개수 업데이트
function updateConceptCount() {
    const checked = document.querySelectorAll('input[name="concept"]:checked').length;
    const countEl = document.getElementById('conceptCount');
    if (countEl) {
        countEl.textContent = `선택됨: ${checked}개`;
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

// 문제 생성 (시뮬레이션 - 실제로는 AI API 호출)
function generateProblems(formData) {
    const problemsList = document.getElementById('problemsList');
    if (!problemsList) return;
    
    // 로딩 상태 표시
    showLoadingState(problemsList);
    
    // 실제 구현 시에는 여기서 Make Webhook이나 API를 호출해야 합니다
    // 지금은 예시 문제를 생성합니다
    setTimeout(() => {
        try {
            const questions = createSampleProblems(formData);
            if (questions && questions.length > 0) {
                displayProblems(questions, formData);
            } else {
                showEmptyState(problemsList);
            }
        } catch (error) {
            showErrorState(problemsList, error.message);
        }
    }, 1500);
}

// 로딩 상태 표시
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

// 실제 문제 생성 (선택한 개념과 틀린 이유 기반) - questions 배열 반환
function createSampleProblems(formData) {
    const questions = [];
    const concepts = formData.concepts;
    const mistakes = formData.mistakes;
    const schoolLevel = formData.schoolLevel === 'elementary' ? '초등학교' : '중학교';
    const grade = formData.grade;
    const problemType = formData.problemType;
    
    // 각 선택된 개념에 대해 문제 생성
    for (let i = 0; i < formData.problemCount; i++) {
        const conceptIndex = i % concepts.length;
        const concept = concepts[conceptIndex];
        const mistake = mistakes[i % mistakes.length];
        
        const question = generateQuestion(concept, mistake, grade, schoolLevel, problemType, i + 1);
        questions.push(question);
    }
    
    return questions;
}

// 문제 객체 생성 함수
function generateQuestion(concept, mistake, grade, schoolLevel, problemType, number) {
    let questionData;
    
    // 초등학교 문제
    if (schoolLevel === '초등학교') {
        questionData = generateElementaryQuestion(concept, mistake, grade, problemType);
    } 
    // 중학교 문제
    else {
        questionData = generateMiddleSchoolQuestion(concept, mistake, grade, problemType);
    }
    
    return {
        id: Date.now() + number,
        number: number,
        stem: questionData.stem,
        choices: questionData.choices,
        answer: questionData.answer,
        explanation: questionData.explanation,
        concept: concept,
        problemType: problemType
    };
}

// 초등학교 문제 생성
function generateElementaryProblem(concept, mistake, grade, problemType) {
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
    if (concept === '덧셈') {
        const a = 15 + grade * 5;
        const b = 23 + grade * 3;
        stem = `${a} + ${b} = ?`;
        answer = (a + b).toString();
        explanation = `${a} + ${b} = ${answer}`;
    } else if (concept === '뺄셈') {
        const a = 45 + grade * 5;
        const b = 18 + grade * 3;
        stem = `${a} - ${b} = ?`;
        answer = (a - b).toString();
        explanation = `${a} - ${b} = ${answer}`;
    } else if (concept === '곱셈') {
        const a = 3 + grade;
        const b = 4 + grade;
        stem = `${a} × ${b} = ?`;
        answer = (a * b).toString();
        explanation = `${a} × ${b} = ${answer}`;
    } else if (concept === '나눗셈') {
        const divisor = grade + 2;
        const quotient = 6;
        const dividend = divisor * quotient;
        stem = `${dividend} ÷ ${divisor} = ?`;
        answer = quotient.toString();
        explanation = `${dividend} ÷ ${divisor} = ${quotient}`;
    } else if (concept === '분수') {
        const num1 = grade;
        const num2 = 1;
        const denom = grade + 1;
        stem = `\\frac{${num1}}{${denom}} + \\frac{${num2}}{${denom}} = ?`;
        answer = `\\frac{${num1 + num2}}{${denom}}`;
        explanation = `분모가 같으므로 분자만 더합니다: ${num1} + ${num2} = ${num1 + num2}`;
    } else if (concept === '소수') {
        const a = 1 + grade * 0.1;
        const b = 2 + grade * 0.2;
        stem = `${a} + ${b} = ?`;
        answer = (a + b).toFixed(1);
        explanation = `${a} + ${b} = ${answer}`;
    } else if (concept === '도형(넓이/둘레)') {
        const side = 5 + grade;
        stem = `한 변의 길이가 ${side}cm인 정사각형의 넓이는 몇 ㎠인가요?`;
        answer = (side * side).toString();
        explanation = `정사각형의 넓이 = 한 변의 길이 × 한 변의 길이 = ${side} × ${side} = ${answer}㎠`;
    } else if (concept === '비와 비율') {
        const a = 3 + grade;
        const b = 5 + grade;
        const x = 6 + grade * 2;
        const y = (b * x / a).toFixed(1);
        stem = `${a} : ${b} = ${x} : ?`;
        answer = y;
        explanation = `비례식을 풀면: ${a} : ${b} = ${x} : ${y}`;
    } else {
        // 기본 문제
        stem = `${concept}와 관련된 문제를 풀어보세요.`;
        answer = '답을 입력하세요';
        explanation = `${concept}에 대한 설명입니다.`;
    }
    
    // 문제 유형에 따라 힌트 추가
    if (problemType === '실수 보완형') {
        explanation = `※ "${mistake}" 부분에 특히 주의하세요.\n\n${explanation}`;
    } else if (problemType === '단계별 풀이형') {
        explanation = `단계별로 풀어보세요:\n1단계: 문제를 잘 읽습니다\n2단계: 식을 세웁니다\n3단계: 계산합니다\n\n${explanation}`;
    }
    
    return { stem, choices, answer, explanation };
}

// 중학교 문제 생성 (질문 객체 반환)
function generateMiddleSchoolQuestion(concept, mistake, grade, problemType) {
    // 중학교 문제 생성 로직
    let stem = '';
    let choices = null;
    let answer = '';
    let explanation = '';
    
    if (concept === '소인수분해') {
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
    } else if (concept === '일차방정식') {
        const coef = 2 + grade;
        const constant = 5 + grade;
        const result = 15 + grade * 3;
        const xValue = (result - constant) / coef;
        stem = `${coef}x + ${constant} = ${result}일 때, x의 값은?`;
        answer = xValue.toString();
        explanation = `${coef}x = ${result} - ${constant} = ${result - constant}\nx = ${xValue}`;
    } else if (concept === '일차함수') {
        const coef = 2 + grade;
        const constant = 3 + grade;
        const x = grade + 1;
        const y = coef * x + constant;
        stem = `일차함수 y = ${coef}x + ${constant}의 그래프가 점 (${x}, k)를 지날 때, k의 값은?`;
        answer = y.toString();
        explanation = `y = ${coef} × ${x} + ${constant} = ${y}`;
    } else if (concept === '연립일차방정식') {
        const a1 = 2 + grade;
        const b1 = 3 + grade;
        const c1 = 10 + grade * 2;
        stem = `연립방정식\n${a1}x + ${b1}y = ${c1}\n${grade + 1}x - ${grade + 2}y = ${grade + 3}\n의 해를 구하시오.`;
        answer = 'x와 y의 값을 구하세요';
        explanation = '연립방정식을 풀어 x와 y의 값을 구합니다.';
    } else if (concept === '이차방정식') {
        const a = 5 + grade;
        const b = 6 + grade;
        stem = `이차방정식 x² - ${a}x + ${b} = 0의 해를 구하시오.`;
        answer = 'x의 값을 구하세요';
        explanation = '인수분해 또는 근의 공식을 사용하여 해를 구합니다.';
    } else if (concept === '인수분해') {
        const a = 5 + grade * 2;
        const b = 6 + grade;
        stem = `x² + ${a}x + ${b}을 인수분해하시오.`;
        answer = '(x + a)(x + b) 형태로';
        explanation = '두 수의 합이 계수, 곱이 상수항이 되도록 인수분해합니다.';
    } else if (concept === '원주각') {
        const angle = 60 + grade * 10;
        stem = `원 O에서 중심각 ∠AOB = ${angle}°일 때, 원주각 ∠ACB의 크기는?`;
        answer = (angle / 2).toString() + '°';
        explanation = `원주각은 중심각의 절반입니다: ${angle}° ÷ 2 = ${angle / 2}°`;
    } else if (concept === '삼각비') {
        const a = 3 + grade;
        const b = 5 + grade * 2;
        stem = `직각삼각형에서 sin A = ${a}/${b}일 때, cos A의 값은?`;
        const c = Math.sqrt(b * b - a * a);
        answer = `${c}/${b}`;
        explanation = `피타고라스 정리: cos A = 인접변/빗변`;
    } else {
        // 기본 문제
        stem = `${concept}와 관련된 문제를 풀어보세요.`;
        answer = '답을 입력하세요';
        explanation = `${concept}에 대한 설명입니다.`;
    }
    
    // 문제 유형에 따라 힌트 추가
    if (problemType === '실수 보완형') {
        explanation = `※ "${mistake}" 부분에 특히 주의하세요.\n\n${explanation}`;
    } else if (problemType === '서술형 문제') {
        explanation = `서술형 문제입니다. 풀이 과정을 자세히 설명하세요.\n\n${explanation}`;
    }
    
    return { stem, choices, answer, explanation };
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
function displayProblems(questions, formData) {
    const problemsList = document.getElementById('problemsList');
    if (!problemsList) return;
    
    if (!questions || questions.length === 0) {
        showEmptyState(problemsList);
        return;
    }
    
    problemsList.innerHTML = questions.map((question, index) => `
        <div class="problem-item" data-question-id="${question.id}">
            <div class="problem-number">문제 ${question.number || index + 1}</div>
            <div class="problem-stem">${question.stem}</div>
            ${question.choices ? `
                <div class="problem-choices">
                    ${question.choices.map((choice, i) => `
                        <label class="choice-item">
                            <input type="radio" name="answer-${question.id}" value="${i}">
                            <span>${String.fromCharCode(65 + i)}. ${choice}</span>
                        </label>
                    `).join('')}
                </div>
            ` : `
                <div class="problem-answer-input">
                    <input type="text" placeholder="답을 입력하세요" class="answer-input">
                </div>
            `}
            <div class="problem-actions">
                <button class="btn-hint" onclick="toggleExplanation('${question.id}')">
                    <span class="hint-icon">💡</span>
                    <span class="hint-text">힌트/해설 보기</span>
                </button>
            </div>
            <div class="problem-explanation" id="explanation-${question.id}" style="display: none;">
                <div class="explanation-title">해설</div>
                <div class="explanation-content">${question.explanation || '해설이 없습니다.'}</div>
            </div>
        </div>
    `).join('');
    
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

// 해설 토글
function toggleExplanation(questionId) {
    const explanation = document.getElementById(`explanation-${questionId}`);
    if (explanation) {
        explanation.style.display = explanation.style.display === 'none' ? 'block' : 'none';
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

// PDF 다운로드
function downloadPDF() {
    const questions = JSON.parse(sessionStorage.getItem('generatedProblems') || '[]');
    const formData = JSON.parse(sessionStorage.getItem('currentFormData') || '{}');
    
    if (questions.length === 0) {
        alert('다운로드할 문제가 없습니다.');
        closeSaveMenu();
        return;
    }
    
    // 텍스트 파일로 다운로드 (실제 구현 시에는 jsPDF 라이브러리로 PDF 생성)
    const schoolLevelName = formData.schoolLevel === 'elementary' ? '초등학교' : '중학교';
    const semesterName = formData.semester === 1 ? '1학기' : '2학기';
    let content = '맞춤형 변형문제\n\n';
    content += `학교급: ${schoolLevelName}\n`;
    content += `학년: ${formData.grade}학년\n`;
    content += `학기: ${semesterName}\n`;
    content += `과목: 수학\n`;
    content += `개념: ${formData.concepts.join(', ')}\n`;
    content += `문제 유형: ${formData.problemType}\n`;
    content += `문제 개수: ${questions.length}개\n\n`;
    content += '='.repeat(50) + '\n\n';
    
    questions.forEach((question, index) => {
        content += `문제 ${index + 1}\n`;
        content += `${question.stem}\n`;
        if (question.answer) {
            content += `답: ${question.answer}\n`;
        }
        if (question.explanation) {
            content += `해설: ${question.explanation}\n`;
        }
        content += '\n' + '-'.repeat(50) + '\n\n';
    });
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `변형문제_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('문제가 다운로드되었습니다. (실제 구현 시 PDF 형식으로 제공됩니다)');
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
function regenerate() {
    const formData = JSON.parse(sessionStorage.getItem('problemFormData') || '{}');
    if (Object.keys(formData).length === 0) {
        alert('데이터를 찾을 수 없습니다. 처음부터 다시 시작해주세요.');
        window.location.href = 'create.html';
        return;
    }
    
    // 결과 페이지에서 재생성하는 경우
    if (document.getElementById('problemsList')) {
        generateProblems(formData);
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

${concepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

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
                <span class="sample-problem-tag" style="background: var(--primary-color); color: white;">${problem.concept}</span>
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

// ===============================
// STEP4: 단원별 2열 레이아웃(1-2 / 3-4 / 5-6)
// ===============================
function extractUnitNo(text) {
  const m = String(text || "").trim().match(/(\d+)\s*단원/);
  return m ? parseInt(m[1], 10) : null;
}

function looksLikeUnitTitle(el) {
  if (!el || el.nodeType !== 1) return false;
  const t = (el.textContent || "").trim();
  // "n단원" 포함 + 체크박스가 안 들어있는(제목 전용) 요소를 우선 타이틀로 취급
  if (!/(\d+)\s*단원/.test(t)) return false;
  if (el.querySelector && el.querySelector('input[type="checkbox"]')) return false;
  return true;
}

function isCheckboxItem(el) {
  if (!el || el.nodeType !== 1) return false;
  return !!(el.querySelector && el.querySelector('input[type="checkbox"]'));
}

/**
 * STEP4(#conceptGroup)를 단원(1~6) 블록으로 재구성.
 * - 왼쪽: 홀수 단원(1/3/5)
 * - 오른쪽: 짝수 단원(2/4/6)
 * - 항목들은 label/checkbox 그대로 이동 => 줄바꿈 유지
 */
function rebuildConceptGroupToUnitGrid() {
  const conceptGroup = document.getElementById("conceptGroup");
  if (!conceptGroup) return;

  const wrapper = conceptGroup.querySelector(":scope > div") || conceptGroup;

  // TreeWalker로 wrapper 내부를 "문서 순서"대로 훑기
  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_ELEMENT);
  const blocks = {}; // {1:{titleEl, items:[]}, ...}
  let currentUnit = null;

  while (walker.nextNode()) {
    const el = walker.currentNode;

    // 1) 단원 제목 발견
    if (looksLikeUnitTitle(el)) {
      const no = extractUnitNo(el.textContent);
      if (no != null) {
        currentUnit = no;
        if (!blocks[no]) blocks[no] = { titleEl: el, items: [] };
        else blocks[no].titleEl = el; // 혹시 중복이면 최신으로
      }
      continue;
    }

    // 2) 체크박스 항목 발견 (label/div 등)
    if (isCheckboxItem(el)) {
      // 체크박스가 들어있는 "가장 바깥" 항목을 잡기 위해,
      // label이 있으면 label까지 끌어올립니다.
      let item = el;
      const label = el.closest ? el.closest("label") : null;
      if (label && label.querySelector('input[type="checkbox"]')) item = label;

      if (currentUnit != null) {
        if (!blocks[currentUnit]) blocks[currentUnit] = { titleEl: null, items: [] };
        // 같은 항목 중복 추가 방지
        if (!blocks[currentUnit].items.includes(item)) {
          blocks[currentUnit].items.push(item);
        }
      }
    }
  }

  // 1~6 중 실제로 있는 단원만 grid로 구성
  const unitGrid = document.createElement("div");
  unitGrid.className = "unit-grid";

  for (let no = 1; no <= 6; no++) {
    if (!blocks[no]) continue;

    const section = document.createElement("section");
    section.className = "unit-block";

    // 제목은 "제목 요소"를 그대로 이동(텍스트 뽑지 말 것!)
    // (기존 스타일 유지하려고)
    if (blocks[no].titleEl) {
      const titleWrap = document.createElement("div");
      titleWrap.className = "unit-title";
      titleWrap.appendChild(blocks[no].titleEl);
      section.appendChild(titleWrap);
    }

    const itemsWrap = document.createElement("div");
    itemsWrap.className = "unit-items";

    // 체크박스 항목을 그대로 이동(줄바꿈/박스 UI 유지)
    blocks[no].items.forEach((it) => itemsWrap.appendChild(it));
    section.appendChild(itemsWrap);

    unitGrid.appendChild(section);
  }

  // 안전장치: 아무것도 못 만들었으면 원본 유지
  if (unitGrid.children.length === 0) return;

  // wrapper 안을 unitGrid로 교체
  wrapper.innerHTML = "";
  wrapper.appendChild(unitGrid);
}

// 전역으로 노출(순서 문제로 not defined 방지)
window.rebuildConceptGroupToUnitGrid = rebuildConceptGroupToUnitGrid;

