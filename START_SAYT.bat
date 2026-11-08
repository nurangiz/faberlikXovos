@echo off
title Faberlic Ayollar Akademiyasi
chcp 65001 >nul
cls

echo =======================================================
echo    🌸 FABERLIC AYOLLAR VA QIZLAR AKADEMIYASI 🌸
echo =======================================================
echo.
echo Server ishga tushirilmoqda (Port: 3000 va 5000)...
echo.

cd /d "%~dp0"

start "" "http://localhost:3000"

:loop
node server/server.js
echo.
echo Server kutilmaganda to'xtadi. 2 soniyada qayta ishga tushirilmoqda...
timeout /t 2 >nul
goto loop
