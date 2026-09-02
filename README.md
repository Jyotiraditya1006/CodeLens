<div align="center">
  <img src="https://img.shields.io/badge/CodeLens-AI_Powered-blue?style=for-the-badge" alt="CodeLens" />
  <h1>CodeLens</h1>
  <p>An advanced, AI-driven code health analyzer and auto-remediation platform.</p>
</div>

---

## 🚀 Overview

**CodeLens** is a modern SaaS platform designed to deeply analyze GitHub repositories, calculate cyclomatic complexity, flag architectural code smells, and instantly generate ready-to-merge patches using large language models. Instead of merely linting your code, CodeLens contextually understands your repository's logic and writes the fixes for you.

## 🛠️ Tech Stack

CodeLens is built using a highly performant, decoupled architecture:

### Frontend
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Visualization:** Recharts, Monaco Editor (for AI patch previewing)
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI
- **Language:** Python 3
- **Server:** Uvicorn
- **AI Integration:** Google Gemini 1.5 Pro API
- **Git Operations:** Native Python `subprocess` interacting with local `git` execution environments.

## 🧠 Architecture & Flowchart

The following flowchart demonstrates how CodeLens safely clones, analyzes, and patches repositories in real-time.

```mermaid
graph TD
    A[User Pastes GitHub URL] -->|Clicks Scan| B[Next.js Frontend]
    B --> |POST /api/analyze/github| C(FastAPI Backend)
    
    subgraph Backend Architecture
    C --> D[Git Service: Clone Repo to Temp Dir]
    D --> E[Analysis Service: Scan AST & LOC]
    E --> F[Filter & Select Problematic Files]
    F --> G[Gemini 1.5 Pro API]
    G --> |Generates Strict JSON Patch| H[Calculate Health Score]
    end
    
    H --> I[Return Analysis & Insights payload]
    I --> B
    
    subgraph User Dashboard
    B --> J[Render Health Dashboard]
    J --> K[User Clicks Actionable Insight]
    K --> L[Monaco Editor: Side-by-Side Review]
    end
```

## 💻 Getting Started (Local Development)

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Activate virtual environment
.\venv\Scripts\Activate.ps1   # Windows
source venv/bin/activate      # Mac/Linux

pip install -r requirements.txt

# Create a .env file and add your Gemini API Key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run the server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🔒 Security & Privacy
CodeLens is built with a zero-retention architecture. All GitHub repositories are cloned into temporary sandboxed environments and instantly purged upon the completion of the AI analysis. Your proprietary source code is never used to train our foundational models.

## 📄 License
This project is licensed under the terms of the MIT license.
