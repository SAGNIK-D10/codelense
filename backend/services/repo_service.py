import os
import shutil
import tempfile
from git import Repo

# Common directories and files to ignore
IGNORE_DIRS = {'.git', 'node_modules', 'dist', 'build', 'venv', '__pycache__', '.pytest_cache', 'target', 'bin', 'obj'}
IGNORE_EXTENSIONS = {
    '.exe', '.dll', '.so', '.dylib', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
    '.pdf', '.zip', '.tar', '.gz', '.mp3', '.mp4', '.woff', '.woff2', '.ttf', '.eot'
}

class RepoService:
    def __init__(self, data_dir="data"):
        self.data_dir = os.path.abspath(data_dir)
        os.makedirs(self.data_dir, exist_ok=True)

    def _extract_repo_name(self, url: str) -> str:
        # e.g., https://github.com/user/repo
        parts = url.rstrip('/').split('/')
        if len(parts) >= 2:
            return f"{parts[-2]}_{parts[-1]}"
        return "repo"

    def clone_repository(self, url: str) -> str:
        """Clones a GitHub repo to a local directory and returns the path."""
        repo_name = self._extract_repo_name(url)
        target_path = os.path.join(self.data_dir, repo_name)
        
        if os.path.exists(target_path):
            print(f"Repository already exists at {target_path}. Using cached version.")
            return target_path
            
        print(f"Cloning repository from {url} to {target_path}...")
        try:
            Repo.clone_from(url, target_path, depth=1) # Shallow clone for speed
            return target_path
        except Exception as e:
            print(f"Error cloning repository: {e}")
            raise Exception(f"Failed to clone repository: {str(e)}")

    def get_all_files(self, repo_path: str) -> list[str]:
        """Traverses the repository and returns a list of valid file paths."""
        valid_files = []
        for root, dirs, files in os.walk(repo_path):
            # Prune ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext not in IGNORE_EXTENSIONS:
                    valid_files.append(os.path.join(root, file))
                    
        return valid_files
