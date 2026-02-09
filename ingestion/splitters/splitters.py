import uuid
import tiktoken

def token_based_splitter(
    text: str,
    metadata: dict,
    model_name: str = "gpt-4o-mini",
    chunk_size: int = 512,
    chunk_overlap: int = 100
):
    encoding = tiktoken.encoding_for_model(model_name)
    tokens = encoding.encode(text)

    chunks = []
    start = 0
    total_tokens = len(tokens)

    while start < total_tokens:
        end = start + chunk_size
        chunk_tokens = tokens[start:end]

        chunk_text = encoding.decode(chunk_tokens)

        chunks.append({
            "chunk_id": str(uuid.uuid4()),
            "text": chunk_text,
            "metadata": metadata | {
                "token_start": start,
                "token_end": min(end, total_tokens)
            }
        })

        if end >= total_tokens:
            break

        start = end - chunk_overlap
        if start < 0:
            start = 0

    return chunks 
