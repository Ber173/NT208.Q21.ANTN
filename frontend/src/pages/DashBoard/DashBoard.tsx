import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaGamepad, FaMagic, FaHome, FaCookieBite, FaRegSmile, FaGift } from 'react-icons/fa';

const categories = [
  { name: 'ABC LETTERS', color: 'bg-yellow-400', shadow: 'shadow-yellow-600', text: 'text-yellow-900' },
  { name: '123 NUMBERS', color: 'bg-cyan-400', shadow: 'shadow-cyan-600', text: 'text-white' },
  { name: 'HOLIDAY', color: 'bg-red-500', shadow: 'shadow-red-700', text: 'text-white' },
  { name: 'STRATEGY', color: 'bg-lime-400', shadow: 'shadow-lime-600', text: 'text-white' },
  { name: 'SKILL', color: 'bg-purple-500', shadow: 'shadow-purple-700', text: 'text-white' },
];

const featuredGames = [
  { id: 1, title: 'Shape & Color BINGO', grade: 'Grades PRE-K – 1', img: <FaGamepad />, bg: 'bg-indigo-300', path: '/login' },
  { id: 2, title: "Molly's Magic Adventure", grade: 'Grades PRE-K – 2', img: <FaMagic />, bg: 'bg-cyan-300', path: '/login' },
  { id: 3, title: 'Make a House', grade: 'Grades PRE-K – 2', img: <FaHome />, bg: 'bg-orange-200', path: '/login' },
  { id: 4, title: 'Lily Pad Pond', grade: 'Grades PRE-K – 2', img: <FaGamepad />, bg: 'bg-green-300', path: '/login' },
  { id: 5, title: 'Same & Different', grade: 'Grades PRE-K – K', img: <FaCookieBite />, bg: 'bg-pink-200', path: '/login' },
  { id: 6, title: 'Rainbow Run', grade: 'Grades K – 2', img: <FaGift />, bg: 'bg-yellow-200', path: '/login' },
  { id: 7, title: 'Happy Hopper', grade: 'Grades PRE-K – K', img: <FaRegSmile />, bg: 'bg-lime-200', path: '/login' },
  { id: 8, title: 'Flashcards', grade: 'All Ages', img: <FaRegSmile />, bg: 'bg-sky-200', path: '/vocabulary' },
];

const DashBoard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0d2a3a] font-sans overflow-x-hidden selection:bg-pink-400 selection:text-white">
      
      {/* 1. TOP NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-3 bg-[#11b59c] text-white font-bold text-sm border-b-[6px] border-[#0a7a69] z-50 relative">
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ rotate: [-5, 5, -5, 0], scale: 1.1 }}
            className="text-4xl font-black text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] cursor-pointer tracking-tighter"
          >
            CABYBAKA!
          </motion.div>
          
            <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search CABYBAKA!" 
              className="px-5 py-2.5 rounded-full text-gray-700 w-72 font-normal outline-none border-4 border-transparent focus:border-yellow-400 transition-all shadow-inner"
            />
            <span className="absolute right-4 top-2.5 text-gray-400 text-lg"><FiSearch /></span>
          </div>
        </div>

        <div className="hidden lg:flex gap-6 items-center">
          <a href="#" className="hover:text-yellow-200 transition-colors">Common Core Standards</a>
          <a href="#" className="hover:text-yellow-200 transition-colors">Parents & Teachers</a>
          <a href="#" className="hover:text-yellow-200 transition-colors">Help</a>
          <a href="#" className="hover:text-yellow-200 transition-colors">Store</a>
          
          <Link to="/register" className="ml-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95, y: 4, boxShadow: "0 0px 0 #b48600" }}
              className="bg-yellow-400 text-yellow-900 px-8 py-2.5 rounded-full shadow-[0_4px_0_#b48600] uppercase tracking-wide flex items-center justify-center"
            >
              Join Now
            </motion.div>
          </Link>

          <Link to="/login" className="hover:text-yellow-200 transition-colors ml-2">Log In</Link>
        </div>
      </nav>

      {/* 2. GRADE BAR */}
      <div className="flex justify-center gap-6 py-4 bg-[#081e2a] text-[#11b59c] font-black text-xl border-b-[3px] border-black/30 shadow-inner z-40 relative">
        {['PRE-K', 'K', '1', '2', '3', '4', '5', '6+'].map((grade, i) => (
          <motion.div 
            key={grade} 
            whileHover={{ scale: 1.2, color: '#ffffff', y: -2 }}
            className={`cursor-pointer transition-colors ${i === 0 ? 'text-pink-400 text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : ''}`}
          >
            <span className="text-sm text-gray-400 mr-1">GRADE</span>
            <span className={i === 0 ? 'text-pink-400' : 'text-orange-400'}>{grade}</span>
          </motion.div>
        ))}
      </div>

      {/* 3. HERO SECTION (Planet & Categories) */}
      <div className="relative w-full h-[350px] overflow-hidden flex flex-col items-center pt-8 z-30">
        
        <div className="flex flex-col items-center z-20 w-full max-w-5xl px-4">
          <div className="flex w-full justify-between items-center mb-6">
            <h1 className="text-white text-6xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">PRE-K</h1>
            <div className="flex gap-3">
               <button className="bg-[#11b59c] text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-[0_3px_0_#0a7a69]">🍎 Educator Info</button>
               <button className="bg-[#11b59c] text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-[0_3px_0_#0a7a69]">🌍 Jugar en español</button>
            </div>
          </div>

          {/* Buttons Danh mục */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <motion.button 
                key={cat.name} 
                whileHover={{ scale: 1.08, rotate: Math.random() > 0.5 ? 2 : -2 }}
                whileTap={{ scale: 0.95, y: 6, boxShadow: "0 0px 0 rgba(0,0,0,0)" }}
                className={`${cat.color} ${cat.text} font-black px-8 py-3 rounded-full text-lg shadow-[0_6px_0_rgba(0,0,0,0.2)] ${cat.shadow} uppercase tracking-wider`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Đồ họa Hành tinh khổng lồ */}
        <div className="absolute top-[180px] w-[180%] md:w-[120%] h-[1000px] bg-[#f96489] rounded-[50%] z-10 border-t-[12px] border-[#ff8aa7] shadow-[inset_0_40px_100px_rgba(0,0,0,0.15)] flex justify-center">
          
          {/* Các vật thể trang trí nổi trên hành tinh */}
          <div className="relative w-full max-w-6xl mt-8 h-32">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute left-[15%] text-6xl drop-shadow-xl"><FaGamepad /></motion.div>
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute left-[25%] top-[-20px] text-6xl drop-shadow-xl"><FaGift /></motion.div>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute left-[45%] top-[10px] text-7xl drop-shadow-xl"><FaMagic /></motion.div>
            <motion.div className="absolute right-[35%] top-[-60px] text-[120px] drop-shadow-xl opacity-80"><FaRegSmile /></motion.div>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute right-[20%] top-[20px] text-6xl drop-shadow-xl"><FaCookieBite /></motion.div>
            <motion.div className="absolute right-[10%] top-[40px] text-5xl drop-shadow-xl"><FaGift /></motion.div>
          </div>
        </div>
      </div>

      {/* 4. GAME GRID SECTION */}
      <div className="relative z-40 bg-[#f44b75] pt-4 pb-20 px-4 md:px-8 border-t-[10px] border-[#ff8aa7]">
        <h2 className="text-center text-white font-black text-2xl tracking-[0.15em] mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] bg-[#e03a62] py-2 mx-auto max-w-3xl rounded-b-3xl -mt-4 shadow-inner">
          FEATURED PRESCHOOL GAMES
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 max-w-[1200px] mx-auto">
          {featuredGames.map((game) => (
            <Link to={game.path || '/login'} key={game.id} className="no-underline">
            <motion.div 
              whileHover={{ y: -10 }}
              className="group w-52 bg-white rounded-[24px] overflow-hidden shadow-[0_10px_0_#a81b42] cursor-pointer border-4 border-white relative"
            >
              {/* Huy hiệu miễn phí (nếu là game đầu tiên) */}
              {game.id === 1 && (
                 <div className="absolute top-2 left-2 bg-lime-400 text-white font-black text-[10px] px-2 py-1 rounded-full z-10 shadow-md rotate-[-15deg]">
                   FREE
                 </div>
              )}

              {/* Game Thumbnail */}
              <div className={`h-40 ${game.bg} flex items-center justify-center text-7xl overflow-hidden`}>
                <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  {game.img}
                </motion.div>
              </div>
              
              {/* Game Info */}
              <div className="p-3 bg-[#f44b75] text-white border-t-4 border-white h-24 flex flex-col justify-between">
                <h3 className="font-black text-[15px] leading-tight mb-1 text-center">{game.title}</h3>
                <div className="flex justify-between items-center w-full">
                  <span className="text-[11px] font-bold opacity-90">{game.grade}</span>
                  <span className="text-white bg-[#a81b42] rounded-full p-1.5 text-xs shadow-inner"><FaGamepad /></span>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashBoard;