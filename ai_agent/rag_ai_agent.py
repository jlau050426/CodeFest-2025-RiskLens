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
import time

from sqlalchemy.testing.suite.test_reflection import metadata

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=api_key)
client = genai.Client(api_key=api_key)

system_instruction = ("You are a professional financial advisor that provides accurate and concise information. You are "
                      "limited to 50 words per response. Always provide your answers in a structured format. You need to "
                      "answer based on the information provided, do not make up any information. If you don't know, just say so.")


def read_company_pdf():
    # load file
    path = "files/company"
    print(f"Looking for company PDFs in: {os.path.abspath(path)}")
    loader = GenericLoader(
        blob_loader=FileSystemBlobLoader(
            path=os.path.abspath(path),
            glob="*.pdf",
        ),
        blob_parser=PyPDFParser(),
    )
    print("Company PDF loaded successfully.")
    return loader.load()

def read_customer_pdf():
    # load file
    path = "files/client"
    print(f"Looking for customer PDFs in: {os.path.abspath(path)}")
    loader = GenericLoader(
        blob_loader=FileSystemBlobLoader(
            path=os.path.abspath(path),
            glob="*.pdf",
        ),
        blob_parser=PyPDFParser(),
    )
    print("Customer PDF loaded successfully.")
    return loader.load()

# create model
# llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp")

def store_customer_document():
    customer_docs = read_customer_pdf()
    customer_result = FAISS.from_documents(
        documents=customer_docs,
        embedding=embeddings
    )
    customer_result.save_local("./db/customer_db")
    print("Customer documents stored successfully.")
    return customer_result

def store_company_document():
    company_docs = read_company_pdf()
    if not company_docs:
        print("No company documents found. Aborting vector store creation.")
        return None
    print(f"Loaded {len(company_docs)} company documents.")
    company_result = FAISS.from_documents(
        documents=company_docs,
        embedding=embeddings
    )

    company_result.save_local("./db/company_db")
    print("Company documents stored successfully.")
    return company_result

def store_evaluation(evaluation_text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(evaluation_text)
    chunk_docs = [Document(page_content=chunk, metadata={"timestamp":time.time()}) for chunk in chunks]
    vector_store = FAISS.from_documents(
        documents=chunk_docs,
        embedding=embeddings
    )
    vector_store.save_local("./db/evaluation_db")
    print("Evaluation stored successfully.")
    return vector_store

def retrieve_docs(query, action):
    if not os.path.exists(f"./db/{action}_db"):
        os.mkdir(f"./db/{action}_db")
    try:
        load_path = f"./db/{action}_db"
        vector_store = FAISS.load_local(
            load_path,
            embeddings,
            allow_dangerous_deserialization=True
        )
        result = vector_store.similarity_search(system_instruction + query, k=5)
        print(f"{action} documents retrieved successfully.")
        return result
    except Exception as e:
        print(f"Error retrieving {action} documents: {e}")
        return []


def summarise_important_key(prompt):
    system_prompt = system_instruction
    prompt = "summarise the important key points from the document provided based on the user prompt: " + prompt
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            temperature=0.1
        ),
        contents="this is the document provided: " + "\n" + prompt
    )
    print("Important key points summarised successfully.")
    return response

def search_background(website_url: str, name: str, links: list):
    system_prompt = system_instruction
    user_prompt = f"""
    This is the links provided: {" ".join(links)}. This is the the person's business website url 
    {website_url} If you cannot find the exactly person, just say so. You are allowed to not only use the provided links,
    but also search the web to find relevant information about the person based on the links provided."""
    grounding_tool = types.Tool(
        google_search=types.GoogleSearch()
    )

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        tools=[grounding_tool]
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        config=config,
        contents=user_prompt
    )
    print("Background search completed successfully.")
    return response.text

def risk_assesment_evaluation(all_info):
    system_prompt = (
        "Based on the information provided, assess the credit risk score of the client and provide reasons for your assessment.\n" +
        system_instruction
    )

    user_prompt = f"""Please provide a credit risk assessment based on the information provided. This is the information 
    provided: 
    ${all_info}. "You must respond in JSON format with the following fields:
    - decision: accept / reject
    - credit_score: credit score out of 100
    - comment: brief explanation of the decision
    - risk_factor: risk factors such as gambling, low income, big purchase, luxury lifestyle
    - personality_insight: insight based on the personality analysis
    - past_evaluation_reference: reference to past evaluation if any, and explain how it influenced the decisiongit pull origin main --allow-unrelated-histories
    Provide a detail explanation for comment, risk factor, personality insight in less than 100 words. """

    response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json"
            ),
        )
    return response.text

def evaluate_image():
    image_path = "image/customer_image.png"
    if not os.path.isfile(image_path):
        print(f"Error: File '{image_path}' not found.")
        return "Error: Image file not found."
    with open(image_path, 'rb') as f:
        image_bytes = f.read()
    print(f"Image bytes type: {type(image_bytes)}, length: {len(image_bytes)}")
    if not image_bytes:
        print("Error: Image file is empty.")
        return "Error: Image file is empty."
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
                "Based on the image provided, identify the environment and determine if user is honest with his financial profile"
            ],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        print("Image evaluation completed successfully.")
        return response.text
    except Exception as e:
        print(f"Error during Gemini API call: {e}")
        return f"Error during Gemini API call: {e}"
