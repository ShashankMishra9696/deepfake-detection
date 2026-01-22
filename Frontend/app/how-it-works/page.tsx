export default function HowItWorksPage() {
  return (
    <div className="section">
      <div className="container">
        <h1>How It Works</h1>

        <div className="card-grid">
          <div className="card">
            <h3>1. Upload Image</h3>
            <p>Select an image you want to analyze.</p>
          </div>

          <div className="card">
            <h3>2. AI Analysis</h3>
            <p>The model evaluates visual inconsistencies.</p>
          </div>

          <div className="card">
            <h3>3. Get Result</h3>
            <p>You receive a real/fake prediction with confidence.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
