export default function HowItWorksPage() {
  return (
    <main className="section pt-32 pb-24">
      <h1 className="text-4xl font-semibold mb-16 text-center">
        How It Works
      </h1>

      <div className="grid md:grid-cols-3 gap-10 text-center">
        {[
          "User uploads an image for verification",
          "Vision Transformer analyzes pixel-level patterns",
          "System returns prediction with confidence score",
        ].map((step, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-8"
          >
            <div className="text-indigo-400 text-3xl mb-4">
              {i + 1}
            </div>
            <p className="text-slate-300">{step}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
