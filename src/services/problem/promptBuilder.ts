export type SubunitSpec = {
  unitId: string;
  unitTitle: string;
  subunitId: string;
  subunitTitle: string;
  mustKeywords: string[];
  banKeywords: string[];
  allowedConcepts: string[];
  banProblemTypes: string[];
};

/**
 * 단원 강제형 프롬프트 생성
 * LLM이 단원 범위를 벗어나지 않도록 강력하게 제약하는 프롬프트를 생성합니다.
 */
export function buildProblemPrompt(spec: SubunitSpec, count: number): string {
  return `
당신은 초등 수학 "변형문제" 출제자입니다.
학년/학기/단원/소단원 정보는 아래와 같고, 이 범위를 1mm도 벗어나면 실패입니다.

[단원 고정]
- 단원: ${spec.unitTitle} (${spec.unitId})
- 소단원: ${spec.subunitTitle} (${spec.subunitId})

[반드시 포함해야 하는 키워드/맥락]
- ${spec.mustKeywords.join(", ")}

[절대 포함하면 안 되는 키워드/개념]
- ${spec.banKeywords.join(", ")}

[허용 개념(이 안에서만 출제)]
- ${spec.allowedConcepts.join(" / ")}

[금지 유형]
- ${spec.banProblemTypes.join(" / ")}
- "연산 형태" 금지: 계산식만 던지고 답 구하는 문제 금지
- 문장제 중심으로 출제

[다양성 규칙]
- 같은 틀에 숫자만 바꾸는 문제는 1개만 허용
- 나머지는 상황/형식/묻는 방식이 서로 달라야 함
- OX/빈칸/이유설명/서술형/선택형(하지만 객관식처럼 보이지 않게) 등 섞되,
  최종 답은 주관식 서술로 받게 구성

[출력 형식(엄격)]
- 문제는 ${count}개
- 각 문제는 JSON 한 덩어리:
  {
    "id": "P1",
    "type": "서술형|이유설명|상황판단|규칙찾기|오류찾기|분류하기",
    "question": "...",
    "answer": "...",
    "explanation": "..."
  }

이제 ${count}개의 문제를 생성하세요.
`.trim();
}

