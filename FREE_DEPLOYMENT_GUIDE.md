# 🆓 100% FREE Deployment Guide

## ✅ Completely Free Stack

```
┌─────────────────┐
│   Vercel        │  Frontend - FREE Forever
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Render.com    │  Backend - FREE Tier (750 hrs/month)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Weaviate Cloud (Free Trial) │
│ + Hugging Face Inference    │  FREE API
└─────────────────────────────┘
```

---

## 🎯 Free Alternatives to Paid Services

| Service | Paid Option | FREE Alternative |
|---------|-------------|------------------|
| Railway.app | $5/month | **Render.com** - 750 hrs free |
| OpenRouter | Pay-per-use | **Hugging Face** - Free API |
| Vercel | Free tier exists | **Vercel** - Already free! |

---

## 🚀 Step-by-Step FREE Deployment

### PART 1: Use Hugging Face Inference API (FREE)

Instead of OpenRouter, use Hugging Face's free inference API.

#### Step 1: Get Hugging Face Account & Token

1. **Sign up:** https://huggingface.co/join
2. **Get your token:** https://huggingface.co/settings/tokens
3. Click "New token" → Name it "RAG-EvoLab" → Copy the token

**✅ It's completely FREE!** No credit card needed.

#### Step 2: Update Backend Code for Hugging Face

I'll update your `llm_client.py` to use Hugging Face instead of OpenRouter.

---

### PART 2: Deploy Backend to Render.com (FREE)

#### Why Render.com?
- ✅ **750 free hours/month** (enough to run 24/7)
- ✅ **No credit card required**
- ✅ **Supports Python/FastAPI**
- ✅ **Auto-deploy from GitHub**

#### Deployment Steps:

1. **Sign up:** https://render.com/register

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select `RAG-evolab` repository

3. **Configure:**
   ```
   Name: rag-evolab-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn api:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

4. **Add Environment Variables:**
   ```bash
   # Hugging Face Configuration
   HUGGING_FACE_TOKEN=hf_your-token-here
   MODEL_NAME=google/flan-t5-base
   
   # Weaviate Configuration
   WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
   WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
   ```

5. **Click "Create Web Service"**

Render will deploy your backend automatically!

**⏰ Important:**Render free tier spins down after 15 minutes of inactivity. First request after idle time takes ~30 seconds to wake up.

---

### PART 3: Deploy Frontend to Vercel (FREE)

Same as before - Vercel is already free!

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Then add environment variable in Vercel dashboard:
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-app.onrender.com
```

---

## 💻 Updated Backend Code for Hugging Face

Update `backend/rag/llm_client.py` to use FREE Hugging Face API:

```python
import os
import requests

# Configuration
HUGGING_FACE_TOKEN = os.getenv('HUGGING_FACE_TOKEN')
MODEL_NAME = os.getenv('MODEL_NAME', 'google/flan-t5-base')

def call_llm(prompt: str) -> str:
    """
    Calls LLM using Hugging Face Inference API (FREE)
    Always returns a string.
    """
    
    if not HUGGING_FACE_TOKEN:
        return "Error: Hugging Face token not configured"
    
    try:
        # Using Hugging Face Inference API
        api_url = f"https://api-inference.huggingface.co/models/{MODEL_NAME}"
        
       headers = {
            "Authorization": f"Bearer {HUGGING_FACE_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 300,
                "temperature": 0.1
            }
        }
        
        response = requests.post(api_url, headers=headers, json=payload, timeout=30)
        
        if response.status_code != 200:
            return f"Hugging Face error: {response.text}"
        
        result = response.json()
        
        # Extract generated text
        if isinstance(result, list) and len(result) > 0:
            return result[0].get('generated_text', '').strip()
        elif isinstance(result, dict):
            return result.get('generated_text', '').strip()
        else:
            return str(result).strip()
    
    except requests.exceptions.RequestException as e:
        return f"Hugging Face request failed: {str(e)}"
    except Exception as e:
        return f"LLM error: {str(e)}"
```

---

## 🆓 Best FREE Models on Hugging Face

These models work great with the free inference API:

| Model | Quality | Speed | Best For |
|-------|---------|-------|----------|
| **google/flan-t5-base** | Good | Fast | General Q&A |
| **google/flan-t5-large** | Better | Medium | Better quality |
| **mistralai/Mistral-7B-v0.1** | Excellent | Medium | High quality |
| **meta-llama/Llama-2-7b-chat** | Excellent | Medium | Conversational |

**Recommended:** Start with `google/flan-t5-base` for speed, upgrade to `mistralai/Mistral-7B-v0.1` for better quality.

---

## 📋 Complete FREE Setup Checklist

### Phase 1: Hugging Face (5 minutes)
- [ ] Create account at https://huggingface.co/join
- [ ] Generate API token at settings/tokens
- [ ] Copy token (starts with `hf_...`)
- [ ] Note model name: `google/flan-t5-base`

### Phase 2: Render.com Backend (10 minutes)
- [ ] Sign up at https://render.com/register
- [ ] Create new "Web Service"
- [ ] Connect GitHub repo
- [ ] Set Root Directory: `backend`
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
- [ ] Add environment variables:
  - `HUGGING_FACE_TOKEN=hf_your-token`
  - `MODEL_NAME=google/flan-t5-base`
  - `WEAVIATE_URL=...`
  - `WEAVIATE_API_KEY=...`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (green checkmark)
- [ ] Copy your Render URL (e.g., `https://xxx.onrender.com`)

### Phase 3: Vercel Frontend (5 minutes)
- [ ] Navigate to `frontend` folder
- [ ] Run: `vercel --prod`
- [ ] Copy Vercel URL
- [ ] In Vercel Dashboard, add env var:
  - `NEXT_PUBLIC_BACKEND_URL=https://your-app.onrender.com`
- [ ] Redeploy

### Phase 4: Test Everything
- [ ] Visit Render health endpoint: `https://your-app.onrender.com/health`
- [ ] Test query: `curl -X POST https://your-app.onrender.com/query -H "Content-Type: application/json" -d '{"query":"test"}'`
- [ ] Open Vercel frontend in browser
- [ ] Submit test query
- [ ] Verify response appears

---

## ⚠️ Limitations of FREE Tier

### Render.com Free Tier:
- ⏰ **750 hours/month** (enough for 24/7 for one service)
- 😴 **Spins down** after 15 min inactivity (30 sec wake-up time)
- 💾 **512 MB RAM** per instance
- 🔄 **Auto-sleep** when not in use

### Hugging Face Free API:
- 📊 **Rate limited** (~300 requests/hour)
- ⏱️ **Timeout** after 30 seconds
- 🚀 **Cold starts** possible
- ✅ **FREE forever** with no credit card

### Vercel Free Tier:
- ✅ **Unlimited deployments**
- ✅ **100 GB bandwidth/month**
- ✅ **Automatic SSL**
- ✅ **Global CDN**

---

## 💰 Cost: $0.00/month Breakdown

| Service | Regular Price | Your Cost |
|---------|--------------|-----------|
| Vercel | $20/month | **$0** (Hobby plan) |
| Render | $7/month | **$0** (Free tier) |
| Hugging Face | Pay-per-use | **$0** (Free inference) |
| Weaviate | Already running | **$0** (Your existing) |

**Total Monthly Cost: $0.00** 🎉

---

## 🔧 Troubleshooting FREE Tier Issues

### Issue: Render service keeps sleeping

**Solutions:**
1. **Accept it** - Just wait 30 seconds for wake-up
2. **Ping service** every 14 minutes (not recommended)
3. **Upgrade to paid** ($7/month) if it bothers you

### Issue: Hugging Face rate limits

**Solutions:**
1. **Use smaller models** - Faster inference = less API calls
2. **Implement caching** - Cache common queries
3. **Reduce query frequency** - Batch requests

### Issue: Slow responses

**Solutions:**
1. Use faster models (`flan-t5-base` instead of large models)
2. Reduce `max_new_tokens` parameter
3. Enable response streaming

---

## 🎯 Alternative FREE Options

### Option A: Oracle Cloud Free Tier (BEST VALUE)

Oracle offers **always-free** cloud resources:

**What you get:**
- 4 ARM Ampere A1 cores
- 24 GB RAM
- 200 GB storage
- **Completely FREE forever**

**Setup:**
1. Sign up: https://www.oracle.com/cloud/free/
2. Create VM instance
3. Install Ollama + your backend
4. Run everything on one server

**Pros:**
- ✅ More powerful than Render free tier
- ✅ No sleep/timeout issues
- ✅ Full control

**Cons:**
- ❌ More complex setup
- ❌ Requires credit card (but won't charge)
- ❌ Longer signup process

### Option B: Google Colab + Ngrok

**For testing only** (not production):

1. Run backend in Google Colab (free GPU!)
2. Expose with ngrok
3. Connect frontend

**Not recommended for production** but great for development.

### Option C: GitHub Codespaces

**For development:**
- 60 hours/month free
- Run full stack in cloud
- Perfect for testing

---

## 📊 Performance Expectations

### FREE Stack Performance:

| Metric | Expectation |
|--------|-------------|
| Response Time | 2-5 seconds (cold start: +30 sec) |
| Uptime | ~95% (excluding sleep time) |
| Concurrent Users | 1-5 users comfortably |
| Monthly Queries | ~10,000 queries (HF limit) |

**Good for:**
- ✅ Personal projects
- ✅ Testing/demos
- ✅ Small user base (<10 users)

**Not suitable for:**
- ❌ Production apps with many users
- ❌ Real-time applications
- ❌ Mission-critical systems

---

## 🚀 Quick Start Commands

```bash
# 1. Get Hugging Face token
# Visit: https://huggingface.co/settings/tokens

# 2. Deploy to Render
# Via dashboard: https://render.com

# 3. Deploy to Vercel
cd frontend
vercel --prod

# 4. Test
curl https://your-render-url.onrender.com/health
```

---

## ✅ Final FREE Setup Summary

### Your FREE Stack:
- 🌐 **Frontend:** Vercel (Free forever)
- ⚙️ **Backend:**Render.com (750 hrs/month free)
- 🤖 **LLM:** Hugging Face Inference API (Free tier)
- 💾 **Vector DB:** Weaviate Cloud (Your existing setup)

### Total Cost: **$0.00/month** 🎉

### What You Get:
- ✅ Fully functional RAG application
- ✅ Global CDN for frontend
- ✅ Auto-scaling backend
- ✅ No credit card required
- ✅ Perfect for learning/testing

### Upgrade Path (When Needed):
- Render Starter ($7/month) - No sleep
- Railway ($5/month) - Better performance
- OpenRouter (Pay-per-use) - Better models
- VPS ($5-10/month) - Full control

---

## 🆘 Need Help?

### Resources:
- Hugging Face Docs: https://huggingface.co/docs/api-inference
- Render Docs: https://docs.render.com
- Vercel Docs: https://vercel.com/docs

### Community Support:
- Hugging Face Discord
- Render Community Forum
- Vercel GitHub Discussions

---

**🎊 You now have a 100% FREE deployed RAG application!**

**No credit card • No hidden costs • Pure free tier magic!** ✨

Start deploying now and enjoy your free RAG-EvoLab! 🚀
