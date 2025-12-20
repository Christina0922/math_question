import http.server
import socketserver
import os
import sys

# 현재 스크립트의 디렉토리를 기준으로 프로젝트 디렉토리 찾기
script_dir = os.path.dirname(os.path.abspath(__file__))
# start_server.py가 프로젝트 루트에 있다고 가정
project_dir = script_dir

# 절대 경로로도 시도
if not os.path.exists(os.path.join(project_dir, 'index.html')):
    # 한글 경로 문제로 인해 직접 경로 지정
    possible_paths = [
        r"D:\1000억 프로젝트\math_question",
        script_dir
    ]
    for path in possible_paths:
        if os.path.exists(os.path.join(path, 'index.html')):
            project_dir = path
            break

# 프로젝트 디렉토리로 이동
try:
    os.chdir(project_dir)
    print(f"작업 디렉토리: {os.getcwd()}")
    print(f"index.html 존재: {os.path.exists('index.html')}")
except Exception as e:
    print(f"오류: {e}")
    sys.exit(1)

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"서버가 http://localhost:{PORT} 에서 실행 중입니다.")
    print(f"작업 디렉토리: {os.getcwd()}")
    httpd.serve_forever()
