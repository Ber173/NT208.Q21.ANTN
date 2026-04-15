import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Shuffle an array using the Fisher–Yates algorithm.
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Shuffle letters in a way that guarantees the result differs from the original.
 */
function shuffleWord(word) {
  const letters = word.split('');
  if (letters.length <= 1) return letters;
  let shuffled;
  let attempts = 0;
  do {
    shuffled = shuffle(letters);
    attempts += 1;
  } while (shuffled.join('') === word && attempts < 20);
  return shuffled;
}

const STAGES = { MENU: 'menu', PLAYING: 'playing', RESULTS: 'results' };

/**
 * Core game logic hook for Word Scramble.
 * @param {Object} gameData - Full game data object (see wordScrambleData.js)
 * @param {number} [roundCount=8] - Number of rounds to pick from the pool
 */
export default function useWordScramble(gameData, roundCount = 8) {
  const allRounds = useMemo(() => gameData?.rounds ?? [], [gameData]);
  const timeLimit = gameData?.timeLimit ?? 90;

  // --- Game session state ---
  const [stage, setStage] = useState(STAGES.MENU);
  const [rounds, setRounds] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [picked, setPicked] = useState([]); // indices of letters picked from shuffled array
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [roundResults, setRoundResults] = useState([]); // { roundId, correct, timeMs }

  const roundStartTime = useRef(Date.now());
  const timerRef = useRef(null);

  // Derived
  const currentRound = rounds[roundIndex] ?? null;
  const shuffledLetters = useMemo(
    () => (currentRound ? shuffleWord(currentRound.word) : []),
    [currentRound],
  );
  const slots = picked.map((i) => shuffledLetters[i]);
  const isComplete = roundIndex >= rounds.length && stage === STAGES.PLAYING;
  const totalPossibleScore = rounds.reduce((sum, r) => sum + r.points, 0);

  // --- Timer ---
  useEffect(() => {
    if (stage !== STAGES.PLAYING) return undefined;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStage(STAGES.RESULTS);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [stage]);

  // --- Auto-advance when rounds exhausted ---
  useEffect(() => {
    if (isComplete) {
      clearInterval(timerRef.current);
      setStage(STAGES.RESULTS);
    }
  }, [isComplete]);

  // --- Actions ---
  const startGame = useCallback(() => {
    const selected = shuffle(allRounds).slice(0, Math.min(roundCount, allRounds.length));
    setRounds(selected);
    setRoundIndex(0);
    setPicked([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(timeLimit);
    setFeedback(null);
    setRoundResults([]);
    roundStartTime.current = Date.now();
    setStage(STAGES.PLAYING);
  }, [allRounds, roundCount, timeLimit]);

  const pickLetter = useCallback(
    (index) => {
      if (stage !== STAGES.PLAYING || feedback) return;
      if (picked.includes(index)) return;
      if (currentRound && picked.length >= currentRound.word.length) return;
      setPicked((prev) => [...prev, index]);
    },
    [stage, feedback, picked, currentRound],
  );

  const removeLast = useCallback(() => {
    if (feedback) return;
    setPicked((prev) => prev.slice(0, -1));
  }, [feedback]);

  const clearAll = useCallback(() => {
    if (feedback) return;
    setPicked([]);
  }, [feedback]);

  const submitAnswer = useCallback(() => {
    if (!currentRound || feedback) return;
    const userWord = slots.join('');
    const correct = userWord === currentRound.word;
    const elapsed = Date.now() - roundStartTime.current;

    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      const speedBonus = elapsed < 3000 ? 5 : 0;
      const newStreak = streak + 1;
      const multiplier = newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1;
      const earned = Math.round((currentRound.points + speedBonus) * multiplier);

      setScore((prev) => prev + earned);
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      // Add bonus time
      if (currentRound.bonusTimeMs) {
        setTimeLeft((prev) => prev + Math.round(currentRound.bonusTimeMs / 1000));
      }
    } else {
      setStreak(0);
    }

    setRoundResults((prev) => [...prev, { roundId: currentRound.id, correct, timeMs: elapsed }]);

    // Auto-advance after a short delay
    setTimeout(() => {
      setFeedback(null);
      setPicked([]);
      setRoundIndex((prev) => prev + 1);
      roundStartTime.current = Date.now();
    }, correct ? 1200 : 1500);
  }, [currentRound, feedback, slots, streak]);

  const resetToMenu = useCallback(() => {
    clearInterval(timerRef.current);
    setStage(STAGES.MENU);
  }, []);

  // Stars calculation
  const stars = useMemo(() => {
    if (totalPossibleScore === 0) return 0;
    const pct = score / totalPossibleScore;
    if (pct >= 0.8) return 3;
    if (pct >= 0.5) return 2;
    if (pct > 0) return 1;
    return 0;
  }, [score, totalPossibleScore]);

  return {
    // State
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
    totalRounds: rounds.length,
    roundResults,
    stars,
    totalPossibleScore,
    // Actions
    startGame,
    pickLetter,
    removeLast,
    clearAll,
    submitAnswer,
    resetToMenu,
  };
}
