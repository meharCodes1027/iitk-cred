#!/bin/bash

# CredTech Startup Script
echo "🚀 Starting CredTech application..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check ports
echo "🔍 Checking ports..."
check_port 8000
BACKEND_PORT_OK=$?
check_port 3000
FRONTEND_PORT_OK=$?

if [ $BACKEND_PORT_OK -ne 0 ] || [ $FRONTEND_PORT_OK -ne 0 ]; then
    echo "❌ Required ports are not available. Please stop other services and try again."
    exit 1
fi

# Start backend in background
echo "🖥️  Starting backend server..."
cd backend
../.venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Start frontend in background
echo "🌐 Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Create PID file for cleanup
echo "$BACKEND_PID $FRONTEND_PID" > ../pids.txt

echo ""
echo "🎉 CredTech is starting up!"
echo "🖥️  Backend:  http://localhost:8000"
echo "🖥️  API Docs: http://localhost:8000/docs"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "To stop the servers, run: ./stop.sh"
echo "Or manually kill processes: kill $BACKEND_PID $FRONTEND_PID"

# Wait for user input to keep script running
echo "Press Ctrl+C to stop all servers..."
wait
