# 🎯 START HERE - Simple 3-Step Guide

## ❓ Quick Answer: API Keys Needed?

### **NO! You don't need Hugging Face or OpenRouter API keys!**

Just use your **LOCAL OLLAMA** (already installed ✓)

---

## ✅ What's Already Done:

- [x] Ollama installed (version 0.17.7) ✓
- [x] Ngrok installed ✓
- [x] Backend code ready ✓
- [x] Push script ready ✓

---

## 🚀 3 Simple Steps to Deploy

### **STEP 1: Start Ollama + Ngrok** (2 minutes)

#### Terminal Window #1 - Start Ollama:
```powershell
ollama serve
```
✅ Leave this window open!

#### Terminal Window #2 - Start Ngrok:
```powershell
ngrok http 11434
```

You'll see:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:11434
```

**📋 COPY THIS URL!** (Example: `https://abc123.ngrok.io`)

✅ Leave this window open too!

---

### **STEP 2: Push to GitHub** (3 minutes)

#### Terminal Window #3:
```powershell
cd "C:\Users\Akhil's-OMEN\Desktop\Rag-Evo frontend\RAG-evolab"
.\push-backend-to-github.ps1
```

This will:
- Configure Git with your email
- Push all code to GitHub
- Ready for Render deployment

✅ Wait for "Successfully pushed to GitHub!" message

---

### **STEP 3: Deploy on Render.com** (10 minutes)

#### Go to Render:
1. Visit: https://render.com
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your repo: `Rag-evolab_BE`

#### Configure:
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn api:app --host 0.0.0.0 --port $PORT`

#### Add Environment Variables (CRITICAL!):

Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

| Key | Value |
|-----|-------|
| `OLLAMA_HOST` | `https://YOUR-NGROK-URL.ngrok.io` ⚠️ **Use YOUR actual ngrok URL from Step 1!** |
| `MODEL_NAME` | `phi3:mini` |
| `WEAVIATE_URL` | `bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud` |
| `WEAVIATE_API_KEY` | `VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw` |

⚠️ **REPLACE `YOUR-NGROK-URL` with the actual URL from Step 1!**

#### Click "Create Web Service"

Wait 5-10 minutes for deployment.

---

## ✅ Test It Works!

Open browser and visit:
```
https://your-render-url.onrender.com/health
```

Should show:
```json
{"status": "healthy"}
```

🎉 **If you see this, IT WORKS!**

---

## 📊 What You Need vs Don't Need

### ✅ YOU NEED:

| Item | Status |
|------|--------|
| Ollama installed | ✅ Already done! |
| Ngrok installed | ✅ Already done! |
| Weaviate credentials | ✅ You have them! |
| Computer stays ON | ✅ Just keep terminals open |

### ❌ YOU DON'T NEED:

| Service | Why? |
|---------|------|
| Hugging Face API key | ❌ Not needed (using local Ollama) |
| OpenRouter API key | ❌ Not needed (using local Ollama) |
| Credit card | ❌ Everything is FREE! |
| Cloud GPU | ❌ Running on your computer |

---

## ⚠️ Important Reminders

### 1. Keep Both Terminals Open!

- Terminal #1: `ollama serve` ← Must stay running
- Terminal #2: `ngrok http 11434` ← Must stay running

If you close either one, backend stops working!

### 2. Ngrok URL Changes

When you restart ngrok, you get a NEW URL.

**What to do:**
1. Copy new ngrok URL
2. Go to Render dashboard
3. Update `OLLAMA_HOST` environment variable
4. Save - Render auto-redeploys!

### 3. Your Computer= Server

Since Ollama runs on YOUR computer:
- If computer turns off → Backend stops
- If internet disconnects → Backend can't reach Ollama
- Keep computer awake and connected!

---

## 💰 Cost Breakdown

| Service | Monthly Cost |
|---------|-------------|
| Vercel Frontend | **FREE** |
| Render Backend| **FREE** (750 hours/month) |
| Local Ollama | **FREE** |
| Ngrok Free Tier | **FREE** |
| Weaviate Cloud | Your existing |

**🎉 TOTAL: $0.00/month!**

---

## 🆘 Quick Troubleshooting

### Problem: "Ollama not found"
**Solution:**Run `ollama pull phi3:mini` first

### Problem: "Ngrok not recognized"
**Solution:** Close PowerShell and open a NEW one (ngrok was just installed)

### Problem: "Git push failed"
**Solution:** Use GitHub Personal Access Token from https://github.com/settings/tokens

### Problem: Render build fails
**Solution:** Check that `requirements.txt` exists in backend folder

---

## 📞 Full Guides

For detailed instructions with troubleshooting:

1. **[API_KEYS_NEEDED.md](API_KEYS_NEEDED.md)** - Complete API key explanation
2. **[QUICK_START_RENDER.md](QUICK_START_RENDER.md)** - Quick reference
3. **[LOCAL_OLLAMA_RENDER_DEPLOYMENT.md](LOCAL_OLLAMA_RENDER_DEPLOYMENT.md)** - Complete guide

---

## ✅ Checklist

Before you start:
- [ ] Ollama installed (`ollama --version`)
- [ ] Ngrok installed (`ngrok version`)
- [ ] Phi3 model downloaded (`ollama list`)
- [ ] GitHub account accessible
- [ ] Render.com account created (free)

Ready? Follow the 3 steps above! 🚀

---

## 🎯 Summary

**Q: Do I need Hugging Face or OpenRouter API keys?**

**A: NO!** Just use local Ollama with ngrok tunnel.

**What you need:**
- ✅ Ollama (installed ✓)
- ✅ Ngrok (installed ✓)
- ✅ Weaviate credentials (you have them ✓)
- ✅ Computer stays ON

**What you DON'T need:**
- ❌ Hugging Face token
- ❌ OpenRouter API key
- ❌ Credit card
- ❌ Cloud servers

**Just follow the 3 steps and you're done!** 🎉
