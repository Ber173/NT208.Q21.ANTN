import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaLock, FaRegSmile, FaStar } from 'react-icons/fa';

const Register: React.FC = () => {
    // khai báo state cho form đăng ký
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // ensure body background stays neutral — dashboard uses its own bg on pages
        return () => {
            // cleanup if needed
        };
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
    
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d2a3a] p-6 relative overflow-hidden">
            {/* decorative blobs */}
            <div className="absolute -top-28 left-0 w-72 h-72 rounded-full bg-pink-400/30 blur-3xl pointer-events-none" />
            <div className="absolute top-16 right-0 w-80 h-80 rounded-full bg-cyan-300/25 blur-3xl pointer-events-none" />

            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-lg bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-4 left-6 text-yellow-300 text-2xl"><FaRegSmile /></motion.div>
                <div className="flex items-center justify-center mb-6">
                    <div className="text-4xl text-yellow-300 mr-3"><FaUserCircle /></div>
                    <h1 className="text-3xl font-black text-white">Đăng ký</h1>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-300 font-semibold">Gmail đăng nhập</label>
                        <div className="mt-2 relative">
                            <input type="email" placeholder="Gmail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/5 outline-none" />
                            <span className="absolute right-3 top-3 text-gray-200"><FaEnvelope /></span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 font-semibold">Tên đăng nhập</label>
                        <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white border border-white/5 outline-none" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 font-semibold">Mật khẩu</label>
                        <div className="mt-2 relative">
                            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/5 outline-none" />
                            <span className="absolute right-3 top-3 text-gray-200"><FaLock /></span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 font-semibold">Xác nhận mật khẩu</label>
                        <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full mt-2 p-3 rounded-lg bg-white/10 text-white border border-white/5 outline-none" />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button className='w-full bg-yellow-400 text-yellow-900 py-3 rounded-full font-bold' type="submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-300">
                    Đã có tài khoản? <Link to="/login" className="text-yellow-300 font-semibold">Đăng nhập ngay</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
