import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Lottie from 'lottie-react'
import submitted from '../assets/animation/submitted.json'
import '../styles/Home.css'

const Home: React.FC = () => {
  useEffect(() => {
    document.body.className = 'bg1'
  }, [])

  return (
    <div className="home-wrapper">
      <div className="home-card">

        <div className="lottie-box">
          <Lottie animationData={submitted} loop={true} />
        </div>

        <h1 className="home-title">English Learning</h1>

        <div className="home-buttons">
          <Link to="/login" className="home-btn">Đăng nhập</Link>
          <Link to="/register" className="home-btn outline">Đăng ký</Link>
        </div>

      </div>
    </div>
  )
}

export default Home
