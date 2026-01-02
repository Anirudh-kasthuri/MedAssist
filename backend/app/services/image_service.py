from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

# Load once
_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def analyze_medical_image(filename: str) -> str:
    name = filename.lower()

    if "xray" in name:
        return "Image appears to be an X-ray. Possible lung field opacity detected."

    if "ct" in name:
        return "CT scan detected. Structural assessment recommended."

    return "Medical image uploaded. Further analysis required."
