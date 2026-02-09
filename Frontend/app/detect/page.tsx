"use client";

import { useState, type ChangeEvent } from "react";
import RequireAuth from "@/components/RequireAuth";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/* -----------------------------------------
   Optional: local dashboard stats
----------------------------------------- */
function updateDashboardStats(prediction: string) {
  if (typeof window === "undefined") return;

  const stats =
    JSON.parse(
      localStorage.getItem("dashboardStats") || ""
    ) || { total: 0, real: 0, fake: 0 };

  stats.total += 1;
  if (prediction === "Real") stats.real += 1;
  if (prediction === "Fake") stats.fake += 1;

  localStorage.setItem("dashboardStats", JSON.stringify(stats));
}

/* -----------------------------------------
   Detect Page
----------------------------------------- */
export default function DetectPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Image Select ---------- */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setConfidence(null);
    setError(null);
  };

  /* ---------- Analyze ---------- */
  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // 🔴 MUST be exactly "file"
      formData.append("file", imageFile);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Backend URL not configured");
      }

      const response = await fetch(`${backendUrl}/predict`, {
        method: "POST",
        body: formData, // ✅ multipart/form-data
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Backend error");
      }

      const data = await response.json();

      setResult(data.prediction);
      setConfidence(data.confidence);

      // Optional Firestore save (safe)
      if (auth.currentUser) {
        await addDoc(collection(db, "detections"), {
          uid: auth.currentUser.uid,
          prediction: data.prediction,
          confidence: data.confidence,
          createdAt: serverTimestamp(),
        });
      }

      updateDashboardStats(data.prediction);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
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
