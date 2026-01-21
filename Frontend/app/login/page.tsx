"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/detect");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign In
        </h1>
        {/* keep your existing form here */}
      </div>
    </main>

  );
}
