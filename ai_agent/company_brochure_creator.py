import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from models.Website import Website
# import api model
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def validate_website_url(website: Website):
    if not hasattr(website, 'url') or not website.url or not isinstance(website.url, str) or website.url.strip() == "":
        raise ValueError("Website URL is missing or invalid.")

# system prompt
def get_links_detail(company: str, website: Website):
    validate_website_url(website)
    sys_prop = ("you are a helpful assistant that helps users to summarize the content of a website. Besides, you "
                "need to summarize the url links in the website: " + "".join(website.links))
    sys_prop += """You need to answer in json format like this: 
    {
        "links": "https://example.com", 
        "type": "home page"
    }"""

    chat = client.chats.create(model="gemini-2.5-pro", config=types.GenerateContentConfig(
        response_mime_type="application/json",
        system_instruction=sys_prop
    ))

    response = chat.send_message_stream("Please summarize the website: " + company)
    all_response = []
    for message in response:
        all_response.append(message.text)
    return "".join(all_response)

def user_prompt_create_broucher(company: str):
    user_prompt = f"""create a broucher for the company:{company}. The broucher should include: 
                    1. company name
                    2. company website
                    3. company product and services
                    4. company contact information
                    5. company address
                    7. company phone number
                    """
    return user_prompt

def create_brochure(company: str, website: Website):
    validate_website_url(website)
    user_prop = user_prompt_create_broucher(company) + "\n\n" + get_all_details(website, company)
    chat = client.chats.create(model="gemini-2.5-flash", config=types.GenerateContentConfig(
        response_mime_type="text/plain"
    ))

    response = chat.send_message(user_prop + "Provide the respond in 100 words only")
    return response.text

def get_all_details(website: Website, company):
    validate_website_url(website)
    website_detail = "Landing page \n"
    website_detail += website.get_content()
    website_detail += "\n\nLinks detail \n"
    website_detail += get_links_detail(company, website)
    return website_detail
