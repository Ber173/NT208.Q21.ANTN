import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.css'
import {useEffect} from 'react'

const Home: React.FC = () => {
  const [open, setOpen] = useState(false)
    useEffect(() => {
        document.body.className = 'bg3';
    }, [])

  return (

    <div className="home-wrapper">
      {/* MENU GÓC */}
      <div className="corner-menu">
        <button 
          className="menu-toggle"
          onClick={() => setOpen(!open)}
        >
          #
        </button>

        {open && (
          <div className="dropdown">
            <Link to="/login" className="dropdown-item">
              Đăng nhập
            </Link>

            <Link to="/register" className="dropdown-item">
              Đăng ký
            </Link>
          </div>
        )}
      </div>

      {/* TEXT GIỮA */}
      <div className="center-text">
        <h1>English Learning</h1>
        <p>Học tiếng Anh mỗi ngày cùng Cabybaka</p>
      </div>

    </div>
  )
}

export default Home
