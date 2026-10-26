@echo off
cd /d "%~dp0"
echo HN Growth Media site running at http://localhost:8765
echo Press Ctrl+C to stop.
start "" http://localhost:8765
python -m http.server 8765 --bind 0.0.0.0
