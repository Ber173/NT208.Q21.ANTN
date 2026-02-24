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
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-8">
          Choose a Topic
        </h1>

        <div className="flex flex-col gap-6 w-full max-w-md">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-left"
            >
              <h2 className="text-xl font-semibold">
                {topic.title}
              </h2>
              <p className="text-gray-500 mt-2">
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

  // ===== Khi hoàn thành =====
  if (finished) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">
          🎉 Completed!
        </h1>

        <button
          onClick={() => {
            setSelectedTopic(null);
            setIndex(0);
            setFinished(false);
          }}
          className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
        >
          Back to Topics
        </button>
      </div>
    );
  }

  // ===== Trang học flashcard =====
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="bg-gray-300 h-3 rounded-full">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="relative w-80 h-56 cursor-pointer"
        style={{ perspective: "1000px" }}
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
            className="absolute w-full h-full bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <h2 className="text-3xl font-bold">
              {current.word}
            </h2>
            <p className="text-gray-500 mt-2">
              {current.ipa}
            </p>
          </div>

          {/* BACK */}
          <div
            className="absolute w-full h-full bg-green-500 text-white rounded-2xl shadow-xl flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h2 className="text-2xl font-bold">
              {current.meaning}
            </h2>
          </div>
        </div>
      </div>

      {/* Buttons */}
      {flipped && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => {
              addXP(5);
              nextCard();
            }}
            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
          >
            I knew this
          </button>

          <button
            onClick={nextCard}
            className="px-6 py-3 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
          >
            I didn't know
          </button>
        </div>
      )}
    </div>
  );
}