"""
PDF 파일 처리 공통 유틸리티
_OCR.pdf 파일만 처리하고, 정규화된 이름으로 매핑

사용 규칙:
- 포함: *_OCR.pdf 파일만 처리
- 제외: _OCR.pdf가 아닌 모든 PDF 파일
- 매핑: _OCR을 제거한 정규화된 이름으로 학년/학기 추출
  예: FundamentalConcept_1-1_OCR.pdf -> 논리 이름 FundamentalConcept_1-1.pdf -> (1, 1) 추출

초등학교(ES_PACK**)와 중학교(JH_PACK**) 모두 지원됩니다.
"""
import os
from typing import List, Tuple, Optional

class PdfEntry:
    """PDF 파일 정보를 담는 클래스"""
    def __init__(self, original_path: str, logical_name: str):
        self.original_path = original_path  # 실제 파일 경로 (예: Basics_1-1_OCR.pdf)
        self.logical_name = logical_name    # 정규화된 이름 (예: Basics_1-1.pdf)
        self.basename = os.path.basename(original_path)
        self.logical_basename = os.path.basename(logical_name)

def is_ocr_pdf(filename: str) -> bool:
    """
    파일명이 _OCR.pdf로 끝나는지 확인
    
    Args:
        filename: 파일명 또는 경로
        
    Returns:
        _OCR.pdf로 끝나면 True
    """
    return filename.endswith('_OCR.pdf') or filename.endswith('_OCR.PDF')

def normalize_pdf_name(filename: str) -> str:
    """
    _OCR.pdf 파일명에서 _OCR을 제거하여 정규화된 이름 반환
    
    예: Basics_1-1_OCR.pdf -> Basics_1-1.pdf
    
    Args:
        filename: 원본 파일명 (예: Basics_1-1_OCR.pdf)
        
    Returns:
        정규화된 파일명 (예: Basics_1-1.pdf)
    """
    if is_ocr_pdf(filename):
        # _OCR.pdf 또는 _OCR.PDF 제거
        if filename.endswith('_OCR.pdf'):
            return filename[:-8] + '.pdf'
        elif filename.endswith('_OCR.PDF'):
            return filename[:-8] + '.PDF'
    return filename

def list_ocr_pdfs(directory: str) -> List[PdfEntry]:
    """
    디렉토리에서 _OCR.pdf 파일만 찾아서 PdfEntry 리스트 반환
    
    Args:
        directory: 검색할 디렉토리 경로
        
    Returns:
        PdfEntry 리스트 (정규화된 이름 포함)
    """
    if not os.path.isdir(directory):
        return []
    
    entries = []
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if os.path.isfile(filepath) and is_ocr_pdf(filename):
            logical_name = normalize_pdf_name(filename)
            entries.append(PdfEntry(filepath, logical_name))
    
    # 정규화된 이름 기준으로 정렬
    entries.sort(key=lambda x: x.logical_basename)
    return entries

def extract_grade_unit_from_name(logical_name: str) -> Optional[Tuple[int, int]]:
    """
    정규화된 파일명에서 학년-단원 추출
    
    예: Basics_1-1.pdf -> (1, 1)
        Principle_2-2.pdf -> (2, 2)
        1-1.pdf -> (1, 1)
    
    Args:
        logical_name: 정규화된 파일명
        
    Returns:
        (grade, unit) 튜플 또는 None
    """
    import re
    # 파일명에서 마지막 부분 추출 (예: Basics_1-1.pdf -> 1-1)
    basename = os.path.splitext(os.path.basename(logical_name))[0]
    
    # 패턴: 숫자-숫자 (예: 1-1, 2-2)
    match = re.search(r'(\d+)-(\d+)', basename)
    if match:
        return (int(match.group(1)), int(match.group(2)))
    
    return None

def validate_ocr_only(pdf_path: str) -> bool:
    """
    PDF 파일이 _OCR.pdf인지 검증 (파이프라인 안전장치)
    
    Args:
        pdf_path: PDF 파일 경로
        
    Returns:
        _OCR.pdf면 True, 아니면 False
    """
    return is_ocr_pdf(pdf_path)

