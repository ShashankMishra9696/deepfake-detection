export default function DashboardPage() {
  return (
    <div className="section">
      <div className="container">
        <h1>Dashboard</h1>

        <div className="card-grid">
          <div className="card">
            <h3>Total Scans</h3>
            <p>Number of images analyzed so far.</p>
            <strong style={{ fontSize: "28px" }}>12</strong>
          </div>

          <div className="card">
            <h3>Fake Detected</h3>
            <p>Images identified as deepfake.</p>
            <strong style={{ fontSize: "28px", color: "#f87171" }}>5</strong>
          </div>

          <div className="card">
            <h3>Accuracy</h3>
            <p>Average confidence score.</p>
            <strong style={{ fontSize: "28px", color: "#a78bfa" }}>
              92%
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
