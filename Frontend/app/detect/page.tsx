"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="pt-32 pb-24 text-center px-6">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Deepfake Image Detection
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-10">
          Detect AI-generated and manipulated images using a
          state-of-the-art Vision Transformer deep learning model.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/detect"
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Start Detection
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "High Accuracy",
            desc: "Vision Transformer model trained to identify subtle manipulation artifacts.",
          },
          {
            title: "Secure & Private",
            desc: "Images are processed in memory and never stored permanently.",
          },
          {
            title: "Fast Analysis",
            desc: "Results generated in seconds with confidence scoring.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-black/30 py-24 px-6">
        <h2 className="text-3xl font-semibold text-center mb-16">
          How It Works
        </h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-indigo-400 text-2xl mb-3">1</div>
            <p className="text-slate-300">
              Upload an image you want to verify
            </p>
          </div>
          <div>
            <div className="text-indigo-400 text-2xl mb-3">2</div>
            <p className="text-slate-300">
              Our AI model analyzes visual patterns
            </p>
          </div>
          <div>
            <div className="text-indigo-400 text-2xl mb-3">3</div>
            <p className="text-slate-300">
              Receive real/fake prediction with confidence
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
