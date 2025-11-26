from typing import List

from pydantic import BaseModel
class UserBaseModel(BaseModel):
    name: str
    age: int
    email: str
    gross_monthly_income: float
    employment_status: str
    loan_purpose: str
    company_name: str
    website_url: str
    social_links: List[str]
    income_source: str | None = None