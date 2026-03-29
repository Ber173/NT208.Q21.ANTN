import { Link } from 'react-router-dom';

const ESL_WEB_URL = 'https://seanred.itch.io/esl-games-collection';

export default function ESLCollectionLauncher() {
  return (
    <main className="min-h-screen bg-slate-950 px-3 py-4 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 p-3">
          <div>
            <h1 className="text-xl font-black text-cyan-200">ESL Game Collection</h1>
            <p className="text-xs font-semibold text-slate-300">
              Tich hop tu repo Unity da clone. Dang mo ban web tu itch.io de choi truc tiep.
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
              href={ESL_WEB_URL}
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
            title="ESL Game Collection"
            src={ESL_WEB_URL}
            className="h-[82vh] w-full"
            allow="autoplay; fullscreen; gamepad"
          />
        </div>
      </section>
    </main>
  );
}
