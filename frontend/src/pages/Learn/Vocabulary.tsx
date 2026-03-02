import { useState } from "react";
import { useGame } from "../../context/GameContext";
import vocabularyData from "../../data/vocabulary.json";

/*
  FLASHCARD LEARNING COMPONENT
  - Chọn topic
  - Học flashcard
  - Có progress
  - Có XP
*/

type Card = {
  id: number;
  word: string;
  ipa: string;
  meaning: string;
};

type Topic = {
  id: string;
  title: string;
  cards: Card[];
};

export default function Flashcard() {
  const { addXP } = useGame();

  // ===== LOAD DATA TỪ JSON FILE =====
  const topics: Topic[] = vocabularyData.topics.map((topic) => ({
    id: topic.topicId,
    title: topic.title,
    cards: topic.lessons.flatMap((lesson) => lesson.cards),
  }));

  // ===== STATE =====
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  // ===== Nếu chưa chọn topic → hiển thị menu chọn =====
  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            📚 Choose a Topic
          </h1>
          <p className="text-gray-600 text-lg">Select a vocabulary set to start learning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left border-2 border-transparent hover:border-indigo-400"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {topic.title}
              </h2>
              <p className="text-indigo-600 font-semibold text-lg">
                {topic.cards.length} words
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const cards = selectedTopic.cards;
  const current = cards[index];
  const progress = ((index + 1) / cards.length) * 100;

  const nextCard = () => {
    setFlipped(false);

    if (index < cards.length - 1) {
      setIndex(index + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-6xl mb-4">
            🎉
          </h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Completed!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            You earned <span className="font-bold text-green-600">{cards.length * 5} XP</span>
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTopic(null);
            setIndex(0);
            setFinished(false);
          }}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg font-semibold"
        >
          ← Back to Topics
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex w-72 bg-white shadow-2xl p-6 flex-col border-r-2 border-indigo-100 overflow-y-auto">
        <button
          onClick={() => setSelectedTopic(null)}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {selectedTopic.title}
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          {cards.length} words
        </p>

        {/* Stats */}
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <p className="text-xs text-gray-600 mb-1 font-semibold">PROGRESS</p>
            <p className="text-3xl font-bold text-blue-600">
              {index + 1} / {cards.length}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <p className="text-xs text-gray-600 mb-1 font-semibold">EARNED XP</p>
            <p className="text-3xl font-bold text-green-600">
              {index * 5}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 mt-6">
            <p className="text-xs text-gray-600 mb-1 font-semibold">COMPLETION</p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 h-full">
        {/* Progress Bar */}
        <div className="w-full mb-8 lg:mb-12 px-4 lg:px-0">
          <div className="flex justify-between mb-2 lg:mb-3">
            <span className="text-sm lg:text-base font-bold text-gray-700">Learning Progress</span>
            <span className="text-sm lg:text-base font-bold text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-300 h-4 lg:h-6 rounded-full overflow-hidden shadow-lg">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-4 lg:h-6 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div
          className="relative w-full max-w-3xl mb-8 lg:mb-12 cursor-pointer"
          style={{ perspective: "1000px", aspectRatio: "16/10" }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped
                ? "rotateY(180deg)"
                : "rotateY(0deg)",
            }}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 rounded-3xl lg:rounded-4xl shadow-2xl flex flex-col items-center justify-center border-2 lg:border-4 border-blue-300"
              style={{ backfaceVisibility: "hidden" }}
            >
              <h2 className="text-4xl lg:text-7xl font-bold text-blue-600 mb-3 lg:mb-6 px-4">
                {current.word}
              </h2>
              <p className="text-2xl lg:text-4xl text-gray-500 mb-6 lg:mb-12">
                {current.ipa}
              </p>
              <p className="text-lg lg:text-2xl text-gray-400">Click to reveal meaning →</p>
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-3xl lg:rounded-4xl shadow-2xl flex items-center justify-center border-2 lg:border-4 border-green-300"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <h2 className="text-3xl lg:text-6xl font-bold text-center px-6 lg:px-12">
                {current.meaning}
              </h2>
            </div>
          </div>
        </div>

        {/* Buttons */}
        {flipped && (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full px-4 lg:px-0 lg:w-auto">
            <button
              onClick={() => {
                addXP(5);
                nextCard();
              }}
              className="px-6 lg:px-12 py-3 lg:py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl lg:rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg lg:text-2xl font-bold shadow-lg"
            >
              ✓ I knew this
            </button>

            <button
              onClick={nextCard}
              className="px-6 lg:px-12 py-3 lg:py-5 bg-gray-300 text-gray-800 rounded-xl lg:rounded-2xl hover:bg-gray-400 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg lg:text-2xl font-bold shadow-lg"
            >
              ✗ I didn't know
            </button>
          </div>
        )}
      </div>
    </div>
  );
}