import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CharacterCreator from './CharacterCreator';

const DEFAULT_AVATAR = {
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

const saveRegisteredUser = ({ email, password, avatar }) => {
    localStorage.setItem(
        'registered-user',
        JSON.stringify({
            email,
            password,
            avatar,
        })
    );
};

const saveCurrentUser = ({ email, password, avatar }) => {
    localStorage.setItem(
        'current-user',
        JSON.stringify({
            email,
            password,
            avatar,
        })
    );
};

export default function Auth() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');
    const [registered, setRegistered] = useState(false);
    const [avatarConfig, setAvatarConfig] = useState(DEFAULT_AVATAR);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận chưa khớp.');
            return;
        }

        if (!acceptedTerms) {
            setError('Bạn cần đồng ý điều khoản để tiếp tục.');
            return;
        }

        saveRegisteredUser({
            email,
            password,
            avatar: avatarConfig,
        });

        setRegistered(true);
    };

    const handleFinishAvatar = () => {
        const userPayload = {
            email,
            password,
            avatar: avatarConfig,
        };

        saveRegisteredUser(userPayload);
        saveCurrentUser(userPayload);
        navigate('/dashboard');
    };

    if (registered) {
        return (
            <CharacterCreator
                fullScreen
                avatarConfig={avatarConfig}
                onChange={setAvatarConfig}
                onSave={handleFinishAvatar}
                onNext={() => navigate('/login')}
            />
        );
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f89f3c] via-[#f5c85b] to-[#e6f48f]">
            <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#fff2d8]/80" />
            <div className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rounded-full bg-[#fff7e6]/75" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-52 w-full bg-gradient-to-t from-[#9de072]/80 to-transparent" />

            <div className="relative flex w-full flex-col items-center justify-center px-6 py-8 md:min-h-screen lg:py-0">
                <div className="mb-6 text-center">
                    <p className="text-5xl font-black tracking-tight text-white drop-shadow-md md:text-6xl">Funny English</p>
                    <p className="mt-2 text-sm font-extrabold text-[#7c420a]">Dang ky tai khoan de bat dau choi game</p>
                </div>

                <div className="w-full rounded-3xl border-4 border-[#f6e9d7] bg-[#fff8eb]/95 shadow-2xl sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <>
                            <h1 className="text-xl font-black leading-tight tracking-tight text-[#6a3511] md:text-2xl">
                                Tạo tài khoản cho bé
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
                                        Mật khẩu
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

                                <div>
                                    <label
                                        htmlFor="confirm-password"
                                        className="block mb-2 text-sm font-bold text-[#7c420a]"
                                    >
                                        Xác nhận mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        name="confirm-password"
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        placeholder="••••••••"
                                        className="block w-full rounded-xl border-2 border-[#f0d9b8] bg-white/90 p-2.5 text-sm text-[#6a3511] focus:border-[#f89f3c] focus:outline-none"
                                        required
                                    />
                                </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="terms"
                                                aria-describedby="terms"
                                                type="checkbox"
                                                checked={acceptedTerms}
                                                onChange={(event) => setAcceptedTerms(event.target.checked)}
                                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label
                                                htmlFor="terms"
                                                className="font-semibold text-[#8f5a31]"
                                            >
                                                Toi dong y voi{' '}
                                                <a
                                                    className="font-black text-[#d14d00] hover:underline"
                                                    href="#"
                                                >
                                                    dieu khoan su dung
                                                </a>
                                            </label>
                                        </div>
                                    </div>

                                    {error ? (
                                        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                                    ) : null}

                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-gradient-to-r from-[#ff8b3d] to-[#ff5f45] px-5 py-2.5 text-center text-sm font-black text-white shadow-md hover:brightness-105"
                                    >
                                        Đăng ký
                                    </button>

                                    <p className="text-sm font-semibold text-[#8f5a31]">
                                        Da co tai khoan?{' '}
                                        <Link
                                            to="/login"
                                            className="font-black text-[#d14d00] hover:underline"
                                        >
                                            Dang nhap ngay
                                        </Link>
                                    </p>
                            </form>
                        </>
                    </div>
                </div>
            </div>
        </section>
    );
}