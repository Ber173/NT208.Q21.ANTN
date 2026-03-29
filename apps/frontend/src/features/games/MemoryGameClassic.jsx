import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const PAIR_POOL = [
  { name: 'apple', icon: '🍎', word: 'Apple' },
  { name: 'banana', icon: '🍌', word: 'Banana' },
  { name: 'grapes', icon: '🍇', word: 'Grapes' },
  { name: 'strawberry', icon: '🍓', word: 'Strawberry' },
  { name: 'watermelon', icon: '🍉', word: 'Watermelon' },
  { name: 'carrot', icon: '🥕', word: 'Carrot' },
  { name: 'broccoli', icon: '🥦', word: 'Broccoli' },
  { name: 'pizza', icon: '🍕', word: 'Pizza' },
  { name: 'burger', icon: '🍔', word: 'Burger' },
  { name: 'fries', icon: '🍟', word: 'Fries' },
  { name: 'icecream', icon: '🍦', word: 'Ice Cream' },
  { name: 'milkshake', icon: '🥤', word: 'Milkshake' },
  { name: 'hotdog', icon: '🌭', word: 'Hot Dog' },
  { name: 'soccer', icon: '⚽', word: 'Soccer Ball' },
  { name: 'basketball', icon: '🏀', word: 'Basketball' },
  { name: 'tennis', icon: '🎾', word: 'Tennis Ball' },
  { name: 'rocket', icon: '🚀', word: 'Rocket' },
  { name: 'car', icon: '🚗', word: 'Car' },
  { name: 'bus', icon: '🚌', word: 'Bus' },
  { name: 'train', icon: '🚆', word: 'Train' },
  { name: 'cat', icon: '🐱', word: 'Cat' },
  { name: 'dog', icon: '🐶', word: 'Dog' },
  { name: 'rabbit', icon: '🐰', word: 'Rabbit' },
  { name: 'fish', icon: '🐟', word: 'Fish' },
];

const PAIRS_PER_GAME = 6;

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDeck() {
  const selectedPairs = shuffle(PAIR_POOL).slice(0, PAIRS_PER_GAME);

  const pairCards = selectedPairs.flatMap((card) => [
    {
      id: `${card.name}-image`,
      pairKey: card.name,
      icon: card.icon,
      word: card.word,
      type: 'image',
    },
    {
      id: `${card.name}-word`,
      pairKey: card.name,
      icon: card.icon,
      word: card.word,
      type: 'word',
    },
  ]);

  return shuffle(pairCards);
}

export default function MemoryGameClassic() {
  const [deck, setDeck] = useState(createDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState('');

  const completed = matched.length === deck.length;

  const restart = () => {
    setDeck(createDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setMessage('');
  };

  const canFlip = (id) => {
    if (completed) return false;
    if (flipped.includes(id)) return false;
    if (matched.includes(id)) return false;
    if (flipped.length >= 2) return false;
    return true;
  };

  const handleCardClick = (id) => {
    if (!canFlip(id)) return;

    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);

    if (nextFlipped.length < 2) return;

    const [firstId, secondId] = nextFlipped;
    const firstCard = deck.find((card) => card.id === firstId);
    const secondCard = deck.find((card) => card.id === secondId);
    setMoves((prev) => prev + 1);

    const isMatch =
      firstCard &&
      secondCard &&
      firstCard.pairKey === secondCard.pairKey &&
      firstCard.type !== secondCard.type;

    if (isMatch) {
      setMatched((prev) => [...prev, firstId, secondId]);
      setMessage(`Tot lam! ${firstCard.word} da duoc ghep dung.`);
      setTimeout(() => setFlipped([]), 300);
      return;
    }

    setMessage('Chua dung cap hinh-va-tu, thu lai nhe!');
    setTimeout(() => setFlipped([]), 650);
  };

  const score = useMemo(() => matched.length / 2, [matched.length]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-sky-100 px-4 py-6">
      <section className="mx-auto w-full max-w-5xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Memory Game Classic</h1>
            <p className="text-sm font-semibold text-slate-600">Lật thẻ để ghép 1 hình với 1 từ tiếng Anh đúng nghĩa.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600">
              Ve Dashboard
            </Link>
            <button
              type="button"
              onClick={restart}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-400"
            >
              Choi Lai
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow sm:grid-cols-3">
          <div className="rounded-xl bg-sky-50 p-3 text-sm font-bold text-sky-800">Score: {score}/{PAIRS_PER_GAME}</div>
          <div className="rounded-xl bg-purple-50 p-3 text-sm font-bold text-purple-800">Luot choi: {moves}</div>
          <div className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
            {completed ? 'Chuc mung! Ban da ghep dung tat ca cap hinh-va-tu.' : message || 'Chon 2 the de bat dau.'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {deck.map((card) => {
            const isOpen = flipped.includes(card.id) || matched.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-2xl border-2 transition ${
                  isOpen
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {isOpen ? (
                  <div className="flex h-full flex-col items-center justify-center gap-1 px-1">
                    {card.type === 'image' ? (
                      <>
                        <span className="text-4xl">{card.icon}</span>
                        <span className="text-[11px] font-black uppercase tracking-wide text-slate-700">IMAGE</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl font-black text-slate-800">{card.word}</span>
                        <span className="text-[11px] font-black uppercase tracking-wide text-slate-700">WORD</span>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-4xl">❓</span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
