import Auth from './features/auth/auth';
import Login from './features/auth/login';
import Dashboard from './features/dashboard/Dashboard';
import GameDetail from './features/dashboard/GameDetail';
import DrawingBoard from './features/games/DrawingBoard';
import { Navigate, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/games/drawing-board" element={<DrawingBoard />} />
      <Route path="/games/:slug" element={<GameDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
