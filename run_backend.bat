@echo off
cd /d "c:\Users\dayac\Downloads\CyberPorjec\backend"
python -m uvicorn main:app --reload --port 8000
pause
