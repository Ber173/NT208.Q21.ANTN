import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Login.css';

const Login: React.FC = () => {
    useEffect(() => {
        document.body.className = 'bg1';
    }, []);

    return (
        <div className='login-page'>
            <h1 className='login-text'>Đăng nhập</h1>
            
            <div className="input-group">
                <p> Tên đăng nhập </p>
                <input type="text" placeholder='Username'></input>
                <p> Mật khẩu </p>
                <input type="password" placeholder='Password'></input>
            </div>

            <p className="register-link">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>

            <button className="login-button">Đăng nhập</button>
        </div>
    );
};

export default Login;
