import Auth from './features/auth/auth';
import AiStoryTellerEmbed from './features/games/AiStoryTellerEmbed';
import Login from './features/auth/login';
import Dashboard from './features/dashboard/Dashboard';
import GameDetail from './features/dashboard/GameDetail';
import DrawingBoard from './features/games/DrawingBoard';
import EnglishSpellingGame from './features/games/english-spelling/EnglishSpellingGame';
import FlashcardsArena from './features/games/FlashcardsArena';
import ESLCollectionLauncher from './features/games/ESLCollectionLauncher';
import MemoryGameClassic from './features/games/MemoryGameClassic';
import ReactGameEmbed from './features/games/ReactGameEmbed';
import RocketDodge from './features/games/RocketDodge';
import WordScrambleGame from './features/games/word-scramble/WordScrambleGame';
import DragDropGame from './features/games/drag-drop/DragDropGame';
import ListeningQuizGame from './features/games/listening-quiz/ListeningQuizGame';
import { Navigate, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/games/ai-storyteller" element={<AiStoryTellerEmbed />} />
      <Route path="/games/drawing-board" element={<DrawingBoard />} />
      <Route path="/games/english-spelling" element={<EnglishSpellingGame />} />
      <Route path="/games/esl-collection" element={<ESLCollectionLauncher />} />
      <Route path="/games/flashcards-arena" element={<FlashcardsArena />} />
      <Route path="/games/react-game" element={<ReactGameEmbed />} />
      <Route path="/games/memory-game" element={<MemoryGameClassic />} />
      <Route path="/games/rocket-dodge" element={<RocketDodge />} />
      <Route path="/games/word-scramble" element={<WordScrambleGame />} />
      <Route path="/games/drag-drop" element={<DragDropGame />} />
      <Route path="/games/listening-quiz" element={<ListeningQuizGame />} />
      <Route path="/games/:slug" element={<GameDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
