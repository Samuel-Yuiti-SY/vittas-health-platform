@echo off
echo Iniciando VITTAS MVP...

start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

start cmd /k "cd frontend && npm.cmd run dev"

echo Servidores iniciados.
echo Back-end: http://127.0.0.1:8000
echo Front-end: http://127.0.0.1:5173
pause
