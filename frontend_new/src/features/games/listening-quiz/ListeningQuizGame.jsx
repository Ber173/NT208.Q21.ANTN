import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LISTENING_QUIZ_DATA from './data/listeningQuizData';

/* ─────────────────── helpers ─────────────────── */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Speak text using Web Speech Synthesis API.
 * Returns a Promise that resolves when speech completes.
 */
function speakText(text) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // slightly slow for kids
    utterance.pitch = 1.1;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
  });
}

/* ─────────────────── Confetti ─────────────────── */
function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.3,
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
          animate={{ y: '105vh', opacity: 0, rotate: 360 }}
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

/* ─────────────────── ProgressDots ─────────────────── */
function ProgressDots({ total, current, results }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const result = results[i];
        const isCurrent = i === current;
        let bgClass = 'bg-white/20';
        if (result?.correct === true) bgClass = 'bg-emerald-400';
        else if (result?.correct === false) bgClass = 'bg-red-400';
        else if (isCurrent) bgClass = 'bg-yellow-400';

        return (
          <motion.div
            key={i}
            animate={isCurrent ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={isCurrent ? { repeat: Infinity, duration: 1.5 } : {}}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${bgClass}`}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

const MAX_REPLAYS = 3;
const ROUNDS_PER_GAME = 8;

export default function ListeningQuizGame() {
  const allQuestions = LISTENING_QUIZ_DATA.rounds;

  // --- State ---
  const [stage, setStage] = useState('menu'); // 'menu' | 'playing' | 'feedback' | 'results'
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [replaysLeft, setReplaysLeft] = useState(MAX_REPLAYS);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [results, setResults] = useState([]); // { roundId, correct, replaysUsed }
  const [showConfetti, setShowConfetti] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState([]); // grayed-out wrong answers
  const playCountRef = useRef(0); // track how many times audio played for THIS question

  const currentQ = questions[questionIndex] ?? null;
  const totalQuestions = questions.length;

  // Stars
  const stars = useMemo(() => {
    if (totalQuestions === 0) return 0;
    const correctCount = results.filter((r) => r.correct).length;
    const pct = correctCount / totalQuestions;
    if (pct >= 0.8) return 3;
    if (pct >= 0.5) return 2;
    if (pct > 0) return 1;
    return 0;
  }, [results, totalQuestions]);

  // --- Actions ---
  const startGame = useCallback(() => {
    const selected = shuffle(allQuestions).slice(0, Math.min(ROUNDS_PER_GAME, allQuestions.length));
    setQuestions(selected);
    setQuestionIndex(0);
    setReplaysLeft(MAX_REPLAYS);
    setSelectedOption(null);
    setIsPlaying(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setResults([]);
    setShowConfetti(false);
    setDisabledOptions([]);
    playCountRef.current = 0;
    setStage('playing');
  }, [allQuestions]);

  const playAudio = useCallback(async () => {
    if (!currentQ || isPlaying) return;
    if (replaysLeft <= 0) return;

    setIsPlaying(true);
    setReplaysLeft((prev) => prev - 1);
    playCountRef.current += 1;
    await speakText(currentQ.transcript);
    setIsPlaying(false);
  }, [currentQ, isPlaying, replaysLeft]);

  // Auto-play audio when question changes
  useEffect(() => {
    if (stage === 'playing' && currentQ && playCountRef.current === 0) {
      // Small delay so animation finishes first
      const t = setTimeout(() => {
        playAudio();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [stage, questionIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOptionSelect = useCallback(
    (optionId) => {
      if (stage !== 'playing' || selectedOption) return;

      setSelectedOption(optionId);
      const correct = optionId === currentQ.correctAnswerId;
      const replaysUsed = MAX_REPLAYS - replaysLeft;

      if (correct) {
        // Points based on replay count
        let pts = 10;
        if (replaysUsed === 1) pts = 7;
        else if (replaysUsed >= 2) pts = 4;

        // Streak bonus
        const newStreak = streak + 1;
        if (newStreak >= 5) pts += 10;
        else if (newStreak >= 3) pts += 5;

        setScore((prev) => prev + pts);
        setStreak(newStreak);
        setBestStreak((prev) => Math.max(prev, newStreak));
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      } else {
        setStreak(0);
        setDisabledOptions((prev) => [...prev, optionId]);
      }

      setResults((prev) => [...prev, { roundId: currentQ.id, correct, replaysUsed }]);
      setStage('feedback');
    },
    [stage, selectedOption, currentQ, replaysLeft, streak],
  );

  const nextQuestion = useCallback(() => {
    if (questionIndex >= totalQuestions - 1) {
      setStage('results');
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setSelectedOption(null);
    setReplaysLeft(MAX_REPLAYS);
    setDisabledOptions([]);
    playCountRef.current = 0;
    setStage('playing');
  }, [questionIndex, totalQuestions]);

  /* ───── MENU ───── */
  if (stage === 'menu') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full max-w-md space-y-6 rounded-3xl border-4 border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-7xl"
          >
            🎧
          </motion.div>
          <h1 className="text-4xl font-black text-white drop-shadow-lg">Listening Quiz</h1>
          <p className="text-lg font-bold text-white/80">Nghe phát âm và chọn đáp án đúng!</p>

          <div className="space-y-3 rounded-2xl bg-white/10 p-4">
            <div className="flex items-center justify-between text-sm font-bold text-white/90">
              <span>🔊 Replay tối đa</span>
              <span>{MAX_REPLAYS} lần / câu</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-white/90">
              <span>📝 Số câu hỏi</span>
              <span>{ROUNDS_PER_GAME} câu</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-white/90">
              <span>🔥 Streak bonus</span>
              <span>3 liên tiếp +5, 5 liên tiếp +10</span>
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
    const correctCount = results.filter((r) => r.correct).length;
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
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
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-black text-yellow-300">
                {score}
              </motion.p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-xs font-bold text-white/70">Đúng</p>
              <p className="text-3xl font-black text-emerald-300">
                {correctCount}/{results.length}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-xs font-bold text-white/70">Combo tốt nhất</p>
              <p className="text-3xl font-black text-orange-300">{bestStreak}🔥</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <p className="text-xs font-bold text-white/70">Độ chính xác</p>
              <p className="text-3xl font-black text-sky-300">
                {results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Word review */}
          <div className="max-h-40 space-y-1 overflow-y-auto rounded-2xl bg-white/10 p-3">
            {results.map((r) => {
              const q = allQuestions.find((qu) => qu.id === r.roundId);
              return (
                <div
                  key={r.roundId}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm font-bold ${
                    r.correct ? 'bg-emerald-500/20 text-emerald-200' : 'bg-red-500/20 text-red-200'
                  }`}
                >
                  <span>
                    {q?.transcript ?? '?'}
                  </span>
                  <span>
                    {r.correct ? '✅' : '❌'} (🔊 ×{r.replaysUsed + 1})
                  </span>
                </div>
              );
            })}
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

  /* ───── PLAYING & FEEDBACK ───── */
  const showingFeedback = stage === 'feedback';
  const lastResult = results[results.length - 1];
  const isCorrect = lastResult?.correct;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 py-4">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="mx-auto mb-4 flex max-w-2xl flex-wrap items-center justify-between gap-3">
        <Link to="/dashboard" className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur hover:bg-white/25">
          ← Dashboard
        </Link>
        <div className="flex items-center gap-4 text-sm font-black text-white">
          <span>🏆 {score}</span>
          {streak >= 2 && (
            <motion.span key={streak} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="rounded-full bg-orange-500/80 px-2.5 py-0.5 text-xs">
              🔥 x{streak}
            </motion.span>
          )}
          <span>
            📝 {questionIndex + 1}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="mx-auto mb-6 max-w-2xl">
        <ProgressDots total={totalQuestions} current={questionIndex} results={results} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        {currentQ && (
          <motion.div
            key={currentQ.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mx-auto max-w-2xl space-y-6 rounded-3xl border-4 border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl"
          >
            {/* Category badge */}
            <div className="text-center">
              <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/70">
                {currentQ.category}
              </span>
            </div>

            {/* Audio player */}
            <div className="flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={playAudio}
                disabled={isPlaying || replaysLeft <= 0}
                className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 text-4xl shadow-lg shadow-orange-500/30 transition disabled:opacity-40"
              >
                {isPlaying ? (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  >
                    🔊
                  </motion.span>
                ) : (
                  '🔊'
                )}

                {/* Pulse ring while playing */}
                {isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-yellow-300/50"
                    animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </motion.button>

              <div className="flex items-center gap-1.5 text-sm font-bold text-white/60">
                <span>Nghe lại:</span>
                {Array.from({ length: MAX_REPLAYS }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < replaysLeft ? 'text-yellow-300' : 'text-white/20'}`}>
                    🔊
                  </span>
                ))}
              </div>

              <p className="text-xs font-bold text-white/50">
                {replaysLeft > 0 ? 'Nhấn nút để nghe!' : 'Hết lượt nghe rồi!'}
              </p>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-2 gap-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === opt.id;
                const isDisabled = disabledOptions.includes(opt.id);
                const isCorrectOption = opt.id === currentQ.correctAnswerId;

                let cardStyle = 'border-white/20 bg-white/10 hover:border-white/50 hover:bg-white/20';

                if (showingFeedback) {
                  if (isCorrectOption) {
                    cardStyle = 'border-emerald-400 bg-emerald-500/30';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'border-red-400 bg-red-500/30';
                  }
                } else if (isDisabled) {
                  cardStyle = 'border-white/10 bg-white/5 opacity-40';
                }

                return (
                  <motion.button
                    key={opt.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.1 }}
                    whileHover={!showingFeedback && !isDisabled ? { y: -4 } : {}}
                    whileTap={!showingFeedback && !isDisabled ? { scale: 0.95 } : {}}
                    onClick={() => handleOptionSelect(opt.id)}
                    disabled={showingFeedback || isDisabled}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-4 p-4 shadow-lg transition-all ${cardStyle}`}
                  >
                    <motion.span
                      className="text-4xl"
                      animate={
                        showingFeedback && isCorrectOption
                          ? { scale: [1, 1.3, 1] }
                          : showingFeedback && isSelected && !isCorrect
                            ? { x: [0, -5, 5, -5, 0] }
                            : {}
                      }
                      transition={{ duration: 0.4 }}
                    >
                      {opt.emoji}
                    </motion.span>
                    <span className="text-sm font-black text-white">{opt.text}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback message */}
            <AnimatePresence>
              {showingFeedback && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 text-center"
                >
                  <p className={`text-lg font-black ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                    {isCorrect ? '🎉 Chính xác! Giỏi lắm!' : `😢 Đáp án đúng là: ${currentQ.transcript}`}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 px-8 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/30"
                  >
                    {questionIndex >= totalQuestions - 1 ? '🏁 Xem kết quả' : '➡️ Câu tiếp theo'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
