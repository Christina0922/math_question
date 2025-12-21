import React from "react";

type Props = {
  checked: boolean;
  onToggle: () => void;
  inputType?: "checkbox" | "radio";
  name?: string;            // radio일 때 사용
  value?: string;           // input value
  label: React.ReactNode;   // 카드 안 텍스트
};

/**
 * STEP 3(학기 선택) 카드 마크업/클래스를 그대로 사용하는 공통 컴포넌트
 * STEP 3에서 사용하는 "radio-label" 클래스를 그대로 재사용
 */
export default function SelectCard({
  checked,
  onToggle,
  inputType = "checkbox",
  name,
  value,
  label
}: Props) {
  return (
    <label className="radio-label">
      <input
        type={inputType}
        name={name}
        value={value}
        checked={checked}
        onChange={onToggle}
      />
      <span>{label}</span>
    </label>
  );
}

