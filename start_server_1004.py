import http.server
import socketserver
import os
import sys

# 프로젝트 디렉토리
project_dir = r"D:\1000억 프로젝트\math_question"

# index.html 존재 확인
index_path = os.path.join(project_dir, 'index.html')
if not os.path.exists(index_path):
    print(f"오류: index.html을 찾을 수 없습니다. 경로: {project_dir}")
    sys.exit(1)

# 프로젝트 디렉토리로 이동
original_dir = os.getcwd()
try:
    os.chdir(project_dir)
    print(f"작업 디렉토리: {os.getcwd()}")
    print(f"index.html 존재: {os.path.exists('index.html')}")
except Exception as e:
    print(f"디렉토리 이동 오류: {e}")
    sys.exit(1)

PORT = 1004

Handler = http.server.SimpleHTTPRequestHandler

# 서버 시작 (IPv4로만 바인딩)
try:
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"\n서버가 http://127.0.0.1:{PORT} 에서 실행 중입니다.")
        print(f"작업 디렉토리: {os.getcwd()}")
        print(f"브라우저에서 http://127.0.0.1:{PORT}/ 를 열어주세요.\n")
        httpd.serve_forever()
except OSError as e:
    if "Address already in use" in str(e):
        print(f"포트 {PORT}가 이미 사용 중입니다.")
    else:
        print(f"서버 시작 오류: {e}")
    sys.exit(1)

