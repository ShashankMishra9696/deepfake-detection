import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <h1>Deepfake Image Detection</h1>
        <p>
          Detect AI-generated and manipulated images using a Vision Transformer
          deep learning model.
        </p>

        <div className="hero-actions">
          <Link href="/detect" className="btn-primary">
            Start Detection
          </Link>
          <Link href="/signup" className="btn-secondary">
            Create Account
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container card-grid">
          <div className="card">
            <h3>High Accuracy</h3>
            <p>Vision Transformer trained to detect subtle manipulation.</p>
          </div>

          <div className="card">
            <h3>Secure & Private</h3>
            <p>Images are processed in memory and never stored.</p>
          </div>

          <div className="card">
            <h3>Fast Analysis</h3>
            <p>Results generated in seconds with confidence scoring.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: "center" }}>How It Works</h2>

          <div className="card-grid" style={{ marginTop: "3rem" }}>
            <div className="card">
              <h3>1. Upload Image</h3>
              <p>Select the image you want to verify.</p>
            </div>

            <div className="card">
              <h3>2. AI Analysis</h3>
              <p>Our model analyzes visual manipulation patterns.</p>
            </div>

            <div className="card">
              <h3>3. Get Result</h3>
              <p>Receive real/fake prediction with confidence.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
