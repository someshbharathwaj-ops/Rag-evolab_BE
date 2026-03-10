# 🚀 COMPLETE DEPLOYMENT GUIDE
## Local Ollama + Railway Backend + Vercel Frontend

---

## 📋 What You Have Now

### ✅ Prepared Files:

**Backend (`/backend`):**
- ✅ `api.py` - FastAPI application with CORS
- ✅ `requirements.txt` - All dependencies
- ✅ `Procfile` - Railway deployment config
- ✅ `.env.example` - Environment template
- ✅ `README.md` - Backend documentation
- ✅ `rag/llm_client.py` - Multi-backend LLM support

**Frontend (`/frontend`):**
- ✅ Next.js application
- ✅ Configured for Vercel deployment
- ✅ API routes to connect to backend

**Deployment Scripts:**
- ✅ `push-backend-to-github.ps1` - Automated push script
- ✅ `start-ollama-ngrok.ps1` - Ollama + Ngrok setup
- ✅ Complete documentation files

---

## 🎯 Step-by-Step Deployment

### PHASE 1: Start Local Ollama (5 minutes)

#### Option A: Automated Script (Recommended)

```powershell
# From project root directory
.\start-ollama-ngrok.ps1
```

This will:
1. Check if Ollama is installed
2. Check if ngrok is installed
3. Start Ollama server
4. Create ngrok tunnel
5. Display your public URL

#### Option B: Manual Setup

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Create ngrok tunnel
ngrok http 11434
```

**Copy the ngrok URL** shown (e.g., `https://abc123.ngrok.io`)

✅ **Test Ollama:**
```bash
curl http://localhost:11434/api/tags
```

Should return list of models.

---

### PHASE 2: Push Backend to GitHub (5 minutes)

#### Option A: Automated Script (Recommended)

```powershell
# From project root directory
.\push-backend-to-github.ps1
```

This will:
1. Configure Git with your email
2. Initialize git repository (if needed)
3. Add remote origin
4. Create .gitignore
5. Stage all files
6. Commit changes
7. Push to GitHub

⚠️ **If authentication fails:**
- Use GitHub Personal Access Token
- Or clone repository fresh and copy files

#### Option B: Manual Commands

```bash
# Navigate to backend folder
cd backend

# Configure Git (first time only)
git config --global user.name "Akhil Senthil"
git config --global user.email "akhilsenthil696@gmail.com"

# Initialize git
git init

# Add remote repository
git remote add origin https://github.com/someshbharathwaj-ops/Rag-evolab_BE.git

# Add all files
git add .

# Commit
git commit -m "Initial backend deployment"

# Rename branch
git branch -M main

# Push to GitHub
git push -u origin main
```

✅ **Verify on GitHub:**
Visit: https://github.com/someshbharathwaj-ops/Rag-evolab_BE

Your code should be there!

---

### PHASE 3: Deploy Backend on Railway (10 minutes)

#### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" → "Sign in with GitHub"
3. Authorize Railway

#### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Find and select `Rag-evolab_BE` repository
4. Railway will start building...

#### Step 3: Configure Railway

**Before deployment completes, configure:**

1. Click on your project
2. Go to **"Variables"** tab
3. Click **"New Variable"**

Add these variables:

```bash
# 1. OLLAMA_HOST (CRITICAL -use YOUR ngrok URL!)
OLLAMA_HOST = https://abc123.ngrok.io
(Replace with your actual ngrok URL from Phase 1)

# 2. MODEL_NAME
MODEL_NAME = phi3:mini

# 3. WEAVIATE_URL
WEAVIATE_URL = bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud

# 4. WEAVIATE_API_KEY
WEAVIATE_API_KEY = VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

⚠️ **IMPORTANT:**Replace `https://abc123.ngrok.io` with YOUR actual ngrok URL!

#### Step 4: Deploy

1. Railway automatically redeploys when you add variables
2. Watch the logs in "Deployments" tab
3. When you see "Listening on port...", it's ready!

✅ **Get your Railway URL:**
- Click "Settings" tab
- Copy the "Domains" URL (e.g., `https://your-app-production.up.railway.app`)

---

### PHASE 4: Test Backend (2 minutes)

#### Test 1: Health Check

Open browser or run:
```bash
curl https://your-railway-url.railway.app/health
```

Expected response:
```json
{"status": "healthy"}
```

#### Test 2: Query Endpoint

```bash
curl -X POST https://your-railway-url.railway.app/query\
  -H "Content-Type: application/json" \
  -d '{"query": "Hello, how are you?"}'
```

Expected: JSON response with answer

⚠️ **First request may take 10-20 seconds** - this is normal as Ollama loads the model.

✅ **If you get a response, backend is working!**

---

### PHASE 5: Deploy Frontend to Vercel (5 minutes)

#### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

#### Step 2: Deploy Frontend

```powershell
# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
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
Value: https://your-railway-url.railway.app
(Use your actual Railway URL)
Environments: ✅ Production, ✅ Preview, ✅ Development
```

5. Save
6. Click "Redeploy"

✅ **Frontend is now connected to backend!**

---

### PHASE 6: Test Everything (2 minutes)

#### Test Full Integration

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

1. **Update Railway manually each time:**
   - Go to Railway dashboard
   - Edit `OLLAMA_HOST` variable
   - Enter new ngrok URL
   - Railway auto-redeploys

2. **Use ngrok paid plan** (~$8/month)
   - Get stable tunnels
   - Reserved domains

3. **Better alternative: Cloudflare Tunnel**
   - Free
   - Stable URLs
   - More reliable

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

Railway will automatically redeploy!

### Update Ollama Host URL

If ngrok URL changes:

1. Get new ngrok URL from ngrok window
2. Go to Railway dashboard
3. Edit `OLLAMA_HOST` variable
4. Paste new URL
5. Railway auto-redeploys

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
| **Railway Backend** | FREE* | 750 hours/month |
| **Ollama (Local)** | FREE | Your computer |
| **Ngrok** | FREE | With limitations |
| **Weaviate Cloud** | Your existing | Already running |

**Total: $0.00/month** 🎉

*One service can run 24/7 on free tier

---

## 🐛 Troubleshooting

### ❌ Backend returns "Ollama error"

**Check:**
1. Ollama is running locally
2. Ngrok tunnel is active
3. `OLLAMA_HOST` in Railway matches ngrok URL exactly
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
4. CORS is enabled (already configured in `api.py`)

### ❌ Railway build failed

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
2. Generate token with `repo` scope
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
GitHub Repo:    https://github.com/someshbharathwaj-ops/Rag-evolab_BE
Railway App:    https://______________________.railway.app
Vercel Frontend: https://______________________.vercel.app
Ngrok URL:      https://______________________.ngrok.io
```

### Environment Variables:

**Railway:**
```bash
OLLAMA_HOST=https://your-ngrok-url.ngrok.io
MODEL_NAME=phi3:mini
WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

**Vercel:**
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.railway.app
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
- [ ] Backend pushed to GitHub
- [ ] Railway deployed from GitHub
- [ ] All 4 environment variables set in Railway
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
- `PUSH_READY_BACKEND.md` - Detailed backend guide
- `OLLAMA_HOSTING_GUIDE.md` - Ollama hosting options
- `FREE_DEPLOYMENT_GUIDE.md` - Alternative free setups
- `BACKEND/README.md` - Backend-specific docs

### External Resources:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Ollama Docs: https://ollama.com/help
- Ngrok Docs: https://ngrok.com/docs

### GitHub Repository:
https://github.com/someshbharathwaj-ops/Rag-evolab_BE

---

## 🎯 Next Steps After Deployment

### 1. Monitor Usage
- Railway dashboard: View logs and resource usage
- Vercel dashboard: Analytics and function invocations
- Ollama: Monitor model performance

### 2. Optimize Performance
- Use faster models if needed
- Adjust temperature and max_tokens
- Enable caching for common queries

### 3. Scale When Needed
- Upgrade Railway if hitting limits
- Consider GPU VPS for production
- Implement rate limiting

### 4. Improve Security
- Restrict CORS to specific domains
- Add authentication
- Implement API key validation

---

**🚀 You're all set! Your RAG-EvoLab is now live and accessible worldwide!**

**Architecture:**
- ✅ Vercel CDN (Global frontend delivery)
- ✅ Railway (Backend API)
- ✅ Your Local Ollama (LLM inference via ngrok)
- ✅ Weaviate Cloud (Vector database)

**Enjoy your deployed RAG application!** 🎉
