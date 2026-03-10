# 🚀 Quick Setup: OpenRouter for Railway Backend

## Why OpenRouter?

Since **Ollama cannot run on Railway**, you need an external LLM service. OpenRouter is the easiest solution:

✅ No server management  
✅ Pay-per-use (cheap for testing)  
✅ Multiple models available  
✅ Works instantly with Railway  

---

## ⚡ 5-Minute Setup

### Step 1: Get OpenRouter API Key

1. Go to https://openrouter.ai/keys
2. Sign up/Login (Google/GitHub/Discord)
3. Click "Create Key"
4. Name it: `RAG-EvoLab`
5. Copy the key (starts with `sk-or-v1-...`)

**💰 Free Credits:**New users get $1 free credit to test!

---

### Step 2: Add to Railway Environment Variables

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to **"Variables"** tab
4. Click **"New Variable"**

Add these variables:

```bash
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Model Selection (choose from available models)
MODEL_NAME=meta-llama/llama-3-8b-instruct

# Existing Weaviate config
WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
```

5. Click **"Save"** - Railway will automatically redeploy!

---

### Step 3: Choose Your Model

OpenRouter supports many models. Here are recommended ones:

| Model | Speed | Quality | Cost per 1M tokens | Best For |
|-------|-------|---------|-------------------|----------|
| **meta-llama/llama-3-8b-instruct** | ⚡⚡⚡ | Good | $0.20 | Fast responses |
| **meta-llama/llama-3-70b-instruct** | ⚡⚡ | Excellent | $0.90 | High quality |
| **mistralai/mistral-7b-instruct** | ⚡⚡⚡ | Good | $0.20 | Budget-friendly |
| **google/gemma-7b-it** | ⚡⚡⚡ | Good | $0.20 | Google model |
| **microsoft/phi-3-mini-128k** | ⚡⚡⚡ | Decent | $0.20 | Similar to your current |

**Recommendation:** Start with `meta-llama/llama-3-8b-instruct`

---

### Step 4: Test Your Deployment

#### Test Backend Directly:

```bash
curl -X POST https://your-railway-app.railway.app/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is RAG?"}'
```

Expected response:
```json
{
  "response": "RAG stands for Retrieval-Augmented Generation..."
}
```

#### Test in Browser:

1. Open your Vercel frontend URL
2. Submit a query
3. Check if you get a response

---

## 💰 Cost Estimate

### OpenRouter Pricing:

**Llama-3-8B Example:**
- Cost: $0.20 per 1 million tokens
- Average query: ~500 tokens (input + output)
- **1,000 queries** = ~$0.10
- **10,000 queries** = ~$1.00

### Your First Month:

If you're just testing/learning:
- **100 queries/day** = ~$0.01/day = **$0.30/month** ✅

For production use:
- **1,000 queries/day** = ~$0.10/day = **$3.00/month** ✅

**Much cheaper than running your own GPU server!**

---

## 🔧 Troubleshooting

### Error: "OpenRouter API error"

**Check:**
1. API key is correct (starts with `sk-or-v1-`)
2. You have credits in your OpenRouter account
3. Model name is valid

**Fix:**
- Add credits at https://openrouter.ai/credits
- Verify model exists at https://openrouter.ai/models

### Error: "Model not found"

**Solution:** Change MODEL_NAME to a valid model:
```bash
MODEL_NAME=meta-llama/llama-3-8b-instruct
```

### Slow Responses

**Solutions:**
1. Try a faster model (add `-fast` variants)
2. Reduce MAX_TOKENS in code
3. Increase TEMPERATURE slightly (0.7 instead of 0.0)

---

## 📊 Monitoring Usage

### Track Your Spending:

1. Go to https://openrouter.ai/activity
2. See real-time usage
3. Monitor token consumption
4. Set spending alerts

### Set Budget Limit:

1. Go to Account Settings
2. Set monthly spending limit
3. Get email notifications

**Recommended:** Start with $5/month limit

---

## 🎯 Advanced Configuration

### Use Different Models for Testing:

You can switch models anytime by updating Railway env var:

```bash
# For speed
MODEL_NAME=microsoft/phi-3-mini-128k

# For quality
MODEL_NAME=meta-llama/llama-3-70b-instruct

# For coding tasks
MODEL_NAME=codellama/codellama-34b-instruct
```

No code changes needed - just update the variable and Railway will redeploy!

---

## 🔄 Migration Path

### Phase 1: Start with OpenRouter (Now)
- ✅ Instant setup
- ✅ Minimal cost for testing
- ✅ No maintenance

### Phase 2: Scale Up (When Needed)
If your usage grows (>10K queries/month):

**Option A:** Keep OpenRouter
- Still cost-effective at scale
- No maintenance overhead

**Option B:**Self-host Ollama on RunPod
- More control
- Lower per-query cost at high volume
- Requires server management

---

## ✅ Checklist

Before deploying to Railway:

- [ ] OpenRouter account created
- [ ] API key generated
- [ ] Added credits ($1-5 to start)
- [ ] MODEL_NAME selected
- [ ] Environment variables added to Railway
- [ ] Backend redeployed automatically
- [ ] Tested with curl or browser
- [ ] Monitoring dashboard bookmarked

---

## 🆘 Need Help?

### Resources:
- **OpenRouter Docs:** https://openrouter.ai/docs
- **Available Models:** https://openrouter.ai/models
- **Pricing Details:** https://openrouter.ai/about

### Support:
- Discord: https://discord.gg/openrouter
- Twitter: @openrouter_ai

---

## 🎉 You're All Set!

Your RAG-EvoLab now uses:
- ✅ **Vercel** for frontend (global CDN)
- ✅ **Railway** for backend (FastAPI)
- ✅ **OpenRouter** for LLM (no maintenance!)
- ✅ **Weaviate** for vector storage

**Total setup time:** < 10 minutes  
**Monthly cost:** ~$0.30-5 (depending on usage)  
**Maintenance:** Zero! 🎊

---

**Next:** Test your deployment and start asking questions! 🚀
