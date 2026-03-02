import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/*
  GameContext
  - Quản lý XP
  - Quản lý Hearts
  - Quản lý Level
*/

interface GameContextType {
  xp: number;
  hearts: number;
  level: number;
  addXP: (amount: number) => void;
  loseHeart: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0);
  const [hearts, setHearts] = useState(5);

  // Level tính theo XP (ví dụ: 100 XP = lên level)
  const level = Math.floor(xp / 100) + 1;

  const addXP = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const loseHeart = () => {
    setHearts((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <GameContext.Provider
      value={{
        xp,
        hearts,
        level,
        addXP,
        loseHeart,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// Hook custom để dùng cho gọn
export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
}