import os
import json
import asyncio
from google import genai
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.client = genai.Client(api_key=self.api_key)
        # Use 1.5-flash — separate quota pool from 2.0 models
        self.model = "gemini-2.5-flash-lite"

    async def _call_gemini(self, prompt: str, retries: int = 3) -> str:
        """Call Gemini with retry logic for rate limits."""
        for attempt in range(retries):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                )
                return response.text
            except Exception as e:
                error_str = str(e)
                if "RESOURCE_EXHAUSTED" in error_str and attempt < retries - 1:
                    wait_time = (attempt + 1) * 10  # 10s, 20s, 30s
                    print(f"Rate limited, retrying in {wait_time}s (attempt {attempt + 1}/{retries})...")
                    await asyncio.sleep(wait_time)
                else:
                    raise

    async def generate_explanation_and_readme(self, code_chunks: list[dict]) -> dict:
        """Generates the architecture diagram, summary, and README based on chunks."""
        # Use fewer chunks to reduce token usage
        context = "\n".join([chunk['content'] for chunk in code_chunks[:10]])

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
        if not self.api_key:
            return {
                "overview": "This is a mock overview because no API key was provided.",
                "architecture_mermaid": "graph TD\\n A[App] --> B[Module]\\n B --> C[Database]",
                "readme_md": "# Mock Project\\nThis project was analyzed without an API key."
            }

        try:
            text = await self._call_gemini(prompt)
            text = text.strip()
            # Remove markdown code fences if present
            if text.startswith("```"):
                text = text.split("\n", 1)[1]
                text = text.rsplit("```", 1)[0].strip()
            result = json.loads(text)
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
        if not self.api_key:
            return f"This is a mock answer. I found {len(relevant_chunks)} relevant chunks for your question: '{question}'"

        try:
            return await self._call_gemini(prompt)
        except Exception as e:
            print(f"Error answering question: {e}")
            return "An error occurred while communicating with the AI model."
