import os
import glob
import sys
import pdfplumber

BASE = r"D:\1000_b_project\math_question\import_from_Math_Questions\_question_bank_only\Elementary_school"
OUT_BASE = r"D:\1000_b_project\math_question\extracted_pages"

def main():
    if len(sys.argv) < 2:
        print("사용법: py extract_pages_pack.py ES_PACK02_Basics")
        raise SystemExit

    pack = sys.argv[1].strip()
    src_dir = os.path.join(BASE, pack)
    out_root = os.path.join(OUT_BASE, pack)

    if not os.path.isdir(src_dir):
        print("폴더가 없습니다:", src_dir)
        raise SystemExit

    os.makedirs(out_root, exist_ok=True)

    pdf_paths = sorted(glob.glob(os.path.join(src_dir, "*.pdf")))
    if not pdf_paths:
        print("PDF가 없습니다:", src_dir)
        raise SystemExit

    for pdf_path in pdf_paths:
        pdf_name = os.path.splitext(os.path.basename(pdf_path))[0]  # 예: 2-2
        out_dir = os.path.join(out_root, pdf_name)
        os.makedirs(out_dir, exist_ok=True)

        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages, start=1):
                text = page.extract_text() or ""
                out_path = os.path.join(out_dir, f"{i:04d}.txt")
                with open(out_path, "w", encoding="utf-8") as f:
                    f.write(text)

        print("완료:", os.path.basename(pdf_path), "->", out_dir)

    print("\n전체 완료:", out_root)

if __name__ == "__main__":
    main()
