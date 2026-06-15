from pydantic import BaseModel, Field

class GenerateRequest(BaseModel):
    prompt: str = Field(..., description="The seed code snippet to generate completions for.", examples=["vector<int>"])
    tokens: int = Field(50, description="The maximum number of tokens to generate.", ge=1, le=200, examples=[50])

class GenerateResponse(BaseModel):
    generated_code: str = Field(..., description="The full code snippet including the prompt and the generated tokens.", examples=["vector<int> nums(n);"])
