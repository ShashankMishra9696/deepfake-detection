import os
import io
import cv2
import torch
import numpy as np

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import transforms
from transformers import ViTConfig, ViTForImageClassification
from safetensors.torch import load_file

# =========================================================
# APP
# =========================================================
app = FastAPI(title="Deepfake Image Detection API")

# =========================================================
# CORS
# =========================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# DEVICE (CPU ONLY for Railway)
# =========================================================
device = torch.device("cpu")

# =========================================================
# ViT CONFIG
# =========================================================
config = ViTConfig(
    num_labels=2,
    image_size=224,
    hidden_size=768,
    num_hidden_layers=12,
    num_attention_heads=12,
    intermediate_size=3072,
)

model = None

# =========================================================
# LOAD MODEL (LAZY)
# =========================================================
def load_model():
    global model
    if model is None:
        print("⏳ Loading model on CPU...")
        m = ViTForImageClassification(config)
        state_dict = load_file("model/model.safetensors")
        m.load_state_dict(state_dict)
        m.to(device)
        m.eval()
        model = m

# =========================================================
# FACE DETECTOR
# =========================================================
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

if face_cascade.empty():
    raise RuntimeError("Haar cascade failed to load")

# =========================================================
# TRANSFORMS
# =========================================================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5]),
])

# =========================================================
# HEALTH CHECK
# =========================================================
@app.get("/")
def health():
    return {"status": "ok"}

# =========================================================
# PREDICTION
# =========================================================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    load_model()

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Face detection
    open_cv_image = np.array(image)
    gray = cv2.cvtColor(open_cv_image, cv2.COLOR_RGB2GRAY)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=5,
        minSize=(60, 60),
    )

    if len(faces) == 0:
        return {"prediction": "No Face Detected", "confidence": 0.0}

    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        logits = model(pixel_values=input_tensor).logits
        probs = torch.softmax(logits, dim=1)[0]

    real_prob = probs[0].item()
    fake_prob = probs[1].item()

    if fake_prob > real_prob:
        return {"prediction": "Fake", "confidence": round(fake_prob * 100, 2)}
    else:
        return {"prediction": "Real", "confidence": round(real_prob * 100, 2)}

# =========================================================
# ENTRYPOINT
# =========================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
    )
