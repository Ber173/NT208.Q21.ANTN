import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Submitted from './assets/animation/Submitted.json'
import Lottie from 'lottie-react'
import './App.css'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Home'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
