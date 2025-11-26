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
from sqlalchemy.testing.suite.test_reflection import metadata

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=api_key)
import time
def consolidate_memory():
    vector_db = FAISS.load_local("db/evaluation_db", embeddings, allow_dangerous_deserialization=True)
    # 1. FIND STALE DATA
    # Filter for data older than 7 days that hasn't been summarized yet
    cutoff_date = time.time() - (24 * 7 * 60 * 60)
    print("the cut off date is ", cutoff_date)
    old_records = vector_db.similarity_search(
        query=f"find the document chunks that have timestamp older than {cutoff_date} second"
    )

    print(f"Finished consolidating {len(old_records)} old records")
    if not old_records:
        return "Nothing to summarize."
    print(f"old records: {old_records}")
    # 2. EXTRACT TEXT
    # Combine all text chunks into one string
    combined_text = old_records[0].page_content
    print("Combined text: ", combined_text)
    user_prompt = ("Review the following data points. Consolidate them into a single, detailed summary that retains key "
                   "facts, dates, and technical details. Discard conversational fluff.")
    # 3. SUMMARIZE (LLM)
    summary = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=f"{user_prompt} The data is as: {combined_text}. Limit the summary to 100 words "
    )

    print(f"New Summary: {summary.text}")
    text_spliter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    splitted_summary = text_spliter.split_text(summary.text)
    # Convert each chunk to a Document object
    summary_documents = [Document(page_content=chunk, metadata={"text": summary.text, "type": "archived_summary", "timestamp": time.time()}) for chunk in splitted_summary]
    vector_db.add_documents(documents=summary_documents)
    print("Stored new summary in vector DB.")
    evaluation_db_path = os.path.relpath("db/evaluation_db", os.getcwd())
    size = len(vector_db.index_to_docstore_id)
    print(f"Index size before deletion: {size}")
    # Delete the old chunks
    old_ids = [rec.id for rec in old_records]
    vector_db.delete(ids=old_ids)
    print("Deleted old records from vector DB.")

    size = len(vector_db.index_to_docstore_id)
    print(f"Index size after deletion: {size}")

    return f"Compressed {len(old_ids)} records into 1 summary. Verification complete."
