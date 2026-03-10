import os
import weaviate
import numpy as np
from dotenv import load_dotenv

def test_weaviate_connection():
    try:
        load_dotenv()
        
        url = os.getenv("WEAVIATE_URL")
        api_key = os.getenv("WEAVIATE_API_KEY")
        
        if not url or not api_key:
            print("Missing WEAVIATE_URL or WEAVIATE_API_KEY")
            return False
        
        client = weaviate.connect_to_weaviate_cloud(
            cluster_url=url,
            auth_credentials=weaviate.auth.AuthApiKey(api_key)
        )
        
        collection_name = "TestCollection"
        
        if collection_name in client.collections.list_all():
            client.collections.delete(collection_name)
        
        client.collections.create(
            name=collection_name,
            vectorizer_config=weaviate.classes.config.Configure.Vectorizer.none(),
            properties=[
                weaviate.classes.config.Property(
                    name="text",
                    data_type=weaviate.classes.config.DataType.TEXT
                )
            ]
        )
        
        collection = client.collections.get(collection_name)
        
        test_data = [
            "Artificial intelligence is transforming technology",
            "Machine learning algorithms process data patterns",
            "Natural language processing understands human text"
        ]
        
        def simple_embed(text):
            words = text.lower().split()
            vector = [len(words), sum(ord(c) for c in text) % 100, len([w for w in words if len(w) > 4])]
            return vector + [0] * (384 - len(vector))
        
        with collection.batch.dynamic() as batch:
            for text in test_data:
                vector = simple_embed(text)
                batch.add_object(
                    properties={"text": text},
                    vector=vector
                )
        
        query_vector = simple_embed("What is AI?")
        
        response = collection.query.near_vector(
            near_vector=query_vector,
            limit=2,
            return_properties=["text"]
        )
        
        print(f"Connected: {url}")
        print(f"Collection created: {collection_name}")
        print(f"Test data uploaded: {len(test_data)} items")
        print(f"Search results: {len(response.objects)} found")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = test_weaviate_connection()
    exit(0 if success else 1)