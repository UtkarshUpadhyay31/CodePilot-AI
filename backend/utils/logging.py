import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    # Minimize verbose tensorflow log outputs
    logging.getLogger("tensorflow").setLevel(logging.WARNING)

logger = logging.getLogger("codepilot_ai")
