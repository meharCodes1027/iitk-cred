#!/bin/bash

# CredTech Stop Script
echo "🛑 Stopping CredTech application..."

# Read PIDs if file exists
if [ -f "pids.txt" ]; then
    read BACKEND_PID FRONTEND_PID < pids.txt
    echo "Stopping backend (PID: $BACKEND_PID) and frontend (PID: $FRONTEND_PID)..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null && echo "✅ Backend stopped" || echo "❌ Backend not running"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null && echo "✅ Frontend stopped" || echo "❌ Frontend not running"
    fi
    
    rm pids.txt
else
    echo "🔍 Looking for running processes..."
    
    # Find and kill backend processes
    BACKEND_PIDS=$(pgrep -f "uvicorn main:app")
    if [ ! -z "$BACKEND_PIDS" ]; then
        echo "Stopping backend processes: $BACKEND_PIDS"
        kill $BACKEND_PIDS
        echo "✅ Backend stopped"
    else
        echo "ℹ️  Backend not running"
    fi
    
    # Find and kill frontend processes
    FRONTEND_PIDS=$(pgrep -f "react-scripts start")
    if [ ! -z "$FRONTEND_PIDS" ]; then
        echo "Stopping frontend processes: $FRONTEND_PIDS"
        kill $FRONTEND_PIDS
        echo "✅ Frontend stopped"
    else
        echo "ℹ️  Frontend not running"
    fi
fi

echo "🎉 CredTech application stopped!"
