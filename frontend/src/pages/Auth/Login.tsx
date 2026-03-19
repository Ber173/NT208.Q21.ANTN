import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { FaUserCircle, FaLock, FaRegSmile, FaRocket, FaCloud } from 'react-icons/fa';

const Login: React.FC = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8017/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Đăng nhập thất bại");
      }

      const token = data?.data?.token;
      const user = data?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/dashboard");

    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d2a3a] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-20 w-80 h-80 rounded-full bg-pink-400/40 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-[-40px] w-72 h-72 rounded-full bg-cyan-300/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] left-1/4 w-96 h-96 rounded-full bg-yellow-300/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md px-6">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 border border-white/10 relative overflow-hidden">
          {/* floating icons */}
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-6 left-6 text-2xl text-yellow-300 opacity-90"><FaRegSmile /></motion.div>
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -right-6 top-8 text-2xl text-pink-300 opacity-90"><FaRocket /></motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-10 right-8 text-2xl text-cyan-300 opacity-80"><FaCloud /></motion.div>

          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-300 text-yellow-900 text-2xl mr-3 shadow-md"><FaRegSmile /></div>
            <h1 className="text-3xl font-black text-white">CABYBAKA!</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-300">Email</label>
              <div className="mt-2 relative">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/5 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
                <span className="absolute right-3 top-3 text-gray-200 text-lg"><FaUserCircle /></span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-300">Password</label>
              <div className="mt-2 relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/5 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
                <span className="absolute right-3 top-3 text-gray-200 text-lg"><FaLock /></span>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-yellow-900 py-3 rounded-full font-bold hover:brightness-95 transition"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-300">
            Chưa có tài khoản? <Link to="/register" className="text-yellow-300 font-semibold">Đăng ký ngay</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;