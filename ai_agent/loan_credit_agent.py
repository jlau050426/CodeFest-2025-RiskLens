from ai_agent.rag_ai_agent import store_company_document, store_customer_document, retrieve_docs, search_background, summarise_important_key, \
    risk_assesment_evaluation, store_evaluation, evaluate_image
from ai_agent.company_brochure_creator import create_brochure
from models.User import User
from models.Company import Company
from models.Website import Website
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)


personality_result = None
# personality result
def evaluate_test_score(test_score):
    user_prompt = f"""
            Based on the test score: {test_score}, you need to evaluate 
            the creditworthiness of the user base on the behaviors such as self-control, conscientiousness, 
            effective economic decision-making and attitue toward money. The test score is from -10 to 10. Provide your 
            answer in 50 words
            """
    response = client.models.generate_content(model="gemini-2.5-flash",
                                   contents=user_prompt)
    global personality_result
    personality_result = response.text
    print(personality_result)


def loan_credit_chain(name, age, email, gross_monthly_income, employment_status, company_name, website_url, loan_purpose, social_links, month_debt=None):
    # receive company info
    # company info is saved into the database
    result = store_company_document()
    # receive bank statement, salary slip, epf statement pdf and store into the user database
    customer_result = store_customer_document()
    # agent research for the background of the user based on the social media link / company link provided
    # receive user data
    user = User(name, age, email, gross_monthly_income, employment_status, loan_purpose, month_debt)
    # agent can analyze image provided by the user -> the picture is valid or not? create user financial profile
    image_result = evaluate_image()
    # company = Company(company_name, website_url)
    # website = Website(website_url)
    background_result = search_background(website_url=website_url, links=social_links, name=name)
    # company summation
    try:
        # company_summarization = create_brochure(company_name, website)
        # summarise background result, company summation, user info, picture, social media link, bank statement, salary slip, epf statement from databse(rag)
        retrieved_company_info = retrieve_docs(
            user.loan_purpose + "Search for the infomation that is related to personal loan", action="company")
        retrieved_customer_info = retrieve_docs(
            user.loan_purpose + "Search for the that is needed to evalute the person's risk credit", action="customer")
        # retrieve the past risk assessment evaluation from the database
        past_evaluation = retrieve_docs(user.loan_purpose + "Retreive the related info that can evaluate the loan purpose",
                                        action="evaluation")
        # restructure the data
        combined_info = {
            "user_info": user.to_string(),
            "background_result": background_result,
            "personality_result": personality_result,
            "user_image_result": image_result,
            "retrieved_company_metadata": retrieved_company_info[0].metadata,
            "retrieved_company_info": retrieved_company_info[0].page_content,
            "retrieved_customer_metadata": retrieved_customer_info[0].metadata,
            "retrieved_customer_info": retrieved_customer_info[0].page_content,
            "useful_past_evaluation": past_evaluation
        }

        for key in combined_info.keys():
            print(key, ": ", combined_info[key])
        # perform risk assessment_evaluation
        print("*" * 100)
        print("Performing risk assessment evaluation...")
        evaluation_result = risk_assesment_evaluation(all_info=combined_info)
        print("####"*100)
        print(evaluation_result)
        # store the risk assessment evaluation into the database
        evaluation_store = store_evaluation(evaluation_result)
        # if the database exceed a certain limit, summarise the data and remove the old data
        return evaluation_result
    except Exception as e:
        print(f'Error: {e}')
# try to launch to the cloud
# test the api endpoint