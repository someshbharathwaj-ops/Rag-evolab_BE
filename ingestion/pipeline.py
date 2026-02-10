import json
import os

from loaders.loaders import load_pdf
from splitters.splitters import token_based_splitter as split_text
from vectorstores.retriever import add_documents_to_store, close_store

RAW_DATA_DIR = "data/raw"
CHUNKS_DIR = "data/chunks"

def run_ingestion():
    """
    Load PDFs, split them into chunks, and store them in Weaviate
    
    This is like:
    1. Reading all your books
    2. Cutting them into small pieces (chunks)
    3. Putting each piece in your smart library (Weaviate)
    """
    print("📚 Starting document ingestion pipeline...")
    
    all_chunks = []
    
    # Step 1: Load all PDF files
    print(f"📂 Looking for PDFs in: {RAW_DATA_DIR}")
    if not os.path.exists(RAW_DATA_DIR):
        print(f"❌ Directory {RAW_DATA_DIR} not found!")
        return
    
    pdf_files = [f for f in os.listdir(RAW_DATA_DIR) if f.endswith(".pdf")]
    print(f"📄 Found {len(pdf_files)} PDF files")
    
    if not pdf_files:
        print("⚠️  No PDF files found. Add some PDFs to data/raw/ folder")
        return
    
    # Step 2: Process each PDF
    for file_name in pdf_files:
        print(f"\n📖 Processing: {file_name}")
        file_path = os.path.join(RAW_DATA_DIR, file_name)
        
        try:
            # Load the PDF
            pages = load_pdf(file_path)
            print(f"  Loaded {len(pages)} pages")
            
            # Split each page into chunks
            file_chunks = []
            for page in pages:
                chunks = split_text(
                    text=page["text"],
                    metadata=page["metadata"]
                )
                file_chunks.extend(chunks)
            
            print(f"  Created {len(file_chunks)} chunks")
            all_chunks.extend(file_chunks)
            
        except Exception as e:
            print(f"  ❌ Error processing {file_name}: {e}")
            continue
    
    # Step 3: Save chunks to JSON file (backup)
    print(f"\n💾 Saving {len(all_chunks)} chunks to JSON file...")
    os.makedirs(CHUNKS_DIR, exist_ok=True)
    output_path = os.path.join(CHUNKS_DIR, "chunks.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Saved chunks to {output_path}")
    
    # Step 4: Add chunks to Weaviate
    if all_chunks:
        print(f"\n🚀 Adding {len(all_chunks)} chunks to Weaviate...")
        success = add_documents_to_store(all_chunks)
        
        if success:
            print("✅ All documents successfully added to Weaviate!")
        else:
            print("❌ Failed to add documents to Weaviate")
    else:
        print("⚠️  No chunks to add")
    
    # Clean up connection
    close_store()
    print("\n🎉 Ingestion pipeline completed!")

if __name__ == "__main__":
    run_ingestion()