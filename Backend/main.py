import os
import io
import cv2
import torch
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
from transformers import ViTConfig, ViTForImageClassification
from safetensors.torch import load_file

# =========================
# APP
# =========================
app = FastAPI(title="Deepfake Image Detection API")

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DEVICE (CPU ONLY – Railway safe)
# =========================
device = torch.device("cpu")

# =========================
# MODEL CONFIG
# =========================
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
        state_dict = load_file("model/model.safetensors")
        m.load_state_dict(state_dict)
        m.to(device)
        m.eval()
        model = m

# =========================
# FACE DETECTOR
# =========================
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

# =========================
# TRANSFORM
# =========================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3),
])

# =========================
# HEALTH
# =========================
@app.get("/")
def health():
    return {"status": "ok"}

# =========================
# PREDICT
# =========================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    load_model()

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.2, 5)

    if len(faces) == 0:
        return {"prediction": "No Face Detected", "confidence": 0.0}

    x = transform(image).unsqueeze(0)

    with torch.no_grad():
        logits = model(pixel_values=x).logits
        probs = torch.softmax(logits, dim=1)[0]

    real, fake = probs.tolist()

    return {
        "prediction": "Fake" if fake > real else "Real",
        "confidence": round(max(real, fake) * 100, 2)
    }

# =========================
# ENTRYPOINT (LOCAL ONLY)
# =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000))
    )
