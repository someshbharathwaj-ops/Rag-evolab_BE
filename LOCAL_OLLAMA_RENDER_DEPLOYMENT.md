# 🚀 Local Ollama + Render.com Backend Deployment Guide

## ✅ Your Deployment Stack

```
Your Computer (Ollama) → Ngrok Tunnel → Render.com (Backend) → Vercel (Frontend)
                              ↓
                      Weaviate Cloud (Vector DB)
```

**Total Cost: $0.00/month** 🎉

---

## 📋 Prerequisites

- [ ] Ollama installed on your computer
- [ ] ngrok installed
- [ ] Render.com account (free)
- [ ] GitHub account
- [ ] Your computer stays on for backend to work

---

## 🎯 Step-by-Step Deployment

### PHASE 1: Start Local Ollama with Ngrok (5 minutes)

#### Run the Automated Script:

```powershell
# From project root directory
.\start-ollama-ngrok.ps1
```

This will:
1. Check if Ollama is installed
2. Check if ngrok is installed  
3. Start Ollama server automatically
4. Create ngrok tunnel to expose port 11434
5. Display your public ngrok URL

#### **IMPORTANT: Copy the ngrok URL!**

The script will show something like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:11434
```

✅ **Copy this URL** - you'll need it for Render!

⚠️ **Keep this window open!**Your computer must stay on.

---

### PHASE 2: Push Backend to GitHub (5 minutes)

#### Run the Automated Push Script:

```powershell
# From project root directory
.\push-backend-to-github.ps1
```

This will:
1. Configure Git with your email (`akhilsenthil696@gmail.com`)
2. Initialize git repository in backend folder
3. Add remote origin to your GitHub repo
4. Stage all files
5. Commit with professional message
6. Push to GitHub main branch

⚠️ **If authentication fails:**
- Use GitHub Personal Access Token instead of password
- Generate at: https://github.com/settings/tokens
- Or use SSH keys

#### Manual Alternative:

```bash
cd backend

# Configure Git (first time)
git config --global user.name "Akhil Senthil"
git config --global user.email "akhilsenthil696@gmail.com"

# Initialize and push
git init
git remote add origin https://github.com/someshbharathwaj-ops/Rag-evolab_BE.git
git add .
git commit -m "Initial backend deployment with Ollama support"
git branch -M main
git push -u origin main
```

✅ **Verify:** Check your code is on GitHub!

---

### PHASE 3: Deploy Backend to Render.com (10 minutes)

#### Step 1: Sign Up for Render

1. Go to https://render.com/register
2. Sign up with GitHub (easiest) or email
3. Complete registration

#### Step 2: Create New Web Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. Choose your account type (Personal)

#### Step 3: Connect GitHub Repository

1. Click **"Connect a repository"**
2. Authorize Render to access GitHub
3. Find and select `Rag-evolab_BE` repository
4. Click **"Connect"**

#### Step 4: Configure Settings

Fill in these settings carefully:

```
Name: rag-evolab-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn api:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

#### Step 5: Add Environment Variables ⚠️ CRITICAL

Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

```bash
# 1. OLLAMA_HOST (USE YOUR NGROK URL!)
OLLAMA_HOST = https://abc123.ngrok.io
(Replace with YOUR actual ngrok URL from Phase 1)

# 2. MODEL_NAME
MODEL_NAME = phi3:mini

# 3. WEAVIATE_URL
WEAVIATE_URL = bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud

# 4. WEAVIATE_API_KEY
WEAVIATE_API_KEY = VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

⚠️ **CRITICAL:**Replace `https://abc123.ngrok.io` with YOUR actual ngrok URL!

#### Step 6: Create and Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Watch the logs in real-time
4. When you see "Listening on port...", it's ready!

✅ **Copy your Render URL** (e.g., `https://rag-evolab-backend-xyz.onrender.com`)

---

### PHASE 4: Test Backend (2 minutes)

#### Test 1: Health Check

Open browser and visit:
```
https://your-render-url.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

⚠️ **First load may take 30-50 seconds** - Render free tier spins down after inactivity. This is normal!

#### Test 2: Query Endpoint

```bash
curl -X POST https://your-render-url.onrender.com/query\
  -H "Content-Type: application/json" \
  -d '{"query": "Hello, how are you?"}'
```

Expected: JSON response with an answer

⚠️ **First request may take 10-20 seconds** - Ollama loads the model.

✅ **If you get a response, backend is working!**

---

### PHASE 5: Deploy Frontend to Vercel (5 minutes)

#### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

#### Step 2: Deploy Frontend

```powershell
cd frontend
vercel login
vercel --prod
```

Vercel will give you a URL like: `https://your-app.vercel.app`

#### Step 3: Configure Backend URL

**In Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Click your project
3. Settings → Environment Variables
4. Add new variable:

```bash
Name: NEXT_PUBLIC_BACKEND_URL
Value: https://your-render-url.onrender.com
Environments: ✅ Production, ✅ Preview, ✅ Development
```

5. Save
6. Click "Redeploy"

✅ **Frontend is now live!**

---

### PHASE 6: Test Full Integration (2 minutes)

1. Open your Vercel URL in browser
2. Type a question in the chat
3. Press Enter
4. Wait for response (may take 10-20 seconds)

✅ **If you get an answer, congratulations! Everything works!** 🎉

---

## ⚠️ Important Notes

### Ngrok URL Changes

**Problem:** Ngrok URLs change every time you restart ngrok.

**Solutions:**

1. **Update Render manually each time:**
   - Go to Render dashboard
   - Click your service
   - Go to "Environment" tab
   - Edit `OLLAMA_HOST` variable
   - Enter new ngrok URL
   - Click "Save Changes"
   - Render auto-redeploys

2. **Use ngrok paid plan** (~$8/month)
   - Get stable tunnels
   - Reserved domains
   - No URL changes

3. **Better alternative: Cloudflare Tunnel**
   - Free
   - Stable URLs
   - More reliable than ngrok

4. **Best for production: GPU VPS**
   - RunPod, Vast.ai
   - Permanent endpoint
   - ~$150/month

---

## 🔧 Updating Your Deployment

### Update Backend Code

```bash
# Make changes to backend code
cd backend

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

Render will automatically redeploy!

### Update Ollama Host URL (When ngrok Changes)

If ngrok URL changes:

1. Get new ngrok URL from ngrok window
2. Go to Render dashboard
3. Click your service
4. Go to "Environment" tab
5. Edit `OLLAMA_HOST` variable
6. Paste new URL
7. Click "Save Changes"
8. Render auto-redeploys!

### Update Frontend Code

```bash
# Make changes to frontend code
cd frontend

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically redeploy!

---

## 💰 Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| **Vercel Frontend** | FREE | Hobby plan |
| **Render Backend** | FREE* | 750 hours/month |
| **Ollama (Local)** | FREE | Your computer |
| **Ngrok** | FREE | With limitations |
| **Weaviate Cloud** | Your existing | Already running |

**Total: $0.00/month** 🎉

*One service can run 24/7 on free tier

---

## 🐛 Troubleshooting

### ❌ Backend returns "Ollama error" or connection refused

**Check:**
1. Ollama is running locally: `ollama list`
2. Ngrok tunnel is active
3. `OLLAMA_HOST` in Render matches ngrok URL exactly
4. Model exists: `ollama pull phi3:mini`

**Test ngrok:**
```bash
curl https://your-ngrok-url.ngrok.io/api/tags
```

Should return models list.

### ❌ Frontend shows "Error processing query"

**Check:**
1. Backend is responding (test health endpoint)
2. `NEXT_PUBLIC_BACKEND_URL` is correct in Vercel
3. Browser console (F12) for errors
4. CORS is enabled (already configured in`api.py`)

### ❌ Render build failed

**Check:**
1. `requirements.txt` exists in backend folder
2. Procfile is correct
3. Build logs show specific error

**Fix:**
```bash
# Verify requirements.txt
cat backend/requirements.txt

# If missing, regenerate:
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
git push origin main
```

### ❌ Git push failed - Authentication error

**Solution 1: Use Personal Access Token**

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate token with`repo` scope
3. Use token as password when pushing

**Solution 2: Use SSH**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "akhilsenthil696@gmail.com"

# Add to GitHub: Settings → SSH and GPG keys
# Then change remote:
git remote set-url origin git@github.com:someshbharathwaj-ops/Rag-evolab_BE.git

# Push
git push -u origin main
```

---

## 📊 Quick Reference

### Your URLs:

```
GitHub Repo:   https://github.com/someshbharathwaj-ops/Rag-evolab_BE
Render Backend: https://______________________.onrender.com
Vercel Frontend: https://______________________.vercel.app
Ngrok URL:     https://______________________.ngrok.io
```

### Environment Variables:

**Render:**
```bash
OLLAMA_HOST=https://your-ngrok-url.ngrok.io
MODEL_NAME=phi3:mini
WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

**Vercel:**
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-render-url.onrender.com
```

### Important Commands:

```bash
# Start Ollama + Ngrok
.\start-ollama-ngrok.ps1

# Push backend to GitHub
.\push-backend-to-github.ps1

# Test backend locally
cd backend
python api.py

# Deploy frontend
cd frontend
vercel --prod
```

---

## ✅ Success Checklist

- [ ] Ollama running locally on port 11434
- [ ] Ngrok tunnel active with URL copied
- [ ] Backend pushed to GitHub successfully
- [ ] Render deployed from GitHub
- [ ] All 4 environment variables set in Render
- [ ] Backend health check passes
- [ ] Backend query endpoint works
- [ ] Frontend deployed to Vercel
- [ ] `NEXT_PUBLIC_BACKEND_URL` set in Vercel
- [ ] Can submit query from frontend
- [ ] Receive meaningful responses
- [ ] No console errors in browser

**All checked? 🎊 Congratulations! Your RAG-EvoLab is LIVE!**

---

## 🆘 Need Help?

### Documentation Files:
- `COMPLETE_DEPLOYMENT_STEPS.md` - Full step-by-step guide
- `PUSH_READY_BACKEND.md` - Detailed backend guide
- `OLLAMA_HOSTING_GUIDE.md` - Ollama hosting options
- `backend/README.md` - Backend-specific docs

### External Resources:
- Render Docs: https://docs.render.com
- Vercel Docs: https://vercel.com/docs
- Ollama Docs: https://ollama.com/help
- Ngrok Docs: https://ngrok.com/docs

### GitHub Repository:
https://github.com/someshbharathwaj-ops/Rag-evolab_BE

---

## 🎯 Next Steps After Deployment

### 1. Monitor Usage
- Render dashboard: View logs and resource usage
- Vercel dashboard: Analytics and function invocations
- Ollama: Monitor model performance

### 2. Optimize Performance
- Use faster models if needed
- Adjust temperature and max_tokens
- Enable caching for common queries

### 3. Scale When Needed
- Upgrade Render if hitting limits
- Consider GPU VPS for production
- Implement rate limiting

### 4. Improve Security
- Restrict CORS to specific domains
- Add authentication
- Implement API key validation

---

**🚀 You're all set! Your RAG-EvoLab is now live with:**

- ✅ Vercel CDN (Global frontend delivery)
- ✅ Render.com (Backend API - Free tier)
- ✅ Your Local Ollama (LLM inference via ngrok)
- ✅ Weaviate Cloud (Vector database)

**Enjoy your deployed RAG application!** 🎉
