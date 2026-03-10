import weaviate
from weaviate.classes.config import Configure
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

load_dotenv()

class WeaviateStore:
    def __init__(self):
        self.url = os.getenv("WEAVIATE_URL")
        self.api_key = os.getenv("WEAVIATE_API_KEY")
        
        if not self.url or not self.api_key:
            raise ValueError("WEAVIATE_URL and WEAVIATE_API_KEY must be set in environment variables")
        
        self.client = weaviate.connect_to_weaviate_cloud(
            cluster_url=self.url,
            auth_credentials=weaviate.auth.AuthApiKey(self.api_key),
            headers={
                "X-HuggingFace-Api-Key": os.getenv("HUGGINGFACE_API_KEY", os.getenv("HUGGING_FACE_TOKEN", ""))
            }
        )
        print(f"Weaviate Cloud connected: {self.url}")
        
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.collection_name = "DocumentChunks"
        self._setup_collection()
    
    def _setup_collection(self):
        if self.collection_name in self.client.collections.list_all():
            self.collection = self.client.collections.get(self.collection_name)
            return
        
        self.client.collections.create(
            name=self.collection_name,
            vectorizer_config=Configure.Vectorizer.none(),
            properties=[
                weaviate.classes.config.Property(
                    name="text",
                    data_type=weaviate.classes.config.DataType.TEXT
                ),
                weaviate.classes.config.Property(
                    name="source",
                    data_type=weaviate.classes.config.DataType.TEXT
                ),
                weaviate.classes.config.Property(
                    name="page",
                    data_type=weaviate.classes.config.DataType.INT
                )
            ]
        )
        
        self.collection = self.client.collections.get(self.collection_name)
    
    def embed_text(self, text):
        return self.embedder.encode(text).tolist()
    
    def add_documents(self, chunks):
        with self.collection.batch.dynamic() as batch:
            for chunk in chunks:
                vector = self.embed_text(chunk["text"])
                metadata = chunk.get("metadata", {})
                
                batch.add_object(
                    properties={
                        "text": chunk["text"],
                        "source": metadata.get("source", "unknown"),
                        "page": metadata.get("page", 0)
                    },
                    vector=vector
                )
    
    def search(self, query_text, limit=5):
        query_vector = self.embed_text(query_text)
        
        response = self.collection.query.near_vector(
            near_vector=query_vector,
            limit=limit,
            return_properties=["text", "source", "page"]
        )
        
        results = []
        for obj in response.objects:
            results.append({
                "text": obj.properties["text"],
                "metadata": {
                    "source": obj.properties["source"],
                    "page": obj.properties["page"]
                },
                "score": obj.metadata.distance
            })
        
        return results
    
    def close(self):
        self.client.close()
