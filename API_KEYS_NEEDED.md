# 🚀 API Keys You Need - Quick Answer

## ❓ Do You Need Hugging Face or OpenRouter API Keys?

### **NO! You don't need them if you use LOCAL OLLAMA.**

Your code has 3 options (in this priority order):

1. **Hugging Face** (FREE) ← Uses `HUGGING_FACE_TOKEN`
2. **OpenRouter** (Paid ~$3-10/month) ← Uses `OPENROUTER_API_KEY`
3. **Ollama** (FREE, Local) ← Uses `OLLAMA_HOST`

**If you use LOCAL OLLAMA (Option 3), you need:**
- ✅ NO Hugging Face token
- ✅ NO OpenRouter API key
- ✅ ONLY your local Ollama + ngrok URL

---

## ✅ What You Need for Local Ollama Setup

### Requirements:
1. ✅ **Ollama installed** (Already done ✓)
2. ✅ **ngrok installed** (Already done ✓)
3. ✅ **Phi3 model downloaded** (Check with`ollama list`)
4. ❌ **NO API keys needed!**

---

## 🔧 Step-by-Step: Start Everything

### Step 1: Start Ollama (if not already running)

Open PowerShell and run:
```powershell
ollama serve
```

Keep this window open!

### Step 2: Start Ngrok in NEW PowerShell Window

Open a NEW PowerShell window and run:
```powershell
ngrok http 11434
```

You'll see something like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:11434
```

**✅ COPY THIS NGROK URL!** (e.g., `https://abc123.ngrok.io`)

Keep this window open too!

### Step 3: Push Backend to GitHub

In another PowerShell window:
```powershell
cd "C:\Users\Akhil's-OMEN\Desktop\Rag-Evo frontend\RAG-evolab"
.\push-backend-to-github.ps1
```

This will push your code to:
`https://github.com/someshbharathwaj-ops/Rag-evolab_BE.git`

### Step 4: Deploy on Render.com

1. Go to https://render.com
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your `Rag-evolab_BE` repository
5. Configure:
   - **Name:** `rag-evolab-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn api:app --host 0.0.0.0 --port $PORT`

6. **Add Environment Variables** (CRITICAL!):

Click **"Advanced"** → **"Add Environment Variable"** and add these 4:

```bash
# 1. OLLAMA_HOST (USE YOUR NGROK URL!)
Key: OLLAMA_HOST
Value: https://abc123.ngrok.io
(Replace with YOUR actual ngrok URL from Step 2!)

# 2. MODEL NAME
Key: MODEL_NAME
Value: phi3:mini

# 3. WEAVIATE URL
Key: WEAVIATE_URL
Value: bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud

# 4. WEAVIATE API KEY
Key: WEAVIATE_API_KEY
Value: VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

⚠️ **IMPORTANT:**Replace `https://abc123.ngrok.io` with YOUR actual ngrok URL!

7. Click **"Create Web Service"**

Render will deploy your backend (5-10 minutes).

---

## ✅ Summary: What API Keys Do You Need?

### For LOCAL OLLAMA (Recommended for FREE):

| Service | API Key Needed? | Cost |
|---------|----------------|------|
| **Ollama (Local)** | ❌ NO | FREE |
| **Hugging Face** | ❌ NO (not needed) | N/A |
| **OpenRouter** | ❌ NO (not needed) | N/A |
| **Weaviate** | ✅ YES (you already have it) | Your existing |
| **ngrok** | ❌ NO (free tier works) | FREE |

**Total API keys needed:** Just Weaviate (which you already have!)

---

### If You Want Cloud LLM Instead (Optional):

#### Option A: Hugging Face (FREE but slower)
- Get token: https://huggingface.co/settings/tokens
- Add to Render: `HUGGING_FACE_TOKEN=hf_your-token`
- Remove or comment out `OLLAMA_HOST`

#### Option B: OpenRouter (Paid ~$3-10/month but fast & easy)
- Get API key: https://openrouter.ai/keys
- Add to Render: `OPENROUTER_API_KEY=sk-or-v1-your-key`
- Remove or comment out `OLLAMA_HOST`

---

## 🎯 Recommendation

### **Use LOCAL OLLAMA (FREE)!**

**Why?**
- ✅ Completely FREE
- ✅ Full control over models
- ✅ No API keys needed
- ✅ Perfect for testing/learning

**Trade-offs:**
- ⚠️ Your computer must stay ON
- ⚠️ Ngrok URL changes when you restart
- ⚠️ Not suitable for production (but great for testing!)

---

## 📊 Quick Test Checklist

After deploying on Render:

```bash
# 1. Test health endpoint
curl https://your-render-url.onrender.com/health

# Expected: {"status": "healthy"}

# 2. Test query
curl -X POST https://your-render-url.onrender.com/query\
  -H "Content-Type: application/json" \
  -d '{"query": "Hello!"}'

# Expected: JSON response with answer
```

✅ **If both work, you're done!**

---

## ⚠️ Important Notes

### Ngrok URL Changes

Every time you restart ngrok, the URL changes:
- Old: `https://abc123.ngrok.io`
- New: `https://xyz789.ngrok.io`

**What to do:**
1. Copy the new ngrok URL
2. Go to Render dashboard
3. Edit `OLLAMA_HOST` environment variable
4. Paste new URL
5. Save - Render auto-redeploys!

### Your Computer Must Stay ON

Since Ollama runs on YOUR computer:
- If you turn off computer → Backend stops working
- If you close ngrok → Backend can't reach Ollama
- Keep both windows open!

---

## 🆘 Troubleshooting

### Backend returns "Ollama connection refused"

**Check:**
1. Ollama is running: `ollama list`
2. Ngrok tunnel is active
3. `OLLAMA_HOST` in Render matches ngrok URL exactly
4. Model exists locally: `ollama pull phi3:mini`

### Frontend shows errors

**Deploy frontend to Vercel:**
```powershell
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Then in Vercel Dashboard add:
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-render-url.onrender.com
```

---

## 📞 Quick Reference

### Your Stack:
```
Vercel (Frontend) → Render (Backend) → Ngrok → Your Computer (Ollama)
```

### Environment Variables for Render:
```bash
OLLAMA_HOST=https://your-ngrok-url.ngrok.io
MODEL_NAME=phi3:mini
WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

### Commands to Start Everything:
```powershell
# Terminal 1: Ollama
ollama serve

# Terminal 2: Ngrok
ngrok http 11434
# Copy the ngrok URL!

# Terminal 3: Push to GitHub
.\push-backend-to-github.ps1
```

---

## ✅ Final Answer

**Q: Should I add Hugging Face and OpenRouter API keys?**

**A: NO!** 

Just use your local Ollama with ngrok. You only need:
- ✅ Ollama running locally (already done ✓)
- ✅ Ngrok tunnel (install done ✓)
- ✅ Weaviate credentials (you already have them ✓)

**NO other API keys needed!** 🎉

---

**Ready to deploy? Follow the steps above and you'll be live in 15 minutes!** 🚀
