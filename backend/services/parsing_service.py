import ast
import os

class ParsingService:
    def __init__(self, chunk_size=300):
        self.chunk_size = chunk_size

    def chunk_file_content(self, filepath: str, content: str) -> list[str]:
        """Simple line-based chunking."""
        lines = content.split('\n')
        chunks = []
        for i in range(0, len(lines), self.chunk_size):
            chunk_lines = lines[i:i + self.chunk_size]
            chunks.append(f"File: {filepath}\n" + '\n'.join(chunk_lines))
        return chunks

    def process_repository(self, file_paths: list[str]) -> list[dict]:
        """Reads all files and chunks them."""
        documents = []
        for path in file_paths:
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Optional: AST parsing for Python to extract structure
                    # if path.endswith('.py'):
                    #     tree = ast.parse(content)
                        
                    chunks = self.chunk_file_content(path, content)
                    for chunk in chunks:
                        documents.append({"filepath": path, "content": chunk})
            except Exception as e:
                # Ignore binary files or unreadable encodings
                continue
                
        return documents
