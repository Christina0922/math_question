import os
import glob
import pdfplumber

BASE_DIR = r"D:\1000_b_project\math_question\import_from_Math_Questions\_question_bank_only\Elementary_school\ES_PACK01_Principle"

pdf_paths = sorted(glob.glob(os.path.join(BASE_DIR, "*.pdf")))
if not pdf_paths:
    print("PDF가 없습니다:", BASE_DIR)
    raise SystemExit

for pdf_path in pdf_paths:
    total_pages = 0
    text_pages = 0
    sample_chars = 0

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages[:10]:  # 앞 10페이지만 샘플 검사
            total_pages += 1
            text = page.extract_text() or ""
            if text.strip():
                text_pages += 1
                sample_chars += len(text)

    ratio = (text_pages / total_pages) * 100 if total_pages else 0
    print(f"\n[{os.path.basename(pdf_path)}]")
    print(f"샘플 10페이지 중 텍스트 추출 성공: {text_pages}/{total_pages} ({ratio:.0f}%)")
    print(f"샘플 텍스트 글자수 합: {sample_chars}")

print("\n판정 기준:")
print("- 성공 비율이 높고 글자수가 충분하면: 텍스트 PDF 가능성이 큽니다.")
print("- 대부분 0에 가깝다면: 스캔 PDF(OCR 필요) 가능성이 큽니다.")
