import time
from fastapi import APIRouter, HTTPException, status
from backend.schemas.generate import GenerateRequest, GenerateResponse
from backend.services.model_service import model_service
from backend.utils.logging import logger

router = APIRouter()

@router.post("/generate", response_model=GenerateResponse, status_code=status.HTTP_200_OK)
async def generate_code_block(request: GenerateRequest):
    """
    Generate a sequence of tokens to complete a C++ code prompt using top-k sampling.
    """
    logger.info(f"Received generate request. Prompt length: {len(request.prompt)} characters, Target tokens: {request.tokens}")
    start_time = time.time()
    
    try:
        # Generate code with top-k sampling (we use k=5 as default)
        generated_code = model_service.generate_code(request.prompt, max_tokens=request.tokens, k=5)
        latency = (time.time() - start_time) * 1000
        logger.info(f"Generation complete. Output length: {len(generated_code)} characters | Latency: {latency:.2f}ms")
        return GenerateResponse(generated_code=generated_code)
    except Exception as e:
        logger.error(f"Generation endpoint error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing code generation: {str(e)}"
        )
