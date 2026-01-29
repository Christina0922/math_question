import { validateProblemText } from "../validator";

describe("validateProblemText", () => {
  describe("금지 키워드 검증", () => {
    it("분수, 소수, 직육면체가 들어가면 약수/배수 단원에서 무조건 탈락", () => {
      const banKeywords = ["분수", "소수", "직육면체"];
      const mustKeywords = ["약수", "배수", "나누어떨어짐"];

      const problem1 = "24의 약수는 1, 2, 3, 4, 6, 8, 12, 24입니다. 분수를 계산해보세요.";
      const result1 = validateProblemText(problem1, banKeywords, mustKeywords);
      expect(result1.ok).toBe(false);
      expect(result1.reason).toContain("금지 키워드 포함: 분수");

      const problem2 = "12의 배수는 12, 24, 36입니다. 소수를 구해보세요.";
      const result2 = validateProblemText(problem2, banKeywords, mustKeywords);
      expect(result2.ok).toBe(false);
      expect(result2.reason).toContain("금지 키워드 포함: 소수");

      const problem3 = "직육면체의 부피를 구하는 문제입니다.";
      const result3 = validateProblemText(problem3, banKeywords, mustKeywords);
      expect(result3.ok).toBe(false);
      expect(result3.reason).toContain("금지 키워드 포함: 직육면체");
    });
  });

  describe("필수 키워드 검증", () => {
    it("mustKeywords(약수/배수/나누어떨어짐)가 하나도 없으면 탈락", () => {
      const banKeywords = ["분수", "소수", "직육면체"];
      const mustKeywords = ["약수", "배수", "나누어떨어짐"];

      const problem1 = "24를 계산해보세요.";
      const result1 = validateProblemText(problem1, banKeywords, mustKeywords);
      expect(result1.ok).toBe(false);
      expect(result1.reason).toContain("필수 키워드/맥락 부족");

      const problem2 = "12와 18의 관계를 설명하세요.";
      const result2 = validateProblemText(problem2, banKeywords, mustKeywords);
      expect(result2.ok).toBe(false);
      expect(result2.reason).toContain("필수 키워드/맥락 부족");
    });

    it("mustKeywords가 하나라도 포함되면 통과", () => {
      const banKeywords = ["분수", "소수", "직육면체"];
      const mustKeywords = ["약수", "배수", "나누어떨어짐"];

      const problem1 = "24의 약수는 무엇인가요?";
      const result1 = validateProblemText(problem1, banKeywords, mustKeywords);
      expect(result1.ok).toBe(true);

      const problem2 = "12의 배수를 모두 구해보세요.";
      const result2 = validateProblemText(problem2, banKeywords, mustKeywords);
      expect(result2.ok).toBe(true);

      const problem3 = "18은 6으로 나누어떨어집니다.";
      const result3 = validateProblemText(problem3, banKeywords, mustKeywords);
      expect(result3.ok).toBe(true);
    });
  });

  describe("연산형 탐지", () => {
    it("1/4 + 2/4 같은 계산식이 있으면 연산형으로 탈락 (문맥 없을 때)", () => {
      const banKeywords = ["직육면체"];
      const mustKeywords = ["분수", "덧셈"];

      const problem1 = "1/4 + 2/4 = ?";
      const result1 = validateProblemText(problem1, banKeywords, mustKeywords);
      expect(result1.ok).toBe(false);
      expect(result1.reason).toContain("연산 형태");

      const problem2 = "0.3 × 0.2 = ?";
      const result2 = validateProblemText(problem2, banKeywords, mustKeywords);
      expect(result2.ok).toBe(false);
      expect(result2.reason).toContain("연산 형태");
    });

    it("문장제 맥락이 있으면 연산형 허용", () => {
      const banKeywords = ["직육면체"];
      const mustKeywords = ["분수", "덧셈"];

      const problem1 = "사과를 1/4개와 배를 2/4개를 더하면 몇 개인가요?";
      const result1 = validateProblemText(problem1, banKeywords, mustKeywords);
      expect(result1.ok).toBe(true);

      const problem2 = "길이가 0.3m인 끈과 0.2m인 끈을 곱하면 얼마인가요?";
      const result2 = validateProblemText(problem2, banKeywords, mustKeywords);
      expect(result2.ok).toBe(true);
    });
  });

  describe("복합 검증", () => {
    it("금지 키워드와 연산형이 동시에 있으면 금지 키워드로 먼저 탈락", () => {
      const banKeywords = ["분수", "소수", "직육면체"];
      const mustKeywords = ["약수", "배수"];

      const problem = "직육면체의 부피를 구하기 위해 1/4 + 2/4를 계산하세요.";
      const result = validateProblemText(problem, banKeywords, mustKeywords);
      expect(result.ok).toBe(false);
      expect(result.reason).toContain("금지 키워드 포함: 직육면체");
    });

    it("모든 검증을 통과하면 성공", () => {
      const banKeywords = ["분수", "소수", "직육면체"];
      const mustKeywords = ["약수", "배수", "나누어떨어짐"];

      const problem = "24의 약수 중에서 6으로 나누어떨어지는 수는 무엇인가요?";
      const result = validateProblemText(problem, banKeywords, mustKeywords);
      expect(result.ok).toBe(true);
    });
  });
});

