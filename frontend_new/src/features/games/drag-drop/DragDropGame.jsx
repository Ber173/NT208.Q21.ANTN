import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DRAG_DROP_DATA from './data/dragDropData';

/* ─────────────────── helpers ─────────────────── */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─────────────────── Confetti ─────────────────── */
function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][i % 7],
        size: 6 + Math.random() * 8,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '105vh', opacity: 0, rotate: 400 }}
          transition={{ duration: 2.2 + Math.random(), delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────── StarRating ─────────────────── */
function StarRating({ count }) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3].map((i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: i <= count ? 1 : 0.5, rotate: 0, opacity: i <= count ? 1 : 0.25 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: i * 0.2 }}
          className="text-5xl"
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

const PAIRS_PER_ROUND = 5;

export default function DragDropGame() {
  const allRounds = DRAG_DROP_DATA.rounds;

  // --- State ---
  const [stage, setStage] = useState('menu'); // 'menu' | 'playing' | 'results'
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null); // id of the word chip being "dragged"
  const [matched, setMatched] = useState({}); // { imageId: wordId }
  const [attempts, setAttempts] = useState({}); // { imageId: number }
  const [lastFeedback, setLastFeedback] = useState(null); // { imageId, correct }
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [roundScores, setRoundScores] = useState([]); // [{ roundId, correct, total, firstTry }]
  const [showConfetti, setShowConfetti] = useState(false);

  // Pick pairs for the current round
  const currentRoundData = allRounds[roundIndex] ?? null;
  const roundPairs = useMemo(() => {
    if (!currentRoundData) return [];
    return shuffle(currentRoundData.pairs).slice(0, PAIRS_PER_ROUND);
  }, [currentRoundData, roundIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Shuffle the words separately
  const shuffledWords = useMemo(() => shuffle(roundPairs), [roundPairs]);

  // How many matched in this round
  const matchedCount = Object.keys(matched).length;
  const roundComplete = matchedCount === roundPairs.length && roundPairs.length > 0;
  const isLastRound = roundIndex >= allRounds.length - 1;

  // --- Actions ---
  const startGame = useCallback(() => {
    setStage('playing');
    setRoundIndex(0);
    setSelectedWord(null);
    setMatched({});
    setAttempts({});
    setLastFeedback(null);
    setScore(0);
    setTotalAttempts(0);
    setRoundScores([]);
  }, []);

  const handleWordClick = useCallback(
    (wordId) => {
      if (Object.values(matched).includes(wordId)) return; // already matched
      setSelectedWord((prev) => (prev === wordId ? null : wordId));
      setLastFeedback(null);
    },
    [matched],
  );

  const handleImageClick = useCallback(
    (imageId) => {
      if (matched[imageId]) return; // already matched
      if (!selectedWord) return; // no word selected

      const att = (attempts[imageId] || 0) + 1;
      setAttempts((prev) => ({ ...prev, [imageId]: att }));
      setTotalAttempts((prev) => prev + 1);

      const correct = imageId === selectedWord;
      setLastFeedback({ imageId, correct });

      if (correct) {
        const pts = att === 1 ? 10 : att === 2 ? 5 : 0;
        setScore((prev) => prev + pts);
        setMatched((prev) => ({ ...prev, [imageId]: selectedWord }));
        setSelectedWord(null);

        // Mini confetti for each correct
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1200);
      } else {
        // Auto-lock after 3 failed attempts
        if (att >= 3) {
          setMatched((prev) => ({ ...prev, [imageId]: imageId }));
          setSelectedWord(null);
        }
      }

      // Clear feedback after a bit
      setTimeout(() => setLastFeedback(null), 800);
    },
    [selectedWord, matched, attempts],
  );

  const nextRound = useCallback(() => {
    // Save round stats
    const firstTryCount = roundPairs.filter((p) => (attempts[p.id] || 1) === 1 && matched[p.id] === p.id).length;
    setRoundScores((prev) => [
      ...prev,
      { roundId: currentRoundData?.roundId, correct: matchedCount, total: roundPairs.length, firstTry: firstTryCount },
    ]);

    if (isLastRound) {
      setStage('results');
      return;
    }

    setRoundIndex((prev) => prev + 1);
    setSelectedWord(null);
    setMatched({});
    setAttempts({});
    setLastFeedback(null);
  }, [isLastRound, roundPairs, attempts, matched, matchedCount, currentRoundData]);

  // Stars
  const maxPossibleScore = allRounds.reduce((s, r) => s + Math.min(r.pairs.length, PAIRS_PER_ROUND) * 10, 0);
  const stars = useMemo(() => {
    if (maxPossibleScore === 0) return 0;
    const pct = score / maxPossibleScore;
    if (pct >= 0.8) return 3;
    if (pct >= 0.5) return 2;
    if (pct > 0) return 1;
    return 0;
  }, [score, maxPossibleScore]);

  /* ───── MENU ───── */
  if (stage === 'menu') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full max-w-md space-y-6 rounded-3xl border-4 border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-7xl"
          >
            🖼️
          </motion.div>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">Drag & Drop</h1>
          <p className="text-lg font-bold text-white/80">Ghép từ tiếng Anh với hình ảnh tương ứng!</p>

          <div className="space-y-3 rounded-2xl bg-white/10 p-4">
            <div className="flex items-center justify-between text-sm font-bold text-white/90">
              <span>📦 Số vòng</span>
              <span>{allRounds.length} vòng</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-white/90">
              <span>🧩 Mỗi vòng</span>
              <span>{PAIRS_PER_ROUND} cặp</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-white/90">
              <span>⭐ Lần đầu đúng</span>
              <span>+10 điểm</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-4 text-xl font-black text-white shadow-lg shadow-orange-500/30"
          >
            🚀 Bắt đầu chơi!
          </motion.button>

          <Link
            to="/dashboard"
            className="inline-block text-sm font-bold text-white/70 underline decoration-white/30 hover:text-white"
          >
            ← Về Dashboard
          </Link>
        </motion.div>
      </main>
    );
  }

  /* ───── RESULTS ───── */
  if (stage === 'results') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 px-4">
        <Confetti />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="w-full max-w-md space-y-6 rounded-3xl border-4 border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <h2 className="text-3xl font-black text-white drop-shadow-lg">🎊 Hoàn thành!</h2>
          <StarRating count={stars} />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-xs font-bold text-white/70">Tổng điểm</p>
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-black text-yellow-300">
                {score}
              </motion.p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-xs font-bold text-white/70">Tổng lượt thử</p>
              <p className="text-3xl font-black text-sky-300">{totalAttempts}</p>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl bg-white/10 p-3">
            {roundScores.map((r, i) => (
              <div key={r.roundId} className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm font-bold text-white/90">
                <span>Vòng {i + 1}</span>
                <span>
                  {r.correct}/{r.total} ✅
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startGame} className="flex-1 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 py-3 text-sm font-black text-white shadow-lg">
              🔄 Chơi lại
            </motion.button>
            <Link to="/dashboard" className="flex flex-1 items-center justify-center rounded-2xl bg-white/20 py-3 text-sm font-black text-white shadow-lg hover:bg-white/30">
              🏠 Dashboard
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  /* ───── PLAYING ───── */
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 px-4 py-4">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="mx-auto mb-4 flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <Link to="/dashboard" className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur hover:bg-white/25">
          ← Dashboard
        </Link>
        <div className="flex items-center gap-4 text-sm font-black text-white">
          <span>🏆 {score}</span>
          <span>
            📦 Vòng {roundIndex + 1}/{allRounds.length}
          </span>
        </div>
      </div>

      {/* Round label */}
      <div className="mx-auto mb-4 max-w-4xl">
        <motion.div
          key={roundIndex}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl bg-white/15 p-3 text-center text-lg font-black text-white backdrop-blur"
        >
          {currentRoundData?.label || `Vòng ${roundIndex + 1}`}
          <span className="ml-2 text-sm font-bold text-white/60">
            ({matchedCount}/{roundPairs.length} đã ghép)
          </span>
        </motion.div>
      </div>

      {/* Instruction */}
      <p className="mx-auto mb-4 max-w-4xl text-center text-sm font-bold text-white/70">
        {selectedWord
          ? '👆 Bây giờ chọn hình ảnh phù hợp!'
          : '👇 Chọn một từ bên dưới, rồi chọn hình tương ứng!'}
      </p>

      {/* Image targets grid */}
      <div className="mx-auto mb-6 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {roundPairs.map((pair, i) => {
          const isMatched = !!matched[pair.id];
          const fb = lastFeedback?.imageId === pair.id ? lastFeedback : null;
          return (
            <motion.button
              key={pair.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.08 }}
              whileHover={!isMatched ? { y: -4 } : {}}
              whileTap={!isMatched ? { scale: 0.95 } : {}}
              onClick={() => handleImageClick(pair.id)}
              disabled={isMatched}
              className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-4 shadow-lg transition-all ${
                isMatched
                  ? 'border-emerald-300 bg-emerald-500/20 backdrop-blur'
                  : selectedWord
                    ? 'cursor-pointer border-yellow-300/60 bg-white/15 backdrop-blur hover:border-yellow-300 hover:bg-white/25'
                    : 'border-white/20 bg-white/10 backdrop-blur'
              }`}
            >
              <motion.span
                className="text-5xl"
                animate={isMatched ? { scale: [1, 1.2, 1] } : fb?.correct === false ? { x: [0, -5, 5, -5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {pair.emoji}
              </motion.span>

              {isMatched && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs font-bold text-emerald-200"
                >
                  {pair.word}
                </motion.span>
              )}

              {/* Match feedback overlay */}
              <AnimatePresence>
                {fb && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 flex items-center justify-center rounded-2xl text-4xl ${
                      fb.correct ? 'bg-emerald-500/40' : 'bg-red-500/40'
                    }`}
                  >
                    {fb.correct ? '✅' : '❌'}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Gold ring for matched */}
              {isMatched && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 1.5, repeat: 1 }}
                  className="pointer-events-none absolute inset-0 rounded-2xl ring-4 ring-yellow-300/60"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Word chips */}
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2">
        {shuffledWords.map((pair, i) => {
          const isMatched = Object.values(matched).includes(pair.id);
          const isSelected = selectedWord === pair.id;
          return (
            <motion.button
              key={pair.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.06 }}
              whileHover={!isMatched ? { scale: 1.08 } : {}}
              whileTap={!isMatched ? { scale: 0.95 } : {}}
              onClick={() => handleWordClick(pair.id)}
              disabled={isMatched}
              className={`rounded-xl px-4 py-2.5 text-sm font-black shadow-lg transition-all ${
                isMatched
                  ? 'bg-emerald-500/20 text-emerald-300/50 line-through'
                  : isSelected
                    ? 'scale-105 border-2 border-yellow-300 bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-yellow-500/30'
                    : 'border-2 border-white/30 bg-white/15 text-white backdrop-blur hover:border-white/60 hover:bg-white/25'
              }`}
            >
              {pair.word}
              {isMatched && ' ✅'}
            </motion.button>
          );
        })}
      </div>

      {/* Next round button */}
      <AnimatePresence>
        {roundComplete && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto mt-6 max-w-4xl text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextRound}
              className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-3 text-lg font-black text-white shadow-lg shadow-orange-500/30"
            >
              {isLastRound ? '🏁 Xem kết quả' : '➡️ Vòng tiếp theo'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
