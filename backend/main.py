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

class SnippetRequest(BaseModel):
    code: str
    filename: str = "snippet.txt"

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Code Health Analyzer API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/analyze/snippet")
def analyze_snippet(request: SnippetRequest):
    try:
        from services.ai_service import AIService
        
        # Count lines for metrics
        lines = request.code.split('\n')
        loc = len(lines)
        size_bytes = len(request.code.encode('utf-8'))
        
        # Analyze directly with AI
        ai_result = AIService.analyze_code(request.filename, request.code)
        
        health_score = 100
        ai_insights = []
        
        if not ai_result.get('error'):
            health_score += ai_result.get('health_score_impact', 0)
            ai_insights.append({
                "file": request.filename,
                "analysis": ai_result
            })
            
        health_score = max(0, min(100, health_score))
            
        analysis_results = {
            "health_score": health_score,
            "total_files": 1,
            "total_lines": loc,
            "file_metrics": [{
                "path": request.filename,
                "loc": loc,
                "size_bytes": size_bytes
            }],
            "ai_insights": ai_insights
        }
        
        return {
            "status": "success",
            "repository": "Direct Snippet Analysis",
            "analysis": analysis_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/github")
def analyze_github_repo(request: RepoRequest):
    repo_path = None
    try:
        # Clone the repo
        repo_path = GitService.clone_repo(request.url)
        
        # Analyze the repo
        analysis_results = AnalysisService.scan_directory(repo_path)
        
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

