import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useWordScramble from './hooks/useWordScramble';
import WORD_SCRAMBLE_DATA from './data/wordScrambleData';

/* ───────────────────── tiny sub-components ───────────────────── */

function TimerBar({ timeLeft, maxTime }) {
  const pct = Math.max(0, (timeLeft / maxTime) * 100);
  const isLow = timeLeft <= 10;
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-white/40 shadow-inner">
      <motion.div
        className={`h-full rounded-full ${isLow ? 'bg-red-400' : 'bg-emerald-400'}`}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

function ScorePopup({ score }) {
  return (
    <AnimatePresence>
      {score > 0 && (
        <motion.span
          key={score}
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ y: -36, opacity: 0, scale: 1.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute -top-2 right-0 text-lg font-black text-yellow-300 drop-shadow-lg"
        >
          +{score}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

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

/* ─────────────────── Confetti particles ─────────────────── */
function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.3,
        color: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'][i % 8],
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
          animate={{ y: '105vh', opacity: 0, rotate: 360 + Math.random() * 360 }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: 'easeIn' }}
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

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function WordScrambleGame() {
  const {
    stage,
    currentRound,
    shuffledLetters,
    picked,
    slots,
    score,
    streak,
    bestStreak,
    timeLeft,
    feedback,
    roundIndex,
    totalRounds,
    roundResults,
    stars,
    startGame,
    pickLetter,
    removeLast,
    clearAll,
    submitAnswer,
    resetToMenu,
  } = useWordScramble(WORD_SCRAMBLE_DATA, 8);

  const [lastScore, setLastScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Track score pops
  useEffect(() => {
    if (score > lastScore) {
      setLastScore(score);
    }
  }, [score, lastScore]);

  // Show confetti on correct answer
  useEffect(() => {
    if (feedback === 'correct') {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  const isFull = currentRound && slots.length === currentRound.word.length;

  /* ───── MENU STAGE ───── */
  if (stage === 'menu') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full max-w-md space-y-6 rounded-3xl border-4 border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-7xl"
          >
            🔤
          </motion.div>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">Word Scramble</h1>
          <p className="text-lg font-bold text-white/80">Sắp xếp các chữ cái để tạo thành từ tiếng Anh!</p>

          <div className="space-y-3 rounded-2xl bg-white/10 p-4">
            <div className="flex items-center justify-between text-sm font-bold text-white/90">
              <span>⏱️ Thời gian</span>
              <span>{WORD_SCRAMBLE_DATA.timeLimit}s</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-white/90">
              <span>📝 Số câu</span>
              <span>8 từ</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-white/90">
              <span>🎯 Combo bonus</span>
              <span>x1.5 / x2</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-4 text-xl font-black text-white shadow-lg shadow-orange-500/30 transition hover:shadow-orange-500/50"
          >
            🚀 Bắt đầu chơi!
          </motion.button>

          <Link
            to="/dashboard"
            className="inline-block text-sm font-bold text-white/70 underline decoration-white/30 transition hover:text-white"
          >
            ← Về Dashboard
          </Link>
        </motion.div>
      </main>
    );
  }

  /* ───── RESULTS STAGE ───── */
  if (stage === 'results') {
    const correctCount = roundResults.filter((r) => r.correct).length;
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 px-4">
        <Confetti />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="w-full max-w-md space-y-6 rounded-3xl border-4 border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <h2 className="text-3xl font-black text-white drop-shadow-lg">🎉 Kết quả</h2>
          <StarRating count={stars} />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-xs font-bold text-white/70">Điểm</p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-3xl font-black text-yellow-300"
              >
                {score}
              </motion.p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-xs font-bold text-white/70">Đúng</p>
              <p className="text-3xl font-black text-emerald-300">
                {correctCount}/{roundResults.length}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-xs font-bold text-white/70">Combo tốt nhất</p>
              <p className="text-3xl font-black text-orange-300">{bestStreak}🔥</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-xs font-bold text-white/70">Thời gian còn lại</p>
              <p className="text-3xl font-black text-sky-300">{timeLeft}s</p>
            </div>
          </div>

          {/* Word review list */}
          <div className="max-h-40 space-y-1 overflow-y-auto rounded-2xl bg-white/10 p-3">
            {roundResults.map((r, i) => {
              const round = WORD_SCRAMBLE_DATA.rounds.find((rd) => rd.id === r.roundId);
              return (
                <div
                  key={r.roundId}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-bold ${
                    r.correct ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'
                  }`}
                >
                  <span>{round?.word ?? `Round ${i + 1}`}</span>
                  <span>{r.correct ? '✅' : '❌'}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="flex-1 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 py-3 text-sm font-black text-white shadow-lg"
            >
              🔄 Chơi lại
            </motion.button>
            <Link
              to="/dashboard"
              className="flex flex-1 items-center justify-center rounded-2xl bg-white/20 py-3 text-sm font-black text-white shadow-lg transition hover:bg-white/30"
            >
              🏠 Dashboard
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  /* ───── PLAYING STAGE ───── */
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 px-4 py-4">
      {showConfetti && <Confetti />}

      {/* Header bar */}
      <div className="mx-auto mb-4 flex max-w-2xl flex-wrap items-center justify-between gap-3">
        <Link
          to="/dashboard"
          className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/25"
        >
          ← Dashboard
        </Link>
        <div className="flex items-center gap-4 text-sm font-black text-white">
          <span className="relative">
            🏆 {score}
            <ScorePopup score={score} />
          </span>
          {streak >= 2 && (
            <motion.span
              key={streak}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="rounded-full bg-orange-500/80 px-2.5 py-0.5 text-xs"
            >
              🔥 x{streak}
            </motion.span>
          )}
          <span>
            📝 {roundIndex + 1}/{totalRounds}
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className="mx-auto mb-6 max-w-2xl">
        <div className="mb-1 flex items-center justify-between text-xs font-bold text-white/80">
          <span>⏱️ Thời gian</span>
          <span>{timeLeft}s</span>
        </div>
        <TimerBar timeLeft={timeLeft} maxTime={WORD_SCRAMBLE_DATA.timeLimit} />
      </div>

      {/* Game card */}
      <AnimatePresence mode="wait">
        {currentRound && (
          <motion.div
            key={currentRound.id}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mx-auto max-w-2xl space-y-5 rounded-3xl border-4 border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
          >
            {/* Hint */}
            <div className="text-center">
              <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/70">
                {currentRound.category}
              </span>
              <p className="mt-3 text-2xl font-black text-white drop-shadow">{currentRound.hint}</p>
            </div>

            {/* Answer slots */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: currentRound.word.length }).map((_, i) => {
                const letter = slots[i] || '';
                const isCorrectFeedback = feedback === 'correct';
                const isWrongFeedback = feedback === 'wrong';
                return (
                  <motion.div
                    key={i}
                    animate={
                      isWrongFeedback
                        ? { x: [0, -6, 6, -6, 6, 0] }
                        : isCorrectFeedback
                          ? { scale: [1, 1.15, 1], borderColor: '#4ade80' }
                          : {}
                    }
                    transition={{ duration: 0.4 }}
                    className={`flex h-14 w-12 items-center justify-center rounded-xl border-3 text-2xl font-black shadow-lg transition-all sm:h-16 sm:w-14 ${
                      letter
                        ? isCorrectFeedback
                          ? 'border-emerald-400 bg-emerald-500/30 text-emerald-100'
                          : isWrongFeedback
                            ? 'border-red-400 bg-red-500/30 text-red-100'
                            : 'border-white/50 bg-white/20 text-white'
                        : 'border-dashed border-white/30 bg-white/5'
                    }`}
                  >
                    {letter}
                  </motion.div>
                );
              })}
            </div>

            {/* Feedback message */}
            <AnimatePresence>
              {feedback && (
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-center text-lg font-black ${
                    feedback === 'correct' ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {feedback === 'correct' ? '🎉 Tuyệt vời! Chính xác!' : `😢 Sai rồi! Đáp án là: ${currentRound.word}`}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Letter bank */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {shuffledLetters.map((letter, i) => {
                const isUsed = picked.includes(i);
                return (
                  <motion.button
                    key={`${letter}-${i}`}
                    whileHover={!isUsed && !feedback ? { scale: 1.1 } : {}}
                    whileTap={!isUsed && !feedback ? { scale: 0.9 } : {}}
                    onClick={() => pickLetter(i)}
                    disabled={isUsed || !!feedback}
                    className={`flex h-12 w-11 items-center justify-center rounded-xl text-xl font-black shadow transition-all sm:h-14 sm:w-12 ${
                      isUsed
                        ? 'scale-90 border-2 border-transparent bg-white/5 text-white/20'
                        : 'border-2 border-white/30 bg-white/20 text-white hover:border-yellow-300 hover:bg-yellow-400/30'
                    }`}
                  >
                    {letter}
                  </motion.button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAll}
                disabled={slots.length === 0 || !!feedback}
                className="rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold text-white/80 shadow transition hover:bg-white/25 disabled:opacity-30"
              >
                🗑️ Xóa hết
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={removeLast}
                disabled={slots.length === 0 || !!feedback}
                className="rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold text-white/80 shadow transition hover:bg-white/25 disabled:opacity-30"
              >
                ⬅️ Xóa 1
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={submitAnswer}
                disabled={!isFull || !!feedback}
                className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-orange-500/30 transition disabled:opacity-40"
              >
                ✅ Kiểm tra
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
