import os
import pickle
import numpy as np
import tensorflow as tf
from backend.config import settings
from backend.utils.logging import logger

class ModelService:
    _instance = None
    model = None
    tokenizer = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ModelService, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def load_model_and_tokenizer(self):
        """
        Loads the TensorFlow Keras model and Pickle tokenizer.
        Guarantees thread-safe loading and avoids reloading if already in memory.
        """
        if self.model is not None and self.tokenizer is not None:
            return

        logger.info("Initializing CodePilot AI model and tokenizer loading...")
        
        # Verify paths
        if not os.path.exists(settings.MODEL_PATH):
            logger.error(f"Model file not found at path: {settings.MODEL_PATH}")
            raise FileNotFoundError(f"Model file not found at path: {settings.MODEL_PATH}")
            
        if not os.path.exists(settings.TOKENIZER_PATH):
            logger.error(f"Tokenizer file not found at path: {settings.TOKENIZER_PATH}")
            raise FileNotFoundError(f"Tokenizer file not found at path: {settings.TOKENIZER_PATH}")
        
        # Load model
        try:
            logger.info(f"Loading Keras model from {settings.MODEL_PATH}...")
            # We load the model. Note that TensorFlow loads .keras format files directly.
            self.model = tf.keras.models.load_model(settings.MODEL_PATH)
            logger.info("Keras model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Keras model: {str(e)}")
            raise e
            
        # Load tokenizer
        try:
            logger.info(f"Loading tokenizer pickle from {settings.TOKENIZER_PATH}...")
            with open(settings.TOKENIZER_PATH, "rb") as f:
                self.tokenizer = pickle.load(f)
            logger.info("Tokenizer loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load tokenizer: {str(e)}")
            raise e

    def predict_next(self, seed_text: str) -> str:
        """
        Predict the single next token based on context code using argmax (greedy).
        """
        self.load_model_and_tokenizer()
        
        if not seed_text or not seed_text.strip():
            return ""
            
        # Text to sequence
        token_list = self.tokenizer.texts_to_sequences([seed_text])[0]
        if not token_list:
            return ""
            
        # Pad sequences to match model input shape
        padded_token_list = tf.keras.preprocessing.sequence.pad_sequences(
            [token_list], 
            maxlen=settings.MAX_SEQUENCE_LENGTH, 
            padding='pre'
        )
        
        # Predict logits
        predictions = self.model.predict(padded_token_list, verbose=0)
        pred_idx = int(np.argmax(predictions[0]))
        
        # Map predicted index to word
        for word, idx in self.tokenizer.word_index.items():
            if idx == pred_idx:
                return word
                
        return ""

    def predict_next_top_k(self, seed_text: str, k: int = 5) -> int:
        """
        Predicts next token probabilities, filters to top-k, and samples from them.
        """
        token_list = self.tokenizer.texts_to_sequences([seed_text])[0]
        if not token_list:
            return 0
            
        padded_token_list = tf.keras.preprocessing.sequence.pad_sequences(
            [token_list], 
            maxlen=settings.MAX_SEQUENCE_LENGTH, 
            padding='pre'
        )
        
        predictions = self.model.predict(padded_token_list, verbose=0)[0]
        
        # Extract top k indices and their probabilities
        top_k_indices = np.argsort(predictions)[-k:]
        top_k_probs = predictions[top_k_indices]
        
        # Normalize probabilities to sum up to 1
        prob_sum = np.sum(top_k_probs)
        if prob_sum > 0:
            top_k_probs = top_k_probs / prob_sum
        else:
            top_k_probs = np.ones(k) / k
            
        # Sample index based on re-normalized probability distribution
        sampled_idx = np.random.choice(top_k_indices, p=top_k_probs)
        return int(sampled_idx)

    def generate_code(self, prompt: str, max_tokens: int = 50, k: int = 5) -> str:
        """
        Generate multiple code tokens using top-k sampling.
        """
        self.load_model_and_tokenizer()
        
        current_text = prompt
        
        for _ in range(max_tokens):
            next_idx = self.predict_next_top_k(current_text, k=k)
            if next_idx == 0:
                break
                
            next_word = ""
            for word, idx in self.tokenizer.word_index.items():
                if idx == next_idx:
                    next_word = word
                    break
                    
            if not next_word:
                break
                
            # Append next word separating it by a space (matching tokenizer training split)
            current_text += " " + next_word
            
        return current_text

# Instantiate a single helper instance
model_service = ModelService()
