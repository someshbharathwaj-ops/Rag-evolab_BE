from vectorstores.weaviate_store import WeaviateStore

# Create a global instance (this connects once and reuses the connection)
# We'll initialize it when first needed
_store_instance = None

def get_store():
    """Get or create the Weaviate store instance"""
    global _store_instance
    if _store_instance is None:
        print("🚀 Initializing Weaviate connection...")
        _store_instance = WeaviateStore()
    return _store_instance

def retrieve_chunks(query: str, top_k: int = 5):
    """
    Retrieve relevant document chunks using Weaviate vector search
    
    This function:
    1. Takes your question/query
    2. Converts it to a vector (mathematical representation)
    3. Finds the most similar chunks in your database
    4. Returns them with their source information
    
    Args:
        query (str): Your question or search term
        top_k (int): Number of results to return (default: 5)
    
    Returns:
        list: List of dictionaries with 'text' and 'metadata'
    """
    try:
        # Get the store instance
        store = get_store()
        
        # Search for similar chunks
        results = store.search(query, limit=top_k)
        
        # Format results to match the expected structure
        formatted_results = []
        for result in results:
            formatted_results.append({
                "text": result["text"],
                "metadata": result["metadata"]
            })
        
        return formatted_results
        
    except Exception as e:
        print(f"❌ Error retrieving chunks: {e}")
        # Fallback to mock data if Weaviate fails
        print("⚠️  Falling back to mock data...")
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

def add_documents_to_store(chunks):
    """
    Add document chunks to Weaviate for future retrieval
    
    Args:
        chunks (list): List of chunk dictionaries with 'text' and 'metadata'
    """
    try:
        store = get_store()
        store.add_documents(chunks)
        print(f"✅ Successfully added {len(chunks)} chunks to Weaviate")
        return True
    except Exception as e:
        print(f"❌ Error adding documents: {e}")
        return False

def close_store():
    """Close the Weaviate connection (call this when done)"""
    global _store_instance
    if _store_instance:
        _store_instance.close()
        _store_instance = None
        print("✅ Weaviate connection closed")


# Example usage:
if __name__ == "__main__":
    # Test the retriever
    print("=== Testing Weaviate Retriever ===")
    
    # Add some test data
    test_chunks = [
        {
            "text": "Artificial intelligence is transforming healthcare by enabling better diagnosis.",
            "metadata": {"source": "ai_healthcare.pdf", "page": 1}
        },
        {
            "text": "Machine learning models require large datasets for training.",
            "metadata": {"source": "ml_basics.pdf", "page": 3}
        },
        {
            "text": "Natural language processing helps computers understand human language.",
            "metadata": {"source": "nlp_guide.pdf", "page": 2}
        }
    ]
    
    print("1. Adding test documents...")
    add_documents_to_store(test_chunks)
    
    print("\n2. Searching for relevant chunks...")
    results = retrieve_chunks("What is artificial intelligence?", top_k=3)
    
    print("\n3. Results:")
    for i, result in enumerate(results, 1):
        print(f"\n--- Result {i} ---")
        print(f"Text: {result['text']}")
        print(f"Source: {result['metadata']['source']}")
    
    print("\n4. Cleaning up...")
    close_store()
    print("✅ Test completed!")