"use client";

import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";


function updateDashboardStats(prediction: string) {
  const stats = JSON.parse(
    localStorage.getItem("dashboardStats") || 
    JSON.stringify({ total: 0, real: 0, fake: 0 })
  );

  stats.total += 1;

  if (prediction === "Real") stats.real += 1;
  if (prediction === "Fake") stats.fake += 1;

  localStorage.setItem("dashboardStats", JSON.stringify(stats));
}


export default function DetectPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setConfidence(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      setResult(data.prediction);
      setConfidence(data.confidence);

      // 🔹 STORE RESULT IN FIRESTORE
      await addDoc(collection(db, "detections"), {
        uid: auth.currentUser?.uid,
        prediction: data.prediction,
        confidence: data.confidence,
        createdAt: serverTimestamp(),
      });

    } catch (err) {
      setError("Failed to analyze image. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <div className="page-container">
        <h1 className="page-title">Deepfake Image Detection</h1>

        {/* Image Upload */}
        <div className="form-group">
          <label>Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              marginTop: "1rem",
              borderRadius: "12px",
              maxWidth: "100%",
            }}
          />
        )}

        {/* Analyze Button */}
        <div className="form-submit">
          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {/* Error */}
        {error && <p className="error-text">{error}</p>}

        {/* Result */}
        {result && confidence !== null && (
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <h3>Result: {result}</h3>
            <p>Confidence: {confidence}%</p>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
