@echo off
setlocal

set "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%backend" || exit /b 1

echo Loading environment variables from .env and backend\.env ...
if exist "%PROJECT_ROOT%.env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%PROJECT_ROOT%.env") do (
    if not "%%A"=="" set "%%A=%%B"
  )
)

if exist ".env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
    if not "%%A"=="" set "%%A=%%B"
  )
) else (
  echo backend\.env not found; using application defaults.
)

if not defined SUPABASE_URL if defined VITE_SUPABASE_URL set "SUPABASE_URL=%VITE_SUPABASE_URL%"

echo Starting Spring Boot backend on http://localhost:8081 ...
set "SPRING_PROFILES_ACTIVE=prod"

if exist "target\backend-0.0.1-SNAPSHOT.jar" (
  java -jar target\backend-0.0.1-SNAPSHOT.jar --server.port=8081 --spring.profiles.active=prod
) else (
  .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=prod" "-Dspring-boot.run.arguments=--server.port=8081"
)
