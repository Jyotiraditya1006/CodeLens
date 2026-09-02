import os
from typing import List, Dict, Any

class AnalysisService:
    IGNORE_DIRS = {'.git', 'node_modules', 'venv', '__pycache__', 'dist', 'build'}
    
    @staticmethod
    def scan_directory(repo_path: str) -> Dict[str, Any]:
        """
        Scans the directory to build a file tree and calculate basic metrics (LOC, total files).
        """
        total_files = 0
        total_lines = 0
        file_tree = []
        file_metrics = []

        for root, dirs, files in os.walk(repo_path):
            # Mutate dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in AnalysisService.IGNORE_DIRS]
            
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, repo_path)
                
                # Basic line counting (skip binary files)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        loc = len(lines)
                        total_lines += loc
                        
                        file_metrics.append({
                            "path": rel_path,
                            "loc": loc,
                            "size_bytes": os.path.getsize(file_path)
                        })
                except UnicodeDecodeError:
                    # Skip binary files
                    continue
                    
                total_files += 1

        # Calculate a naive health score based on LOC and average file size
        health_score = 100
        
        # Simple heuristic: Identify potentially problematic files (e.g. largest ones)
        # We will pick the top 3 largest files to run deep AI analysis on to save time
        large_files = sorted([f for f in file_metrics if f['loc'] > 50], key=lambda x: x['loc'], reverse=True)
        top_problematic_files = large_files[:3]
        
        # We can dynamically import AIService to avoid circular dependency
        from services.ai_service import AIService
        
        ai_insights = []
        for pf in top_problematic_files:
            file_abs_path = os.path.join(repo_path, pf['path'])
            try:
                with open(file_abs_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Truncate content to avoid token limits if it's too massive
                if len(content) > 15000:
                    content = content[:15000] + "\n... [TRUNCATED]"
                    
                ai_result = AIService.analyze_code(pf['path'], content)
                
                if not ai_result.get('error'):
                    health_score += ai_result.get('health_score_impact', 0)
                    ai_insights.append({
                        "file": pf['path'],
                        "analysis": ai_result
                    })
            except Exception as e:
                print(f"Skipping AI analysis for {pf['path']}: {str(e)}")

        # Ensure score stays between 0 and 100
        health_score = max(0, min(100, health_score))

        return {
            "health_score": health_score,
            "total_files": total_files,
            "total_lines": total_lines,
            "file_metrics": file_metrics,
            "ai_insights": ai_insights
        }
