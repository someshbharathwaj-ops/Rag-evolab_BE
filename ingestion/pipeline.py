import json
import os
from typing import List, Dict

from ingestion.loaders.loaders import load_pdf
from ingestion.splitters.splitters import token_based_splitter
from vectorstores.retriever import add_documents_to_store


CHUNKS_PATH = os.path.join("data", "chunks", "chunks.json")


def run_ingestion(pdf_path: str) -> List[Dict]:
    """
    Full ingestion pipeline:
    PDF → text → chunks → store locally → push to Weaviate
    """
    
    # Validate input
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")
    
    print(f"[Ingestion] Loading PDF: {pdf_path}")
    documents = load_pdf(pdf_path)
    
    if not documents:
        raise ValueError("No documents loaded from PDF")
    
    print(f"[Ingestion] Loaded {len(documents)} pages")
    
    print("[Ingestion] Splitting text into chunks...")
    chunks = token_based_splitter(documents)
    
    if not chunks:
        raise ValueError("No chunks created during ingestion")
    
    print(f"[Ingestion] Created {len(chunks)} chunks")
    
    # Ensure directories exist
    os.makedirs(os.path.dirname(CHUNKS_PATH), exist_ok=True)
    
    # Save chunks locally (debug / audit)
    with open(CHUNKS_PATH, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=2, ensure_ascii=False)
    
    print(f"[Ingestion] Chunks saved to {CHUNKS_PATH}")
    
    print("[Ingestion] Adding chunks to vector store (Weaviate)...")
    success = add_documents_to_store(chunks)
    
    if not success:
        raise RuntimeError("Failed to add documents to vector store")
    
    print("[Ingestion] ✓ Ingestion complete")
    
    return chunks