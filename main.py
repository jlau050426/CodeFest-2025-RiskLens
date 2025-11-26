import json
import shutil
from http import HTTPStatus
from typing import List

from fastapi import FastAPI, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from models.UserBaseModel import UserBaseModel
from ai_agent.loan_credit_agent import loan_credit_chain, evaluate_test_score
from utils.utils import remove_db, remove_folder
import os
from ai_agent.database_learning_agent import consolidate_memory
from langchain_community.vectorstores import FAISS

app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

# 2. Add the CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # List of allowed origins
    allow_credentials=True,         # Allow cookies/authorization headers (requires specific origins, not "*")
    allow_methods=["*"],            # Allow all standard HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],            # Allow all headers
)
@app.post("/upload-customer-pdf/")
async def upload_customer_pdf(files: List[UploadFile] = File(...)):
    if not os.path.exists("./files/client"):
        os.makedirs("./files/client")
    for file in files:
        file_location = f"files/client/{file.filename}"

        # Save the file to the server
        with open(file_location, "wb") as buffer:
            print("Saving file:", file_location)
            shutil.copyfileobj(file.file, buffer)
            print("File saved:", file_location)

    return {"message": "Files uploaded successfully."}

@app.post("/upload-company-pdf/")
async def upload_company_pdf(file: UploadFile = File(...)):
    file_location = f"files/company/{file.filename}"

    # Save the file to the server
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"info": f"file '{file.filename}' saved at '{file_location}'"}

@app.post("/upload-customer-image")
async def upload_customer_image(file: UploadFile = File(...)):
    if not os.path.exists("./image"):
        os.makedirs("./image")
    file_location = "image/customer_image.png"

    # Save the file to the server
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"info": f"file '{file.filename}' saved at '{file_location}'"}

evaluation_result_data = None

@app.post("/start_evaluation")
async def start_evaluation(user_data: UserBaseModel):
    print(user_data.model_dump())
    user_data_dict = user_data.model_dump()
    global evaluation_result_data
    evaluation_result_data = loan_credit_chain(
        name=user_data_dict["name"],
        age=user_data_dict["age"],
        email=user_data_dict["email"],
        gross_monthly_income=user_data_dict["gross_monthly_income"],
        employment_status=user_data_dict["employment_status"],
        company_name=user_data_dict["company_name"],
        website_url=user_data_dict["website_url"],
        loan_purpose=user_data_dict["loan_purpose"],
        social_links=user_data_dict["social_links"]
    )
    print("Evaluation Result Data:")
    print("--" * 100)
    print("Evaluation process completed.")
    print(evaluation_result_data)
    return {"message": "Evaluation started successfully."}

@app.get("/evaluation_result")
async def get_evaluation_result():
    data = json.loads(evaluation_result_data)
    return JSONResponse(content=data, status_code=HTTPStatus.OK)


@app.get("/test", status_code=HTTPStatus.OK)
async def test():
    return {"message": "API is working correctly."}

@app.get("/test-score")
async def test_score(score: int):
    evaluate_test_score(score)
@app.post("/quit")
async def quite_program():
    evaluation_db_path = os.path.abspath("./db/evaluation_db")
    # consolidate database
    consolidate_memory()
    # remove_folder("./files/client")
    # remove_folder("./image")
    # remove_db("./db/customer_db")
