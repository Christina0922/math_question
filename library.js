// 문제은행 보기 페이지 로직
// - 템플릿(JSON): reference_problems/templates_manifest.json 기반 목록/필터/미리보기
// - 원본(PDF): import_from_Math_Questions/_question_bank_only/data/materials_manifest.json 기반 링크 제공

const TEMPLATE_MANIFEST_URL = 'reference_problems/templates_manifest.json';
const MATERIALS_MANIFEST_URL = 'import_from_Math_Questions/_question_bank_only/data/materials_manifest.json';

const PACK_MAP = {
  '01. principle': { folder: 'ES_PACK01_Principle', prefix: 'Principle', label: '원리' },
  '02. basics': { folder: 'ES_PACK02_Basics', prefix: 'Basics', label: '기초' },
  '03. application': { folder: 'ES_PACK03_Application', prefix: 'Application', label: '적용' },
  '04. types of questions': { folder: 'ES_PACK04_TypesOfQuestions', prefix: 'TypesOfQuestions', label: '문제 유형' },
  '05. basis practical application': { folder: 'ES_PACK05_PracticalApplication', prefix: 'PracticalApplication', label: '기초 실전 적용' },
  '06. basic type': { folder: 'ES_PACK06_BasicType', prefix: 'BasicType', label: '기본 유형' }
};

function qs(sel) {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Element not found: ${sel}`);
  return el;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function typeLabel(type) {
  if (type === 'application') return '응용 심화형';
  if (type === 'basic') return '기본형';
  return type;
}

function sortTemplates(a, b) {
  if (a.grade !== b.grade) return a.grade - b.grade;
  if (a.semester !== b.semester) return a.semester - b.semester;
  // basic 먼저
  const oa = a.type === 'basic' ? 0 : 1;
  const ob = b.type === 'basic' ? 0 : 1;
  if (oa !== ob) return oa - ob;
  return a.file.localeCompare(b.file);
}

function renderError(container, title, detail) {
  container.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <div class="error-message">${escapeHtml(title)}</div>
      <div class="error-description">${escapeHtml(detail || '')}</div>
    </div>
  `;
}

function renderLoading(container, text) {
  container.innerHTML = `
    <div class="loading-state">
      <div class="loading-message">${escapeHtml(text || '불러오는 중...')}</div>
    </div>
  `;
}

async function loadJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} (${res.status})`);
  return await res.json();
}

function getFilters() {
  const grade = qs('#filterGrade').value ? Number(qs('#filterGrade').value) : null;
  const semester = qs('#filterSemester').value ? Number(qs('#filterSemester').value) : null;
  const type = qs('#filterType').value || null;
  return { grade, semester, type };
}

function applyFilters(templates, { grade, semester, type }) {
  return templates.filter((t) => {
    if (grade && t.grade !== grade) return false;
    if (semester && t.semester !== semester) return false;
    if (type && t.type !== type) return false;
    return true;
  });
}

function renderTemplatesList(templates) {
  const listEl = qs('#templatesList');
  if (!templates.length) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <div class="empty-message">조건에 맞는 템플릿이 없습니다.</div>
        <div class="empty-description">필터를 “전체”로 바꿔 다시 확인해보세요.</div>
      </div>
    `;
    return;
  }

  listEl.innerHTML = templates
    .map((t) => {
      const badge = t.type === 'application' ? 'badge' : 'badge';
      const title = `${t.grade}-${t.semester} ${typeLabel(t.type)}`;
      return `
        <div class="sample-problem-card" style="min-height:auto; padding:18px;">
          <div class="sample-problem-tags">
            <span class="sample-problem-tag">${escapeHtml(`${t.grade}학년 ${t.semester}학기`)}</span>
            <span class="sample-problem-tag">${escapeHtml(typeLabel(t.type))}</span>
          </div>
          <div class="sample-problem-stem" style="margin-bottom:12px;">
            <strong>${escapeHtml(title)}</strong><br/>
            <small style="color:var(--text-light);">${escapeHtml(t.file)}</small>
          </div>
          <div class="sample-problem-actions" style="border-top:none; padding-top:0;">
            <button class="sample-problem-toggle" data-action="preview" data-file="${escapeHtml(t.file)}">미리보기</button>
            <a class="sample-problem-toggle" href="reference_problems/${encodeURIComponent(t.file)}" target="_blank" rel="noopener">JSON 열기</a>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderTemplatePreview(data, fileName) {
  const previewEl = qs('#templatePreview');
  const title = data.title || fileName;
  const total = data.total_problems ?? data.totalProblems ?? '';
  const level = data.difficulty_level || '';
  const categories = Array.isArray(data.categories) ? data.categories : [];

  previewEl.innerHTML = `
    <div class="concept-group" style="background:#fff;">
      <div class="concept-group-header">
        <h3 class="concept-group-title" style="margin:0;">${escapeHtml(title)}</h3>
        <div style="margin-top:8px; color:var(--text-light);">
          <small><strong>파일</strong>: ${escapeHtml(fileName)}</small><br/>
          <small><strong>총 문항</strong>: ${escapeHtml(total)}</small>${level ? ` · <small><strong>레벨</strong>: ${escapeHtml(level)}</small>` : ''}
        </div>
      </div>
      <div>
        ${categories
          .map((c) => {
            const cName = c.name || `카테고리 ${c.id || ''}`;
            const problems = Array.isArray(c.problems) ? c.problems : [];
            return `
              <details style="margin:10px 0; background:var(--bg-light); border:1px solid var(--border-color); border-radius:12px; padding:12px;">
                <summary style="cursor:pointer; font-weight:700; color:var(--primary-color);">
                  ${escapeHtml(cName)} <span style="color:var(--text-light); font-weight:500;">(${problems.length}문항)</span>
                </summary>
                <div style="margin-top:10px;">
                  ${problems
                    .slice(0, 50)
                    .map((p) => `<div style="padding:8px 0; border-bottom:1px dashed #e5e7eb;"><strong>${escapeHtml(p.id)}</strong>. ${escapeHtml(p.question || '')}</div>`)
                    .join('')}
                  ${problems.length > 50 ? `<div style="margin-top:10px; color:var(--text-light);"><small>미리보기는 50문항까지만 표시됩니다. (전체는 JSON 열기로 확인)</small></div>` : ''}
                </div>
              </details>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
  previewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function initTemplatesTab() {
  const listEl = qs('#templatesList');
  const previewEl = qs('#templatePreview');
  renderLoading(listEl, '템플릿 목록을 불러오는 중...');
  previewEl.innerHTML = '';

  let manifest;
  try {
    manifest = await loadJson(TEMPLATE_MANIFEST_URL);
  } catch (e) {
    renderError(listEl, '템플릿 목록을 불러오지 못했습니다.', `manifest 파일을 확인하세요: ${TEMPLATE_MANIFEST_URL}`);
    return;
  }

  const all = Array.isArray(manifest.templates) ? manifest.templates.slice() : [];
  all.sort(sortTemplates);

  const rerender = () => {
    const filtered = applyFilters(all, getFilters());
    renderTemplatesList(filtered);
  };

  qs('#filterGrade').addEventListener('change', rerender);
  qs('#filterSemester').addEventListener('change', rerender);
  qs('#filterType').addEventListener('change', rerender);

  listEl.addEventListener('click', async (ev) => {
    const btn = ev.target?.closest?.('[data-action="preview"]');
    if (!btn) return;
    const file = btn.getAttribute('data-file');
    if (!file) return;
    previewEl.innerHTML = '';
    renderLoading(previewEl, `${file} 불러오는 중...`);
    try {
      const data = await loadJson(`reference_problems/${encodeURIComponent(file)}`);
      renderTemplatePreview(data, file);
    } catch (e) {
      renderError(previewEl, '템플릿을 불러오지 못했습니다.', String(e?.message || e));
    }
  });

  rerender();
}

function renderSourcesList(manifest) {
  const container = qs('#sourcesList');
  const elementary = manifest?.elementary;
  if (!elementary || typeof elementary !== 'object') {
    renderError(container, '원본 목록을 읽을 수 없습니다.', 'materials_manifest.json 구조를 확인해주세요.');
    return;
  }

  const packs = Object.keys(elementary);
  container.innerHTML = packs
    .map((packKey) => {
      const pack = elementary[packKey];
      const map = PACK_MAP[packKey];
      if (!map) return '';

      const semesters = Object.keys(pack).sort((a, b) => {
        const [ga, sa] = a.split('-').map(Number);
        const [gb, sb] = b.split('-').map(Number);
        if (ga !== gb) return ga - gb;
        return sa - sb;
      });

      const items = semesters
        .map((gs) => {
          const info = pack[gs];
          const localPdf = `import_from_Math_Questions/_question_bank_only/Elementary_school/${map.folder}/${map.prefix}_${gs}.pdf`;
          const localOcrPdf = `import_from_Math_Questions/_question_bank_only/Elementary_school/${map.folder}/${map.prefix}_${gs}_OCR.pdf`;
          const drive = info?.previewUrl;

          return `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px dashed #e5e7eb;">
              <div>
                <strong>${escapeHtml(gs)}</strong>
                <span style="color:var(--text-light); margin-left:8px;"><small>${escapeHtml(info?.name || '')}</small></span>
              </div>
              <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
                <a class="sample-problem-toggle" href="${escapeHtml(localPdf)}" target="_blank" rel="noopener">로컬 PDF</a>
                <a class="sample-problem-toggle" href="${escapeHtml(localOcrPdf)}" target="_blank" rel="noopener">로컬 OCR</a>
                ${drive ? `<a class="sample-problem-toggle" href="${escapeHtml(drive)}" target="_blank" rel="noopener">Drive 미리보기</a>` : ''}
              </div>
            </div>
          `;
        })
        .join('');

      return `
        <div class="concept-group" style="background:#fff;">
          <div class="concept-group-header">
            <h3 class="concept-group-title" style="margin:0;">${escapeHtml(map.label)} <span style="color:var(--text-light); font-weight:500;"><small>(${escapeHtml(packKey)})</small></span></h3>
          </div>
          <div>${items || '<div style="color:var(--text-light);">표시할 항목이 없습니다.</div>'}</div>
        </div>
      `;
    })
    .filter(Boolean)
    .join('');
}

async function initSourcesTab() {
  const container = qs('#sourcesList');
  renderLoading(container, '원본 문제은행 목록을 불러오는 중...');

  try {
    const manifest = await loadJson(MATERIALS_MANIFEST_URL);
    renderSourcesList(manifest);
  } catch (e) {
    renderError(container, '원본 목록을 불러오지 못했습니다.', `파일을 확인하세요: ${MATERIALS_MANIFEST_URL}`);
  }
}

function initTabs() {
  const templatesTab = qs('#templatesTab');
  const sourcesTab = qs('#sourcesTab');

  const onChange = () => {
    const v = document.querySelector('input[name="tab"]:checked')?.value;
    const isTemplates = v === 'templates';
    templatesTab.style.display = isTemplates ? '' : 'none';
    sourcesTab.style.display = isTemplates ? 'none' : '';
  };

  document.querySelectorAll('input[name="tab"]').forEach((el) => el.addEventListener('change', onChange));
  onChange();
}

window.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  await initTemplatesTab();
  await initSourcesTab();
});


