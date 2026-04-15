/**
 * Word Scramble game data — default content pool.
 * In production, this is fetched from GET /api/games/word-scramble/content
 * and merged / replaced at runtime.
 */

const WORD_SCRAMBLE_DATA = {
  gameId: 'word-scramble-mixed-01',
  title: 'Word Scramble Challenge',
  category: 'Mixed',
  difficulty: 'easy',
  timeLimit: 90,
  rounds: [
    { id: 1, word: 'CAT', hint: '🐱 A small furry pet', category: 'Animals', points: 10, bonusTimeMs: 3000 },
    { id: 2, word: 'DOG', hint: '🐶 Man\'s best friend', category: 'Animals', points: 10, bonusTimeMs: 3000 },
    { id: 3, word: 'FISH', hint: '🐟 It lives in water', category: 'Animals', points: 10, bonusTimeMs: 3000 },
    { id: 4, word: 'BIRD', hint: '🐦 It can fly in the sky', category: 'Animals', points: 10, bonusTimeMs: 3000 },
    { id: 5, word: 'FROG', hint: '🐸 It jumps and says ribbit', category: 'Animals', points: 10, bonusTimeMs: 3000 },
    { id: 6, word: 'APPLE', hint: '🍎 A red or green fruit', category: 'Fruits', points: 12, bonusTimeMs: 4000 },
    { id: 7, word: 'GRAPE', hint: '🍇 Small round purple fruit', category: 'Fruits', points: 12, bonusTimeMs: 4000 },
    { id: 8, word: 'MANGO', hint: '🥭 A sweet tropical fruit', category: 'Fruits', points: 12, bonusTimeMs: 4000 },
    { id: 9, word: 'TIGER', hint: '🐯 A big stripy cat', category: 'Animals', points: 15, bonusTimeMs: 5000 },
    { id: 10, word: 'HORSE', hint: '🐴 You can ride this animal', category: 'Animals', points: 15, bonusTimeMs: 5000 },
    { id: 11, word: 'LEMON', hint: '🍋 A sour yellow fruit', category: 'Fruits', points: 15, bonusTimeMs: 5000 },
    { id: 12, word: 'WATER', hint: '💧 You drink this every day', category: 'Nature', points: 15, bonusTimeMs: 5000 },
    { id: 13, word: 'RABBIT', hint: '🐰 It has long ears and hops', category: 'Animals', points: 18, bonusTimeMs: 5000 },
    { id: 14, word: 'YELLOW', hint: '🌻 The color of the sun', category: 'Colors', points: 18, bonusTimeMs: 5000 },
    { id: 15, word: 'ORANGE', hint: '🍊 A citrus fruit and a color', category: 'Fruits', points: 18, bonusTimeMs: 5000 },
  ],
};

export default WORD_SCRAMBLE_DATA;
