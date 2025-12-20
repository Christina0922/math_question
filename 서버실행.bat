@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 현재 디렉토리: %CD%
echo index.html 파일 확인: 
if exist index.html (echo   - index.html 존재) else (echo   - index.html 없음)
echo.
echo 서버를 시작합니다...
echo 브라우저에서 http://localhost:8000/index.html 로 접속하세요.
echo.
python -m http.server 8000
pause

