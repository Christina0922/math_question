import os
import sys
import pdfplumber
from pdf_utils import list_ocr_pdfs, validate_ocr_only, extract_grade_unit_from_name

# 초등/중등 루트 경로
BASE_ELEMENTARY = r"D:\1000_b_project\math_question\import_from_Math_Questions\_question_bank_only\Elementary_school"
BASE_JUNIOR = r"D:\1000_b_project\math_question\import_from_Math_Questions\_question_bank_only\Junior_high_school"
OUT_BASE = r"D:\1000_b_project\math_question\extracted_pages"

def main():
    if len(sys.argv) < 2:
        print("사용법: py extract_pages_pack.py <팩이름>")
        print("  예: py extract_pages_pack.py ES_PACK02_Basics (초등)")
        print("  예: py extract_pages_pack.py JH_PACK01_FundamentalConcept (중등)")
        raise SystemExit

    pack = sys.argv[1].strip()
    
    # 초등/중등 자동 판단 (팩 이름으로)
    is_junior = pack.startswith('JH_')
    BASE = BASE_JUNIOR if is_junior else BASE_ELEMENTARY
    school_type = "[JH] 중등" if is_junior else "[ES] 초등"
    
    src_dir = os.path.join(BASE, pack)
    out_root = os.path.join(OUT_BASE, pack)

    if not os.path.isdir(src_dir):
        print("폴더가 없습니다:", src_dir)
        raise SystemExit

    os.makedirs(out_root, exist_ok=True)

    # _OCR.pdf 파일만 찾기
    pdf_entries = list_ocr_pdfs(src_dir)
    if not pdf_entries:
        print(f"⚠️  경고: {src_dir}에 _OCR.pdf 파일이 없습니다.")
        print("   원본 PDF는 무시되며, _OCR.pdf만 처리됩니다.")
        raise SystemExit

    print(f"\n{school_type} root scanned: {BASE}")
    print(f"{school_type} pack found: {pack} (OCR pdf count: {len(pdf_entries)})")
    print(f"\n[{pack}] 폴더에서 OCR PDF {len(pdf_entries)}개 발견")
    print("처리할 파일 (샘플 3개):")
    for entry in pdf_entries[:3]:
        print(f"  - {entry.basename} -> {entry.logical_basename}")
    if len(pdf_entries) > 3:
        print(f"  ... 외 {len(pdf_entries) - 3}개")

    processed_count = 0
    skipped_count = 0

    for entry in pdf_entries:
        # 안전장치: _OCR.pdf가 아니면 스킵
        if not validate_ocr_only(entry.original_path):
            print(f"⚠️  경고: {entry.basename}는 _OCR.pdf가 아닙니다. 스킵합니다.")
            skipped_count += 1
            continue

        # 정규화된 이름으로 출력 디렉토리 생성 (예: Basics_1-1_OCR.pdf -> 1-1)
        grade_unit = extract_grade_unit_from_name(entry.logical_name)
        if grade_unit:
            pdf_name = f"{grade_unit[0]}-{grade_unit[1]}"
        else:
            # 패턴 매칭 실패 시 파일명에서 직접 추출 시도
            logical_basename = os.path.splitext(entry.logical_basename)[0]
            # 마지막 부분 추출 (예: Basics_1-1 -> 1-1)
            import re
            match = re.search(r'(\d+-\d+)$', logical_basename)
            if match:
                pdf_name = match.group(1)
            else:
                pdf_name = logical_basename

        out_dir = os.path.join(out_root, pdf_name)
        os.makedirs(out_dir, exist_ok=True)

        try:
            with pdfplumber.open(entry.original_path) as pdf:
                for i, page in enumerate(pdf.pages, start=1):
                    text = page.extract_text() or ""
                    out_path = os.path.join(out_dir, f"{i:04d}.txt")
                    with open(out_path, "w", encoding="utf-8") as f:
                        f.write(text)

            print(f"[완료] {entry.basename} -> {out_dir}")
            processed_count += 1
        except Exception as e:
            print(f"[오류] {entry.basename} 처리 실패 - {e}")
            skipped_count += 1

    print(f"\n[처리 완료] {processed_count}개 성공, {skipped_count}개 스킵")
    print(f"전체 완료: {out_root}")

if __name__ == "__main__":
    main()
