@echo off
echo Loading environment variables from backend\.env ...
cd backend
for /f "usebackq tokens=*" %%a in (".env") do (
    set %%a
)
echo Starting Spring Boot backend...
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"
