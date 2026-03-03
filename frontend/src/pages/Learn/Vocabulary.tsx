import { useState } from "react";
import { useGame } from "../../context/GameContext";
import vocabularyData from "../../data/vocabulary.json";
import Earth from "../../assets/images/Earth.png";

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
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f1029] via-[#20144f] to-[#09070f] text-white flex flex-col items-center justify-center p-8">
        {/* Decorative lights */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-[-80px] left-1/3 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
        </div>

        <div className="relative z-10 text-center mb-12">
            <h1 className="text-5xl font-bold text-yellow-300 mb-4">
            <img src={Earth} alt="Earth" className="inline-block w-16 h-16 mr-3 animate-pulse drop-shadow-[0_0_20px_rgba(147,197,253,0.8)] scale-120" />
            Choose a Topic
            </h1>
          <p className="text-purple-100/90 text-lg">Select a vocabulary set to start learning</p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="bg-white/10 backdrop-blur-md border border-white/15 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 hover:bg-white/15 transition-all duration-300 text-left"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {topic.title}
              </h2>
              <p className="text-cyan-300 font-semibold text-lg">
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
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f1029] via-[#20144f] to-[#09070f] text-white flex flex-col items-center justify-center p-8">
        {/* Decorative lights */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-green-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 text-center bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-12 shadow-2xl">
          <h1 className="text-6xl mb-4">
            🎉
          </h1>
          <h2 className="text-4xl font-bold text-yellow-300 mb-4">
            Completed!
          </h2>
          <p className="text-xl text-purple-100/90 mb-8">
            You earned <span className="font-bold text-emerald-300">{cards.length * 5} XP</span>
          </p>

          <button
            onClick={() => {
              setSelectedTopic(null);
              setIndex(0);
              setFinished(false);
            }}
            className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg font-semibold"
          >
            ← Back to Topics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-[#0f1029] via-[#20144f] to-[#09070f] text-white flex">
      {/* Decorative lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* Sidebar - Hidden on mobile */}
      <div className="relative z-10 hidden lg:flex w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl p-6 flex-col overflow-y-auto">
        <button
          onClick={() => setSelectedTopic(null)}
          className="mb-6 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition text-sm font-semibold"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-yellow-300 mb-2">
          {selectedTopic.title}
        </h2>
        <p className="text-purple-100/80 mb-6 text-sm">
          {cards.length} words
        </p>

        {/* Stats */}
        <div className="space-y-3">
          <div className="bg-blue-400/20 backdrop-blur-md border border-blue-200/30 p-4 rounded-lg">
            <p className="text-xs text-blue-100 mb-1 font-semibold">PROGRESS</p>
            <p className="text-3xl font-bold text-cyan-300">
              {index + 1} / {cards.length}
            </p>
          </div>

          <div className="bg-emerald-400/20 backdrop-blur-md border border-emerald-200/30 p-4 rounded-lg">
            <p className="text-xs text-emerald-100 mb-1 font-semibold">EARNED XP</p>
            <p className="text-3xl font-bold text-emerald-300">
              {index * 5}
            </p>
          </div>

          <div className="bg-purple-400/20 backdrop-blur-md border border-purple-200/30 p-4 rounded-lg mt-6">
            <p className="text-xs text-purple-100 mb-1 font-semibold">COMPLETION</p>
            <p className="text-2xl font-bold text-purple-300">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 lg:p-12 h-full">
        {/* Progress Bar */}
        <div className="w-full mb-8 lg:mb-12 px-4 lg:px-0">
          <div className="flex justify-between mb-2 lg:mb-3">
            <span className="text-sm lg:text-base font-bold text-purple-100">Learning Progress</span>
            <span className="text-sm lg:text-base font-bold text-cyan-300">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 h-4 lg:h-6 rounded-full overflow-hidden shadow-lg backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 h-4 lg:h-6 rounded-full transition-all duration-300"
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
              className="absolute inset-0 bg-white/15 backdrop-blur-xl rounded-3xl lg:rounded-4xl shadow-2xl flex flex-col items-center justify-center border border-white/20"
              style={{ backfaceVisibility: "hidden" }}
            >
              <h2 className="text-4xl lg:text-7xl font-bold text-cyan-300 mb-3 lg:mb-6 px-4">
                {current.word}
              </h2>
              <p className="text-2xl lg:text-4xl text-purple-200 mb-6 lg:mb-12">
                {current.ipa}
              </p>
              <p className="text-lg lg:text-2xl text-purple-100/70">Click to reveal meaning →</p>
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-emerald-400/90 to-green-500/90 backdrop-blur-xl text-white rounded-3xl lg:rounded-4xl shadow-2xl flex items-center justify-center border border-emerald-300/50"
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
              className="px-6 lg:px-12 py-3 lg:py-5 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl lg:rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg lg:text-2xl font-bold shadow-lg"
            >
              ✓ I knew this
            </button>

            <button
              onClick={nextCard}
              className="px-6 lg:px-12 py-3 lg:py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl lg:rounded-2xl hover:bg-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg lg:text-2xl font-bold shadow-lg"
            >
              ✗ I didn't know
            </button>
          </div>
        )}
      </div>
    </div>
  );
}