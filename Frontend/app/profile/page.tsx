"use client";

import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

function ProfileContent() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container section">
      <h1 className="page-title">Profile</h1>

      <div className="card max-w-md">
        <p className="text-sm text-gray-400">Email</p>
        <p className="text-lg font-semibold">{user.email}</p>

        <p className="text-sm text-gray-400 mt-4">Account Created</p>
        <p className="text-lg font-semibold">
          {new Date(user.metadata.creationTime || "").toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
