from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from services.git_service import GitService
from services.analysis_service import AnalysisService

app = FastAPI(title="AI Code Health Analyzer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RepoRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Code Health Analyzer API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/analyze/github")
def analyze_github_repo(request: RepoRequest):
    repo_path = None
    try:
        # Clone the repo
        repo_path = GitService.clone_repo(request.url)
        
        # Analyze the repo
        analysis_results = AnalysisService.scan_directory(repo_path)
        
        # TODO: Add AI integration step here
        
        return {
            "status": "success",
            "repository": request.url,
            "analysis": analysis_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temp directory
        if repo_path:
            GitService.cleanup(repo_path)

