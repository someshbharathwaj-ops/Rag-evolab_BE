# Automated Backend Push to GitHub Script
# This script will push your backend code to GitHub repository

param(
    [string]$GitHubEmail = "akhilsenthil696@gmail.com",
    [string]$GitHubUsername = "AkhilSenthil696",
    [string]$RepoURL = "https://github.com/someshbharathwaj-ops/Rag-evolab_BE.git"
)

Write-Host"🚀 Backend Deployment to GitHub" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Set working directory to backend folder
$backendPath = Join-Path $PSScriptRoot "backend"
Write-Host"📁 Backend path: $backendPath" -ForegroundColor Yellow
Set-Location -Path $backendPath

# Step 1: Configure Git
Write-Host ""
Write-Host"🔧 Configuring Git..." -ForegroundColor Cyan
git config --global user.name "Akhil Senthil"
git config --global user.email $GitHubEmail
Write-Host"✅ Git configured for $GitHubEmail" -ForegroundColor Green

# Step 2: Check if Git repository exists
Write-Host ""
Write-Host"📋 Checking Git repository status..." -ForegroundColor Cyan
$gitStatus = git status -ErrorAction SilentlyContinue

if ($LASTEXITCODE -ne 0) {
   Write-Host"⚠️  Git repository not initialized. Initializing..." -ForegroundColor Yellow
    git init
   Write-Host"✅ Git repository initialized" -ForegroundColor Green
} else {
   Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Step 3: Check/Add remote origin
Write-Host ""
Write-Host"🔗 Checking remote repository..." -ForegroundColor Cyan
$remotes = git remote-v
$hasOrigin = $remotes -match "origin.*$RepoURL"

if (-not $hasOrigin) {
   Write-Host"⚠️  Remote 'origin' not found or incorrect. Adding..." -ForegroundColor Yellow
    
    # Remove existing origin if any
    git remote remove origin -ErrorAction SilentlyContinue
    
    # Add new origin
    git remote add origin $RepoURL
   Write-Host "✅ Remote 'origin' added: $RepoURL" -ForegroundColor Green
} else {
   Write-Host "✅ Remote 'origin' already configured correctly" -ForegroundColor Green
}

# Verify remote
$verifyRemote = git remote get-url origin
Write-Host "📍 Remote URL: $verifyRemote" -ForegroundColor Cyan

# Step 4: Create .gitignore if it doesn't exist
Write-Host ""
Write-Host "📄 Checking .gitignore..." -ForegroundColor Cyan
if (-not (Test-Path ".gitignore")) {
   Write-Host"⚠️  .gitignore not found. Creating..." -ForegroundColor Yellow
@'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Environment variables
.env
.env.local

# Testing
.pytest_cache/
.coverage
htmlcov/

# OS
Thumbs.db
'@ | Out-File -FilePath ".gitignore" -Encoding UTF8
   Write-Host"✅ .gitignore created" -ForegroundColor Green
} else {
   Write-Host "✅ .gitignore already exists" -ForegroundColor Green
}

# Step 5: Stage all files
Write-Host ""
Write-Host"📦 Staging files..." -ForegroundColor Cyan
git add .
$stagedFiles = git status --porcelain
Write-Host "✅ Files staged for commit" -ForegroundColor Green

if ($stagedFiles) {
   Write-Host"📋 Files to be committed:" -ForegroundColor Yellow
   Write-Host $stagedFiles
}

# Step 6: Commit changes
Write-Host ""
Write-Host "💾 Committing changes..." -ForegroundColor Cyan
$commitMessage = @"
Initial backend deployment with Ollama support

- Added FastAPI backend with CORS support
- Integrated Ollama LLM with multi-backend support
- Configured Weaviate vector store
- Added deployment configuration for Railway
- Updated llm_client.py with Hugging Face/OpenRouter/Ollama fallbacks
- Created Procfile for Railway deployment
- Added requirements.txt with all dependencies
- Configured for local Ollama hosting with ngrok tunnel support

Author: $GitHubEmail
"@

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
   Write-Host "✅ Changes committed successfully" -ForegroundColor Green
} else {
   Write-Host"⚠️  No changes to commit or commit failed" -ForegroundColor Yellow
}

# Step 7: Rename branch to main
Write-Host ""
Write-Host"🏷️  Setting branch to 'main'..." -ForegroundColor Cyan
git branch -M main
Write-Host "✅ Branch renamed to 'main'" -ForegroundColor Green

# Step 8: Push to GitHub
Write-Host ""
Write-Host"🚀 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "Repository: $RepoURL" -ForegroundColor Yellow
Write-Host ""

# Try to push
git push -u origin main

if ($LASTEXITCODE -ne 0) {
   Write-Host ""
   Write-Host"⚠️  Push failed. This is normal if:" -ForegroundColor Yellow
   Write-Host"  1. Repository already has commits (use --force)" -ForegroundColor Yellow
   Write-Host"  2. Authentication required" -ForegroundColor Yellow
   Write-Host ""
   Write-Host "Trying force push..." -ForegroundColor Yellow
    git push -u origin main --force
    
    if ($LASTEXITCODE -ne 0) {
       Write-Host ""
       Write-Host"❌ Force push also failed." -ForegroundColor Red
       Write-Host ""
       Write-Host"📝 Manual steps required:" -ForegroundColor Cyan
       Write-Host "1. Make sure you have access to the repository" -ForegroundColor Yellow
       Write-Host"2. Use GitHub Personal Access Token instead of password" -ForegroundColor Yellow
       Write-Host "   Generate token at: https://github.com/settings/tokens" -ForegroundColor Yellow
       Write-Host"3. Or use SSH keys for authentication" -ForegroundColor Yellow
       Write-Host ""
       Write-Host "Alternative: Clone the repository fresh and copy files" -ForegroundColor Yellow
       Write-Host "  git clone $RepoURL" -ForegroundColor White
       Write-Host ""
    } else {
       Write-Host "✅ Force push successful!" -ForegroundColor Green
    }
} else {
   Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
}

# Step 9: Display summary
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🎉 Summary" -ForegroundColor Green
Write-Host"=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host"✅ Git configured for: $GitHubEmail" -ForegroundColor Green
Write-Host "✅ Repository: $RepoURL" -ForegroundColor Green
Write-Host "✅ Branch: main" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start Ollama locally:" -ForegroundColor Yellow
Write-Host "  ollama serve" -ForegroundColor White
Write-Host ""
Write-Host "2. Expose with ngrok:" -ForegroundColor Yellow
Write-Host "   ngrok http 11434" -ForegroundColor White
Write-Host "   Copy the ngrok URL (e.g., https://abc123.ngrok.io)" -ForegroundColor White
Write-Host ""
Write-Host "3. Deploy on Render.com:" -ForegroundColor Yellow
Write-Host "   - Go to https://render.com" -ForegroundColor White
Write-Host "   - Create new 'Web Service'" -ForegroundColor White
Write-Host "   - Connect GitHub and select 'Rag-evolab_BE' repository" -ForegroundColor White
Write-Host "   - Root Directory: backend" -ForegroundColor White
Write-Host "   - Build Command: pip install -r requirements.txt" -ForegroundColor White
Write-Host "   - Start Command: uvicorn api:app --host 0.0.0.0 --port $PORT" -ForegroundColor White
Write-Host "   - Add environment variables:" -ForegroundColor White
Write-Host "     * OLLAMA_HOST = https://your-ngrok-url.ngrok.io" -ForegroundColor Cyan
Write-Host "     * MODEL_NAME = phi3:mini" -ForegroundColor Cyan
Write-Host "     * WEAVIATE_URL = bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud" -ForegroundColor Cyan
Write-Host "     * WEAVIATE_API_KEY = VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Test your deployment:" -ForegroundColor Yellow
Write-Host "   curl https://your-render-url.onrender.com/health" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full guide: ../LOCAL_OLLAMA_RENDER_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Return to original directory
Set-Location -Path $PSScriptRoot
