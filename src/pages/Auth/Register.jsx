import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css'
import { useEffect } from 'react'

function Register(){
    useEffect(() => {
        document.body.className = 'bg2';
    }, [])
    
    return (
        <div className='register-page'>
            <h1 className='register-text'>Đăng ký</h1>

            <div className="input-group">
                <p>Gmail</p>
                <input type="text" placeholder='Gmail'></input>
                <p>Tên đăng nhập</p>
                <input type='text' placeholder='Username'></input>
                <p>Mật khẩu</p>
                <input type='password' placeholder='Password'></input>
                <p>Xác nhận mật khẩu</p>
                <input type='password' placeholder='Confirm Password'></input>
            </div>

            <button className='register-button'>Đăng ký</button>

            <p className="login-link">
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
        </div>
    )
}

export default Register;