# ✅ Complete Deployment Guide: Vercel + Railway + OpenRouter

## 🎯 Your Deployment Stack

```
┌─────────────────┐
│   Vercel CDN    │  Frontend (Next.js)
│  your-app.vercel.app
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│ Railway Server  │  Backend (FastAPI)
│ your-app.railway.app
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Weaviate Cloud + OpenRouter │
│ Vector DB + LLM API         │
└─────────────────────────────┘
```

---

## 🚀 Step-by-Step Deployment

### PART 1: Deploy Backend to Railway

#### Step 1.1: Push Code to GitHub

```bash
git add .
git commit -m "Add OpenRouter support and deployment config"
git push origin main
```

#### Step 1.2: Deploy on Railway

1. **Go to** https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `RAG-evolab` repository
5. **Important:**Set Root Directory to `backend`
6. Click **"Deploy"**

#### Step 1.3: Add Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```bash
# OpenRouter Configuration (GET YOUR KEY FIRST!)
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here

# Model Selection
MODEL_NAME=meta-llama/llama-3-8b-instruct

# Weaviate Configuration
WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

**Get OpenRouter Key:**
1. Visit https://openrouter.ai/keys
2. Sign up/Login
3. Create key
4. Copy it (starts with `sk-or-v1-...`)
5. Add $1-5 credits for testing

Railway will automatically redeploy when you save variables.

#### Step 1.4: Get Your Railway URL

After deployment completes:
- Go to Railway dashboard
- Click on your project
- Copy the URL (e.g., `https://your-app-production.up.railway.app`)

**Save this URL - you'll need it for Vercel!**

---

### PART 2: Deploy Frontend to Vercel

#### Step 2.1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2.2: Deploy to Vercel

```bash
cd RAG-evolab/frontend
vercel login
vercel --prod
```

Vercel will give you a URL like: `https://your-app.vercel.app`

#### Step 2.3: Configure Backend URL in Vercel

**Method A: Using Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New Variable"**
5. Add:
   - Name: `NEXT_PUBLIC_BACKEND_URL`
   - Value: `https://your-railway-url.railway.app` (from Part 1)
   - Environments: ✅ Production, ✅ Preview, ✅ Development
6. Click **Save**
7. Redeploy: Click **"Redeploy"** or run `vercel --prod` again

**Method B: Using .env.production**

Already created for you at `frontend/.env.production`:

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.railway.app
```

Just update the URL and redeploy.

---

## ✅ Testing Your Deployment

### Test 1: Backend Health Check

```bash
curl https://your-railway-url.railway.app/health
```

Expected response:
```json
{"status": "healthy"}
```

### Test 2: Backend Query API

```bash
curl -X POST https://your-railway-url.railway.app/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is RAG?"}'
```

Expected: JSON response with answer

### Test 3: Frontend Connection

1. Open your Vercel URL in browser
2. Check browser console (F12) for errors
3. Submit a test query
4. Verify you get a response

### Test 4: Full Integration

Ask a question related to your ingested documents:
- Frontend should send to backend
- Backend should query Weaviate
- OpenRouter should generate answer
- Response should display correctly

---

## 🔧 Troubleshooting

### ❌ Frontend can't connect to backend

**Check:**
1. `NEXT_PUBLIC_BACKEND_URL` is correct in Vercel
2. Backend is running (test health endpoint)
3. CORS is enabled (already configured in `api.py`)

**Fix:**
```bash
# In Vercel Dashboard
NEXT_PUBLIC_BACKEND_URL=https://correct-railway-url.railway.app
```

### ❌ Backend returns error: "OpenRouter API error"

**Check:**
1. `OPENROUTER_API_KEY` is set correctly in Railway
2. You have credits in OpenRouter account
3. Model name is valid

**Fix:**
```bash
# In Railway Variables tab
OPENROUTER_API_KEY=sk-or-v1-correct-key
MODEL_NAME=meta-llama/llama-3-8b-instruct
```

### ❌ No response from Weaviate

**Check:**
1. `WEAVIATE_URL` and `WEAVIATE_API_KEY` are correct
2. Weaviate instance is running
3. Network connectivity

**Test:**
```bash
curl -X GET https://your-weaviate-url/v1/meta
```

### ❌ Build fails on Vercel

**Fix:**
```bash
# Clear cache and force rebuild
vercel --prod --force
```

---

## 💰 Cost Breakdown

### Fixed Costs:
- **Vercel Frontend:** FREE (Hobby plan)
- **Railway Backend:** ~$5/month (minimum)
- **Weaviate Cloud:** Already running

### Variable Costs:
- **OpenRouter LLM:** ~$0.20 per 1M tokens
  - 100 queries/day ≈ $0.30/month
  - 1,000 queries/day ≈ $3.00/month

**Total Monthly Cost:**
- Testing (100 queries/day): **~$5.30/month**
- Moderate (1K queries/day): **~$8.00/month**
- Heavy (10K queries/day): **~$30/month**

---

## 📊 Monitoring & Maintenance

### Railway Dashboard:
- View logs: https://railway.app → Your Project → Logs
- Monitor uptime
- Check resource usage

### Vercel Dashboard:
- View analytics: https://vercel.com → Your Project → Analytics
- Monitor function invocations
- Check bandwidth usage

### OpenRouter Dashboard:
- Track usage: https://openrouter.ai/activity
- Monitor spending
- Set budget alerts

---

## 🎯 Optimization Tips

### 1. Reduce LLM Costs:
- Use smaller models (Phi-3 instead of Llama-3-70B)
- Reduce MAX_TOKENS in code
- Implement caching for common queries

### 2. Improve Performance:
- Enable streaming responses
- Add response compression
- Use Vercel Edge Functions

### 3. Scale Efficiently:
- Railway auto-scales, but monitor costs
- Consider reserved instances for steady workloads
- Implement request queuing for peak times

---

## 🔄 Updating Your Deployment

### Update Backend:

```bash
# Make changes to backend code
git add backend/
git commit -m "Update backend feature"
git push origin main

# Railway auto-deploys from GitHub
# Or manually trigger redeploy in Railway dashboard
```

### Update Frontend:

```bash
# Make changes to frontend code
git add frontend/
git commit -m "Update frontend feature"
git push origin main

# Vercel auto-deploys from GitHub
# Or manually: cd frontend && vercel --prod
```

---

## 📋 Environment Variables Summary

### Railway (Backend):
```bash
OPENROUTER_API_KEY=sk-or-v1-...          # Required
MODEL_NAME=meta-llama/llama-3-8b-instruct # Required
WEAVIATE_URL=...                          # Required
WEAVIATE_API_KEY=...                      # Required
OLLAMA_HOST=http://localhost:11434        # Optional (if using Ollama)
```

### Vercel (Frontend):
```bash
NEXT_PUBLIC_BACKEND_URL=https://...       # Required
```

---

## 🎉 Success Checklist

- [ ] Backend deployed to Railway
- [ ] OpenRouter API key added
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] NEXT_PUBLIC_BACKEND_URL configured
- [ ] Test query works end-to-end
- [ ] No console errors in browser
- [ ] Monitoring dashboards bookmarked
- [ ] Budget alerts configured

---

## 🆘 Need Help?

### Documentation:
- **OpenRouter Setup:** `OPENROUTER_SETUP.md`
- **Backend Guide:** `BACKEND_DEPLOYMENT_OLLAMA.md`
- **Vercel Guide:** `VERCEL_DEPLOYMENT_GUIDE.md`
- **Quick Start:** `QUICK_START.md`

### External Resources:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- OpenRouter Docs: https://openrouter.ai/docs

---

## 🚀 Quick Commands Reference

```bash
# Deploy Backend (via Git push)
git push origin main

# Deploy Frontend
cd frontend
vercel --prod

# Test Backend
curl https://your-railway-url.railway.app/health

# View Railway Logs
# Use Railway dashboard

# View Vercel Logs
vercel logs your-deployment-url
```

---

**🎊 Congratulations! Your RAG-EvoLab is now live!**

**Architecture:**
- ✅ Vercel (Frontend) - Global CDN
- ✅ Railway (Backend) - Scalable API
- ✅ OpenRouter (LLM) - Zero maintenance
- ✅ Weaviate (Vector DB) - Persistent storage

**You're ready to serve users worldwide!** 🌍🚀
