from pydantic import BaseModel, Field

class EvaluationResultBaseModel(BaseModel):
    decision: str = Field(description="accept / reject")
    credit_score: str = Field(description="credit score out of 100")
    comment: str = Field(description="brief explanation of the decision")
    risk_factor: str = Field(description="risk factors such as gambling, low income, big purchase, luxury lifestyle, etc.")