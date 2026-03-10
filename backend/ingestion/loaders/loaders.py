import fitz
from typing import List, Dict


def clean_text(text: str) -> str:
    """Remove extra whitespace and normalize text"""
    clean_text = text.replace('\n', ' ')
    clean_text = clean_text.replace('\r', ' ')
    clean_text = clean_text.replace('\t', ' ')
    # Remove multiple spaces
    clean_text = ' '.join(clean_text.split())
    return clean_text


def load_pdf(file_path: str):
    documents = []
    doc = fitz.open(file_path)

    for page_number in range(doc.page_count):
        page = doc.load_page(page_number)

        blocks = page.get_text("blocks")

        # Sort blocks top-to-bottom
        blocks = sorted(blocks, key=lambda b: (b[1], b[0]))

        page_text = " ".join(block[4] for block in blocks)

        cleaned_text = clean_text(page_text)

        if cleaned_text.strip():
            documents.append({
                "text": cleaned_text,
                "metadata": {
                    "source": file_path,
                    "page": page_number + 1
                }
            })

    doc.close()
    return documents