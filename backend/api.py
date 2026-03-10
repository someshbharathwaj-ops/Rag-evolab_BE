from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os
import asyncio
from starlette.concurrency import run_in_threadpool

# Add the parent directory to sys.path to import rag modules
sys.path.append(os.path.join(os.path.dirname(__file__), "."))

from rag.rag_pipeline import run_rag
from rag.llm_client import call_llm

app = FastAPI(
    title="RAG Application API",
    description="API for connecting Next.js frontend to RAG backend",
    version="1.0.0"
)

class QueryRequest(BaseModel):
    query: str

QUERY_TIMEOUT_SECONDS = float(os.getenv("QUERY_TIMEOUT_SECONDS", "45"))

# The run_rag function is used directly

@app.get("/")
def read_root():
    return {"message": "RAG Application API is running"}

@app.post("/query")
async def query_endpoint(request: QueryRequest):
    """
    Process a query using the RAG pipeline and return the response
    """
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        # Process the query using the RAG pipeline with a hard timeout to avoid hanging requests.
        response = await asyncio.wait_for(
            run_in_threadpool(run_rag, request.query),
            timeout=QUERY_TIMEOUT_SECONDS
        )
        
        return {"response": response}
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail=f"Query timed out after {QUERY_TIMEOUT_SECONDS:.0f}s. Check LLM/Weaviate connectivity."
        )
    except Exception as e:
        print(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
