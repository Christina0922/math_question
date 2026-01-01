import os, json, re

ROOT_TXT = r"D:\1000_b_project\math_question\extracted_pages"
ROOT_PNG = r"D:\1000_b_project\math_question\extracted_pages_png"
OUT_FILE = r"D:\1000_b_project\math_question\data_index.json"

pdf_pat = re.compile(r"^(\d+)-(\d+)$")  # 예: 3-2 -> grade=3, unit=2

index = []
for pack in sorted(os.listdir(ROOT_TXT)):
    pack_dir = os.path.join(ROOT_TXT, pack)
    if not os.path.isdir(pack_dir):
        continue

    for pdf_name in sorted(os.listdir(pack_dir)):  # 예: 3-2
        pdf_dir = os.path.join(pack_dir, pdf_name)
        if not os.path.isdir(pdf_dir):
            continue

        m = pdf_pat.match(pdf_name)
        grade = int(m.group(1)) if m else None
        unit = int(m.group(2)) if m else None

        txt_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith(".txt")]
        txt_files.sort()
        page_count = len(txt_files)

        # 샘플(첫 페이지 일부) 넣어서 검색용 힌트
        sample = ""
        if txt_files:
            first = os.path.join(pdf_dir, txt_files[0])
            try:
                with open(first, "r", encoding="utf-8") as fp:
                    sample = fp.read(300).replace("\n", " ").strip()
            except:
                sample = ""

        png_dir = os.path.join(ROOT_PNG, pack, pdf_name)
        has_png = os.path.isdir(png_dir)

        index.append({
            "pack": pack,
            "pdf_key": pdf_name,
            "grade": grade,
            "unit": unit,
            "page_count": page_count,
            "txt_dir": pdf_dir,
            "png_dir": png_dir if has_png else None,
            "sample": sample
        })

with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(index, f, ensure_ascii=False, indent=2)

print("완료:", OUT_FILE, "항목수:", len(index))
