# 🦙 How to Host Your Ollama Model

## ⚠️ Important: Ollama Cannot Run on Free Tiers

**Railway.app, Render.com, Vercel, Fly.io** - None support Ollama because:
- ❌ Need GPU for good performance
- ❌ Model files are large (2-4GB each)
- ❌ Long startup times
- ❌ Docker/containerization complexity

---

## ✅ Your Options to Host Ollama

### Option 1: Run Ollama Locally + Expose with Ngrok/Tunnel (FREE)

**Best for:**Development, testing, demos

#### Steps:

1. **Install Ollama locally** (if not already):
   ```powershell
   # Download from https://ollama.com/download
   # Or run installer
   ```

2. **Pull your model**:
   ```bash
   ollama pull phi3:mini
   ```

3. **Start Ollama server**:
   ```bash
   ollama serve
   ```
   
   This runs on `http://localhost:11434`

4. **Expose with Ngrok** (free):
   ```bash
   # Install ngrok first
   ngrok http 11434
   ```
   
   Ngrok gives you a URL like: `https://abc123.ngrok.io`

5. **Update Railway/Render environment variables**:
   ```bash
   OLLAMA_HOST=https://abc123.ngrok.io
   MODEL_NAME=phi3:mini
   # Remove HUGGING_FACE_TOKEN and OPENROUTER_API_KEY
   ```

6. **Your backend will automatically use Ollama!**

⚠️ **Limitations:**
- Ngrok URL changes every restart
- Rate limits on free tier
- Your computer must stay on
- Not production-ready

---

### Option 2: Rent a GPU VPS (Recommended for Production)

**Best for:**Production, serious projects, multiple users

#### Providers:

| Provider | Price | GPU | RAM | Storage |
|----------|-------|-----|-----|---------|
| **RunPod.io** | ~$0.20/hr | RTX 3060 12GB | 24GB | 50GB |
| **Vast.ai** | ~$0.15/hr | RTX 3090 24GB | 48GB | 100GB |
| **Lambda Labs** | ~$0.50/hr | RTX A6000 | 32GB | 100GB |
| **Paperspace** | ~$0.45/hr | RTX 5000 | 16GB | 50GB |

**Monthly cost:** ~$100-150/month (much cheaper than you think!)

#### Setup Steps (RunPod Example):

1. **Sign up:** https://runpod.io/console/signup
2. **Add credits:** Minimum $10
3. **Deploy Ollama:**
   - Click "Deploy" → "Template"
   - Search for "Ollama"
   - Choose GPU (RTX 3060 or better)
   - Click "Deploy"

4. **Get your endpoint URL:**
   - Will be like: `https://your-pod-id.runpod.net`
   - Port 11434 is exposed by default

5. **Configure firewall:**
   - In RunPod dashboard, ensure port 11434 is open

6. **Update Railway/Render:**
   ```bash
   OLLAMA_HOST=https://your-pod-id.runpod.net:11434
   MODEL_NAME=phi3:mini
   ```

7. **Test:**
   ```bash
   curl https://your-pod-id.runpod.net:11434/api/tags
   ```

✅ **Done!**Your Ollama is now hosted 24/7!

---

### Option 3: Use Cloud Ollama Services (Easiest)

**Best for:** People who don't want to manage servers

#### Services:

1. **OpenRouter** (Already configured!)
   - Supports Phi3, Llama, Mistral models
   - Pay-per-use (~$0.20 per 1M tokens)
   - No setup needed
   - Just add API key

2. **Together AI**
   - https://together.ai
   - Similar pricing
   - Fast inference

3. **Replicate**
   - https://replicate.com
   - Hosted Ollama models
   - Easy API

**How to use OpenRouter:**
```bash
# Get token from https://openrouter.ai/keys
# Add to Railway/Render:
OPENROUTER_API_KEY=sk-or-v1-your-key
MODEL_NAME=microsoft/phi-3-mini-128k-instruct
```

Your code automatically uses OpenRouter when this is set!

---

### Option 4: Oracle Cloud Free Tier (Advanced)

**Best for:** Tech-savvy users wanting free hosting

Oracle offers **always-free ARM instances**:

**What you get:**
- 4 CPU cores (ARM)
- 24 GB RAM
- 200 GB storage
- **FREE forever**

**Setup:**

1. **Sign up:** https://www.oracle.com/cloud/free/
2. **Create VM instance:**
   - Shape: VM.Standard.A1.Flex
   - OS: Ubuntu 22.04
   - Boot volume: 200GB

3. **SSH into VM:**
   ```bash
   ssh -i your-key ubuntu@your-vm-ip
   ```

4. **Install Ollama:**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ollama pull phi3:mini
   ```

5. **Configure Ollama to accept external connections:**
   ```bash
   sudo nano /etc/systemd/system/ollama.service
   
   # Add this line under [Service]:
   Environment="OLLAMA_HOST=0.0.0.0:11434"
   
   sudo systemctl daemon-reload
   sudo systemctl restart ollama
   ```

6. **Open firewall:**
   ```bash
   sudo ufw allow 11434/tcp
   ```

7. **Update Railway/Render:**
   ```bash
   OLLAMA_HOST=http://your-vm-public-ip:11434
   MODEL_NAME=phi3:mini
   ```

⚠️ **Challenges:**
- ARM architecture (some models may not work)
- Slower than GPU (no hardware acceleration)
- Complex setup
- Requires credit card (won't charge)

---

## 💰 Cost Comparison

| Option | Monthly Cost | Pros | Cons |
|--------|-------------|------|------|
| **Local + Ngrok** | $0 | Free, easy | Not production, unstable |
| **RunPod GPU** | ~$150 | Fast, reliable, full control | Requires management |
| **OpenRouter API** | ~$3-10 | Zero maintenance, pay-per-use | Ongoing costs |
| **Oracle Cloud** | $0 | Free forever | Slow (no GPU), complex |

---

## 🎯 Recommended Approach

### For Testing/Learning:
**Use Local + Ngrok** (FREE)

```bash
# On your computer
ollama serve

# In another terminal
ngrok http 11434

# Copy the ngrok URL to Railway/Render
OLLAMA_HOST=https://your-url.ngrok.io
```

### For Small Production (<100 users/day):
**Use OpenRouter** (~$3-10/month)

```bash
# Get key from openrouter.ai
# Add to Railway/Render:
OPENROUTER_API_KEY=sk-or-v1-...
MODEL_NAME=microsoft/phi-3-mini-128k-instruct
```

Your code already supports this!

### For Serious Production (>100 users/day):
**Rent GPU VPS** (~$150/month)

```bash
# Deploy on RunPod/Vast.ai
# Get your endpoint
# Add to Railway/Render:
OLLAMA_HOST=https://your-gpu-server:11434
MODEL_NAME=phi3:mini
```

---

## 🔧 Update Your Backend for Ollama Hosting

Your code is already configured! It checks in this order:

1. **Hugging Face** (if `HUGGING_FACE_TOKEN` exists) ← FREE
2. **OpenRouter** (if `OPENROUTER_API_KEY` exists) ← Paid but cheap
3. **Ollama** (uses `OLLAMA_HOST`) ← Your self-hosted

### To use your hosted Ollama:

**In Railway/Render environment variables, set:**

```bash
# Remove or comment out these:
# HUGGING_FACE_TOKEN=...
# OPENROUTER_API_KEY=...

# Add this:
OLLAMA_HOST=https://your-ollama-host:11434
MODEL_NAME=phi3:mini
```

Your backend will automatically use Ollama!

---

## 📊 Performance Expectations

| Setup | Response Time | Concurrent Users | Monthly Cost |
|-------|--------------|------------------|--------------|
| **Local + Ngrok** | 2-5 seconds | 1-3 | $0 |
| **OpenRouter** | 1-3 seconds | Unlimited* | ~$3-10 |
| **RunPod RTX 3060** | 1-2 seconds | 10-20 | ~$150 |
| **Oracle Cloud (ARM)** | 10-30 seconds | 1-2 | $0 |

*Limited by your budget

---

## 🚀 Quick Start: Local Ollama + Ngrok (RIGHT NOW)

### Step 1: Start Ollama
```bash
ollama serve
```

### Step 2: Install Ngrok
```bash
# Windows (PowerShell as Administrator)
winget install ngrok

# Or download from https://ngrok.com/download
```

### Step 3: Expose Ollama
```bash
ngrok http 11434
```

You'll see:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:11434
```

### Step 4: Update Railway/Render

Go to your Railway/Render dashboard and add:

```bash
OLLAMA_HOST=https://abc123.ngrok.io
MODEL_NAME=phi3:mini

# Remove these if they exist:
# HUGGING_FACE_TOKEN=...
# OPENROUTER_API_KEY=...
```

### Step 5: Test
```bash
curl -X POST https://your-railway-app.railway.app/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Hello!"}'
```

✅ **Done!**Your local Ollama is now connected to your cloud backend!

⚠️ **Remember:**Your computer must stay on, and ngrok URL changes when you restart it.

---

## 🆘 Troubleshooting

### ❌ "Ollama connection refused"

**Check:**
1. Ollama is running: `ollama list`
2. Server is started: `ollama serve`
3. Firewall allows port 11434
4. Ngrok tunnel is active

### ❌ "Model not found"

**Fix:**
```bash
ollama pull phi3:mini
ollama list  # Verify it's there
```

### ❌ Backend still using Hugging Face/OpenRouter

**Check environment variables priority:**
1. Make sure `HUGGING_FACE_TOKEN` is NOT set
2. Make sure `OPENROUTER_API_KEY` is NOT set
3. Only `OLLAMA_HOST` should be set
4. Redeploy backend after changing env vars

### ❌ Slow responses from Oracle Cloud

**Reality:** ARM CPU without GPU is slow for LLMs

**Solution:** Upgrade to GPU VPS (RunPod/Vast.ai)

---

## 💡 Pro Tips

### 1. Use Multiple Backends

Keep fallback options in your code:

```bash
# Primary: Your Ollama on RunPod
OLLAMA_HOST=https://your-runpod:11434

# Fallback: OpenRouter (uncomment if needed)
# OPENROUTER_API_KEY=sk-or-v1-...
```

### 2. Monitor Ollama Usage

```bash
# Check what's running
ollama ps

# Check logs
docker logs ollama-container
```

### 3. Optimize Model Selection

For faster responses, use smaller models:
- `phi3:mini` (3.8B) - Fast, decent quality
- `mistral:7b` - Good balance
- `llama3:8b` - Better quality, slower

### 4. Automate Ngrok (Development)

Create a script `start-ollama.ps1`:

```powershell
Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
Start-Sleep -Seconds 5
Start-Process "ngrok" -ArgumentList"http", "11434" -WindowStyle Normal
```

---

## ✅ Summary: Choose Your Path

### Path 1: Quick & Free (Testing)
**Local Ollama + Ngrok**
- Cost: $0
- Setup time: 10 minutes
- Best for: Development, demos

### Path 2: Cheap & Easy (Small Production)
**OpenRouter API**
- Cost: ~$3-10/month
- Setup time: 5 minutes
- Best for: <100 queries/day

### Path 3: Professional (Serious Production)
**GPU VPS (RunPod/Vast.ai)**
- Cost: ~$150/month
- Setup time: 1 hour
- Best for: >1000 queries/day

### Path 4: Free but Slow (Learning)
**Oracle Cloud ARM**
- Cost: $0
- Setup time: 2-3 hours
- Best for: Learning, very light testing

---

## 🎉 Ready to Deploy?

**For testing right now:**
→ Follow "Quick Start: Local Ollama + Ngrok" above

**For production:**
→ Choose between OpenRouter (easy) or RunPod (full control)

**Your backend code is already configured to support all options!**

Just set the right environment variables and redeploy! 🚀
