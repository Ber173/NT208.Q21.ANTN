import { Link } from 'react-router-dom';

export default function ReactGameEmbed() {
  return (
    <main className="min-h-screen bg-slate-950 px-3 py-4 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
          <div>
            <h1 className="text-xl font-black text-cyan-200">React Game</h1>
            <p className="text-xs font-semibold text-slate-300">
              Da tich hop tu project react-game vao dashboard.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/dashboard"
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600"
            >
              Ve Dashboard
            </Link>
            <a
              href="/react-game/index.html?v=2"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-400"
            >
              Mo tab moi
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
          <iframe
            title="React Game Embedded"
            src="/react-game/index.html?v=2"
            className="h-[82vh] w-full"
            allow="autoplay; fullscreen; gamepad"
          />
        </div>
      </section>
    </main>
  );
}
