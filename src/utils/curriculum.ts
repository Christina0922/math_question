import curriculumRaw from "../data/curriculum_1_3.json";

export type Semester = 1 | 2;
export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type CurriculumUnit = {
  unit: string;
  topics: string[];
};

export type CurriculumBySemester = {
  "1학기": CurriculumUnit[];
  "2학기"?: CurriculumUnit[]; // 5-2, 6-2는 데이터 없음
};

export type Curriculum = {
  "1학년": CurriculumBySemester;
  "2학년": CurriculumBySemester;
  "3학년": CurriculumBySemester;
  "4학년": CurriculumBySemester;
  "5학년": CurriculumBySemester;
  "6학년": CurriculumBySemester;
};

const curriculum = curriculumRaw as unknown as Curriculum;

function pickUnitNo(unitTitle: string, fallback: number): number {
  const m = unitTitle.match(/^(\d+)\s*단원/);
  return m ? Number(m[1]) : fallback;
}

function pickTopicNo(topicTitle: string, fallback: number): number {
  const m = topicTitle.match(/^(\d+)\s*\)/);
  return m ? Number(m[1]) : fallback;
}

export type ConceptItem = {
  id: string;          // 예: G1-S2-U4-T3
  grade: Grade;
  semester: Semester;
  unitTitle: string;   // "4단원 : 덧셈과 뺄셈(2)"
  topicTitle: string;  // "3) 뺄셈을 알아볼까요"
};

export function getCurriculumUnits(grade: Grade, semester: Semester): CurriculumUnit[] {
  const gKey = `${grade}학년` as keyof Curriculum;
  const sKey = `${semester}학기` as keyof CurriculumBySemester;
  const gradeData = curriculum[gKey];
  if (!gradeData) return [];
  const semesterData = gradeData[sKey];
  return semesterData || [];
}

export function getConceptItems(grade: Grade, semester: Semester): ConceptItem[] {
  const units = getCurriculumUnits(grade, semester);
  const result: ConceptItem[] = [];

  units.forEach((u, uIdx) => {
    const unitNo = pickUnitNo(u.unit, uIdx + 1);
    u.topics.forEach((t, tIdx) => {
      const topicNo = pickTopicNo(t, tIdx + 1);
      result.push({
        id: `G${grade}-S${semester}-U${unitNo}-T${topicNo}`,
        grade,
        semester,
        unitTitle: u.unit,
        topicTitle: t
      });
    });
  });

  return result;
}

/**
 * 개념 ID를 파싱하여 학년, 학기, 단원, 소단원 정보를 추출
 * 형식: G{grade}-S{semester}-U{unit}-T{topic}
 */
export function parseConceptId(conceptId: string): {
  grade: Grade;
  semester: Semester;
  unitNo: number;
  topicNo: number;
  unitId: string;
  subunitId: string;
  conceptId: string;
} | null {
  const match = conceptId.match(/^G(\d+)-S(\d+)-U(\d+)-T(\d+)$/);
  if (!match) return null;
  
  const grade = parseInt(match[1]) as Grade;
  const semester = parseInt(match[2]) as Semester;
  const unitNo = parseInt(match[3]);
  const topicNo = parseInt(match[4]);
  
  return {
    grade,
    semester,
    unitNo,
    topicNo,
    unitId: `G${grade}-S${semester}-U${unitNo}`,
    subunitId: `G${grade}-S${semester}-U${unitNo}`, // 소단원은 단원과 동일하게 처리
    conceptId: conceptId
  };
}

