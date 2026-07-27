@echo off
title Investment Tracker Update

echo =======================================
echo   Investment Dashboard Update
echo   Source: TongHuaShun iFinD
echo =======================================
echo.

cd /d "%~dp0"

echo Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js first.
    echo.
    pause
    exit /b 1
)

echo.
echo Fetching latest market data...
echo.

node update-dashboard.js

echo.
echo =======================================
echo   Update complete! Refresh your browser
echo =======================================
echo.
pause
