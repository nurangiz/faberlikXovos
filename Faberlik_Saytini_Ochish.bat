@echo off
title Faberlic Ayollar va Qizlar Akademiyasi
chcp 65001 >nul
cls

echo ================================================================
echo        🌸 FABERLIC AYOLLAR VA QIZLAR AKADEMIYASI 🌸
echo ================================================================
echo.
echo Sayt ochilmoqda: http://localhost:3000 ...
echo Server doimiy fonda faol bo'lib turadi (Uxlab qolmaydi).
echo.

cd /d "%~dp0"

:: Brauzerda Faberlic saytini ochish
start "" "http://localhost:3000"

:: Serverni uzluksiz fonda ushlab turish (Agar to'xtasa avto-restart)
:loop
node server/server.js
echo.
echo [Ogohlantirish] Server to'xtadi. 2 soniyada qayta ishga tushirilmoqda...
timeout /t 2 >nul
goto loop
