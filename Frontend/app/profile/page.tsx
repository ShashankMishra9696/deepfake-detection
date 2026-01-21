"use client";

import { useAuth } from "@/lib/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="section pt-32 pb-24">
      <h1 className="text-4xl font-semibold mb-8">
        Profile
      </h1>

      <div className="glass rounded-2xl p-6 max-w-xl">
        <p className="text-slate-400 text-sm">Email</p>
        <p className="mt-1">{user?.email}</p>

        <p className="text-slate-400 text-sm mt-6">
          Account Status
        </p>
        <p className="mt-1 text-emerald-400">
          Active
        </p>
      </div>
    </main>
  );
}
