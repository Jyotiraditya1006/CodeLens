import os
import google.generativeai as genai
from typing import Dict, Any
from dotenv import load_dotenv
import json

load_dotenv()

# Configure the AI API using the key from environment variables
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class AIService:
    @staticmethod
    def analyze_code(file_path: str, code_content: str) -> Dict[str, Any]:
        """
        Sends the code content to the AI and requests a code review and patch.
        Returns a structured dictionary with issues and fixes.
        """
        if not api_key:
            return {
                "error": "GEMINI_API_KEY not found in environment variables.",
                "issues": [],
                "suggested_patch": None
            }

        prompt = f"""
        You are an expert Code Reviewer and AI Agent. 
        Analyze the following code for code smells, bugs, complexity, and maintainability.
        
        File: {file_path}
        
        Code:
        ```
        {code_content}
        ```
        
        Return your analysis STRICTLY as a JSON object with the following schema, and no other text:
        {{
            "health_score_impact": <integer from 0 to -20 indicating how much to deduct from overall health>,
            "issues": [
                {{
                    "type": "Code Smell" | "Bug" | "Complexity",
                    "description": "...",
                    "line_numbers": [start, end]
                }}
            ],
            "suggested_patch": "The FULL patched code block, ready to replace the original content. If no changes needed, return null."
        }}
        """

        try:
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt)
            
            # Extract JSON from the markdown code block if present
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:-3]
            elif response_text.startswith("```"):
                response_text = response_text[3:-3]
                
            result = json.loads(response_text)
            return result
            
        except Exception as e:
            print(f"AI Analysis Failed for {file_path}: {str(e)}")
            return {
                "error": str(e),
                "issues": [],
                "suggested_patch": None
            }
