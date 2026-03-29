import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const DECK = [
  { id: 1, front: 'Apple', back: 'Qua tao', hint: 'Fruit' },
  { id: 2, front: 'Book', back: 'Quyen sach', hint: 'School' },
  { id: 3, front: 'Teacher', back: 'Giao vien', hint: 'Classroom' },
  { id: 4, front: 'Sun', back: 'Mat troi', hint: 'Nature' },
  { id: 5, front: 'Water', back: 'Nuoc', hint: 'Daily life' },
  { id: 6, front: 'Friend', back: 'Ban be', hint: 'People' },
  { id: 7, front: 'Music', back: 'Am nhac', hint: 'Art' },
  { id: 8, front: 'Happy', back: 'Vui ve', hint: 'Emotion' },
  { id: 9, front: 'House', back: 'Nha', hint: 'Place' },
  { id: 10, front: 'School', back: 'Truong hoc', hint: 'Place' },
];

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function FlashcardsArena() {
  const [cards, setCards] = useState(() => shuffle(DECK));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [reviewLater, setReviewLater] = useState(0);

  const current = cards[index];
  const total = cards.length;
  const progress = useMemo(() => Math.round(((index + 1) / total) * 100), [index, total]);

  const nextCard = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % total);
  };

  const markKnown = () => {
    setKnown((v) => v + 1);
    nextCard();
  };

  const markReview = () => {
    setReviewLater((v) => v + 1);
    nextCard();
  };

  const resetSession = () => {
    setCards(shuffle(DECK));
    setIndex(0);
    setFlipped(false);
    setKnown(0);
    setReviewLater(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-100 via-white to-lime-100 px-4 py-6">
      <section className="mx-auto w-full max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Flashcards Arena</h1>
            <p className="text-sm font-semibold text-slate-600">Lat the, hoc tu vung, va theo doi tien do cua ban.</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/dashboard"
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600"
            >
              Ve Dashboard
            </Link>
            <button
              type="button"
              onClick={resetSession}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-400"
            >
              Tron lai bo the
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow">
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
            <span>The {index + 1}/{total}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-sky-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="group relative block h-80 w-full rounded-3xl bg-transparent text-left"
        >
          <div className={`absolute inset-0 rounded-3xl border-4 p-6 shadow-xl transition-all duration-300 ${flipped ? 'border-fuchsia-300 bg-fuchsia-50' : 'border-sky-300 bg-sky-50'}`}>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">
              {flipped ? 'Back side' : 'Front side'}
            </p>
            <p className="mt-1 text-xs font-bold text-slate-500">Hint: {current.hint}</p>
            <div className="flex h-[220px] items-center justify-center">
              <p className="text-center text-4xl font-black text-slate-800">
                {flipped ? current.back : current.front}
              </p>
            </div>
            <p className="text-center text-xs font-bold text-slate-500">Nhan vao the de lat</p>
          </div>
        </button>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={markKnown}
            className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-white hover:bg-emerald-400"
          >
            Da nho the nay
          </button>
          <button
            type="button"
            onClick={markReview}
            className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-400"
          >
            On lai sau
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm font-bold">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
            Da nho: {known}
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
            Can on lai: {reviewLater}
          </div>
        </div>
      </section>
    </main>
  );
}
