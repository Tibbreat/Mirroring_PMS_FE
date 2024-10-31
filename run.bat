@echo off
echo Building Docker image tungb12ok/fe_pms...

REM Build the Docker image
docker build -t tungb12ok/fe_pms .

REM Check if the build was successful
IF %ERRORLEVEL% NEQ 0 (
    echo Docker build failed.
    exit /b %ERRORLEVEL%
)

echo Docker image built successfully: tungb12ok/fe_pms

REM Push the Docker image to Docker Hub
echo Pushing Docker image tungb12ok/fe_pms to Docker Hub...
docker push tungb12ok/fe_pms

REM Check if the push was successful
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to push Docker image.
    exit /b %ERRORLEVEL%
)

echo Docker image pushed successfully.
