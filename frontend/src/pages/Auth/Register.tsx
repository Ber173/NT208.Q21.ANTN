import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Register.css';

const Register: React.FC = () => {
    // khai báo state cho form đăng ký
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.className = 'bg2';
    }, []);

    // xử lý đăng ký khi submit form
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Gọi API đăng ký
        setLoading(true); // Bắt đầu loading
        try {
            const response = await fetch('http://localhost:8017/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Đăng ký thất bại');
            }

            const token = data?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
            }

            window.location.href = '/';
        } catch (err: any) {
            setError(err?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className='register-page'>
            <h1 className='register-text'>Đăng ký</h1>

            <form className="input-group" onSubmit={handleRegister}>
                <p>Gmail đăng nhập</p>
                <input
                    type="email"
                    placeholder='Gmail'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p>Tên đăng nhập</p>
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <p>Mật khẩu</p>
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <p>Xác nhận mật khẩu</p>
                <input
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && <p className="error-message">{error}</p>}

                <button className='register-button' type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </form>

            <p className="login-link">
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
        </div>
    );
};

export default Register;
