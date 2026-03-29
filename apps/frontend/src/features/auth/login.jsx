import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from 'avataaars';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const rawUser = localStorage.getItem('registered-user');
    if (!rawUser) {
      setError('Chưa có tài khoản. Vui lòng đăng ký trước.');
      return;
    }

    const user = JSON.parse(rawUser);
    const emailMatched = email.trim().toLowerCase() === (user.email || '').trim().toLowerCase();
    const passwordMatched = !user.password || password === user.password;

    if (!emailMatched || !passwordMatched) {
      setError('Email hoặc mật khẩu chưa đúng.');
      return;
    }

    localStorage.setItem('current-user', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f89f3c] via-[#f6c85a] to-[#e5f391]">
      <div className="pointer-events-none absolute -left-20 top-36 h-64 w-64 rounded-full bg-[#fff2d8]/80" />
      <div className="pointer-events-none absolute -right-24 top-28 h-72 w-72 rounded-full bg-[#fff7e6]/75" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-52 w-full bg-gradient-to-t from-[#9de072]/80 to-transparent" />

      <div className="relative mx-auto flex min-h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
        <div className="mb-6 text-center">
          <p className="text-5xl font-black tracking-tight text-white drop-shadow-md md:text-6xl">Funny English</p>
          <p className="mt-2 text-sm font-extrabold text-[#7c420a]">Dang nhap de tiep tuc hanh trinh hoc tap</p>
        </div>

        <div className="w-full rounded-3xl border-4 border-[#f6e9d7] bg-[#fff8eb]/95 shadow-2xl sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex justify-center">
              <Avatar
                style={{ width: '96px', height: '96px' }}
                avatarStyle="Circle"
                topType="ShortHairShortFlat"
                accessoriesType="Blank"
                hairColor="Black"
                facialHairType="Blank"
                clotheType="ShirtScoopNeck"
                clotheColor="Blue03"
                eyeType="Default"
                eyebrowType="Default"
                mouthType="Smile"
                skinColor="Light"
              />
            </div>

            <h1 className="text-xl font-black leading-tight tracking-tight text-[#6a3511] md:text-2xl">
              Dang nhap tai khoan
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-[#7c420a]"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="block w-full rounded-xl border-2 border-[#f0d9b8] bg-white/90 p-2.5 text-sm text-[#6a3511] focus:border-[#f89f3c] focus:outline-none"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-bold text-[#7c420a]"
                >
                  Mat khau
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border-2 border-[#f0d9b8] bg-white/90 p-2.5 text-sm text-[#6a3511] focus:border-[#f89f3c] focus:outline-none"
                  required
                />
              </div>

              {error ? (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#ff8b3d] to-[#ff5f45] px-5 py-2.5 text-center text-sm font-black text-white shadow-md hover:brightness-105"
              >
                Dang nhap
              </button>

              <p className="text-sm font-semibold text-[#8f5a31]">
                Chua co tai khoan?{' '}
                <Link
                  to="/"
                  className="font-black text-[#d14d00] hover:underline"
                >
                  Dang ky ngay
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
