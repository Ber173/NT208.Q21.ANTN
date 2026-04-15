import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'avataaars';
import { motion } from 'framer-motion';
import gcomprisGames from '../../data/gcomprisGames.json';
import trackLearnAndPlay from '../../assets/sound/lttmedia-lets-learn-and-play-398670.mp3';
import trackLittleDolphin from '../../assets/sound/lttmedia-little-dolphin-fin-274776.mp3';
import trackPhonicsSong from '../../assets/sound/phonics-song-gracies-corner.mp3';

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

const MUSIC_PLAYLIST = [trackLearnAndPlay, trackLittleDolphin, trackPhonicsSong];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);

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
    if (audioRef.current) {
      audioRef.current.pause();
    }
    navigate('/login');
  };

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0.35;
    audioRef.current = audio;

    const handleEnded = () => {
      setTrackIndex((prev) => (prev + 1) % MUSIC_PLAYLIST.length);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = MUSIC_PLAYLIST[trackIndex];
    if (!isMusicOn) return;

    const tryPlay = async () => {
      try {
        await audio.play();
      } catch {
        // Browser autoplay policies may block play until user interacts.
      }
    };

    tryPlay();
  }, [trackIndex, isMusicOn]);

  useEffect(() => {
    if (!isMusicOn) return undefined;

    const handleFirstInteraction = () => {
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;
      audio.play().catch(() => {});
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, [isMusicOn]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicOn) {
      audio.pause();
      setIsMusicOn(false);
      return;
    }

    setIsMusicOn(true);
    audio.play().catch(() => {});
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
      path: '/games/drawing-board',
      title: 'Bảng Vẽ Tô Màu',
      category: 'creativity',
      icon: 'https://raw.githubusercontent.com/L-E-D-4-N/Image/main/OIG1.jpg',
      description: 'Trò chơi tô màu giúp bé học màu sắc và phát huy trí tưởng tượng.',
    },
    {
      slug: 'rocket-dodge',
      path: '/games/rocket-dodge',
      title: 'Rocket Dodge',
      category: 'creativity',
      icon: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80',
      description: 'Game né sao bằng react-game-kit, dùng phím mũi tên để chơi.',
    },
    {
      slug: 'english-spelling',
      path: '/games/english-spelling',
      title: 'English Spelling Word Game',
      category: 'creativity',
      icon: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
      description: 'Game xep chu cai de hoan thanh tu tieng Anh theo hinh minh hoa.',
    },
    {
      slug: 'flashcards-arena',
      path: '/games/flashcards-arena',
      title: 'Flashcards Arena',
      category: 'creativity',
      icon: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
      description: 'Lật thẻ từ vựng, đánh dấu đã nhớ hoặc cần ôn lại.',
    },
    {
      slug: 'memory-game',
      path: '/games/memory-game',
      title: 'Memory Game Classic',
      category: 'creativity',
      icon: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=900&q=80',
      description: 'Lật thẻ hình ảnh kèm từ tiếng Anh và ghép cặp giống nhau.',
    },
    {
      slug: 'esl-collection',
      path: '/games/esl-collection',
      title: 'ESL Game Collection',
      category: 'creativity',
      icon: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
      description: 'Bộ nhiều mini-game ESL (Unity) mở trực tiếp từ bản web.',
    },
    {
      slug: 'react-game',
      path: '/games/react-game',
      title: 'React Game (Embedded)',
      category: 'creativity',
      icon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
      description: 'Tich hop truc tiep tu project react-game vao dashboard.',
    },
    {
      slug: 'ai-storyteller',
      path: '/games/ai-storyteller',
      title: 'AI Kid Storyteller',
      category: 'creativity',
      icon: 'https://images.unsplash.com/photo-1516627145497-ae6968895b9f?auto=format&fit=crop&w=900&q=80',
      description: 'Mo ung dung ke chuyen AI da clone de choi ngay tu dashboard.',
    },
    {
      slug: 'word-scramble',
      path: '/games/word-scramble',
      title: 'Word Scramble',
      category: 'reading',
      icon: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
      description: 'Sắp xếp chữ cái bị xáo trộn để tạo thành từ tiếng Anh đúng.',
    },
    {
      slug: 'drag-drop',
      path: '/games/drag-drop',
      title: 'Drag & Drop Match',
      category: 'reading',
      icon: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=80',
      description: 'Ghép từ tiếng Anh với hình ảnh tương ứng bằng cách chọn cặp.',
    },
    {
      slug: 'listening-quiz',
      path: '/games/listening-quiz',
      title: 'Listening Quiz',
      category: 'reading',
      icon: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=80',
      description: 'Nghe phát âm tiếng Anh và chọn đáp án đúng từ 4 lựa chọn.',
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f89f3c] via-[#f6c85a] to-[#e5f391]">
      <div className="pointer-events-none absolute -left-28 top-24 h-80 w-80 rounded-full bg-[#fff2d8]/85" />
      <div className="pointer-events-none absolute -right-24 top-16 h-96 w-96 rounded-full bg-[#fff7e6]/80" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-full bg-gradient-to-t from-[#95db67]/90 to-transparent" />

      <div className="fixed left-3 top-3 z-30 flex items-center gap-2 rounded-full border-2 border-[#f5e6d1] bg-[#fff8eb]/95 px-3 py-1.5 shadow-lg backdrop-blur">
        <Avatar style={{ width: '36px', height: '36px' }} {...(user?.avatar || fallbackAvatar)} />
        <span className="text-sm font-black text-[#6b3b14]">{displayName}</span>
      </div>

      <header className="sticky top-0 z-20 border-b border-[#f3d5ad] bg-[#fff6e7]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 pl-20">
          <div>
            <h1 className="text-xl font-black text-[#7a3f13]">Funny English Dashboard</h1>
            <p className="text-xs font-bold text-[#9b6339]">Khu tro choi vui nhon theo phong cach thieu nhi</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMusic}
              className="rounded-full bg-gradient-to-r from-[#58bfff] to-[#3f99ff] px-4 py-2 text-sm font-black text-white"
            >
              {isMusicOn ? 'Tat nhac' : 'Bat nhac'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-gradient-to-r from-[#ff8a52] to-[#ff5f45] px-4 py-2 text-sm font-black text-white"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="rounded-3xl border-4 border-[#f7e8d3] bg-gradient-to-r from-[#ffa53c] via-[#ffbd4c] to-[#ffd160] p-5 text-white shadow-xl">
          <p className="text-sm font-bold opacity-90">Welcome to Funny English</p>
          <h2 className="mt-1 text-3xl font-black">Kham pha tro choi hoc tieng Anh that vui</h2>
          <p className="mt-2 text-sm font-bold opacity-90">Tong cong {gcomprisGames.length} tro choi, co nhac nen va mini-game choi ngay.</p>
        </div>

        <div className="rounded-3xl border-4 border-[#d7f0bf] bg-[#f3ffe6]/95 p-4 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-black text-[#3c7b23]">Choi Ngay Tren Web</h3>
            <span className="rounded-full bg-[#b7e591] px-3 py-1 text-xs font-black text-[#255213]">Playable</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {customGames.map((game) => (
              <Link to={game.path} key={`playable-${game.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="overflow-hidden rounded-2xl border-2 border-[#d9ecbf] bg-white/95 shadow-sm transition hover:shadow-md"
                >
                  <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${game.icon})` }} />
                  <div className="space-y-2 p-3">
                    <h4 className="text-sm font-black text-slate-800">{game.title}</h4>
                    <p className="text-xs text-slate-600">{game.description}</p>
                    <span className="inline-block rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-black text-white">
                      Chơi ngay
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat.key} className={`rounded-full border-2 border-white/70 px-4 py-2 text-xs font-black uppercase shadow-sm ${cat.color}`}>
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
                <Link to={game.path} key={game.slug}>
                  <motion.div
                    className="group overflow-hidden rounded-2xl border-2 border-[#f2e4ce] bg-[#fff9ef] shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
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
                    className="overflow-hidden rounded-2xl border-2 border-[#f2e4ce] bg-[#fff9ef] shadow-sm"
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
