@echo off
setlocal

set "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%backend" || exit /b 1

if exist "%PROJECT_ROOT%.env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%PROJECT_ROOT%.env") do (
    if not "%%A"=="" set "%%A=%%B"
  )
)

if exist ".env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
    if not "%%A"=="" set "%%A=%%B"
  )
)

if not defined SUPABASE_URL if defined VITE_SUPABASE_URL set "SUPABASE_URL=%VITE_SUPABASE_URL%"

set "SPRING_PROFILES_ACTIVE=prod"
start "DearBook Backend 8081" cmd /c "java -jar target\backend-0.0.1-SNAPSHOT.jar --server.port=8081 --spring.profiles.active=prod > backend-run.log 2>&1"
