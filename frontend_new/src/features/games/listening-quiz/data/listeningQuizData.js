/**
 * Listening Quiz game data — default content pool.
 * Uses Web Speech Synthesis for audio playback (no pre-recorded MP3s needed).
 * In production, fetched from GET /api/games/listening-quiz/content
 */

const LISTENING_QUIZ_DATA = {
  gameId: 'listening-quiz-mixed-01',
  title: 'Listen & Choose',
  category: 'Mixed',
  difficulty: 'easy',
  rounds: [
    {
      id: 1,
      transcript: 'Hand',
      correctAnswerId: 'hand',
      category: 'Body Parts',
      options: [
        { id: 'hand', text: 'Hand', emoji: '✋' },
        { id: 'head', text: 'Head', emoji: '🧑' },
        { id: 'hat', text: 'Hat', emoji: '🎩' },
        { id: 'heart', text: 'Heart', emoji: '❤️' },
      ],
    },
    {
      id: 2,
      transcript: 'Elephant',
      correctAnswerId: 'elephant',
      category: 'Animals',
      options: [
        { id: 'eagle', text: 'Eagle', emoji: '🦅' },
        { id: 'elephant', text: 'Elephant', emoji: '🐘' },
        { id: 'egg', text: 'Egg', emoji: '🥚' },
        { id: 'eel', text: 'Eel', emoji: '🐍' },
      ],
    },
    {
      id: 3,
      transcript: 'Butterfly',
      correctAnswerId: 'butterfly',
      category: 'Animals',
      options: [
        { id: 'bird', text: 'Bird', emoji: '🐦' },
        { id: 'bear', text: 'Bear', emoji: '🐻' },
        { id: 'butterfly', text: 'Butterfly', emoji: '🦋' },
        { id: 'bee', text: 'Bee', emoji: '🐝' },
      ],
    },
    {
      id: 4,
      transcript: 'Strawberry',
      correctAnswerId: 'strawberry',
      category: 'Fruits',
      options: [
        { id: 'strawberry', text: 'Strawberry', emoji: '🍓' },
        { id: 'star', text: 'Star', emoji: '⭐' },
        { id: 'snake', text: 'Snake', emoji: '🐍' },
        { id: 'sun', text: 'Sun', emoji: '☀️' },
      ],
    },
    {
      id: 5,
      transcript: 'Umbrella',
      correctAnswerId: 'umbrella',
      category: 'Objects',
      options: [
        { id: 'unicorn', text: 'Unicorn', emoji: '🦄' },
        { id: 'umbrella', text: 'Umbrella', emoji: '☂️' },
        { id: 'ukulele', text: 'Ukulele', emoji: '🎸' },
        { id: 'uniform', text: 'Uniform', emoji: '👔' },
      ],
    },
    {
      id: 6,
      transcript: 'Rainbow',
      correctAnswerId: 'rainbow',
      category: 'Nature',
      options: [
        { id: 'rocket', text: 'Rocket', emoji: '🚀' },
        { id: 'rain', text: 'Rain', emoji: '🌧️' },
        { id: 'rainbow', text: 'Rainbow', emoji: '🌈' },
        { id: 'robot', text: 'Robot', emoji: '🤖' },
      ],
    },
    {
      id: 7,
      transcript: 'Chocolate',
      correctAnswerId: 'chocolate',
      category: 'Food',
      options: [
        { id: 'cheese', text: 'Cheese', emoji: '🧀' },
        { id: 'cherry', text: 'Cherry', emoji: '🍒' },
        { id: 'chicken', text: 'Chicken', emoji: '🍗' },
        { id: 'chocolate', text: 'Chocolate', emoji: '🍫' },
      ],
    },
    {
      id: 8,
      transcript: 'Guitar',
      correctAnswerId: 'guitar',
      category: 'Music',
      options: [
        { id: 'guitar', text: 'Guitar', emoji: '🎸' },
        { id: 'goat', text: 'Goat', emoji: '🐐' },
        { id: 'globe', text: 'Globe', emoji: '🌍' },
        { id: 'gift', text: 'Gift', emoji: '🎁' },
      ],
    },
    {
      id: 9,
      transcript: 'Penguin',
      correctAnswerId: 'penguin',
      category: 'Animals',
      options: [
        { id: 'panda', text: 'Panda', emoji: '🐼' },
        { id: 'penguin', text: 'Penguin', emoji: '🐧' },
        { id: 'pig', text: 'Pig', emoji: '🐷' },
        { id: 'parrot', text: 'Parrot', emoji: '🦜' },
      ],
    },
    {
      id: 10,
      transcript: 'Bicycle',
      correctAnswerId: 'bicycle',
      category: 'Transport',
      options: [
        { id: 'bus', text: 'Bus', emoji: '🚌' },
        { id: 'boat', text: 'Boat', emoji: '⛵' },
        { id: 'bicycle', text: 'Bicycle', emoji: '🚲' },
        { id: 'balloon', text: 'Balloon', emoji: '🎈' },
      ],
    },
  ],
};

export default LISTENING_QUIZ_DATA;
