"""
모든 팩(초등/중등)을 스캔하여 _OCR.pdf 파일 목록을 출력하는 스크립트
"""
import os
from pdf_utils import list_ocr_pdfs

BASE_ELEMENTARY = r"D:\1000_b_project\math_question\import_from_Math_Questions\_question_bank_only\Elementary_school"
BASE_JUNIOR = r"D:\1000_b_project\math_question\import_from_Math_Questions\_question_bank_only\Junior_high_school"

def scan_packs(base_dir, school_type):
    """특정 루트 디렉토리 아래의 모든 팩을 스캔"""
    if not os.path.isdir(base_dir):
        print(f"⚠️  경고: {base_dir} 폴더가 없습니다.")
        return []
    
    packs = []
    for item in sorted(os.listdir(base_dir)):
        pack_dir = os.path.join(base_dir, item)
        if not os.path.isdir(pack_dir):
            continue
        
        # 팩 폴더에서 _OCR.pdf 파일 찾기
        pdf_entries = list_ocr_pdfs(pack_dir)
        
        if pdf_entries:
            packs.append({
                'name': item,
                'path': pack_dir,
                'ocr_count': len(pdf_entries),
                'samples': pdf_entries[:3]  # 샘플 3개
            })
            print(f"{school_type} pack found: {item} (OCR pdf count: {len(pdf_entries)})")
        else:
            print(f"⚠️  {school_type} pack '{item}'에 OCR PDF가 없습니다.")
    
    return packs

def main():
    print("=" * 60)
    print("초등/중등 모든 팩 스캔 시작")
    print("=" * 60)
    
    # 초등학교 스캔
    print(f"\n[ES] 초등학교 루트 스캔: {BASE_ELEMENTARY}")
    elementary_packs = scan_packs(BASE_ELEMENTARY, "[ES]")
    
    # 중학교 스캔
    print(f"\n[JH] 중학교 루트 스캔: {BASE_JUNIOR}")
    junior_packs = scan_packs(BASE_JUNIOR, "[JH]")
    
    # 요약
    print("\n" + "=" * 60)
    print("스캔 완료 요약")
    print("=" * 60)
    print(f"초등학교 팩: {len(elementary_packs)}개")
    for pack in elementary_packs:
        print(f"  - {pack['name']}: {pack['ocr_count']}개 OCR PDF")
        if pack['samples']:
            print(f"    샘플: {pack['samples'][0].basename}")
    
    print(f"\n중학교 팩: {len(junior_packs)}개")
    for pack in junior_packs:
        print(f"  - {pack['name']}: {pack['ocr_count']}개 OCR PDF")
        if pack['samples']:
            print(f"    샘플: {pack['samples'][0].basename}")
    
    print(f"\n전체 팩 수: {len(elementary_packs) + len(junior_packs)}개")
    print("=" * 60)

if __name__ == "__main__":
    main()

