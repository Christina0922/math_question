import React, { useMemo } from "react";
import { Grade, Semester, getCurriculumUnits } from "../utils/curriculum";

type Props = {
  grade: Grade | null;
  semester: Semester | null;
  selectedIds: string[];
  onChangeSelectedIds: (next: string[]) => void;
};

function pickUnitNo(unitTitle: string, fallback: number): number {
  const m = unitTitle.match(/^(\d+)\s*단원/);
  return m ? Number(m[1]) : fallback;
}

function pickTopicNo(topicTitle: string, fallback: number): number {
  const m = topicTitle.match(/^(\d+)\s*\)/);
  return m ? Number(m[1]) : fallback;
}

export default function ConceptSelector({
  grade,
  semester,
  selectedIds,
  onChangeSelectedIds
}: Props) {
  const units = useMemo(() => {
    if (!grade || !semester) return [];
    return getCurriculumUnits(grade, semester);
  }, [grade, semester]);

  const itemsByUnit = useMemo(() => {
    if (!grade || !semester) return [];
    return units.map((u, uIdx) => {
      const unitNo = pickUnitNo(u.unit, uIdx + 1);
      const topics = u.topics.map((t, tIdx) => {
        const topicNo = pickTopicNo(t, tIdx + 1);
        const id = `G${grade}-S${semester}-U${unitNo}-T${topicNo}`;
        return { id, title: t };
      });
      return { unitTitle: u.unit, topics };
    });
  }, [grade, semester, units]);

  const toggleOne = (id: string) => {
    const has = selectedIds.includes(id);
    const next = has ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];
    onChangeSelectedIds(next);
  };

  const selectAllVisible = () => {
    const all = itemsByUnit.flatMap((u) => u.topics.map((t) => t.id));
    const set = new Set([...selectedIds, ...all]);
    onChangeSelectedIds(Array.from(set));
  };

  const clearAllVisible = () => {
    const visible = new Set(itemsByUnit.flatMap((u) => u.topics.map((t) => t.id)));
    onChangeSelectedIds(selectedIds.filter((id) => !visible.has(id)));
  };

  if (!grade || !semester) {
    return (
      <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
        학년과 학기를 먼저 선택해 주세요.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <button type="button" onClick={selectAllVisible}>
          전체 선택
        </button>
        <button type="button" onClick={clearAllVisible}>
          전체 해제
        </button>
        <div style={{ marginLeft: "auto", fontSize: 13, opacity: 0.8 }}>
          선택됨: {selectedIds.length}개
        </div>
      </div>

      {itemsByUnit.map((u) => (
        <div key={u.unitTitle} style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{u.unitTitle}</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10
            }}
          >
            {u.topics.map((t) => (
              <label
                key={t.id}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "10px 12px",
                  border: "1px solid #e6e6e6",
                  borderRadius: 10,
                  background: "#fff"
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(t.id)}
                  onChange={() => toggleOne(t.id)}
                />
                <span>{t.title}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

