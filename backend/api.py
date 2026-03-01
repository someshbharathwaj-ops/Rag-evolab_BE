from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os

# Add the parent directory to sys.path to import rag modules
sys.path.append(os.path.join(os.path.dirname(__file__), "."))

from rag.rag.rag_pipeline import run_rag
from rag.rag.llm_client import call_llm

app = FastAPI(
    title="RAG Application API",
    description="API for connecting Next.js frontend to RAG backend",
    version="1.0.0"
)

class QueryRequest(BaseModel):
    query: str

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
        
        # Process the query using the RAG pipeline
        response = run_rag(request.query)
        
        return {"response": response}
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