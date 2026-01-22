export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-slate-500 text-sm">
      © {new Date().getFullYear()} Deepfake Detection System | Shashank Mishra 
      <br />
      Images are processed securely and not stored.
    </footer>
  );
}
