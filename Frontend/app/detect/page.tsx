"use client";

import { useState, type ChangeEvent } from "react";
import RequireAuth from "@/components/RequireAuth";

/* ------------------------------------------------
   Detect Page – Stable & Railway/Vercel Safe
------------------------------------------------ */
export default function DetectPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Image Selection ---------- */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setConfidence(null);
    setError(null);
  };

  /* ---------- Analyze Image ---------- */
  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
      setError("Backend URL not configured.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // 🚨 THIS MUST BE EXACTLY "file"
      formData.append("file", imageFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/predict`,
        {
          method: "POST",
          body: formData,
          // ❌ DO NOT SET HEADERS
          // browser sets multipart boundary automatically
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Backend error");
      }

      const data = await response.json();

      setResult(data.prediction);
      setConfidence(data.confidence);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <RequireAuth>
      <div className="page-container">
        <h1 className="page-title">Deepfake Image Detection</h1>

        <div className="form-group">
          <label>Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

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

        <div className="form-submit">
          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

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
