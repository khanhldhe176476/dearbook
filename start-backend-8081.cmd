@echo off
setlocal

cd /d "%~dp0backend" || exit /b 1

for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
  if not "%%A"=="" if not "%%A:~0,1%"=="#" set "%%A=%%B"
)

set "SPRING_PROFILES_ACTIVE=prod"
start "DearBook Backend 8081" cmd /c "java -jar target\backend-0.0.1-SNAPSHOT.jar --server.port=8081 --spring.profiles.active=prod > backend-run.log 2>&1"
