export default function AboutPage() {
  return (
    <main className="section pt-32 pb-24">
      <h1 className="text-4xl font-semibold mb-6">
        About the Project
      </h1>

      <p className="text-slate-400 max-w-3xl leading-relaxed">
        The Deepfake Detection System is an AI-powered platform
        designed to identify manipulated and AI-generated images.
        It uses a Vision Transformer (ViT) deep learning model to
        analyze subtle visual artifacts that are difficult for
        humans to detect.
      </p>

      <p className="text-slate-400 max-w-3xl mt-6 leading-relaxed">
        This system is intended for journalists, researchers,
        security professionals, and digital media platforms to
        help verify image authenticity and combat misinformation.
      </p>
    </main>
  );
}
