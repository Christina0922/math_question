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
        script_dir,
        os.getcwd()  # 현재 작업 디렉토리도 시도
    ]
    for path in possible_paths:
        index_path = os.path.join(path, 'index.html')
        if os.path.exists(index_path):
            project_dir = path
            print(f"프로젝트 디렉토리 찾음: {project_dir}")
            break

# 프로젝트 디렉토리로 이동
try:
    os.chdir(project_dir)
    print(f"작업 디렉토리: {os.getcwd()}")
    print(f"index.html 존재: {os.path.exists('index.html')}")
    print(f"create.html 존재: {os.path.exists('create.html')}")
    
    # 파일 목록 확인
    files = os.listdir('.')
    html_files = [f for f in files if f.endswith('.html')]
    print(f"HTML 파일들: {html_files}")
except Exception as e:
    print(f"오류: {e}")
    sys.exit(1)

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

# 서버 시작 전에 포트가 이미 사용 중인지 확인
try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n서버가 http://localhost:{PORT} 에서 실행 중입니다.")
        print(f"작업 디렉토리: {os.getcwd()}")
        print(f"브라우저에서 http://localhost:{PORT}/create.html 을 열어주세요.\n")
        httpd.serve_forever()
except OSError as e:
    if "Address already in use" in str(e) or "포트가 이미 사용 중" in str(e):
        print(f"포트 {PORT}가 이미 사용 중입니다. 다른 포트를 사용하거나 기존 프로세스를 종료하세요.")
    else:
        print(f"서버 시작 오류: {e}")
    sys.exit(1)
