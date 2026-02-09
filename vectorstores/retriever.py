
def retrieve_chunks(query: str, top_k: int = 5):
    """
    Mock retriever for testing RAG without a vector store.
    """
    return [
        {
            "text": "The paper proposes a new method for efficient information retrieval.",
            "metadata": {"source": "paper1.pdf"}
        },
        {
            "text": "Experimental results demonstrate improved performance over baseline methods.",
            "metadata": {"source": "paper1.pdf"}
        }
    ]
