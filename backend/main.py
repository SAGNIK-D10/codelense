import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from services.repo_service import RepoService
from services.parsing_service import ParsingService
from services.embedding_service import EmbeddingService
from services.llm_service import LLMService

app = FastAPI(title="AI Codebase Explainer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
repo_service = RepoService()
parsing_service = ParsingService(chunk_size=150)
embedding_service = EmbeddingService()
llm_service = LLMService()

class RepoRequest(BaseModel):
    url: str

class ChatRequest(BaseModel):
    repo_url: str
    question: str

@app.post("/analyze-repo")
async def analyze_repo(req: RepoRequest):
    if not req.url.startswith("https://github.com/"):
        raise HTTPException(status_code=400, detail="Invalid GitHub URL")
    
    try:
        print(f"Analyzing {req.url}...")
        repo_path = repo_service.clone_repository(req.url)
        files = repo_service.get_all_files(repo_path)
        
        print(f"Found {len(files)} files. Chunking...")
        documents = parsing_service.process_repository(files)
        
        print(f"Ingesting {len(documents)} chunks to FAISS...")
        await embedding_service.ingest_documents(documents)
        
        print("Generating project insights via LLM...")
        insights = await llm_service.generate_explanation_and_readme(documents)
        
        return {
            "status": "success",
            "message": "Repository analyzed successfully.",
            "overview": insights.get("overview", ""),
            "architecture_diagram": insights.get("architecture_mermaid", ""),
            "readme": insights.get("readme_md", "")
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask-question")
async def ask_question(req: ChatRequest):
    try:
        chunks = await embedding_service.retrieve_relevant_chunks(req.question)
        answer = await llm_service.answer_question(req.question, chunks)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
