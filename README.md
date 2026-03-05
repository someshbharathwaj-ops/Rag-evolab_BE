# RAG-Evolab

RAG-Evolab is a **Retrieval Augmented Generation (RAG) application** designed to support the Evolab learning ecosystem.
It enables users to ask questions and receive answers generated from the content of ingested documents.

The system processes documents, converts them into embeddings stored in a vector database, retrieves relevant context for a query, and generates responses using a language model.

---

# System Overview

The application consists of two main components:

**Frontend**

* Built with Next.js
* Provides a user interface for submitting queries

**Backend**

* Built with FastAPI
* Handles document ingestion, vector retrieval, and response generation

The backend interacts with:

* **Weaviate** (vector database)
* **Ollama** (local language model runtime)

---

# Project Structure

```
RAG-evolab/
│
├── backend/
│   │
│   ├── rag/
│   │   ├── rag_pipeline.py
│   │   ├── llm_client.py
│   │   └── prompts.py
│   │
│   ├── ingestion/
│   │   ├── pipeline.py
│   │   ├── loaders/
│   │   └── splitters/
│   │
│   ├── vectorstores/
│   │   ├── weaviate_store.py
│   │   └── retriever.py
│   │
│   ├── data/
│   │   ├── raw/
│   │   │   └── Source documents
│   │   │
│   │   └── chunks/
│   │       └── Processed document chunks
│   │
│   ├── api.py
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── pages/
│   │   ├── api/
│   │   └── chat.js
│   │
│   ├── components/
│   ├── styles/
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── .env
├── README.md
└── SEPARATION_GUIDE.md
```

---

# Requirements

Before running the application ensure the following are installed:

* Python **3.8 or higher**
* Node.js **16 or higher**
* npm
* Weaviate instance
* Ollama installed

---

# Installation

## Clone the Repository

```
git clone https://github.com/Akhils696/RAG-evolab.git
cd RAG-evolab
```

---

# Backend Setup

Navigate to the backend directory:

```
cd backend
```

Install dependencies:

```
pip install -r requirements.txt
```

---

# Environment Configuration

Create a `.env` file in the project root.

Example configuration:

```
OPENAI_API_KEY=your_openai_api_key
WEAVIATE_URL=http://localhost:8080
WEAVIATE_API_KEY=your_weaviate_api_key
MODEL_NAME=phi3:mini
```

---

# Frontend Setup

Navigate to the frontend directory:

```
cd frontend
```

Install dependencies:

```
npm install
```

---

# Running the Application

## Start Ollama

```
ollama serve
```

Download the required model:

```
ollama pull phi3:mini
```

---

## Start Backend

From the backend directory:

```
python api.py
```

Backend runs at:

```
http://localhost:8000
```

---

## Start Frontend

From the frontend directory:

```
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

# Using the System

1. Add documents to:

```
backend/data/raw/
```

2. Run the ingestion pipeline to process documents.

3. Start the backend and frontend services.

4. Open the frontend application in the browser.

5. Submit a query related to the uploaded documents.

6. The system retrieves relevant information and generates a response.

---

# API Endpoints

| Endpoint  | Method | Description          |
| --------- | ------ | -------------------- |
| `/`       | GET    | Root endpoint        |
| `/query`  | POST   | Submit a query       |
| `/health` | GET    | Backend health check |

---

# Troubleshooting

### Backend not responding

Check if the backend server is running:

```
http://localhost:8000
```

Restart the backend if necessary.

---

### Frontend cannot connect to backend

Verify the frontend environment configuration:

```
frontend/.env.local
```

Example:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Restart the frontend server after changes.

---

### Vector database connection error

Ensure the Weaviate instance is running.

Test connection:

```
curl http://localhost:8080/v1/meta
```

If the request fails, restart the Weaviate service.

---

### Ollama model not found

Verify installed models:

```
ollama list
```

If the required model is missing:

```
ollama pull phi3:mini
```

---

### Ingestion fails during document processing

Check that:

* The document format is supported
* Files are located inside `backend/data/raw`
* The vector database connection is available

---

# Notes

* Large datasets and processed files should not be committed to Git.
* Ensure required services (Weaviate and Ollama) are running before starting the backend.

---

# License

This project is licensed under the terms defined in the LICENSE file.
