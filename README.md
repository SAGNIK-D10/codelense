# AI Codebase Explainer

A production-ready full-stack web application designed for developers to instantly understand any GitHub repository. 

By simply pasting a GitHub URL, the app clones the repository, analyzes its structure, and uses a local vector database coupled with RAG (Retrieval-Augmented Generation) to explain the codebase, generate a README, draw architecture diagrams, and provide an interactive Q&A chat.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** Python, FastAPI, Uvicorn
- **AI / ML:** OpenAI GPT (gpt-4o-mini), FAISS (Local Vector DB), LangChain patterns
- **Other:** Mermaid.js, GitHub API

## Project Structure
```text
codelense/
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Main route views
│   │   └── index.css     # Tailwind styling
│   └── package.json
└── backend/              # Python application (FastAPI)
    ├── data/             # Cloned repos & FAISS indices are stored here
    ├── services/         # Core business logic logic
    │   ├── repo_service.py       # GitHub cloning & file traversing
    │   ├── parsing_service.py    # Code chunking
    │   ├── embedding_service.py  # FAISS Vector Indexing
    │   └── llm_service.py        # OpenAI API interaction
    ├── .env              # Environment configurations
    └── main.py           # API routes
```

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Create and activate a Virtual Environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install "fastapi[all]" pydantic python-dotenv faiss-cpu openai gitpython tiktoken
   ```
4. Set up environment variables:
   Update the `backend/.env` file with your actual `OPENAI_API_KEY`.
5. Run the server:
   ```bash
   python main.py
   ```
   *Runs on `http://localhost:8000`*

### 2. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *Runs on `http://localhost:5173`*

## Usage
1. Open up `http://localhost:5173` in your browser.
2. Enter the URL of a public GitHub repository.
3. Wait for the pipeline to clone, embed, and analyze the repo.
4. Explore the Overview, Architecture, Generated README, and ask questions!
