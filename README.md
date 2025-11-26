# Risk lens
## 🏦 AI-Powered Loan Risk Assessment System 

This project is an intelligent loan processing application that leverages Generative AI (Google Gemini) and RAG (Retrieval-Augmented Generation) to analyze loan requests, retrieve context from vector databases, and provide automated risk scoring.

## 🏗️ System Architecture

![System Architecture](software_architecture_diagram.png)

### 🚀 Tech Stack

**Frontend (Client Side)**
* **React / Vite:** High-performance user interface for submitting requests and viewing results.

**Backend (API & Orchestration)**
* **Python:** Core programming language.
* **FastAPI / Uvicorn:** High-performance async API server acting as the main orchestrator.

**AI Intelligence Layer**
* **Google Gemini:** The core reasoning engine responsible for analysis and scoring.
* **LangChain:** Framework for context retrieval and chaining AI workflows.

**Data & Storage**
* **FAISS Vector Store:** Efficient similarity search for embeddings.
    * *Company Data:* Internal policies and guidelines.
    * *Customer Data:* User history and profiles.
    * *Past Evaluations:* Historical decision records.

---

## ⚙️ How It Works

This system follows a 7-step pipeline to process a loan request:

1.  **Submission:** The user submits a loan request via the **React/Vite Frontend**.
2.  **Orchestration:** The **FastAPI** backend receives the request and forwards the user information to the AI Layer.
3.  **Context Retrieval (RAG):**
    * **Google Gemini** initiates a context lookup.
    * **LangChain** queries the **FAISS Vector Store**.
    * Relevant *Company Data* (policies) and *Customer Data* (credit history) are retrieved to ground the AI's decision.
4.  **Analysis & Scoring:** Google Gemini processes the user info alongside the retrieved context to generate a risk score and detailed analysis.
5.  **Result Return:** The scored result is sent back to the Frontend for the user to see.
6.  **Storage:** The evaluation result is embedded and stored in the **Past Evaluations** bucket of the vector store.
7.  **Maintenance (Pruning):**
    * The system checks the timestamp of stored sessions.
    * **Logic:** Is the session > 1 Week old?
    * **Yes:** Summarize the data to save space and prune the raw logs.
    * **No:** Keep the full session active.

---

## 📦 Setup & Installation

### Prerequisites
* Node.js & npm
* Python 3.10+

### Backend Setup
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd .\risklens\
npm install
npm run dev
```
