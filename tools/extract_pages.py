import os
import glob
import pdfplumber

SRC_DIR = r"D:\1000_b_project\math_question\import_from_Math_Questions\_question_bank_only\Elementary_school\ES_PACK01_Principle"
OUT_ROOT = r"D:\1000_b_project\math_question\extracted_pages\ES_PACK01_Principle"

os.makedirs(OUT_ROOT, exist_ok=True)

pdf_paths = sorted(glob.glob(os.path.join(SRC_DIR, "*.pdf")))
if not pdf_paths:
    print("PDF가 없습니다:", SRC_DIR)
    raise SystemExit

for pdf_path in pdf_paths:
    pdf_name = os.path.splitext(os.path.basename(pdf_path))[0]  # 예: 1-1
    out_dir = os.path.join(OUT_ROOT, pdf_name)
    os.makedirs(out_dir, exist_ok=True)

    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            out_path = os.path.join(out_dir, f"{i:04d}.txt")
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(text)

    print("완료:", os.path.basename(pdf_path), "->", out_dir)

print("\n전체 완료:", OUT_ROOT)
