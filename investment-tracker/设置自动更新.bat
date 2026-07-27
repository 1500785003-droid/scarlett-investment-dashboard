@echo off
chcp 65001 >nul
title 设置自动更新 - 投资看板

echo ╔═══════════════════════════════════════╗
echo ║     投资看板 - 自动更新设置           ║
echo ╚═══════════════════════════════════════╝
echo.

echo 正在创建自动更新任务...
echo.

:: 获取当前脚本所在目录
set "SCRIPT_DIR=%~dp0"
set "UPDATE_BAT=%SCRIPT_DIR%更新行情.bat"
set "UPDATE_JS=%SCRIPT_DIR%update-dashboard.js"

:: 创建VBS脚本（用于隐藏运行）
echo Set WshShell = CreateObject("WScript.Shell") > "%SCRIPT_DIR%run-hidden.vbs"
echo WshShell.Run chr(34) ^& "%UPDATE_BAT%" ^& chr(34), 0, False >> "%SCRIPT_DIR%run-hidden.vbs"

:: 使用schtasks创建定时任务
:: 工作日 9:00-17:00，每小时一次
schtasks /create /tn "投资看板_自动更新" /tr "\"wscript.exe\" \"%SCRIPT_DIR%run-hidden.vbs\"" /sc hourly /mo 1 /st 09:00 /et 17:00 /sd 2026/01/01 /ru SYSTEM /f

if %errorlevel% equ 0 (
    echo ✓ 自动更新任务创建成功！
    echo.
    echo ═══════════════════════════════════════
    echo   更新时间：工作日 9:00 - 17:00
    echo   更新频率：每小时一次
    echo   静默运行：后台自动更新，不弹窗
    echo ═══════════════════════════════════════
) else (
    echo ✗ 创建失败，请以管理员身份运行
    echo.
    echo 右键点击此文件，选择「以管理员身份运行」
)

echo.
pause
