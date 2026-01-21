"use client";

export default function DashboardPage() {
  return (
    <main className="section pt-32 pb-24">
      <h1 className="text-4xl font-semibold mb-10">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Total Scans", value: "—" },
          { title: "Fake Detected", value: "—" },
          { title: "Real Images", value: "—" },
        ].map((card) => (
          <div
            key={card.title}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-slate-400 text-sm">
              {card.title}
            </h3>
            <p className="text-3xl font-semibold mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
