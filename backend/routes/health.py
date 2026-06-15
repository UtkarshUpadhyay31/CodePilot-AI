from fastapi import APIRouter, Response, status
from backend.services.model_service import model_service
from backend.config import settings
from backend.utils.logging import logger

router = APIRouter()

@router.get("/")
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": "1.0.0",
        "description": "Deep Learning Powered Code Autocomplete and Generation Engine",
        "endpoints": {
            "predict": "/api/v1/predict",
            "generate": "/api/v1/generate",
            "health": "/api/v1/health"
        }
    }

@router.get("/health")
async def health_check(response: Response):
    try:
        # Trigger model/tokenizer loading to verify status
        model_service.load_model_and_tokenizer()
        return {
            "status": "healthy",
            "model_loaded": model_service.model is not None,
            "tokenizer_loaded": model_service.tokenizer is not None,
            "max_sequence_length": settings.MAX_SEQUENCE_LENGTH
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return {
            "status": "unhealthy",
            "error": str(e)
        }
