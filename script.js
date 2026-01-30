// ? 1) OCR   ϳ ҽ 
let OCR_CURRICULUM = null;
let ocrLoadPromise = null;

// OCR  ε (curriculum_1_3.json)
async function loadOCRCcurriculum() {
    if (OCR_CURRICULUM) return OCR_CURRICULUM;
    if (ocrLoadPromise) return ocrLoadPromise;
    
    ocrLoadPromise = (async () => {
        try {
            const response = await fetch('src/data/curriculum_1_3.json');
            if (!response.ok) {
                console.error('? [OCR] curriculum_1_3.json ε ');
                return null;
            }
            const data = await response.json();
            OCR_CURRICULUM = data;
            console.log('? [OCR] curriculum_1_3.json ε ');
            return data;
        } catch (error) {
            console.error('? [OCR] curriculum_1_3.json ε :', error);
            return null;
        }
    })();
    
    return ocrLoadPromise;
}

// OCR itemKey  (ȭ)
function createItemKey(itemTitle) {
    if (!itemTitle) return '';
    return itemTitle
        .replace(/^\d+\)\s*/, '') //  ȣ  (: "5) " )
        .replace(/\s+/g, '')
        .replace(/[()]/g, '')
        .toLowerCase();
}

// OCR에서 학년/학기별 모든 item 목록 추출
function getOCRItems(grade, semester) {
    if (!OCR_CURRICULUM) return [];
    
    const gradeKey = `${grade}학년`;
    const semesterKey = `${semester}학기`;
    
    if (!OCR_CURRICULUM[gradeKey] || !OCR_CURRICULUM[gradeKey][semesterKey]) {
        return [];
    }
    
    const units = OCR_CURRICULUM[gradeKey][semesterKey];
    const items = [];
    
    units.forEach((unit, unitIndex) => {
        const unitTitle = unit.unit || '';
        (unit.topics || []).forEach((topic, topicIndex) => {
            const itemTitle = topic;
            const itemKey = createItemKey(itemTitle);
            
            items.push({
                itemKey,
                itemTitle,
                unitTitle,
                unitIndex: unitIndex + 1,
                topicIndex: topicIndex + 1,
                grade,
                semester
            });
        });
    });
    
    return items;
}

// ===============================
// STEP 4:    
// ===============================
let isConceptLoading = true; // ʱⰪ: ε 
let conceptError = null;
let concepts = [];
let selectedConcepts = new Set(); // õ  ID Set
let currentUnitKey = null; //  ܿ Ű (grade-semester-unit)

// STEP 4  UI Ʈ
function updateConceptUI() {
    const loadingEl = document.getElementById('conceptLoadingState');
    const errorEl = document.getElementById('conceptErrorState');
    const emptyEl = document.getElementById('conceptEmptyState');
    const contentEl = document.getElementById('conceptContent');
    
    if (!loadingEl || !errorEl || !emptyEl || !contentEl) {
        console.warn('[STEP4] UI Ҹ ã  ϴ.');
        return;
    }
    
    //   
    loadingEl.style.display = 'none';
    errorEl.style.display = 'none';
    emptyEl.style.display = 'none';
    contentEl.style.display = 'none';
    
    // ¿  ǥ
    if (isConceptLoading) {
        loadingEl.style.display = 'block';
        console.log('[STEP4] ε  ǥ');
    } else if (conceptError) {
        errorEl.style.display = 'block';
        console.log('[STEP4]   ǥ:', conceptError.message);
    } else if (concepts.length === 0) {
        emptyEl.style.display = 'block';
        console.log('[STEP4]   ǥ');
    } else {
        contentEl.style.display = 'block';
        console.log('[STEP4]  ǥ:', concepts.length, '');
    }
}

//   
function renderConcepts() {
    const contentEl = document.getElementById('conceptContent');
    if (!contentEl) return;
    
    if (concepts.length === 0) {
        contentEl.innerHTML = '';
        return;
    }
    
    // 단원별로 그룹화
    const unitsMap = new Map();
    concepts.forEach(concept => {
        const unitTitle = concept.unitTitle || '기타';
        if (!unitsMap.has(unitTitle)) {
            unitsMap.set(unitTitle, []);
        }
        unitsMap.get(unitTitle).push(concept);
    });
    
    // 단원들을 배열로 변환
    const unitsArray = Array.from(unitsMap.entries());
    
    // 두 개의 컬럼으로 나누기
    const midPoint = Math.ceil(unitsArray.length / 2);
    const leftUnits = unitsArray.slice(0, midPoint);
    const rightUnits = unitsArray.slice(midPoint);
    
    // 단원 섹션 HTML 생성 함수
    const renderUnitSection = (items, unitTitle) => {
        let sectionHtml = `<div class="unit-section" style="margin-bottom: 24px;">`;
        sectionHtml += `<div class="unit-title" style="font-weight: 700; margin-bottom: 12px; font-size: 16px; color: #4F46E5; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">${escapeHtml(unitTitle)}</div>`;
        sectionHtml += `<div class="radio-group">`;
        
        items.forEach(item => {
            const itemId = `concept-${item.itemKey || item.itemTitle}`;
            const isChecked = selectedConcepts.has(item.itemKey || item.itemTitle);
            sectionHtml += `
                <label for="${itemId}" class="checkbox-label">
                    <input type="checkbox" id="${itemId}" name="concept" value="${escapeHtml(item.itemKey || item.itemTitle)}" ${isChecked ? 'checked' : ''} data-item-key="${escapeHtml(item.itemKey || item.itemTitle)}">
                    <span>${escapeHtml(item.itemTitle)}</span>
                </label>
            `;
        });
        
        sectionHtml += `</div></div>`;
        return sectionHtml;
    };
    
    // 두 개의 컬럼으로 HTML 생성
    let leftHtml = '';
    leftUnits.forEach(([unitTitle, items]) => {
        leftHtml += renderUnitSection(items, unitTitle);
    });
    
    let rightHtml = '';
    rightUnits.forEach(([unitTitle, items]) => {
        rightHtml += renderUnitSection(items, unitTitle);
    });
    
    // 최종 HTML: 두 개의 컬럼으로 배치
    const html = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; width: 100%;">
            <div class="concept-column-left" style="min-width: 0;">${leftHtml || '<div style="padding: 20px; text-align: center; color: #999;">없음</div>'}</div>
            <div class="concept-column-right" style="min-width: 0;">${rightHtml || '<div style="padding: 20px; text-align: center; color: #999;">없음</div>'}</div>
        </div>
    `;
    
    contentEl.innerHTML = html;
    
    // üũڽ ̺Ʈ  ߰
    contentEl.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const itemKey = this.getAttribute('data-item-key');
            if (this.checked) {
                selectedConcepts.add(itemKey);
            } else {
                selectedConcepts.delete(itemKey);
            }
            updateSelectedConceptsCount();
        });
    });
    
    // ̾ƿ 籸 (curriculum_4to6.js Լ )
    if (typeof window.rebuildConceptGroupToUnitGrid === 'function') {
        setTimeout(() => {
            window.rebuildConceptGroupToUnitGrid();
        }, 100);
    }
}

// õ   Ʈ
function updateSelectedConceptsCount() {
    const countEl = document.getElementById('selectedConceptsCount');
    if (countEl) {
        countEl.textContent = selectedConcepts.size;
    }
}

// HTML ̽
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

//   Ʈ ( Լ)
async function updateConceptList() {
    const gradeEl = document.querySelector('input[name="grade"]:checked');
    const semesterEl = document.querySelector('input[name="semester"]:checked');
    const schoolLevelEl = document.querySelector('input[name="schoolLevel"]:checked');
    
    const grade = gradeEl ? parseInt(gradeEl.value) : null;
    const semester = semesterEl ? parseInt(semesterEl.value) : null;
    const schoolLevel = schoolLevelEl ? schoolLevelEl.value : 'elementary';
    
    //  α
    console.log('[STEP4]', {
        isConceptLoading,
        conceptError: conceptError ? conceptError.message : null,
        conceptsLen: concepts?.length || 0,
        grade,
        semester,
        schoolLevel,
        unitKey: currentUnitKey
    });
    
    //  üũ
    if (!grade || !semester) {
        isConceptLoading = false;
        conceptError = new Error('г б⸦ ּ.');
        concepts = [];
        updateConceptUI();
        return;
    }
    
    const newUnitKey = `${grade}-${semester}-${schoolLevel}`;
    
    // ܿ Ǿ  selectedConcepts ʱȭ (ε  )
    const unitChanged = currentUnitKey !== newUnitKey;
    currentUnitKey = newUnitKey;
    
    // ε 
    isConceptLoading = true;
    conceptError = null;
    updateConceptUI();
    
    try {
        let items = [];
        
        if (schoolLevel === 'elementary') {
            // ʵб: 1-3г OCR, 4-6г CURRICULUM_4_TO_6
            if (grade >= 1 && grade <= 3) {
                // OCR  
                const ocrData = await loadOCRCcurriculum();
                if (!ocrData) {
                    throw new Error('OCR  ͸ ҷ  ϴ.');
                }
                items = getOCRItems(grade, semester);
            } else if (grade >= 4 && grade <= 6) {
                // CURRICULUM_4_TO_6 사용
                const gradeKey = `${grade}학년`;
                const semesterKey = `${semester}학기`;
                
                if (window.CURRICULUM_4_TO_6 && 
                    window.CURRICULUM_4_TO_6[gradeKey] && 
                    window.CURRICULUM_4_TO_6[gradeKey][semesterKey]) {
                    
                    const units = window.CURRICULUM_4_TO_6[gradeKey][semesterKey];
                    units.forEach((unit, unitIndex) => {
                        const unitTitle = unit.unit || '';
                        const topics = unit.topics || [];
                        
                        topics.forEach((topic, topicIndex) => {
                            const itemTitle = typeof topic === 'string' ? topic : topic.title;
                            const itemKey = createItemKey(itemTitle);
                            
                            items.push({
                                itemKey,
                                itemTitle,
                                unitTitle,
                                unitIndex: unitIndex + 1,
                                topicIndex: topicIndex + 1,
                                grade,
                                semester
                            });
                        });
                    });
                }
            }
        } else if (schoolLevel === 'middle') {
            // 중학교: MIDDLE_SCHOOL_TOC 사용
            if (window.MIDDLE_SCHOOL_TOC) {
                const gradeKey = `${grade}학년`;
                const semesterKey = `${semester}학기`;
                
                if (window.MIDDLE_SCHOOL_TOC[gradeKey] && 
                    window.MIDDLE_SCHOOL_TOC[gradeKey][semesterKey]) {
                    
                    const units = window.MIDDLE_SCHOOL_TOC[gradeKey][semesterKey];
                    units.forEach((unit, unitIndex) => {
                        const unitTitle = unit.title || '';
                        const subunits = unit.subunits || [];
                        
                        subunits.forEach((subunit, subunitIndex) => {
                            const topics = subunit.topics || [];
                            
                            topics.forEach((topic, topicIndex) => {
                                const itemTitle = typeof topic === 'string' ? topic : topic.title;
                                const itemKey = createItemKey(itemTitle);
                                
                                items.push({
                                    itemKey,
                                    itemTitle,
                                    unitTitle: `${unitTitle} - ${subunit.title || ''}`,
                                    unitIndex: unitIndex + 1,
                                    topicIndex: topicIndex + 1,
                                    grade,
                                    semester
                                });
                            });
                        });
                    });
                }
            }
        }
        
        // ε Ϸ
        isConceptLoading = false;
        concepts = items;
        
        // ܿ Ǿ ε   selectedConcepts ʱȭ
        if (unitChanged && !conceptError && concepts.length > 0) {
            selectedConcepts.clear();
            updateSelectedConceptsCount();
        }
        
        updateConceptUI();
        renderConcepts();
        
        console.log('[STEP4] ε Ϸ:', {
            conceptsCount: concepts.length,
            selectedCount: selectedConcepts.size
        });
        
    } catch (error) {
        console.error('[STEP4] ε :', error);
        isConceptLoading = false;
        conceptError = error;
        concepts = [];
        updateConceptUI();
    }
}

// õ ư ̺Ʈ  ʱȭ
function initConceptSelector() {
    console.log('[STEP4] ʱȭ ');
    
    // ʱ   (ε  )
    isConceptLoading = true;
    updateConceptUI();
    
    const reloadBtn = document.getElementById('reloadConceptsBtn');
    const reloadEmptyBtn = document.getElementById('reloadConceptsEmptyBtn');
    
    if (reloadBtn) {
        reloadBtn.addEventListener('click', async function() {
            console.log('[STEP4] õ ư Ŭ');
            await updateConceptList();
        });
    }
    
    if (reloadEmptyBtn) {
        reloadEmptyBtn.addEventListener('click', async function() {
            console.log('[STEP4]   õ ư Ŭ');
            await updateConceptList();
        });
    }
    
    // г/б     Ʈ
    const gradeInputs = document.querySelectorAll('input[name="grade"]');
    const semesterInputs = document.querySelectorAll('input[name="semester"]');
    const schoolLevelInputs = document.querySelectorAll('input[name="schoolLevel"]');
    
    [...gradeInputs, ...semesterInputs, ...schoolLevelInputs].forEach(input => {
        input.addEventListener('change', async function() {
            console.log('[STEP4]  :', this.name, this.value);
            await updateConceptList();
        });
    });
    
    // ʱ ε
    console.log('[STEP4] ʱ   ε ');
    updateConceptList();
}

// DOMContentLoaded ̺Ʈ 
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConceptSelector);
} else {
    // ̹ ε   
    initConceptSelector();
}
