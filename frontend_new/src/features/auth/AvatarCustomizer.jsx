import { useEffect, useState } from 'react';
import Avatar from 'avataaars';

const STORAGE_KEY = 'favorite-avatar-config';

const AVATAR_OPTIONS = {
  avatarStyle: ['Circle', 'Transparent'],
  topType: [
    'NoHair',
    'LongHairMiaWallace',
    'LongHairStraight',
    'ShortHairShortFlat',
    'ShortHairShortRound',
    'ShortHairFrizzle',
    'Hat',
    'Hijab',
    'Turban',
    'WinterHat1',
    'WinterHat2',
    'WinterHat3',
    'WinterHat4',
  ],
  accessoriesType: [
    'Blank',
    'Kurt',
    'Prescription01',
    'Prescription02',
    'Round',
    'Sunglasses',
    'Wayfarers',
  ],
  hairColor: [
    'Black',
    'BrownDark',
    'Brown',
    'Auburn',
    'Blonde',
    'BlondeGolden',
    'Platinum',
    'Red',
    'SilverGray',
    'PastelPink',
    'Blue',
  ],
  facialHairType: ['Blank', 'BeardLight', 'BeardMedium', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'],
  clotheType: [
    'BlazerShirt',
    'BlazerSweater',
    'CollarSweater',
    'GraphicShirt',
    'Hoodie',
    'Overall',
    'ShirtCrewNeck',
    'ShirtScoopNeck',
    'ShirtVNeck',
  ],
  clotheColor: ['Blue01', 'Blue02', 'Blue03', 'PastelBlue', 'PastelGreen', 'PastelYellow', 'Pink', 'Red'],
  graphicType: ['Bat', 'Bear', 'Deer', 'Diamond', 'Hola', 'Pizza', 'Resist', 'Selena', 'Skull', 'SkullOutline'],
  eyeType: ['Default', 'Happy', 'Hearts', 'Wink', 'WinkWacky', 'Dizzy', 'Surprised', 'Cry', 'Squint'],
  eyebrowType: ['Default', 'DefaultNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'FlatNatural', 'UpDown'],
  mouthType: ['Smile', 'Twinkle', 'Default', 'Tongue', 'ScreamOpen', 'Serious', 'Eating'],
  skinColor: ['Pale', 'Light', 'Tanned', 'Brown', 'DarkBrown', 'Black', 'Yellow'],
};

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

const CONTROL_LABELS = {
  avatarStyle: 'Kiểu khung',
  topType: 'Tóc / Mũ',
  accessoriesType: 'Phụ kiện',
  hairColor: 'Màu tóc',
  facialHairType: 'Râu',
  clotheType: 'Trang phục',
  clotheColor: 'Màu áo',
  graphicType: 'Họa tiết áo',
  eyeType: 'Mắt',
  eyebrowType: 'Lông mày',
  mouthType: 'Miệng',
  skinColor: 'Màu da',
};

function pickRandom(values) {
  return values[Math.floor(Math.random() * values.length)];
}

export default function AvatarCustomizer() {
  const [avatarConfig, setAvatarConfig] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_AVATAR;

      const parsed = JSON.parse(raw);
      return { ...DEFAULT_AVATAR, ...parsed };
    } catch {
      return DEFAULT_AVATAR;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatarConfig));
  }, [avatarConfig]);

  const handleChange = (key, value) => {
    setAvatarConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleRandom = () => {
    const randomConfig = Object.keys(AVATAR_OPTIONS).reduce((acc, key) => {
      acc[key] = pickRandom(AVATAR_OPTIONS[key]);
      return acc;
    }, {});

    setAvatarConfig(randomConfig);
  };

  const handleReset = () => {
    setAvatarConfig(DEFAULT_AVATAR);
  };

  return (
    <div className="rounded-xl border border-pink-100 bg-pink-50 p-4 dark:border-gray-700 dark:bg-gray-700/30">
      <div className="mb-4 flex flex-col items-center gap-3">
        <Avatar style={{ width: '120px', height: '120px' }} {...avatarConfig} />
        <p className="text-center text-sm font-medium text-pink-700 dark:text-pink-300">
          Bé có thể tự tạo nhân vật yêu thích ✨
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Object.keys(AVATAR_OPTIONS).map((key) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700 dark:text-gray-200">{CONTROL_LABELS[key]}</span>
            <select
              value={avatarConfig[key]}
              onChange={(event) => handleChange(key, event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 focus:border-pink-400 focus:ring-pink-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {AVATAR_OPTIONS[key].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleRandom}
          className="rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-600"
        >
          Tạo ngẫu nhiên
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
        >
          Mặc định
        </button>
      </div>
    </div>
  );
}
