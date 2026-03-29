import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GameLoop, Stage, World } from 'react-game-kit';

const STAGE_WIDTH = 780;
const STAGE_HEIGHT = 420;
const PLAYER_SIZE = 56;
const STAR_SIZE = 24;
const PLAYER_Y = STAGE_HEIGHT - PLAYER_SIZE - 10;
const BEST_KEY = 'rocket-dodge-best-score';

const createInitialState = (best) => ({
  playerX: STAGE_WIDTH / 2 - PLAYER_SIZE / 2,
  stars: [],
  frame: 0,
  score: 0,
  best,
  playing: true,
});

export default function RocketDodge() {
  const bestAtLoad = Number(localStorage.getItem(BEST_KEY) || 0);
  const [state, setState] = useState(createInitialState(bestAtLoad));
  const keyState = useRef({ left: false, right: false });
  const nextStarId = useRef(1);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keyState.current.left = true;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keyState.current.right = true;
    };

    const onKeyUp = (event) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keyState.current.left = false;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keyState.current.right = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const restart = () => {
    keyState.current = { left: false, right: false };
    setState((prev) => createInitialState(prev.best));
  };

  const tick = useCallback(() => {
    setState((prev) => {
      if (!prev.playing) return prev;

      let playerX = prev.playerX;
      const speed = 7;
      if (keyState.current.left) playerX -= speed;
      if (keyState.current.right) playerX += speed;
      playerX = Math.max(0, Math.min(STAGE_WIDTH - PLAYER_SIZE, playerX));

      const frame = prev.frame + 1;
      let score = prev.score;

      let stars = prev.stars
        .map((star) => ({ ...star, y: star.y + star.speed }))
        .filter((star) => {
          const onScreen = star.y < STAGE_HEIGHT + STAR_SIZE;
          if (!onScreen) score += 1;
          return onScreen;
        });

      // Spawn with increasing difficulty over time.
      const spawnRate = Math.max(15, 30 - Math.floor(score / 8));
      if (frame % spawnRate === 0) {
        stars = stars.concat({
          id: nextStarId.current++,
          x: Math.random() * (STAGE_WIDTH - STAR_SIZE),
          y: -STAR_SIZE,
          speed: 2.8 + Math.random() * 2.8 + score * 0.02,
        });
      }

      const hit = stars.some((star) => {
        const dx = star.x + STAR_SIZE / 2 - (playerX + PLAYER_SIZE / 2);
        const dy = star.y + STAR_SIZE / 2 - (PLAYER_Y + PLAYER_SIZE / 2);
        return Math.abs(dx) < (PLAYER_SIZE + STAR_SIZE) / 2.2 && Math.abs(dy) < (PLAYER_SIZE + STAR_SIZE) / 2.4;
      });

      if (hit) {
        const best = Math.max(prev.best, score);
        localStorage.setItem(BEST_KEY, String(best));
        return {
          ...prev,
          playerX,
          stars,
          frame,
          score,
          best,
          playing: false,
        };
      }

      return {
        ...prev,
        playerX,
        stars,
        frame,
        score,
      };
    });
  }, []);

  const scoreLabel = useMemo(() => `Score: ${state.score}`, [state.score]);
  const bestLabel = useMemo(() => `Best: ${state.best}`, [state.best]);

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-6 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-sky-200">Rocket Dodge</h1>
            <p className="text-sm text-slate-300">Di chuyen bang phim mui ten trai/phai de ne sao roi.</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/dashboard"
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600"
            >
              Ve Dashboard
            </Link>
            <button
              type="button"
              onClick={restart}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-400"
            >
              Choi Lai
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-800 p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between text-sm font-bold text-slate-200">
            <span>{scoreLabel}</span>
            <span>{bestLabel}</span>
          </div>

          <GameLoop onUpdate={tick}>
            <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT} className="mx-auto overflow-hidden rounded-xl border border-slate-600 bg-slate-950">
              <World>
                <div
                  style={{
                    position: 'absolute',
                    left: state.playerX,
                    top: PLAYER_Y,
                    width: PLAYER_SIZE,
                    height: PLAYER_SIZE,
                    borderRadius: 16,
                    background: 'linear-gradient(145deg, #60a5fa, #2563eb)',
                    boxShadow: '0 0 16px rgba(59,130,246,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}
                >
                  🚀
                </div>

                {state.stars.map((star) => (
                  <div
                    key={star.id}
                    style={{
                      position: 'absolute',
                      left: star.x,
                      top: star.y,
                      width: STAR_SIZE,
                      height: STAR_SIZE,
                      borderRadius: 999,
                      background: 'radial-gradient(circle at 30% 30%, #fde68a 0%, #f59e0b 70%)',
                      boxShadow: '0 0 14px rgba(245,158,11,0.7)',
                    }}
                  />
                ))}
              </World>
            </Stage>
          </GameLoop>

          {!state.playing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="rounded-2xl border border-slate-400 bg-slate-900/95 px-6 py-5 text-center shadow-xl">
                <p className="text-xl font-black text-rose-300">Game Over</p>
                <p className="mt-1 text-sm text-slate-200">Score cua ban: {state.score}</p>
                <button
                  type="button"
                  onClick={restart}
                  className="mt-3 rounded-lg bg-sky-500 px-4 py-2 text-sm font-bold text-white hover:bg-sky-400"
                >
                  Choi Lai
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
