import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import Vocabulary from '../src/pages/Learn/Vocabulary';
import DashBoard from './pages/DashBoard/DashBoard';
import ImageQuiz from './pages/Learn/ImageQuiz';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/vocabulary" element={<Vocabulary />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/image-quiz" element={<ImageQuiz />} />
    </Routes>
  );
};

export default App;
