# Backend Deployment Guide: Railway + Ollama

## ⚠️ Important: Ollama Cannot Run on Railway

Railway.app doesn't support running Ollama directly because:
- No Docker-in-Docker support
- No GPU access
- Model files are too large (~2-4GB each)
- Long startup times

---

## ✅ Solution: External Ollama Service

### Architecture:
```
Vercel (Frontend)
   ↓
Railway (Backend - FastAPI)
   ↓
Ollama API (External Server)
   ↓
Weaviate Cloud (Vector DB)
```

---

## 🚀 Option 1: Run Ollama on a VPS (Recommended)

### Step 1: Rent a GPU VPS

**Providers:**
- **RunPod.io** - Best value, starting at $0.20/hour
- **Lambda Labs** - From $0.50/hour
- **Paperspace** - From $0.45/hour
- **Vast.ai** - Marketplace, cheap options

**Minimum Specs:**
- GPU: RTX 3060 or better (12GB VRAM)
- RAM: 16GB+
- Storage: 50GB+

### Step 2: Install Ollama on VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull the model
ollama pull phi3:mini

# Start Ollama server (runs on port 11434)
ollama serve
```

### Step 3: Configure Firewall

```bash
# Allow incoming connections to Ollama
ufw allow 11434/tcp

# Or if using iptables
iptables -A INPUT -p tcp --dport 11434 -j ACCEPT
```

### Step 4: Update Your Backend

Modify `backend/.env` or Railway environment variables:

```bash
WEAVIATE_URL=bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
WEAVIATE_API_KEY=VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
OLLAMA_HOST=http://your-vps-ip:11434
MODEL_NAME=phi3:mini
```

### Step 5: Update Backend Code

Check your `backend/rag/llm_client.py` to ensure it uses the OLLAMA_HOST variable:

```python
import os

ollama_host = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
model_name = os.getenv('MODEL_NAME', 'phi3:mini')

# When calling Ollama
response = requests.post(
    f'{ollama_host}/api/generate',
    json={
        'model': model_name,
        'prompt': prompt
    }
)
```

---

## 🚀 Option 2: Use Ollama Cloud Services

### Alternative: Managed LLM APIs

Instead of self-hosting Ollama, use cloud APIs:

#### A. **OpenRouter** (Supports many models)
- Website: https://openrouter.ai
- Supports Phi3, Llama, Mistral, etc.
- Pay-per-use pricing

**Setup:**
```bash
# Add to Railway env vars
OPENROUTER_API_KEY=your_key_here
MODEL_NAME=meta-llama/llama-3-8b-instruct
```

Update `backend/rag/llm_client.py`:
```python
import requests

def call_llm(prompt):
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        },
        json={
            "model": os.getenv('MODEL_NAME'),
            "messages": [{"role": "user", "content": prompt}]
        }
    )
    return response.json()['choices'][0]['message']['content']
```

#### B. **Together AI**
- Website: https://together.ai
- Fast inference, good pricing
- Similar setup process

#### C. **Replicate**
- Website: https://replicate.com
- Hosted open-source models
- Easy API integration

---

## 🚀 Option 3: Use Hugging Face Inference Endpoints

### Deploy Ollama-compatible model on HF

1. Go to https://huggingface.co/inference-endpoints
2. Deploy a model (e.g., Phi3, Llama-3)
3. Get API endpoint
4. Update backend to use HF API

**Cost:** Starting at ~$0.06/hour

---

## 🚀 Option 4: Run Ollama Locally + Ngrok Tunnel

### For Development/Testing Only

**Step 1: Run Ollama locally**
```bash
ollama serve
```

**Step 2: Expose with Ngrok**
```bash
ngrok http 11434
```

**Step 3: Use Ngrok URL in Railway**
```bash
# Railway env var
OLLAMA_HOST=https://abc123.ngrok.io
```

⚠️ **Not for production** - Ngrok URLs change, rate limits apply

---

## 💰 Cost Comparison

| Option | Cost | Pros | Cons |
|--------|------|------|-------|
| **VPS (RunPod)** | ~$150/month | Full control, fast | Need to manage server |
| **OpenRouter API** | ~$0.01-0.10 per 1K queries | No maintenance, pay-per-use | Ongoing costs |
| **Together AI** | ~$0.20 per 1M tokens | Fast, reliable | API costs |
| **Hugging Face** | ~$45/month | Managed service | Less flexible |
| **Local + Ngrok** | Free | Good for testing | Not production-ready |

---

## 🔧 Recommended Setup for You

### **Start with OpenRouter (Easiest)**

**Why:**
- ✅ No server management
- ✅ Pay only for what you use
- ✅ Instant setup
- ✅ Multiple models available
- ✅ Scales automatically

**Steps:**

1. **Get API Key:**
   - Go to https://openrouter.ai/keys
   - Create account
   - Generate API key

2. **Add to Railway Environment Variables:**
   ```
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
   MODEL_NAME=meta-llama/llama-3-8b-instruct
   WEAVIATE_URL=...
   WEAVIATE_API_KEY=...
   ```

3. **Update `backend/rag/llm_client.py`:**

```python
import os
import requests

def call_llm(prompt: str) -> str:
    """Call LLM using OpenRouter API"""
    
    api_key = os.getenv('OPENROUTER_API_KEY')
    model = os.getenv('MODEL_NAME', 'meta-llama/llama-3-8b-instruct')
    
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )
    
    if response.status_code != 200:
        raise Exception(f"API call failed: {response.text}")
    
    return response.json()['choices'][0]['message']['content']
```

4. **Deploy to Railway** - Done! ✅

---

## 🎯 Migration Path

### Phase 1: Start with OpenRouter (Now)
- Quick setup
- Test your application
- Validate with users

### Phase 2: Scale with VPS (Later)
- If costs get high
- Deploy your own Ollama on RunPod
- More control over models

### Phase 3: Hybrid (Future)
- Keep OpenRouter as fallback
- Primary traffic on your VPS
- Best of both worlds

---

## 📊 Expected Costs

### OpenRouter (Starting):
- **Phi-3-mini**: ~$0.20 per 1M tokens
- **Llama-3-8B**: ~$0.20 per 1M tokens
- **Average query**: ~500 tokens
- **1000 queries/day**: ~$3/month

### RunPod VPS:
- **RTX 3060**: ~$0.20/hour = ~$144/month
- **RTX 4090**: ~$0.70/hour = ~$504/month
- Unlimited queries

**Break-even point:** ~50,000 queries/month

---

## ✅ Next Steps

1. **Choose your approach:**
   - Quick start → OpenRouter
   - Full control → RunPod VPS

2. **Update backend code** based on choice

3. **Add environment variables** to Railway

4. **Redeploy** and test

---

## 🆘 Need Help?

- OpenRouter docs: https://openrouter.ai/docs
- RunPod tutorials: https://docs.runpod.io
- Ollama documentation: https://ollama.com/help

---

**Recommendation: Start with OpenRouter today, migrate to VPS when you need more control!** 🚀
