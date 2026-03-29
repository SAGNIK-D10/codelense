import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1"
        )
        self.model = "openai/gpt-4o-mini"  # OpenRouter model path

    async def generate_explanation_and_readme(self, code_chunks: list[dict]) -> dict:
        """Generates the architecture diagram, summary, and README based on chunks."""
        context = "\n".join([chunk['content'] for chunk in code_chunks[:20]])
        
        prompt = f"""
You are an expert Senior Software Engineer analyzing a new GitHub repository.
Based on the provided codebase context, I need you to generate:
1. A concise project overview (1-2 paragraphs).
2. A Mermaid.js flowchart mapping the high level architecture/modules.
3. A structured README.md for the project.

RETURN ONLY VALID JSON. Do not include markdown formatting blocks (```json).
Format:
{{
    "overview": "text",
    "architecture_mermaid": "graph TD\\n...",
    "readme_md": "# Project Title\\n..."
}}

Context:
{context}
"""
        if not self.client.api_key:
            return {
                "overview": "This is a mock overview because no API key was provided.",
                "architecture_mermaid": "graph TD\\n A[App] --> B[Module]\\n B --> C[Database]",
                "readme_md": "# Mock Project\\nThis project was analyzed without an API key."
            }
            
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                extra_headers={
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "CodeLense AI Codebase Explainer"
                }
            )
            import json
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            print(f"Error generating insights: {e}")
            raise

    async def answer_question(self, question: str, relevant_chunks: list[dict]) -> str:
        """Answers a user's question using RAG."""
        context = "\n\n---\n\n".join([chunk['content'] for chunk in relevant_chunks])
        
        prompt = f"""
You are an expert developer helping out a teammate. Answer their question about the codebase based ONLY on the provided context retrieved from the repository files.

Context:
{context}

Question: {question}
"""
        if not self.client.api_key:
            return f"This is a mock answer. I found {len(relevant_chunks)} relevant chunks for your question: '{question}'"
            
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                extra_headers={
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "CodeLense AI Codebase Explainer"
                }
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error answering question: {e}")
            return "An error occurred while communicating with the AI model."
