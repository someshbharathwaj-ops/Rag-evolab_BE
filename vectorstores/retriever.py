
import re
from typing import List, Dict

# Mock corpus (simulate chunked PDF data)
MOCK_CHUNKS = [
    {
        "text": "The paper proposes a new method for efficient information retrieval.",
        "metadata": {"source": "paper1.pdf", "chunk_id": 1}
    },
    {
        "text": "Experimental results demonstrate improved performance over baseline methods.",
        "metadata": {"source": "paper1.pdf", "chunk_id": 2}
    },
    {
        "text": "The methodology section describes the model architecture and training process.",
        "metadata": {"source": "paper1.pdf", "chunk_id": 3}
    },
    {
        "text": "The introduction outlines the motivation and background of the study.",
        "metadata": {"source": "paper1.pdf", "chunk_id": 4}
    },
]


def _score_chunk(query: str, chunk_text: str) -> int:
    
    query_tokens = set(re.findall(r"\w+", query.lower()))
    chunk_tokens = set(re.findall(r"\w+", chunk_text.lower()))
    return len(query_tokens & chunk_tokens)


def retrieve_chunks(query: str, top_k: int = 5) -> List[Dict]:
    
    scored_chunks = []

    for chunk in MOCK_CHUNKS:
        score = _score_chunk(query, chunk["text"])
        scored_chunks.append((score, chunk))

    
    scored_chunks.sort(key=lambda x: x[0], reverse=True)

   
    relevant_chunks = [chunk for score, chunk in scored_chunks if score > 0]

    
    if not relevant_chunks:
        relevant_chunks = MOCK_CHUNKS[:top_k]

    return relevant_chunks[:top_k]
