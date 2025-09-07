@echo off
echo ========================================
echo BaddBeatz Development Setup (Windows)
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed. Please install Python first.
    echo Download from: https://python.org/
    pause
    exit /b 1
)

echo OK: Prerequisites check passed
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

REM Copy environment file if it doesn't exist
if not exist .env (
    echo Creating .env file from example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit backend\.env with your configuration
) else (
    echo OK: .env file already exists
)

cd ..

REM Create missing PWA icon if needed
if not exist assets\images\icon-144x144.png (
    echo Creating PWA icon...
    copy assets\images\Logo.png assets\images\icon-144x144.png
)

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start development:
echo 1. Terminal 1: cd backend ^&^& node auth-server.js
echo 2. Terminal 2: python server.py
echo 3. Open http://localhost:8000 in your browser
echo.
echo For production deployment, see HTTPS_DEPLOYMENT_GUIDE.md
echo.
pause
