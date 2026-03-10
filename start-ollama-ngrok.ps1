# Start Ollama + Ngrok Tunnel Script
# This script starts Ollama locally and exposes it via ngrok

Write-Host"🦙 Starting Ollama + Ngrok Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
try {
    $ollamaVersion= ollama --version
   Write-Host "✅ Ollama found: $ollamaVersion" -ForegroundColor Green
} catch {
   Write-Host "❌ Ollama not found!" -ForegroundColor Red
   Write-Host"Download and install from: https://ollama.com/download" -ForegroundColor Yellow
    exit 1
}

# Check if ngrok is installed
try {
    $ngrokVersion = ngrok version
   Write-Host "✅ Ngrok found: $ngrokVersion" -ForegroundColor Green
} catch {
   Write-Host "❌ Ngrok not found!" -ForegroundColor Red
   Write-Host "Installing ngrok..." -ForegroundColor Yellow
    
    try {
        # Install using winget (Windows package manager)
        winget install ngrok
       Write-Host "✅ Ngrok installed!" -ForegroundColor Green
       Write-Host "⚠️  Please restart this script or run: ngrok http 11434" -ForegroundColor Yellow
        exit 0
    } catch {
       Write-Host"❌ Failed to install ngrok automatically" -ForegroundColor Red
       Write-Host "Download from: https://ngrok.com/download" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host"📋 Checking Ollama models..." -ForegroundColor Cyan
$models = ollama list

if ($models -match "phi3") {
   Write-Host "✅ Phi3 model found" -ForegroundColor Green
} else {
   Write-Host"⚠️  Phi3 model not found. Downloading..." -ForegroundColor Yellow
   ollama pull phi3:mini
}

Write-Host ""
Write-Host"🚀 Starting Ollama server..." -ForegroundColor Green

# Start Ollama in background
$ollamaProcess = Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden -PassThru
Write-Host"✅ Ollama server started (PID: $($ollamaProcess.Id))" -ForegroundColor Green

# Wait for Ollama to start
Write-Host"⏳ Waiting for Ollama to initialize (5 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test if Ollama is responding
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
       Write-Host "✅ Ollama is running and responding!" -ForegroundColor Green
    }
} catch {
   Write-Host "⚠️  Ollama might still be starting up..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host"🌐 Starting Ngrok tunnel..." -ForegroundColor Cyan
Write-Host"This will expose Ollama to the internet" -ForegroundColor Yellow
Write-Host ""

# Start ngrok
$ngrokProcess = Start-Process "ngrok" -ArgumentList"http", "11434" -WindowStyle Normal -PassThru

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host"📊 Status:" -ForegroundColor Cyan
Write-Host"  - Ollama: Running on http://localhost:11434" -ForegroundColor Green
Write-Host "  - Ngrok: Check the ngrok window for your public URL" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. In the ngrok window, copy the 'Forwarding' URL" -ForegroundColor Yellow
Write-Host"     (looks like: https://abc123.ngrok.io)" -ForegroundColor Yellow
Write-Host ""
Write-Host"  2. Add to your Railway/Render environment variables:" -ForegroundColor Yellow
Write-Host "     OLLAMA_HOST=https://your-url.ngrok.io" -ForegroundColor White
Write-Host "     MODEL_NAME=phi3:mini" -ForegroundColor White
Write-Host ""
Write-Host"  3. Remove these variables if they exist:" -ForegroundColor Yellow
Write-Host"     HUGGING_FACE_TOKEN" -ForegroundColor White
Write-Host"     OPENROUTER_API_KEY" -ForegroundColor White
Write-Host ""
Write-Host"⚠️  IMPORTANT:" -ForegroundColor Red
Write-Host "  - Keep this window open" -ForegroundColor Yellow
Write-Host "  - Your computer must stay on" -ForegroundColor Yellow
Write-Host "  - Ngrok URL changes when you restart" -ForegroundColor Yellow
Write-Host"  - Not suitable for production use" -ForegroundColor Yellow
Write-Host ""
Write-Host "🧪 Test your setup:" -ForegroundColor Cyan
Write-Host "  curl http://localhost:11434/api/tags" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Cyan
Write-Host ""

# Wait for user to press a key
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
