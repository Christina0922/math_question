/**
 * 문제 유형 다양화를 강제하는 중복 방지 장치
 */

export type Problem = {
  id?: string;
  type?: string;
  question: string;
  answer?: string;
  explanation?: string;
};

/**
 * 문제들이 너무 유사한지 확인
 * 같은 질문이 80% 이상이면 실패
 * 
 * @param problems 문제 배열
 * @returns 너무 유사하면 true
 */
export function hasTooSimilar(problems: Problem[]): boolean {
  if (problems.length === 0) return false;
  if (problems.length === 1) return false;

  const stems = problems.map((p) => normalize(p.question));
  const set = new Set(stems);

  // 같은 질문이 80% 이상이면 실패
  const similarityRatio = set.size / problems.length;
  return similarityRatio < 0.8;
}

/**
 * 문제 텍스트를 정규화하여 비교 가능하게 만듦
 * - 숫자를 #로 치환
 * - 공백 정규화
 * 
 * @param s 원본 텍스트
 * @returns 정규화된 텍스트
 */
function normalize(s: string): string {
  return s
    .replace(/\d+/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 문제 유형이 다양한지 확인
 * 같은 유형이 50% 이상이면 실패
 * 
 * @param problems 문제 배열
 * @returns 유형이 다양하지 않으면 true
 */
export function hasTooSimilarTypes(problems: Problem[]): boolean {
  if (problems.length === 0) return false;
  if (problems.length === 1) return false;

  const types = problems
    .map((p) => p.type || "unknown")
    .filter((t) => t !== "unknown");

  if (types.length === 0) return false;

  // 가장 많이 나온 유형의 비율 계산
  const typeCounts = new Map<string, number>();
  types.forEach((t) => {
    typeCounts.set(t, (typeCounts.get(t) || 0) + 1);
  });

  const maxCount = Math.max(...Array.from(typeCounts.values()));
  const maxRatio = maxCount / problems.length;

  // 같은 유형이 50% 이상이면 실패
  return maxRatio > 0.5;
}

