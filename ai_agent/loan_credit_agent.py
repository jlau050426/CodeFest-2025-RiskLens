from ai_agent.rag_ai_agent import store_company_document, store_customer_document, retrieve_docs, search_background, summarise_important_key, \
    risk_assesment_evaluation, store_evaluation, evaluate_image
from ai_agent.company_brochure_creator import create_brochure
from models.User import User
from models.Company import Company
from models.Website import Website

def loan_credit_chain(name, age, email, gross_monthly_income, employment_status, company_name, website_url, loan_purpose, social_links):
    # receive company info
    # company info is saved into the database
    result = store_company_document()
    # receive bank statement, salary slip, epf statement pdf and store into the user database
    customer_result = store_customer_document()
    # agent research for the background of the user based on the social media link / company link provided
    # receive user data
    user = User(name, age, email, gross_monthly_income, employment_status, loan_purpose)
    # agent can analyze image provided by the user -> the picture is valid or not? create user financial profile
    # image_evaluation_result = evaluate_image()
    # questionaire test
    # code here
    # personality result
    company = Company(company_name, website_url)
    website = Website(website_url)
    background_result = search_background(links=social_links, name=name)
    # company summation
    try:
        company_summarization = create_brochure(company_name, website)
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
            "company_summarization": company_summarization,
            "background_result": background_result,
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
        # remove the user db once the risk assessment evaluation is done
        # remove_db()
        # remove_db()
        # # remove all of the client files and images
        # os.rmdir("files/client")
        # print("Client files removed.")
        # os.rmdir("image")
        # print("Client images removed.")
        return evaluation_result
    except Exception as e:
        print(f'Error: {e}')
# try to launch to the cloud
# test the api endpoint