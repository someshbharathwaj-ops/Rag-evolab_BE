# ⚡ FREE Deployment - Quick Start (10 Minutes)

## Your 100% FREE Stack

- ✅ **Vercel** - Frontend hosting (FREE forever)
- ✅ **Render.com** - Backend hosting (750 hours/month FREE)
- ✅ **Hugging Face** - LLM API (FREE tier)
- ✅ **Weaviate Cloud** - Vector DB (your existing setup)

**Total Cost: $0.00/month** 🎉

---

## 🚀 Step-by-Step Guide

### Step 1: Get Hugging Face Token (2 minutes)

1. **Sign up:** https://huggingface.co/join
2. **Get token:** https://huggingface.co/settings/tokens
3. Click "New token" → Name: "RAG-EvoLab" → Type: Read
4. **Copy the token** (starts with`hf_...`)

✅ **Done!** No credit card needed.

---

### Step 2: Deploy Backend to Render.com (5 minutes)

#### A. Sign Up for Render
1. Go to https://render.com/register
2. Sign up with GitHub (easiest) or email
3. Complete registration

#### B. Create Web Service
1. Click **"New +"** → Select **"Web Service"**
2. Choose your account type (Personal)
3. Click **"Connect a repository"**

#### C. Connect GitHub Repo
1. Authorize Render to access GitHub
2. Find and select your `RAG-evolab` repository
3. Click **"Connect"**

#### D. Configure Settings

Fill in these settings:

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

#### E. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

```bash
# 1. Hugging Face Token (REQUIRED)
HUGGING_FACE_TOKEN = hf_your-actual-token-here

# 2. Model Name
MODEL_NAME = google/flan-t5-base

# 3. Weaviate URL
WEAVIATE_URL = bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud

# 4. Weaviate API Key
WEAVIATE_API_KEY = VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

⚠️ **Replace `hf_your-actual-token-here` with your real Hugging Face token!**

#### F. Create and Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Watch logs - when you see "Listening on port...", it's ready!
4. **Copy your Render URL** (e.g., `https://rag-evolab-backend-xyz.onrender.com`)

✅ **Backend is LIVE!**

---

### Step 3: Deploy Frontend to Vercel (3 minutes)

#### A. Open PowerShell
Navigate to your project:

```powershell
cd "C:\Users\Akhil's-OMEN\Desktop\Rag-Evo frontend\RAG-evolab\frontend"
```

#### B. Install Vercel CLI
```powershell
npm install -g vercel
```

#### C. Deploy
```powershell
vercel login
vercel --prod
```

Follow the prompts:
- Login with GitHub
- Link to existing project or create new
- Accept defaults

Vercel will give you a URL like: `https://your-app.vercel.app`

✅ **Frontend is LIVE!**

---

### Step 4: Connect Frontend to Backend (2 minutes)

#### A. Update Environment Variable in Vercel

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Click **"Add New Variable"**

Add this variable:

```bash
Name: NEXT_PUBLIC_BACKEND_URL
Value: https://your-rag-app.onrender.com
(Use YOUR actual Render URL from Step 2)
Environments: ✅ Production, ✅ Preview, ✅ Development
```

5. Click **"Save"**

#### B. Redeploy Frontend

In Vercel dashboard, click **"Redeploy"** or run:

```powershell
vercel --prod
```

✅ **Everything is connected!**

---

## ✅ Test Your Deployment

### Test 1: Backend Health Check

Open browser and visit:
```
https://your-rag-app.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

⚠️ **First load may take 30-50 seconds** - Render free tier spins down after inactivity. This is normal!

### Test 2: Direct Query Test

```powershell
curl -X POST https://your-rag-app.onrender.com/query `
  -H "Content-Type: application/json" `
  -d "{\"query\": \"What is machine learning?\"}"
```

Expected: JSON response with an answer about ML.

### Test 3: Full Frontend Test

1. Open your Vercel URL in browser
2. Wait for page to load
3. Type a question in the chat
4. Press Enter
5. Wait for response (may take 10-20 seconds)

✅ **If you get an answer, congratulations! It works!** 🎉

---

## 🔧 Troubleshooting

### ❌ Error: "Hugging Face error (401)"

**Problem:** Invalid or missing Hugging Face token

**Fix:**
1. Go to Render dashboard
2. Check `HUGGING_FACE_TOKEN` environment variable
3. Make sure it starts with `hf_`
4. Redeploy in Render

### ❌ Error: "Backend timeout" or "504 Gateway Timeout"

**Problem:**Render free tier spins down after 15 minutes of inactivity

**Solution:** 
- Just wait 30-50 seconds for cold start
- It's normal for free tier
- Subsequent requests will be faster

### ❌ Frontend shows "Error processing query"

**Check:**
1. Is backend running? Visit `/health` endpoint
2. Is `NEXT_PUBLIC_BACKEND_URL` correct in Vercel?
3. Check browser console (F12) for errors

**Fix:**
- Verify backend URL in Vercel environment variables
- Redeploy frontend

### ❌ Hugging Face model loading error

**Problem:** Model is still loading on HF servers

**Solution:**
- Wait 1-2 minutes and try again
- First request to a model triggers loading
- Subsequent requests are faster

---

## 💡 Tips for FREE Tier

### Maximize Render Free Hours

You get **750 hours/month** = enough for ONE service running 24/7

**Tips:**
- Don't deploy multiple services on free tier
- Monitor usage in Render dashboard
- Delete unused services

### Speed Up Cold Starts

**Option 1: Keep Warm (Not Recommended)**
- Ping your backend every 14 minutes
- Uses more of your free hours
- Only do if really needed

**Option 2: Accept It (Recommended)**
- Just wait the 30-50 seconds
- Fine for personal/testing use
- Saves your free hours

### Best Models for FREE Tier

These work great with Hugging Face free inference:

| Model | Speed | Quality | Good For |
|-------|-------|---------|----------|
| `google/flan-t5-base` | Fast | Good | General Q&A ✅ |
| `google/flan-t5-large` | Medium | Better | Better answers |
| `mistralai/Mistral-7B-v0.1` | Medium | Excellent | High quality |

**Recommended:** Start with`google/flan-t5-base`, upgrade if quality isn't good enough.

---

## 📊 What to Expect

### Performance on FREE Tier:

| Metric | Expectation |
|--------|-------------|
| **Cold Start** | 30-50 seconds |
| **Normal Response** | 5-15 seconds |
| **Concurrent Users** | 1-3 users |
| **Monthly Queries** | ~10,000 queries |
| **Uptime** | ~95% (excluding sleep) |

**Good for:**
- ✅ Personal projects
- ✅ Learning/testing
- ✅ Demos
- ✅ Small prototypes

**Not ideal for:**
- ❌ Production apps
- ❌ Many concurrent users
- ❌ Real-time requirements

---

## 🆙 When to Upgrade

### Signs You Need Paid Plan:

1. **Too many users** (>10 daily active users)
2. **Timeout errors** happening frequently
3. **Rate limits** from Hugging Face
4. **Need faster responses**

### Upgrade Options:

| Service | Upgrade To | Cost | Benefit |
|---------|------------|------|---------|
| **Render** | Starter | $7/month | No sleep, faster |
| **Railway** | Standard | $5/month | Better performance |
| **OpenRouter** | Pay-per-use | ~$3/month | Better models |
| **VPS** | RunPod | ~$150/month | Full control |

**Recommendation:** Stay free as long as possible. Upgrade only when you hit limitations.

---

## 📋 Quick Reference

### Your URLs:

```
Frontend (Vercel):  https://______________________.vercel.app
Backend (Render):   https://______________________.onrender.com
HF Token Settings:  https://huggingface.co/settings/tokens
Vercel Dashboard:   https://vercel.com/dashboard
Render Dashboard:   https://dashboard.render.com
```

### Important Commands:

```powershell
# Deploy frontend updates
cd frontend
vercel --prod

# View Vercel logs
vercel logs your-deployment-url

# Test backend
curl https://your-render-url.onrender.com/health
```

---

## 🎉 Success Checklist

Before you're done, verify:

- [ ] Hugging Face token obtained
- [ ] Backend deployed to Render
- [ ] All 4 environment variables set in Render
- [ ] Backend health check passes (`/health`)
- [ ] Frontend deployed to Vercel
- [ ] `NEXT_PUBLIC_BACKEND_URL` set in Vercel
- [ ] Can submit query from frontend
- [ ] Receive meaningful responses
- [ ] No console errors in browser

**All checked? 🎊 Congratulations! Your 100% FREE RAG app is live!**

---

## 🆘 Need Help?

### Documentation:
- [`FREE_DEPLOYMENT_GUIDE.md`](FREE_DEPLOYMENT_GUIDE.md) - Complete guide
- [`OPENROUTER_SETUP.md`](OPENROUTER_SETUP.md) - Alternative (paid) option

### External Resources:
- Render Docs: https://docs.render.com
- Hugging Face Docs: https://huggingface.co/docs/api-inference
- Vercel Docs: https://vercel.com/docs

### Communities:
- Render Discord: https://discord.gg/render
- Hugging Face Forum: https://discuss.huggingface.co

---

**🚀 You now have a fully functional RAG application deployed for FREE!**

**No credit card • No hidden costs • 100% free tier magic!** ✨

Enjoy your RAG-EvoLab! 🎉
