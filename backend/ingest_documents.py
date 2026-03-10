import json
import os
import sys
from typing import List, Dict

# Add current directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

try:
    from ingestion.ingestion.loaders.loaders import load_pdf
    from ingestion.ingestion.splitters.splitters import token_based_splitter
    from vectorstores.vectorstores.retriever import add_documents_to_store
except ImportError as e:
    print(f"Import error: {e}")
    # Try alternative import paths
    try:
        from .ingestion.loaders.loaders import load_pdf
        from .ingestion.splitters.splitters import token_based_splitter
        from ..vectorstores.vectorstores.retriever import add_documents_to_store
    except ImportError:
        print("Failed to import modules")
        sys.exit(1)

CHUNKS_PATH = os.path.join("data", "data", "chunks", "chunks.json")

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

def main():
    # Path to your PDF files 
    pdf_files = [
        "data/data/raw/1-s2.0-S1877050924021860-main.pdf",
        "data/data/raw/2504.07615v2.pdf"
    ]
    
    print("Starting document ingestion process...")
    print("=" * 50)
    
    total_chunks = 0
    
    for pdf_path in pdf_files:
        if os.path.exists(pdf_path):
            print(f"\nProcessing: {pdf_path}")
            print("-" * 40)
            
            try:
                chunks = run_ingestion(pdf_path)
                print(f"✓ Successfully ingested {len(chunks)} chunks from {pdf_path}")
                total_chunks += len(chunks)
            except Exception as e:
                print(f"✗ Error processing {pdf_path}: {e}")
                import traceback
                traceback.print_exc()
        else:
            print(f"⚠ File not found: {pdf_path}")
    
    print("\n" + "=" * 50)
    print(f"Total chunks processed: {total_chunks}")
    print("Ingestion process completed!")

if __name__ == "__main__":
    main()