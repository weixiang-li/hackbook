@echo off
echo ============build============
echo cnpm install
call cnpm install
echo cnpm run build
call cnpm run build
echo ============ web ============
call node ./dist/server.js
echo. & pause