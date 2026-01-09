import os
import pdfplumber
from pdf_utils import list_ocr_pdfs, validate_ocr_only

BASE_DIR = r"D:\1000_b_project\math_question\import_from_Math_Questions\_question_bank_only\Elementary_school\ES_PACK01_Principle"

# _OCR.pdf 파일만 찾기
pdf_entries = list_ocr_pdfs(BASE_DIR)
if not pdf_entries:
    print(f"⚠️  경고: {BASE_DIR}에 _OCR.pdf 파일이 없습니다.")
    print("   원본 PDF는 무시되며, _OCR.pdf만 처리됩니다.")
    raise SystemExit

print(f"\n📁 {os.path.basename(BASE_DIR)} 폴더에서 OCR PDF {len(pdf_entries)}개 발견")
print("검사할 파일 (샘플 3개):")
for entry in pdf_entries[:3]:
    print(f"  - {entry.basename} -> {entry.logical_basename}")
if len(pdf_entries) > 3:
    print(f"  ... 외 {len(pdf_entries) - 3}개\n")

for entry in pdf_entries:
    # 안전장치: _OCR.pdf가 아니면 스킵
    if not validate_ocr_only(entry.original_path):
        print(f"⚠️  경고: {entry.basename}는 _OCR.pdf가 아닙니다. 스킵합니다.")
        continue

    total_pages = 0
    text_pages = 0
    sample_chars = 0

    try:
        with pdfplumber.open(entry.original_path) as pdf:
            for page in pdf.pages[:10]:  # 앞 10페이지만 샘플 검사
                total_pages += 1
                text = page.extract_text() or ""
                if text.strip():
                    text_pages += 1
                    sample_chars += len(text)

        ratio = (text_pages / total_pages) * 100 if total_pages else 0
        print(f"\n[{entry.basename}] (정규화: {entry.logical_basename})")
        print(f"샘플 10페이지 중 텍스트 추출 성공: {text_pages}/{total_pages} ({ratio:.0f}%)")
        print(f"샘플 텍스트 글자수 합: {sample_chars}")
    except Exception as e:
        print(f"\n❌ 오류: {entry.basename} 검사 실패 - {e}")

print("\n판정 기준:")
print("- 성공 비율이 높고 글자수가 충분하면: 텍스트 PDF 가능성이 큽니다.")
print("- 대부분 0에 가깝다면: 스캔 PDF(OCR 필요) 가능성이 큽니다.")
print("\n⚠️  참고: 이 스크립트는 _OCR.pdf 파일만 검사합니다.")
