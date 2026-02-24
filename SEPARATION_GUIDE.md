# Project Structure Separation Guide

This project has been organized into separate frontend and backend directories for better maintainability and scalability.

## Directory Structure

```
RAG-evolab/
├── backend/
│   ├── rag/
│   │   ├── llm_client.py
│   │   ├── prompts.py
│   │   └── rag_pipeline.py
│   ├── ingestion/
│   │   ├── loaders/
│   │   ├── splitters/
│   │   └── pipeline.py
│   ├── vectorstores/
│   │   ├── retriever.py
│   │   └── weaviate_store.py
│   ├── data/
│   │   ├── chunks/
│   │   └── raw/
│   ├── api.py                 # FastAPI backend server
│   └── requirements.txt       # Backend dependencies
├── frontend/
│   ├── pages/
│   │   ├── index.js          # Main frontend page
│   │   └── api/
│   │       └── query.js      # API proxy to backend
│   ├── components/
│   ├── styles/
│   ├── public/
│   ├── package.json
│   └── .env.local            # Frontend environment variables
├── README.md
└── .env                      # Shared environment variables
```

## Running the Application

### Backend (FastAPI Server)
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `python api.py` (runs on port 8000)

### Frontend (Next.js App)
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev` (runs on port 3000)

## Environment Variables

### Backend (.env)
Located in the root directory, shared between both applications:
```
OPENAI_API_KEY=your_openai_api_key_here
WEAVIATE_URL=your_weaviate_instance_url
WEAVIATE_API_KEY=your_weaviate_api_key
MODEL_NAME=phi3:mini
```

### Frontend (.env.local)
Located in the frontend directory:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## API Communication

The frontend communicates with the backend through:
1. Frontend Next.js API routes (frontend/pages/api/query.js) act as a proxy
2. Requests from the frontend UI are sent to the Next.js API route
3. The Next.js API route forwards the request to the FastAPI backend
4. Responses are relayed back to the frontend UI

This setup allows for easy deployment flexibility and handles CORS concerns.