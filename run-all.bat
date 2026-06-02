@echo off
echo Starting DearBook Application...
start cmd /k "run-backend.bat"
start cmd /k "npm run dev"
echo Both servers are launching in separate command windows.
