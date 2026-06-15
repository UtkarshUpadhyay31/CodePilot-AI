from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    code: str = Field(..., description="The context code snippet to predict the next token for.", examples=["vector<int>"])

class PredictResponse(BaseModel):
    prediction: str = Field(..., description="The predicted next token.", examples=["nums"])
