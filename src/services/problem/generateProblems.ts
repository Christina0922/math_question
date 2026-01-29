import { buildProblemPrompt, SubunitSpec } from "./promptBuilder";
import { validateProblemText, ValidationResult } from "./validator";
import { hasTooSimilar, hasTooSimilarTypes, Problem } from "./diversity";

export type ProblemGenerationResult = {
  id: string;
  type: string;
  question: string;
  answer: string;
  explanation: string;
};

export type GenerationLog = {
  attempt: number;
  subunitId: string;
  failedReason?: string;
  rawLLMOutput?: string;
  timestamp: number;
};

/**
 * LLM 호출 함수 타입 (실제 구현은 외부에서 주입)
 */
export type LLMCallFunction = (prompt: string) => Promise<string>;

/**
 * 단원 적합성 검증을 통과하는 문제 생성
 * 검증 실패 시 최대 N회까지 재생성
 * 
 * @param spec 소단원 스펙
 * @param count 생성할 문제 개수
 * @param callLLM LLM 호출 함수
 * @param onLog 로그 콜백 (선택)
 * @returns 검증 통과한 문제 배열
 */
export async function generateProblemsForSubunit(
  spec: SubunitSpec,
  count: number,
  callLLM: LLMCallFunction,
  onLog?: (log: GenerationLog) => void
): Promise<ProblemGenerationResult[]> {
  const MAX_TRIES = 5;
  const logs: GenerationLog[] = [];

  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    try {
      const prompt = buildProblemPrompt(spec, count);
      const raw = await callLLM(prompt);
      const problems = safeParseJsonArray(raw);

      if (!Array.isArray(problems) || problems.length === 0) {
        const log: GenerationLog = {
          attempt,
          subunitId: spec.subunitId,
          failedReason: "LLM output is not array or empty",
          rawLLMOutput: raw.substring(0, 200), // 처음 200자만
          timestamp: Date.now(),
        };
        logs.push(log);
        if (onLog) onLog(log);
        continue;
      }

      // 각 문제 검증
      const validated: ProblemGenerationResult[] = [];
      let failedReason = "";

      for (const p of problems) {
        // 문제 형식 검증
        if (!p.question || !p.answer) {
          failedReason = "문제 형식 오류: question 또는 answer가 없음";
          break;
        }

        // 단원 적합성 검증
        const mergedText = `${p.question}\n${p.answer}\n${p.explanation || ""}`;
        const validation = validateProblemText(
          mergedText,
          spec.banKeywords,
          spec.mustKeywords
        );

        if (!validation.ok) {
          failedReason = validation.reason;
          break;
        }

        validated.push({
          id: p.id || `P${validated.length + 1}`,
          type: p.type || "서술형",
          question: p.question,
          answer: p.answer,
          explanation: p.explanation || "",
        });
      }

      // 모든 문제가 검증 통과했는지 확인
      if (validated.length === count) {
        // 다양성 체크
        const diversityCheck = checkDiversity(validated);
        if (!diversityCheck.ok) {
          const log: GenerationLog = {
            attempt,
            subunitId: spec.subunitId,
            failedReason: diversityCheck.reason,
            rawLLMOutput: raw.substring(0, 200),
            timestamp: Date.now(),
          };
          logs.push(log);
          if (onLog) onLog(log);
          continue;
        }

        // 성공
        return validated;
      } else {
        // 일부 문제가 검증 실패
        const log: GenerationLog = {
          attempt,
          subunitId: spec.subunitId,
          failedReason: failedReason || `검증 통과 문제 수 부족: ${validated.length}/${count}`,
          rawLLMOutput: raw.substring(0, 200),
          timestamp: Date.now(),
        };
        logs.push(log);
        if (onLog) onLog(log);
      }
    } catch (error) {
      const log: GenerationLog = {
        attempt,
        subunitId: spec.subunitId,
        failedReason: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
      };
      logs.push(log);
      if (onLog) onLog(log);
    }
  }

  // 최대 재시도 초과
  throw new Error(
    `단원 적합성 검증을 통과하는 문제 생성 실패(최대 재시도 ${MAX_TRIES}회 초과). 로그: ${JSON.stringify(logs)}`
  );
}

/**
 * JSON 배열 안전 파싱
 * 
 * @param raw 원본 문자열
 * @returns 파싱된 배열
 */
function safeParseJsonArray(raw: string): any[] {
  // 1) ``` 제거
  let cleaned = raw.replace(/```json|```/g, "").trim();

  // 2) 배열로 감싸져 있지 않으면 배열로 감싸기
  if (!cleaned.startsWith("[")) {
    // 여러 JSON 객체가 줄바꿈으로 구분되어 있을 수 있음
    const lines = cleaned.split("\n").filter((line) => line.trim());
    const objects = [];
    for (const line of lines) {
      try {
        const obj = JSON.parse(line.trim());
        objects.push(obj);
      } catch {
        // 무시
      }
    }
    if (objects.length > 0) {
      return objects;
    }
  }

  // 3) JSON 파싱
  try {
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) {
      throw new Error("LLM output is not array");
    }
    return parsed;
  } catch (error) {
    throw new Error(`JSON 파싱 실패: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 다양성 체크
 * 
 * @param problems 문제 배열
 * @returns 검증 결과
 */
function checkDiversity(
  problems: ProblemGenerationResult[]
): ValidationResult {
  // 문제 유형 다양성 체크
  if (hasTooSimilar(problems)) {
    return {
      ok: false,
      reason: "문제가 너무 유사함 (80% 이상 중복)",
    };
  }

  // 유형 다양성 체크
  if (hasTooSimilarTypes(problems)) {
    return {
      ok: false,
      reason: "문제 유형이 너무 유사함 (50% 이상 같은 유형)",
    };
  }

  return { ok: true };
}

/**
 * 단원 데이터에서 소단원 스펙 가져오기
 * 
 * @param grade 학년
 * @param semester 학기
 * @param subunitId 소단원 ID (예: "5-1_U2_S1")
 * @returns 소단원 스펙 또는 null
 */
export async function getSubunitSpec(
  grade: number,
  semester: number,
  subunitId: string
): Promise<SubunitSpec | null> {
  // 단원 데이터 파일 로드
  // 예: grade5_sem1.units.json
  const fileName = `grade${grade}_sem${semester}.units.json`;
  
  try {
    // 동적 import 또는 fetch로 데이터 로드
    // 실제 구현은 프로젝트 구조에 맞게 수정 필요
    const response = await fetch(`/src/data/curriculum/${fileName}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();

    // subunitId로 소단원 찾기
    for (const unit of data.units || []) {
      for (const subunit of unit.subunits || []) {
        if (subunit.subunitId === subunitId) {
          return {
            unitId: unit.unitId,
            unitTitle: unit.unitTitle,
            subunitId: subunit.subunitId,
            subunitTitle: subunit.subunitTitle,
            mustKeywords: subunit.mustKeywords || [],
            banKeywords: subunit.banKeywords || [],
            allowedConcepts: subunit.allowedConcepts || [],
            banProblemTypes: subunit.banProblemTypes || [],
          };
        }
      }
    }
  } catch (error) {
    console.error("단원 데이터 로드 실패:", error);
    return null;
  }

  return null;
}

