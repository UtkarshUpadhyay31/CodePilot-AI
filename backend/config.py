import os

class Settings:
    PROJECT_NAME: str = "CodePilot AI Backend"
    
    # Directories
    BACKEND_DIR: str = os.path.dirname(os.path.abspath(__file__))
    BASE_DIR: str = os.path.dirname(BACKEND_DIR)
    
    # Model configuration
    # Look for files in the root workspace
    MODEL_PATH: str = os.environ.get("MODEL_PATH", os.path.join(BASE_DIR, "code_model.keras"))
    TOKENIZER_PATH: str = os.environ.get("TOKENIZER_PATH", os.path.join(BASE_DIR, "tokenizer (1).pkl"))
    
    MAX_SEQUENCE_LENGTH: int = 200
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["*"]

settings = Settings()
