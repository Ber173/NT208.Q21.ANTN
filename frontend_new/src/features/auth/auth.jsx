import { useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function Auth() {
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
        saveRegisteredUser({
            email,
            password,
            avatar: avatarConfig,
        });
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a
                    href="#"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                >
                    <img
                        className="w-8 h-8 mr-2"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                        alt="logo"
                    />
                    Flowbite
                </a>

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {!registered ? (
                            <>
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Tạo tài khoản cho bé
                                </h1>

                                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="name@company.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="confirm-password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                                className="font-light text-gray-500 dark:text-gray-300"
                                            >
                                                I accept the{' '}
                                                <a
                                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                                    href="#"
                                                >
                                                    Terms and Conditions
                                                </a>
                                            </label>
                                        </div>
                                    </div>

                                    {error ? (
                                        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                                    ) : null}

                                    <button
                                        type="submit"
                                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    >
                                        Đăng ký
                                    </button>

                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        Already have an account?{' '}
                                        <Link
                                            to="/login"
                                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                        >
                                            Login here
                                        </Link>
                                    </p>
                                </form>
                            </>
                        ) : (
                            <>
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Đăng ký thành công 🎉
                                </h1>

                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Bây giờ bé hãy chọn nhân vật bằng hình ảnh nhé.
                                </p>

                                <CharacterCreator avatarConfig={avatarConfig} onChange={setAvatarConfig} />

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleFinishAvatar}
                                        className="flex-1 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    >
                                        Lưu nhân vật
                                    </button>
                                    <Link
                                        to="/login"
                                        className="flex-1 text-center text-sm font-medium rounded-lg px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Sang đăng nhập
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}