"""
인덱스 생성 스크립트
이미 추출된 .txt 파일을 기반으로 data_index.json을 생성합니다.

참고: PDF 추출은 Python 스크립트(tools/extract_pages_pack.py 등)에서 수행하며,
      반드시 _OCR.pdf 파일만 사용됩니다. 원본 PDF는 무시됩니다.
      내부적으로는 _OCR을 제거한 정규화된 이름(예: 1-1.pdf)으로 학년/단원 매핑이 수행됩니다.
      
      초등학교(ES_PACK**)와 중학교(JH_PACK**) 모두 자동으로 스캔됩니다.
"""
import os, json, re

ROOT_TXT = r"D:\1000_b_project\math_question\extracted_pages"
ROOT_PNG = r"D:\1000_b_project\math_question\extracted_pages_png"
OUT_FILE = r"D:\1000_b_project\math_question\data_index.json"

pdf_pat = re.compile(r"^(\d+)-(\d+)$")  # 예: 3-2 -> grade=3, unit=2

index = []
elementary_count = 0
junior_count = 0

print("=" * 60)
print("인덱스 생성 시작 (초등/중등 모두 스캔)")
print("=" * 60)

for pack in sorted(os.listdir(ROOT_TXT)):
    pack_dir = os.path.join(ROOT_TXT, pack)
    if not os.path.isdir(pack_dir):
        continue

    # 초등/중등 판단
    is_junior = pack.startswith('JH_')
    school_type = "[JH] 중등" if is_junior else "[ES] 초등"
    
    pack_pdf_count = 0
    
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
        
        pack_pdf_count += 1
    
    if is_junior:
        junior_count += pack_pdf_count
        print(f"{school_type} pack: {pack} ({pack_pdf_count}개 PDF)")
    else:
        elementary_count += pack_pdf_count
        print(f"{school_type} pack: {pack} ({pack_pdf_count}개 PDF)")

with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(index, f, ensure_ascii=False, indent=2)

print("=" * 60)
print(f"완료: {OUT_FILE}")
print(f"  초등학교: {elementary_count}개 항목")
print(f"  중학교: {junior_count}개 항목")
print(f"  전체 항목수: {len(index)}개")
print("=" * 60)
