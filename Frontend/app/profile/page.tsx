"use client";

import { useAuth } from "@/lib/AuthContext";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="center-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="center-page">
        <p>You are not logged in.</p>
      </div>
    );
  }

  const joinedDate = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="page-container">
      <h1>Profile</h1>

      <div className="card profile-card">
        <div className="profile-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div className="profile-row">
          <span>Joined On</span>
          <strong>{joinedDate}</strong>
        </div>

        <div className="profile-row">
          <span>User ID</span>
          <strong>{user.uid}</strong>
        </div>
      </div>
    </div>
  );
}
