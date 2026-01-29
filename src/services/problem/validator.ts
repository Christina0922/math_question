export type ValidationResult = { ok: true } | { ok: false; reason: string };

/**
 * 문제 텍스트가 단원 적합성을 만족하는지 검증
 * 
 * @param text 검증할 텍스트 (문제, 답, 설명을 합친 전체 텍스트)
 * @param banKeywords 금지 키워드 목록
 * @param mustKeywords 필수 키워드 목록
 * @returns 검증 결과
 */
export function validateProblemText(
  text: string,
  banKeywords: string[],
  mustKeywords: string[]
): ValidationResult {
  const lower = text.toLowerCase();

  // 1) 금지 키워드 탐지
  for (const k of banKeywords) {
    if (!k) continue;
    const keywordLower = k.toLowerCase();
    if (lower.includes(keywordLower)) {
      return { ok: false, reason: `금지 키워드 포함: ${k}` };
    }
  }

  // 2) must 키워드 최소 1개 이상 포함(너무 빡세면 1개로 시작)
  const mustHit = mustKeywords.some((k) => {
    if (!k) return false;
    return lower.includes(k.toLowerCase());
  });
  if (!mustHit && mustKeywords.length > 0) {
    return {
      ok: false,
      reason: `필수 키워드/맥락 부족 (mustKeywords 미포함)`,
    };
  }

  // 3) 연산형 탐지(간단 휴리스틱)
  // - "1/4 + 2/4", "0.3×0.2" 같은 패턴, "=" 중심, 기호 연산 위주면 탈락
  const hasOpPattern =
    /(\d+)\s*[\+\-\×\*\/]\s*(\d+)/.test(text) ||
    /(\d+\/\d+)\s*[\+\-\×\*\/]\s*(\d+\/\d+)/.test(text) ||
    /=\s*\?/.test(text);

  // 연산형 패턴이 있고, 문맥이 부족하면 탈락
  // 단, 문장제 맥락이 있으면 허용 (예: "사과 3개와 배 2개를 더하면 몇 개인가요?")
  if (hasOpPattern) {
    // 문장제 맥락 체크: 질문형 종결어미나 상황 설명이 있는지 확인
    const hasContext =
      /[가요?다요?지요?]/g.test(text) ||
      /[은는이가을를]/g.test(text) ||
      text.length > 50; // 충분한 문맥이 있으면 허용

    if (!hasContext) {
      return { ok: false, reason: "연산 형태(계산식 중심) 패턴 감지" };
    }
  }

  return { ok: true };
}

