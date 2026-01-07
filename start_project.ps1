# Startup Script for CareerConnect
Write-Host "Starting CareerConnect..."

# Start Node.js Backend Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js" -WorkingDirectory "$PSScriptRoot"

# Start React Frontend (Client)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WorkingDirectory "$PSScriptRoot"

# Start Aptitude App
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Aptitude; streamlit run AptiApp.py --server.port 8501" -WorkingDirectory "$PSScriptRoot"

# Start Aptitude Dashboard
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Aptitude; streamlit run InteractiveDashboard.py --server.port 8505" -WorkingDirectory "$PSScriptRoot"

# Start DSA App
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd CodingPract; streamlit run DSA_app_db.py --server.port 8502" -WorkingDirectory "$PSScriptRoot"

# Start DSA Dashboard
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd CodingPract; streamlit run DSA_dash.py --server.port 8506" -WorkingDirectory "$PSScriptRoot"

# Start Mock Interview App
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd MockInter; streamlit run app.py --server.port 8503" -WorkingDirectory "$PSScriptRoot"

# Start Resume ATS App
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ResumeATS; streamlit run app.py --server.port 8504" -WorkingDirectory "$PSScriptRoot"

Write-Host "All components started! Frontend is running at http://localhost:5173"
