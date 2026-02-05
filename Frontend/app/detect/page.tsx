"use client";

import { useState, type ChangeEvent } from "react";
import RequireAuth from "@/components/RequireAuth";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/* -----------------------------------------
   Optional: local dashboard stats (safe)
----------------------------------------- */
function updateDashboardStats(prediction: string) {
  if (typeof window === "undefined") return;

  const stats = JSON.parse(
    localStorage.getItem("dashboardStats") ??
      JSON.stringify({ total: 0, real: 0, fake: 0 })
  );

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
      formData.append("file", imageFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/predict`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data: {
        prediction: string;
        confidence: number;
      } = await response.json();

      setResult(data.prediction);
      setConfidence(data.confidence);

      updateDashboardStats(data.prediction);

      // 🔹 Store in Firestore
      await addDoc(collection(db, "detections"), {
        uid: auth.currentUser?.uid ?? null,
        prediction: data.prediction,
        confidence: data.confidence,
        createdAt: serverTimestamp(),
      });
    } catch {
      setError("Failed to analyze image. Is backend running?");
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
