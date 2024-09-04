@echo off
python path/to/your/folder/WuWaRecord/record.py

if %ERRORLEVEL% neq 0 (
    echo Failed to record game time.
    pause
)

echo Launching WuWa...
start "" "path/to/your/game/folder/game.exe"
:: Hint: you can direct launch the WuWa via "%GAME_FOLDER%\Wuthering Waves Game\Client\Binaries\Win64\Client-Win64-Shipping.exe"

timeout /t 2 /nobreak >nul
