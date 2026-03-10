"""
Script to run the ingestion pipeline on your PDFs
"""
import os
import sys
from ingestion.pipeline import run_ingestion

def main():
    # Add the current directory to Python path
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    # Path to your PDF files 
    pdf_files = [
        "backend/data/raw/6_2024_10_09!10_32_54_AM.pdf" ,
        "backend/data/raw/3712256.pdf",
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