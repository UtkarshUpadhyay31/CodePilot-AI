import time
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager

from backend.config import settings
from backend.routes import health, predict, generate
from backend.services.model_service import model_service
from backend.utils.logging import setup_logging, logger

# Initialize global logging setup
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Starting CodePilot AI FastAPI Application...")
    start_time = time.time()
    try:
        # Load the tensorflow model and tokenizer pickle into memory once
        model_service.load_model_and_tokenizer()
        logger.info(f"Preloaded AI model successfully in {time.time() - start_time:.2f} seconds.")
    except Exception as e:
        logger.error(f"Failed to preload model at startup: {str(e)}. Server will still start, but predictions will fail.")
    
    yield
    
    # Shutdown actions
    logger.info("Shutting down CodePilot AI Backend...")
    # Clear model references to free memory
    model_service.model = None
    model_service.tokenizer = None
    logger.info("Shutdown sequence finished.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Deep Learning next-token autocomplete and code generation backend for C++ solutions.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS policies for client integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handlers for Production-grade API Response Formatting
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Request validation failure on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "message": "Input validation failed. Please check the format of your request data.",
            "details": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled system error on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please contact the administrator.",
            "details": str(exc) if app.debug else None
        }
    )

# Include endpoint routes directly at root level
app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, tags=["Inference"])
app.include_router(generate.router, tags=["Generation"])
