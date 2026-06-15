import time
from fastapi import APIRouter, HTTPException, status
from backend.schemas.predict import PredictRequest, PredictResponse
from backend.services.model_service import model_service
from backend.utils.logging import logger

router = APIRouter()

@router.post("/predict", response_model=PredictResponse, status_code=status.HTTP_200_OK)
async def predict_next_token(request: PredictRequest):
    """
    Predict the next C++ token based on context code.
    """
    logger.info(f"Received predict request. Input length: {len(request.code)} characters")
    start_time = time.time()
    
    try:
        prediction = model_service.predict_next(request.code)
        latency = (time.time() - start_time) * 1000
        logger.info(f"Prediction complete. Token: '{prediction}' | Latency: {latency:.2f}ms")
        return PredictResponse(prediction=prediction)
    except Exception as e:
        logger.error(f"Prediction endpoint error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing token prediction: {str(e)}"
        )
