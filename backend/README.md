# RAG-EvoLab Backend

FastAPI backend for RAG-EvoLab application with Ollama LLM integration.

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start Ollama:**
   ```bash
  ollama serve
   ```

3. **Create `.env` file:**
   ```bash
   OLLAMA_HOST=http://localhost:11434
   MODEL_NAME=phi3:mini
   WEAVIATE_URL=your-weaviate-url
   WEAVIATE_API_KEY=your-weaviate-api-key
   ```

4. **Run the API:**
   ```bash
   python api.py
   ```

   Server runs at: `http://localhost:8000`

### Production Deployment (Railway + Local Ollama)

1. **Expose Ollama with ngrok:**
   ```bash
   ngrok http 11434
   ```
   
   Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

2. **Deploy to Railway:**
   - Connect GitHub repository
   - Set environment variables:
     ```
     OLLAMA_HOST=https://your-ngrok-url.ngrok.io
     MODEL_NAME=phi3:mini
     WEAVIATE_URL=...
     WEAVIATE_API_KEY=...
     ```

3. **Railway will auto-deploy!**

## 📋 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OLLAMA_HOST` | Ollama server URL | `http://localhost:11434` or `https://xxx.ngrok.io` |
| `MODEL_NAME` | Ollama model to use | `phi3:mini` |
| `WEAVIATE_URL` | Weaviate vector DB URL | `https://...` |
| `WEAVIATE_API_KEY` | Weaviate API key | `...` |

## 🔌 API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{"status": "healthy"}
```

### Root Endpoint
```bash
GET /
```

Response:
```json
{"message": "RAG Application API is running"}
```

### Query Endpoint
```bash
POST /query
Content-Type: application/json

{
  "query": "Your question here"
}
```

Response:
```json
{
  "response": "Generated answer from RAG pipeline"
}
```

## 🏗️ Architecture

```
Frontend (Vercel)
    ↓
Backend (Railway) → Ollama (Local/Cloud)
    ↓                    ↓
Weaviate Cloud      LLM Inference
```

## 🦙 Ollama Integration

The backend supports multiple LLM backends with automatic fallback:

1. **Hugging Face Inference API** (FREE) - if `HUGGING_FACE_TOKEN` is set
2. **OpenRouter API** (Paid) - if `OPENROUTER_API_KEY` is set
3. **Ollama** (Self-hosted) -uses `OLLAMA_HOST`

### Priority Order:
- If `HUGGING_FACE_TOKEN` exists → Use Hugging Face (FREE)
- Else if `OPENROUTER_API_KEY` exists → Use OpenRouter
- Else → Use Ollama (local or remote)

## 🚀 Deployment Options

### Option 1: Railway + Local Ollama (Recommended for Testing)

**Pros:**
- ✅ Free testing
- ✅ Full control over models
- ✅ No model size limits

**Cons:**
- ⚠️ Your computer must stay on
- ⚠️ Ngrok URL changes on restart

### Option 2: Railway + OpenRouter (Production Ready)

**Pros:**
- ✅ Zero maintenance
- ✅ Reliable and fast
- ✅ Pay-per-use (~$3-10/month)

**cons:**
- ⚠️ Small ongoing cost

### Option 3: Railway + GPU VPS (Full Production)

**Pros:**
- ✅ Full control
- ✅ Fast responses
- ✅ Scalable

**Cons:**
- ⚠️ More expensive (~$150/month)
- ⚠️ Requires server management

## 🧪 Testing

### Test Locally
```bash
# Health check
curl http://localhost:8000/health

# Test query
curl -X POST http://localhost:8000/query\
  -H "Content-Type: application/json" \
  -d '{"query": "What is machine learning?"}'
```

### Test Railway Deployment
```bash
# Replace with your Railway URL
curl https://your-railway-app.railway.app/health
curl -X POST https://your-railway-app.railway.app/query\
  -H "Content-Type: application/json" \
  -d '{"query": "What is machine learning?"}'
```

## 📦 Project Structure

```
backend/
├── api.py                 # FastAPI application
├── requirements.txt       # Python dependencies
├── Procfile              # Railway start command
├── .env.example          # Environment template
│
├── rag/
│   ├── llm_client.py     # LLM integration (multi-backend)
│   ├── prompts.py        # Prompt templates
│   └── rag_pipeline.py   # RAG logic
│
├── ingestion/
│   ├── pipeline.py       # Document processing
│   ├── loaders/          # Document loaders
│   └── splitters/        # Text splitters
│
└── vectorstores/
    ├── weaviate_store.py # Vector DB integration
    └── retriever.py      # Retrieval logic
```

## 🔧 Development

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Development Server
```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### Run Production Server
```bash
uvicorn api:app --host 0.0.0.0 --port $PORT
```

## 🐛 Troubleshooting

### Backend can't connect to Ollama

**Check:**
1. Ollama is running: `ollama list`
2. Correct `OLLAMA_HOST` in environment variables
3. Firewall allows connections to port 11434

### Slow responses

**Solutions:**
1. Use smaller/faster models
2. Reduce MAX_TOKENS in`llm_client.py`
3. Increase TEMPERATURE slightly

### Railway deployment fails

**Check:**
1. `requirements.txt` has all dependencies
2. Procfile is correct
3. Build logs show specific error

## 📊 Performance

| Setup | Response Time | Monthly Cost |
|-------|--------------|--------------|
| Local Ollama + Ngrok | 2-5 seconds | $0 |
| OpenRouter API | 1-3 seconds | ~$3-10 |
| GPU VPS (RunPod) | 1-2 seconds | ~$150 |

## 🔐 Security

- Never commit `.env` files
- Use environment variables in Railway dashboard
- Enable CORS only for trusted domains
- Implement rate limiting for production

## 📝 License

See LICENSE file in root directory.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- Issues: GitHub Issues
- Documentation: See project root

---

**Built with ❤️ using FastAPI, Ollama, and Weaviate**
