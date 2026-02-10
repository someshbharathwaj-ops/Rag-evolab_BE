"""
Test script to run the ingestion pipeline on your PDFs
"""
import os
from ingestion.pipeline import run_ingestion

def main():
    # Path to your PDF files from the screenshot
    pdf_files = [
        "data/raw/1-s2.0-S1877050924021860-main.pdf",
        "data/raw/2504.07615v2.pdf"
    ]
    
    for pdf_path in pdf_files:
        if os.path.exists(pdf_path):
            print(f"\n{'='*60}")
            print(f"Processing: {pdf_path}")
            print(f"{'='*60}")
            
            try:
                chunks = run_ingestion(pdf_path)
                print(f"✓ Successfully ingested {len(chunks)} chunks from {pdf_path}")
            except Exception as e:
                print(f"✗ Error processing {pdf_path}: {e}")
        else:
            print(f"⚠ File not found: {pdf_path}")

if __name__ == "__main__":
    main()