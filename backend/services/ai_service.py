import os
from google import genai
from typing import Dict, Any
from dotenv import load_dotenv
import json

load_dotenv()

# Configure the AI API using the key from environment variables
api_key = os.getenv("GEMINI_API_KEY")

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

        # --- CUSTOM ML CLASSIFIER INFERENCE ---
        ml_vulnerability_score = 0
        ml_confidence = "Unknown"
        try:
            import joblib
            vectorizer_path = os.path.join(os.path.dirname(__file__), "..", "ml_models", "tfidf_vectorizer.pkl")
            clf_path = os.path.join(os.path.dirname(__file__), "..", "ml_models", "rf_classifier.pkl")
            
            if os.path.exists(vectorizer_path) and os.path.exists(clf_path):
                vectorizer = joblib.load(vectorizer_path)
                clf = joblib.load(clf_path)
                
                # Transform the code content
                X_vec = vectorizer.transform([code_content])
                
                # Predict probability of being vulnerable (label 1)
                proba = clf.predict_proba(X_vec)[0]
                # If the classifier has 2 classes, proba[1] is the probability of being vulnerable
                if len(proba) > 1:
                    ml_vulnerability_score = round(proba[1] * 100, 2)
                    
                ml_confidence = "High" if ml_vulnerability_score > 80 or ml_vulnerability_score < 20 else "Medium"
        except Exception as e:
            print(f"ML Classifier inference failed: {e}")
        # ----------------------------------------

        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt
            )
            
            # Extract JSON from the markdown code block if present
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:-3]
            elif response_text.startswith("```"):
                response_text = response_text[3:-3]
                
            result = json.loads(response_text)
            
            # Inject our Custom ML Score into the AI Response!
            result["ml_vulnerability_probability"] = ml_vulnerability_score
            result["ml_confidence"] = ml_confidence
            
            return result
            
        except Exception as e:
            print(f"AI Analysis Failed for {file_path}: {str(e)}")
            return {
                "error": str(e),
                "issues": [],
                "suggested_patch": None
            }
