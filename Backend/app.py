import io
import os
import cv2
import torch
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
from transformers import ViTConfig, ViTForImageClassification
from safetensors.torch import load_file

# --------------------------------------------------
# App
# --------------------------------------------------
app = FastAPI(title="Deepfake Image Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Vercel allowed
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Device
# --------------------------------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --------------------------------------------------
# Model config (MUST MATCH TRAINING)
# --------------------------------------------------
config = ViTConfig(
    num_labels=2,
    image_size=224,
    hidden_size=768,
    num_hidden_layers=12,
    num_attention_heads=12,
    intermediate_size=3072,
)

model = None

def load_model():
    global model
    if model is None:
        print("Loading model...")
        m = ViTForImageClassification(config)
        state = load_file("model/model.safetensors")
        m.load_state_dict(state)
        m.to(device)
        m.eval()
        model = m

# --------------------------------------------------
# Face detector
# --------------------------------------------------
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

# --------------------------------------------------
# Image transform
# --------------------------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),
])

# --------------------------------------------------
# Health check
# --------------------------------------------------
@app.get("/")
def root():
    return {"status": "ok"}

# --------------------------------------------------
# Predict
# --------------------------------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    load_model()

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Face detection
    img_np = np.array(image)
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.2, 5)

    if len(faces) == 0:
        return {"prediction": "No Face Detected", "confidence": 0.0}

    # Model inference
    x = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        logits = model(pixel_values=x).logits
        probs = torch.softmax(logits, dim=1)[0]

    real_p = probs[0].item()
    fake_p = probs[1].item()

    if fake_p > real_p:
        return {"prediction": "Fake", "confidence": round(fake_p * 100, 2)}
    else:
        return {"prediction": "Real", "confidence": round(real_p * 100, 2)}
