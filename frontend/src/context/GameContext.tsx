import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/*
  GameContext
  - Quản lý XP
  - Quản lý Hearts
  - Quản lý Level
*/

// interface định nghĩa kiểu dữ liệu của context
interface GameContextType {
  xp: number;     // Tổng XP hiện tại
  hearts: number; // Số lượng hearts còn lại
  level: number;  // Level hiện tại (tính theo XP)
  addXP: (amount: number) => void;   // Hàm để thêm XP
  loseHeart: () => void;  // Hàm để mất một heart
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