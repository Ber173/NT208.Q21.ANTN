import Sun from "../../assets/images/Sun.png";
import Lottie from "lottie-react";
import SubmittedAnimation from "../../assets/animation/Submitted.json";
import { Link } from "react-router-dom";

export default function DashBoard() {
  const user = {
    name: "Little Astronaut",
    streak: 5,
    level: 3,
    points: 250,
  };

  const xpToNextLevel = 120;
  const currentLevelXP = 80;
  const progressPercent = (currentLevelXP / xpToNextLevel) * 100;

  const missions = [
    { title: "Learn 10 vocabulary words", reward: "+40 XP", done: true },
    { title: "Complete 1 quiz", reward: "+60 XP", done: false },
    { title: "Review flashcards", reward: "+30 XP", done: false },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f1029] via-[#20144f] to-[#09070f] text-white">
      {/* Decorative lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-80px] left-1/3 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="text-center lg:text-left">
              <p className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-purple-100">
                CABYBAKA • DASHBOARD
              </p>
              <h1 className="text-3xl font-black tracking-tight text-yellow-300 sm:text-4xl">
                Welcome back,  {user.name}
              </h1>
              <p className="mt-2 text-purple-100/90">
                Keep your learning orbit stable and grow your English power daily.
              </p>

              <div className="mt-5 w-full max-w-md">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-purple-100">Level {user.level} Progress</span>
                  <span className="font-semibold text-cyan-200">
                    {currentLevelXP}/{xpToNextLevel} XP
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <img
                src={Sun}
                alt="Sun Mascot"
                className="w-28 animate-pulse drop-shadow-[0_0_28px_rgba(255,200,0,0.85)] sm:w-36 hover:rotate-6 transition-transform duration-300"
              />
              <div className="mt-3 rounded-2xl border border-yellow-200/30 bg-yellow-300 px-4 py-2 text-sm font-bold text-black shadow-lg">
                🌟 {user.streak}-day streak! Keep it up!
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-orange-200/30 bg-gradient-to-br from-orange-400/20 to-red-500/15 p-5 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:scale-110">
            <p className="text-sm font-semibold text-orange-100">🔥 Streak</p>
            <p className="mt-2 text-3xl font-black">{user.streak}</p>
            <p className="mt-1 text-xs text-orange-100/80">Consecutive learning days</p>
          </div>

          <div className="rounded-2xl border border-emerald-200/30 bg-gradient-to-br from-emerald-400/20 to-green-500/15 p-5 shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:scale-110">
            <p className="text-sm font-semibold text-emerald-100">🚀 Level</p>
            <p className="mt-2 text-3xl font-black">{user.level}</p>
            <p className="mt-1 text-xs text-emerald-100/80">Current rank in galaxy</p>
          </div>

          <div className="rounded-2xl border border-pink-200/30 bg-gradient-to-br from-pink-400/20 to-fuchsia-500/15 p-5 shadow-xl backdrop-blur-md transition hover:-translate-y-1">
            <p className="text-sm font-semibold text-pink-100">⭐ Points</p>
            <p className="mt-2 text-3xl font-black">{user.points}</p>
            <p className="mt-1 text-xs text-pink-100/80">Total collected points</p>
          </div>
        </section>

        {/* Missions + Actions */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur-md lg:col-span-2">
            <h2 className="text-lg font-bold text-cyan-200">Today&apos;s Missions</h2>
            <div className="mt-4 space-y-3">
              {missions.map((mission) => (
                <div
                  key={mission.title}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    {mission.done ? (
                      <Lottie
                        animationData={SubmittedAnimation}
                        loop={false}
                        className="w-7 h-7 scale-150 align-middle"
                      />
                    ) : (
                      <span className="text-lg">🛰️</span>
                    )}
                    <p className="text-sm sm:text-base">{mission.title}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-yellow-200">
                    {mission.reward}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur-md">
            <h2 className="text-lg font-bold text-purple-200">Quick Start</h2>
            <p className="mt-2 text-sm text-purple-100/90">
              Continue your journey with one click.
            </p>

            <div className="mt-4 grid gap-3">
              <Link
                to="/vocabulary"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]"
              >
                Start Vocabulary
              </Link>
              <button className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]">
                Play Quiz
              </button>
              <button className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20">
                Review Progress
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}