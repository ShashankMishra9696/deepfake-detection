import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="section pt-36 pb-28 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight
          bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Deepfake Image Detection
        </h1>

        <p className="mt-6 text-slate-400 max-w-2xl mx-auto">
          AI-powered system using Vision Transformer models to
          identify manipulated and AI-generated images.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/detect"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Start Detection
          </Link>

          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl glass hover:bg-white/10 transition"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section grid md:grid-cols-3 gap-8 py-24">
        {[
          {
            title: "High Accuracy",
            desc: "Vision Transformer model trained to detect subtle artifacts.",
          },
          {
            title: "Secure & Private",
            desc: "Images are processed securely and never stored.",
          },
          {
            title: "Fast Analysis",
            desc: "Results generated in seconds with confidence scoring.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="glass rounded-2xl p-6 hover:-translate-y-1 transition"
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-black/30 py-28">
        <h2 className="text-3xl font-semibold text-center mb-16">
          How It Works
        </h2>

        <div className="section grid md:grid-cols-3 gap-10 text-center">
          {[
            "Upload an image",
            "AI analyzes visual patterns",
            "Get prediction with confidence",
          ].map((step, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="text-indigo-400 text-3xl mb-3">
                {i + 1}
              </div>
              <p className="text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
