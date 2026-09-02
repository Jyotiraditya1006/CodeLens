import os
import tempfile
import git
import shutil

class GitService:
    @staticmethod
    def clone_repo(repo_url: str) -> str:
        """
        Clones a GitHub repository to a temporary directory.
        Returns the path to the temporary directory.
        """
        try:
            # Create a temporary directory
            temp_dir = tempfile.mkdtemp(prefix="code_health_")
            print(f"Cloning {repo_url} into {temp_dir}...")
            
            # Clone the repository
            git.Repo.clone_from(repo_url, temp_dir)
            
            return temp_dir
        except Exception as e:
            raise Exception(f"Failed to clone repository: {str(e)}")
            
    @staticmethod
    def cleanup(repo_path: str):
        """
        Deletes the temporary directory after analysis is complete.
        """
        try:
            if os.path.exists(repo_path):
                shutil.rmtree(repo_path, ignore_errors=True)
        except Exception as e:
            print(f"Failed to cleanup {repo_path}: {str(e)}")
