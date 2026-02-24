import { useState } from "react";
import { useGame } from "../../context/GameContext";
import data from "../../data/vocabulary.json";

/*
  Flashcard Component đơn giản
  - Chọn 1 nhóm (vd: fruits)
  - Không dùng route động
  - Tailwind UI
*/

type Card = {
  id: number;
  word: string;
  ipa: string;
  meaning: string;
};

export default function Flashcard() {
  const { addXP } = useGame();

  // 🔥 Chọn nhóm ở đây
  const cards: Card[] = data.topics[0]?.lessons[0]?.cards || [];

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = cards[index];

  const nextCard = () => {
    setFlipped(false);

    if (index < cards.length - 1) {
      setIndex(index + 1);
    } else {
      alert("Hoàn thành nhóm này!");
    }
  };

  const progress = ((index + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="w-full bg-gray-300 h-3 rounded-full">
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
          {/* Front */}
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

          {/* Back */}
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
            className="px-6 py-3 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
          >
            I knew this
          </button>

          <button
            onClick={nextCard}
            className="px-6 py-3 bg-gray-300 rounded-xl shadow hover:bg-gray-400 transition"
          >
            I didn't know
          </button>
        </div>
      )}
    </div>
  );
}
