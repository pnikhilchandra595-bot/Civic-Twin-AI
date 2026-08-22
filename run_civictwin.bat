@echo off
echo ===================================================================
echo   CIVICTWIN AI - URBAN RESILIENCE & DISASTER RESPONSE DIGITAL TWIN
echo ===================================================================
echo.
echo Starting CivicTwin Backend (FastAPI + WebSocket Engine)...
start cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo Starting CivicTwin Tactical Operations Dashboard (Frontend)...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===================================================================
echo   Digital Twin Engine: http://127.0.0.1:8000
echo   Tactical Command Center: http://localhost:5173
echo ===================================================================
