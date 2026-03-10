# 🚀 Push-Ready Backend Deployment Guide

## ✅ Files Prepared for Deployment

This guide will help you push your backend to GitHub and deploy it on Railway.

---

## 📋 Pre-Deployment Checklist

### 1. Local Ollama Setup

**Start Ollama locally:**
```bash
ollama serve
```

**Verify it's running:**
```bash
curl http://localhost:11434/api/tags
```

Should return list of models.

---

### 2. Expose Ollama with Ngrok (For Railway Access)

**Option A: Manual Setup**
```bash
ngrok http 11434
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

**Option B: Use Automated Script**
```powershell
.\start-ollama-ngrok.ps1
```

---

### 3. Update Backend Environment Variables

**For LOCAL testing (development):**

Create `backend/.env` file:
```bash
OLLAMA_HOST=http://localhost:11434
MODEL_NAME=phi3:mini
WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

**For RAILWAY deployment (production):**

Railway uses environment variables from dashboard, NOT .env file.

Variables to add in Railway dashboard:
```bash
OLLAMA_HOST=https://your-ngrok-url.ngrok.io
MODEL_NAME=phi3:mini
WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

⚠️ **IMPORTANT:**Replace `your-ngrok-url.ngrok.io` with your actual ngrok URL!

---

## 🔧 Git Configuration

### Set Your Git Identity

```bash
# Configure git with your email
git config --global user.name "Akhil Senthil"
git config --global user.email "akhilsenthil696@gmail.com"

# Verify configuration
git config --list
```

---

## 📦 Prepare Backend for Push

### Step 1: Navigate to Backend Directory

```bash
cd "C:\Users\Akhil's-OMEN\Desktop\Rag-Evo frontend\RAG-evolab\backend"
```

### Step 2: Initialize Git (if not already done)

```bash
# Check if git repo exists
git status

# If not initialized, initialize it
git init
```

### Step 3: Add Remote Repository

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/someshbharathwaj-ops/Rag-evolab_BE.git

# Verify remote is added
git remote-v
```

### Step 4: Create .gitignore

Make sure `.gitignore` exists in backend folder:

```bash
# Create.gitignore if it doesn't exist
echo "# Python
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
htmlcov/" > .gitignore
```

### Step 5: Add All Files

```bash
# Stage all files
git add .

# Check what's staged
git status
```

### Step 6: Commit Changes

```bash
# Commit with message
git commit -m "Initial backend deployment with Ollama support

- Added FastAPI backend with CORS support
- Integrated Ollama LLM with Hugging Face/OpenRouter fallbacks
- Configured Weaviate vector store
- Added deployment configuration for Railway
- Updated llm_client.py with multi-backend support
- Created Procfile for Railway deployment
- Added requirements.txt with all dependencies

Configured for local Ollama hosting with ngrok tunnel support."
```

### Step 7: Push to GitHub

```bash
# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main

# If you get authentication error, use:
# git push -u origin main --force
```

⚠️ **Authentication:**You may need to:
- Use GitHub Personal Access Token instead of password
- Or use SSH keys

**To create Personal Access Token:**
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token with `repo` scope
3. Use token as password when pushing

---

## 🚀 Deploy to Railway

### Step 1: Connect Railway to GitHub

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `Rag-evolab_BE` repository

### Step 2: Configure Railway

**Settings:**
- Root Directory: `.` (leave blank or put `/`)
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`

### Step 3: Add Environment Variables

In Railway dashboard, click "Variables" tab and add:

```bash
OLLAMA_HOST=https://your-actual-ngrok-url.ngrok.io
MODEL_NAME=phi3:mini
WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

⚠️ **CRITICAL:**Replace with YOUR actual ngrok URL!

### Step 4: Deploy

Click "Deploy" and watch the logs.

---

## 🧪 Testing

### Test Locally

```bash
# In backend directory
python api.py

# Test in another terminal
curl http://localhost:8000/health
curl -X POST http://localhost:8000/query\
  -H "Content-Type: application/json" \
  -d '{"query": "Hello!"}'
```

### Test Railway Deployment

```bash
# Replace with your actual Railway URL
curl https://your-railway-app.railway.app/health
curl -X POST https://your-railway-app.railway.app/query\
  -H "Content-Type: application/json" \
  -d '{"query": "Hello!"}'
```

---

## ⚠️ Important Notes

### Ngrok URL Changes

**Problem:** Ngrok URLs change every time you restart ngrok.

**Solutions:**

1. **Use ngrok paid plan** - Get stable tunnels
2. **Update Railway env vars manually** each time ngrok restarts
3. **Use alternative:** Cloudflare Tunnel (free, stable URLs)
4. **Best option:**Deploy Ollama on GPU VPS (RunPod, Vast.ai)

### To Update Railway Environment Variables:

1. Go to Railway dashboard
2. Click your project
3. Go to "Variables" tab
4. Edit `OLLAMA_HOST` with new ngrok URL
5. Railway auto-redeploys

---

## 🔄 Updating After Changes

### Make Changes Locally

```bash
# Edit your code
# Then:
git add .
git commit -m "Description of changes"
git push origin main
```

Railway will automatically redeploy from GitHub!

---

## 🐛 Troubleshooting

### ❌ Git Push Failed - Authentication Error

**Solution 1: Use Personal Access Token**
```bash
# When prompted for password, use your GitHub Personal Access Token
git push -u origin main
```

**Solution 2: Use SSH**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "akhilsenthil696@gmail.com"

# Add to GitHub: Settings → SSH and GPG keys
# Then change remote URL:
git remote set-url origin git@github.com:someshbharathwaj-ops/Rag-evolab_BE.git

# Push
git push -u origin main
```

### ❌ Railway Build Failed

**Check:**
1. `requirements.txt` is in backend folder
2. All dependencies are listed
3. Build logs show specific error

**Fix:**
```bash
# Verify requirements.txt exists
cat requirements.txt

# If missing, regenerate:
pip freeze > requirements.txt

# Commit and push
git add requirements.txt
git commit -m "Update requirements.txt"
git push origin main
```

### ❌ Backend Can't Connect to Ollama

**Check:**
1. Ollama is running: `ollama list`
2. Ngrok tunnel is active
3. `OLLAMA_HOST` in Railway matches ngrok URL
4. Model exists: `ollama pull phi3:mini`

**Test ngrok tunnel:**
```bash
# Should return JSON with models
curl https://your-ngrok-url.ngrok.io/api/tags
```

---

## 📊 File Structure

Your backend should have this structure:

```
backend/
│
├── api.py                    # FastAPI application ✅
├── requirements.txt          # Dependencies ✅
├── Procfile                 # Railway start command ✅
├── .env.example             # Environment template ✅
├── .gitignore               # Git ignore rules ✅
│
├── rag/
│   ├── llm_client.py        # Multi-backend LLM ✅
│   ├── prompts.py           # Prompt templates
│   └── rag_pipeline.py      # RAG logic
│
├── ingestion/
│   ├── pipeline.py          # Document processing
│   ├── loaders/
│   └── splitters/
│
└── vectorstores/
    ├── weaviate_store.py    # Vector DB integration ✅
    └── retriever.py         # Retrieval logic
```

---

## ✅ Quick Commands Summary

```bash
# 1. Configure Git
git config --global user.name "Akhil Senthil"
git config --global user.email "akhilsenthil696@gmail.com"

# 2. Prepare backend
cd backend
git init
git remote add origin https://github.com/someshbharathwaj-ops/Rag-evolab_BE.git
git add .
git commit -m "Initial deployment"
git branch -M main
git push -u origin main

# 3. Start Ollama locally
ollama serve

# 4. Expose with ngrok
ngrok http 11434

# 5. Update Railway with ngrok URL
# (Do this in Railway dashboard)

# 6. Deploy on Railway
# (Connect GitHub repo and deploy)
```

---

## 🎉 Success Checklist

- [ ] Ollama running locally on port 11434
- [ ] Ngrok tunnel active
- [ ] Ngrok URL copied
- [ ] Backend `.env` file created (for local testing)
- [ ] Git configured with your email
- [ ] Backend pushed to GitHub
- [ ] Railway connected to GitHub repo
- [ ] Environment variables set in Railway:
  - [ ] `OLLAMA_HOST` = your ngrok URL
  - [ ] `MODEL_NAME` = phi3:mini
  - [ ] `WEAVIATE_URL` = ...
  - [ ] `WEAVIATE_API_KEY` = ...
- [ ] Railway deployment successful
- [ ] Health check passes
- [ ] Query endpoint works

---

## 🆘 Need Help?

### GitHub Repository:
https://github.com/someshbharathwaj-ops/Rag-evolab_BE.git

### Railway Dashboard:
https://railway.app

### Ollama Docs:
https://ollama.com/help

---

**🚀 You're ready to deploy!**

Follow the steps above and your backend will be live on Railway with local Ollama access!
