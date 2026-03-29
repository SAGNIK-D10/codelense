import os
import faiss
import numpy as np
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

class EmbeddingService:
    def __init__(self):
        self.index = None
        self.documents = []
        api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1"
        )
        self.dimension = 1536  # text-embedding-3-small dimension

    async def _get_embeddings(self, texts: list[str]) -> list[list[float]]:
        if not self.client.api_key:
            print("Warning: No API key set. Using mock embeddings.")
            return [np.random.rand(self.dimension).tolist() for _ in texts]
            
        try:
            response = await self.client.embeddings.create(
                input=texts,
                model="openai/text-embedding-3-small",
                extra_headers={
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "CodeLense AI Codebase Explainer"
                }
            )
            return [data.embedding for data in response.data]
        except Exception as e:
            print(f"Error getting embeddings: {e}")
            # Fallback to mock embeddings on error
            return [np.random.rand(self.dimension).tolist() for _ in texts]

    async def ingest_documents(self, documents: list[dict]):
        """Creates FAISS index from the documents."""
        if not documents:
            return

        self.documents = documents
        texts = [doc["content"] for doc in documents]
        
        embeddings = await self._get_embeddings(texts)
        
        vectors = np.array(embeddings).astype('float32')
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(vectors)
        print(f"Index built with {self.index.ntotal} vectors.")

    async def retrieve_relevant_chunks(self, query: str, top_k: int = 5) -> list[dict]:
        """Queries FAISS to find top K relevant code chunks."""
        if not self.index or self.index.ntotal == 0:
            return []

        query_embedding = (await self._get_embeddings([query]))[0]
        query_vector = np.array([query_embedding]).astype('float32')
        
        distances, indices = self.index.search(query_vector, min(top_k, len(self.documents)))
        
        results = []
        for idx in indices[0]:
            if idx >= 0:
                results.append(self.documents[idx])
                
        return results
