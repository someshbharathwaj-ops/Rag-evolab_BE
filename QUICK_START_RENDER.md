# 🚀 Quick Start: Local Ollama + Render Backend

## ⚡ 3-Command Deployment

### Command 1: Start Ollama + Ngrok
```powershell
.\start-ollama-ngrok.ps1
```
**→ Copy the ngrok URL it displays!**

---

### Command 2: Push to GitHub
```powershell
.\push-backend-to-github.ps1
```
**→ This pushes your code to GitHub**

---

### Command 3: Deploy on Render (Manual)
1. Go to https://render.com
2. Create new **Web Service**
3. Connect your `Rag-evolab_BE` GitHub repo
4. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables:**
   ```bash
   OLLAMA_HOST = https://YOUR-NGROK-URL.ngrok.io
   (Paste the URL from Command 1!)
   
   MODEL_NAME= phi3:mini
   
   WEAVIATE_URL = bzmzxv5xtlwr755bvbi1a.c0.asia-southeast1.gcp.weaviate.cloud
   
   WEAVIATE_API_KEY= VWt1ZHlTRlNaZEVKTExhK19IUlBHekQ5Z1EyZ21lRkZKb0FiMWtINVBWbFVrbVcvUWdxNEtTczMxVnUwPV92MjAw
   ```

6. Click **"Create Web Service"**

---

## ✅ Test Your Deployment

```bash
# Health check
curl https://your-render-url.onrender.com/health

# Query test
curl -X POST https://your-render-url.onrender.com/query\
  -H "Content-Type: application/json" \
  -d '{"query": "Hello!"}'
```

---

## 📖 Full Guide

For detailed instructions with troubleshooting:
👉 [`LOCAL_OLLAMA_RENDER_DEPLOYMENT.md`](LOCAL_OLLAMA_RENDER_DEPLOYMENT.md)

---

## ⚠️ Important Notes

1. **Keep ngrok running!**Your computer must stay on
2. **Ngrok URL changes** when you restart- update Render environment variables
3. **Render free tier** spins down after 15 min inactivity (30 sec wake-up)
4. **Total cost: $0.00/month** 🎉

---

## 🎯 What You Get

- ✅ **Frontend:** Vercel (FREE)
- ✅ **Backend:**Render.com (FREE - 750 hours/month)
- ✅ **LLM:**Your local Ollama (FREE)
- ✅ **Vector DB:** Weaviate Cloud (Your existing)

**Ready to deploy? Run those 2 PowerShell scripts!** 🚀
