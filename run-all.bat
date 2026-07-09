@echo off
echo Starting DearBook Application...
start "DearBook Backend 8081" cmd /k "%~dp0run-backend.bat"
if exist "%~dp0.tools\with-node22.cmd" (
  start "DearBook Frontend" cmd /k ""%~dp0.tools\with-node22.cmd" npm run dev"
) else (
  start "DearBook Frontend" cmd /k "npm run dev"
)
echo Both servers are launching in separate command windows.
