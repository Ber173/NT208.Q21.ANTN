import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'avataaars';
import { motion } from 'framer-motion';
import gcomprisGames from '../../data/gcomprisGames.json';

const fallbackAvatar = {
  avatarStyle: 'Circle',
  topType: 'ShortHairShortFlat',
  accessoriesType: 'Blank',
  hairColor: 'BrownDark',
  facialHairType: 'Blank',
  clotheType: 'Hoodie',
  clotheColor: 'PastelBlue',
  graphicType: 'Bear',
  eyeType: 'Happy',
  eyebrowType: 'RaisedExcited',
  mouthType: 'Smile',
  skinColor: 'Light',
};

const categories = [
  { key: 'reading', name: 'READING', color: 'bg-[#ffe48f] text-[#7b4e00]' },
  { key: 'math', name: 'MATH', color: 'bg-[#9ad8ff] text-[#0b3a66]' },
  { key: 'logic', name: 'LOGIC', color: 'bg-[#ffb0bf] text-[#6e1d3b]' },
  { key: 'science', name: 'SCIENCE', color: 'bg-[#b5f2b9] text-[#0f5e2f]' },
  { key: 'computer', name: 'COMPUTER', color: 'bg-[#d6c7ff] text-[#412d7a]' },
  { key: 'creativity', name: 'CREATIVITY', color: 'bg-[#fdd835] text-[#4e3400]' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const rawCurrentUser = localStorage.getItem('current-user');
    const rawRegisteredUser = localStorage.getItem('registered-user');

    if (!rawCurrentUser && !rawRegisteredUser) {
      navigate('/login', { replace: true });
      return;
    }

    const parsedCurrentUser = rawCurrentUser ? JSON.parse(rawCurrentUser) : null;
    const parsedRegisteredUser = rawRegisteredUser ? JSON.parse(rawRegisteredUser) : null;

    setUser(parsedCurrentUser || parsedRegisteredUser);
  }, [navigate]);

  const displayName = useMemo(() => {
    if (!user?.email) return 'Bé yêu';
    return user.email.split('@')[0];
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('current-user');
    navigate('/login');
  };

  const gamesByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.key] = gcomprisGames.filter((game) => game.category === category.key);
      return acc;
    }, {});
  }, []);

  const customGames = [
    {
      slug: 'drawing-board',
      title: 'Bảng Vẽ Tô Màu',
      category: 'creativity',
      icon: 'https://raw.githubusercontent.com/L-E-D-4-N/Image/main/OIG1.jpg',
      description: 'Trò chơi tô màu giúp bé học màu sắc và phát huy trí tưởng tượng.',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-black text-slate-800">Game Dashboard</h1>
            <p className="text-xs font-semibold text-slate-500">Kho trò chơi theo dữ liệu GCompris</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <Avatar style={{ width: '34px', height: '34px' }} {...(user?.avatar || fallbackAvatar)} />
              <span className="text-sm font-bold text-slate-700">{displayName}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 p-5 text-white">
          <p className="text-sm font-semibold opacity-90">Kho game dựa trên repo GCompris</p>
          <h2 className="mt-1 text-2xl font-black">Hiển thị game đúng vị trí theo nhóm học tập</h2>
          <p className="mt-2 text-sm font-semibold opacity-90">Tổng cộng {gcomprisGames.length} trò chơi từ kho GCompris.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat.key} className={`rounded-full px-4 py-2 text-xs font-black uppercase ${cat.color}`}>
              {cat.name}
            </span>
          ))}
        </div>

        {categories.map((category) => (
          <div key={category.key}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className={`text-lg font-black uppercase ${category.color.replace('bg-', 'text-').split(' ')[0]}`}>
                {category.name}
              </h3>
              <span className={`text-xs font-black ${category.color}`}>{gamesByCategory[category.key]?.length || 0} games</span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {category.key === 'creativity' && customGames.map((game) => (
                <Link to={`/games/${game.slug}`} key={game.slug}>
                  <motion.div
                    className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className="h-32 bg-cover bg-center"
                      style={{ backgroundImage: `url(${game.icon})` }}
                    />
                    <div className="p-3">
                      <h4 className="truncate text-sm font-black text-slate-800">{game.title}</h4>
                      <p className="truncate text-xs text-slate-500">{game.description}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
              {gamesByCategory[category.key]?.map((game) => (
                <Link to={`/games/${game.slug}`} key={game.id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                  >
                    <div className={`h-32 ${game.bg} flex items-center justify-center text-5xl`}>
                      {game.icon}
                    </div>

                    <div className="space-y-2 p-3">
                      <h4 className="line-clamp-2 text-sm font-black text-slate-800">{game.title}</h4>
                      <p className="text-[11px] font-bold uppercase text-slate-500">{game.section}</p>
                      <div className="inline-block rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">
                        {game.grade}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
