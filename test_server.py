import os
import http.server
import socketserver

# 프로젝트 디렉토리로 이동
project_dir = r"D:\1000억 프로젝트\math_question"
os.chdir(project_dir)

print(f"현재 디렉토리: {os.getcwd()}")
print(f"index.html 존재: {os.path.exists('index.html')}")

PORT = 1004
Handler = http.server.SimpleHTTPRequestHandler

# IPv4로만 바인딩 (127.0.0.1)
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"\n서버가 http://127.0.0.1:{PORT} 에서 실행 중입니다.")
    print(f"브라우저에서 http://127.0.0.1:{PORT}/ 를 열어주세요.\n")
    httpd.serve_forever()

