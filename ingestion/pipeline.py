import json
import os

from loaders.loaders import load_pdf
from splitters.splitters import token_based_splitter as split_text

RAW_DATA_DIR = "data/raw"
CHUNKS_DIR = "data/chunks"


def run_ingestion():
    all_chunks = []

    for file_name in os.listdir(RAW_DATA_DIR):
        if not file_name.endswith(".pdf"):
            continue

        file_path = os.path.join(RAW_DATA_DIR, file_name)
        pages = load_pdf(file_path)

        for page in pages:
            chunks = split_text(
                text=page["text"],
                metadata=page["metadata"]
            )
            all_chunks.extend(chunks)

    os.makedirs(CHUNKS_DIR, exist_ok=True)

    output_path = os.path.join(CHUNKS_DIR, "chunks.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(all_chunks)} chunks to {output_path}")

if __name__ == "__main__":
    run_ingestion()
