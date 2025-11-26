from dotenv import load_dotenv
import os
from google import genai
from google.genai import types
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import FileSystemBlobLoader
from langchain_community.document_loaders.generic import GenericLoader
from langchain_community.document_loaders.parsers import PyPDFParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=api_key)
import time
def consolidate_memory(vector_db, embedder):
    # 1. FIND STALE DATA
    # Filter for data older than 7 days that hasn't been summarized yet
    cutoff_date = time.time() - (7 * 24 * 60 * 60)
    old_records = vector_db.query(
        filter={"timestamp": {"$lt": cutoff_date}, "type": "raw_log"}
    )

    if not old_records:
        return "Nothing to summarize."

    # 2. EXTRACT TEXT
    # Combine all text chunks into one string
    combined_text = "\n".join([rec.metadata['text'] for rec in old_records])
    user_prompt = ("Review the following data points. Consolidate them into a single, detailed summary that retains key "
                   "facts, dates, and technical details. Discard conversational fluff.")
    # 3. SUMMARIZE (LLM)
    summary = client.generate(f"Summarize this context deeply: {combined_text}. {user_prompt}")

    # 4. EMBED
    new_vector = embedder.embed_query(summary)

    # 5. SWAP (Store New, Delete Old)
    # Store the summary
    vector_db.upsert(
        vectors=[new_vector],
        metadata={"text": summary, "type": "archived_summary", "timestamp": time.time()}
    )

    # Delete the old chunks
    old_ids = [rec.id for rec in old_records]
    vector_db.delete(ids=old_ids)

    return f"Compressed {len(old_ids)} records into 1 summary."