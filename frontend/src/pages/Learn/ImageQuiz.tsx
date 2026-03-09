import { useState } from "react";
import { Link } from "react-router-dom";
import data from "../../data/ImageQuiz.json";

type Question = {
  id: number;
  image: string;
  options: string[];
  answer: string;
};

type QuizData = {
  questions: Question[];
};

export default function ImageQuiz() {

  const questions: Question[] = (data as QuizData).questions;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const current = questions[index];

  const handleAnswer = (option: string) => {

    if (selected) return;

    setSelected(option);

    if (option === current.answer) {
      setScore(score + 1);
    }

    setTimeout(() => {

      setSelected(null);

      if (index < questions.length - 1) {
        setIndex(index + 1);
      } else {
        setShowResult(true);
      }

    }, 1000);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
  };

  const getResultEmoji = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "🔥";
    if (percentage >= 80) return "🎉";
    if (percentage >= 60) return "👍";
    if (percentage >= 40) return "😅";
    return "💪";
  };

  const getResultMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Sheesh! Perfect score, you're literally him! 💯";
    if (percentage >= 80) return "Slay queen/king! That's fire fr fr! 🔥";
    if (percentage >= 60) return "Not bad bestie! Keep going! ✨";
    if (percentage >= 40) return "It's giving... effort! You can do better tho 👀";
    return "Nahhh bestie, you need to lock in fr 😭";
  };

  if (showResult) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 overflow-hidden">
        <Link
          to="/dashboard"
          className="absolute top-6 right-6 z-20 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition text-sm font-semibold"
        >
          ← Return Dashboard
        </Link>

        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-[bounce_1s_ease-in-out]">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce">
              {getResultEmoji()}
            </div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              Quiz Complete!
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {getResultMessage()}
            </p>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {score} / {questions.length}
              </div>
              <p className="text-gray-600 font-semibold mt-2">
                {Math.round((score / questions.length) * 100)}% Accuracy
              </p>
            </div>

            <button
              onClick={handleRestart}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Run it back! 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 overflow-hidden">
      <Link
        to="/dashboard"
        className="absolute top-6 right-6 z-20 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition text-sm font-semibold"
      >
        ← Return Dashboard
      </Link>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-2 drop-shadow-lg">
            🖼️ Guess the Picture
          </h1>
          <p className="text-white/90 text-lg">Test your visual knowledge!</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold text-sm">Progress</span>
            <span className="text-white font-bold text-sm">
              {index + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Image Card */}
        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mb-6 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-center">
            <img
              src={current.image}
              alt="quiz"
              className="w-80 h-80 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {current.options.map((opt) => {
            let colorClass = "bg-white/90 text-gray-800 hover:bg-white hover:shadow-xl";
            
            if (selected) {
              if (opt === current.answer) {
                colorClass = "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl scale-105";
              } else if (opt === selected) {
                colorClass = "bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-xl scale-95";
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={selected !== null}
                className={`p-6 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed ${colorClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Score Display */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
            <span className="text-2xl">⭐</span>
            <span className="text-white font-bold text-xl">
              Score: {score} / {questions.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}