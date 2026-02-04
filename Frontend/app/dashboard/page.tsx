"use client";

import { useAuth } from "@/lib/auth";
import RequireAuth from "@/components/RequireAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <RequireAuth>
      <div className="container section">
        <h1 className="page-title">Dashboard</h1>

        <div className="card-grid">
          <div className="card">
            <h3>Total Checks</h3>
            <p className="stat-value">0</p>
          </div>

          <div className="card">
            <h3>Fake Images</h3>
            <p className="stat-value text-red">0</p>
          </div>

          <div className="card">
            <h3>Real Images</h3>
            <p className="stat-value text-green">0</p>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
