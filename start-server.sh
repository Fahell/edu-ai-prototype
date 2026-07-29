#!/bin/bash
# Start the EduAI HTTP server as a proper daemon
cd ~/projects/edu-ai-prototype
pkill -f 'serve.js' 2>/dev/null
sleep 0.5
setsid node serve.js 8090 < /dev/null > /tmp/eduai-server.log 2>&1 &
echo $! > .server.pid
echo "Server started with PID $(cat .server.pid)"
