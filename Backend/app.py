from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
from torchvision import transforms
from transformers import ViTConfig, ViTForImageClassification
from safetensors.torch import load_file

# ---------------- APP ----------------
app = FastAPI(title="Deepfake Image Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DEVICE ----------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ---------------- ViT CONFIG (2 CLASS) ----------------
config = ViTConfig(
    num_labels=2,
    image_size=224,
    hidden_size=768,
    num_hidden_layers=12,
    num_attention_heads=12,
    intermediate_size=3072,
)

model = ViTForImageClassification(config)

# ---------------- LOAD SAFETENSORS ----------------
state_dict = load_file("model/model.safetensors")
model.load_state_dict(state_dict)
model.to(device)
model.eval()

# ---------------- PREPROCESS ----------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.5, 0.5, 0.5],
        std=[0.5, 0.5, 0.5],
    ),
])

# ---------------- API ----------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(pixel_values=input_tensor).logits
        probs = torch.softmax(logits, dim=1)[0]

    real_prob = probs[0].item()
    fake_prob = probs[1].item()

    if fake_prob > real_prob:
        return {
            "prediction": "Fake",
            "confidence": round(fake_prob * 100, 2),
        }
    else:
        return {
            "prediction": "Real",
            "confidence": round(real_prob * 100, 2),
        }
