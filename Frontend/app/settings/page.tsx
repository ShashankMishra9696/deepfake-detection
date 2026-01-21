"use client";

export default function SettingsPage() {
  return (
    <main className="section pt-32 pb-24">
      <h1 className="text-4xl font-semibold mb-8">
        Settings
      </h1>

      <div className="glass rounded-2xl p-6 max-w-xl space-y-6">
        <div>
          <p className="text-slate-400 text-sm">
            Theme
          </p>
          <p className="mt-1">
            Dark (Default)
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">
            Notifications
          </p>
          <p className="mt-1">
            Disabled
          </p>
        </div>
      </div>
    </main>
  );
}
