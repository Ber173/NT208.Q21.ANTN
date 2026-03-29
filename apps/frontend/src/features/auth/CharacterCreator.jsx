import { useEffect, useRef, useState } from 'react';
import Avatar from 'avataaars';
import { motion } from 'framer-motion';
import popSound from '../../assets/effects/pop.mp3';

const BASE_CONFIG = {
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

const CATEGORIES = [
  {
    key: 'topType',
    icon: '👨‍🦱',
    title: 'Tóc',
    options: [
      { value: 'NoHair', props: { topType: 'NoHair', hairColor: 'BrownDark' } },
      { value: 'ShortHairShortFlat', props: { topType: 'ShortHairShortFlat', hairColor: 'BrownDark' } },
      { value: 'ShortHairShortRound', props: { topType: 'ShortHairShortRound', hairColor: 'Brown' } },
      { value: 'ShortHairFrizzle', props: { topType: 'ShortHairFrizzle', hairColor: 'Black' } },
      { value: 'LongHairStraight2', props: { topType: 'LongHairStraight2', hairColor: 'BrownDark' } },
      { value: 'LongHairStraight', props: { topType: 'LongHairStraight', hairColor: 'BlondeGolden' } },
      { value: 'LongHairMiaWallace', props: { topType: 'LongHairMiaWallace', hairColor: 'Brown' } },
      { value: 'Hijab', props: { topType: 'Hijab', hairColor: 'Black' } },
      { value: 'Turban', props: { topType: 'Turban', hairColor: 'Auburn' } },
      { value: 'Hat', props: { topType: 'Hat', hairColor: 'BrownDark' } },
      { value: 'WinterHat1', props: { topType: 'WinterHat1', hairColor: 'Black' } },
      { value: 'WinterHat2', props: { topType: 'WinterHat2', hairColor: 'BrownDark' } },
      { value: 'WinterHat3', props: { topType: 'WinterHat3', hairColor: 'SilverGray' } },
      { value: 'WinterHat4', props: { topType: 'WinterHat4', hairColor: 'Blue' } },
    ],
  },
  {
    key: 'eyeType',
    icon: '👀',
    title: 'Mắt',
    options: [
      { value: 'Default', props: { eyeType: 'Default' } },
      { value: 'Happy', props: { eyeType: 'Happy' } },
      { value: 'Hearts', props: { eyeType: 'Hearts' } },
      { value: 'Wink', props: { eyeType: 'Wink' } },
      { value: 'WinkWacky', props: { eyeType: 'WinkWacky' } },
      { value: 'Dizzy', props: { eyeType: 'Dizzy' } },
      { value: 'Squint', props: { eyeType: 'Squint' } },
      { value: 'Surprised', props: { eyeType: 'Surprised' } },
      { value: 'Cry', props: { eyeType: 'Cry' } },
    ],
  },
  {
    key: 'mouthType',
    icon: '👄',
    title: 'Miệng',
    options: [
      { value: 'Smile', props: { mouthType: 'Smile' } },
      { value: 'Twinkle', props: { mouthType: 'Twinkle' } },
      { value: 'Default', props: { mouthType: 'Default' } },
      { value: 'Tongue', props: { mouthType: 'Tongue' } },
      { value: 'ScreamOpen', props: { mouthType: 'ScreamOpen' } },
      { value: 'Serious', props: { mouthType: 'Serious' } },
      { value: 'Eating', props: { mouthType: 'Eating' } },
    ],
  },
  {
    key: 'skinColor',
    icon: '🎨',
    title: 'Màu da',
    options: [
      { value: 'Pale', props: { skinColor: 'Pale' } },
      { value: 'Light', props: { skinColor: 'Light' } },
      { value: 'Tanned', props: { skinColor: 'Tanned' } },
      { value: 'Brown', props: { skinColor: 'Brown' } },
      { value: 'DarkBrown', props: { skinColor: 'DarkBrown' } },
      { value: 'Black', props: { skinColor: 'Black' } },
      { value: 'Yellow', props: { skinColor: 'Yellow' } },
    ],
  },
];

export default function CharacterCreator({ avatarConfig, onChange, onSave, onNext, fullScreen = false }) {
  const merged = { ...BASE_CONFIG, ...avatarConfig };
  const [reactionKey, setReactionKey] = useState(0);
  const popAudioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(popSound);
    audio.preload = 'auto';
    popAudioRef.current = audio;

    return () => {
      if (popAudioRef.current) {
        popAudioRef.current.pause();
        popAudioRef.current = null;
      }
    };
  }, []);

  const playPop = () => {
    const audio = popAudioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore browser autoplay restrictions; next user interaction will allow playback.
    });
  };

  const handleSelect = (key, value) => {
    playPop();
    onChange((prev) => ({ ...prev, [key]: value }));
    setReactionKey((prev) => prev + 1);
  };

  const handleRandom = () => {
    onChange((prev) => {
      const next = { ...prev };

      CATEGORIES.forEach((category) => {
        const options = category.options;
        const randomOption = options[Math.floor(Math.random() * options.length)];
        next[category.key] = randomOption.value;
      });

      return next;
    });

    setReactionKey((prev) => prev + 1);
  };

  const handleReset = () => {
    onChange((prev) => ({ ...prev, ...BASE_CONFIG }));
    setReactionKey((prev) => prev + 1);
  };

  const showActionButtons = typeof onSave === 'function' || typeof onNext === 'function';
  const containerClassName = fullScreen
    ? 'h-screen w-full overflow-hidden bg-gradient-to-br from-[#b8d9ff] via-[#ffd9ec] to-[#c9e9ff] p-3 xl:p-4'
    : 'w-full rounded-3xl border-4 border-white bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 p-4 shadow-xl xl:p-5';
  const contentClassName = fullScreen
    ? 'grid h-full gap-3 xl:grid-cols-[1.7fr_1fr]'
    : 'grid items-start gap-4 xl:grid-cols-[1.6fr_1fr]';

  return (
    <div className={containerClassName}>
      <div className={contentClassName}>
        <div className={fullScreen ? 'flex h-full flex-col gap-3 overflow-hidden' : 'space-y-3'}>
          <div className="flex flex-wrap items-end justify-between gap-2 rounded-3xl border-4 border-white/80 bg-white/30 p-3 backdrop-blur-md">
            <div>
              <h2 className="text-lg font-black text-[#1a2a4f] drop-shadow-sm xl:text-2xl">
                ✨ Tạo Nhân Vật Của Bé ✨
              </h2>
              <p className="text-xs font-bold text-[#33456f] xl:text-sm">
                Chọn từng phần ở cột trái, xem kết quả ngay cột phải.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRandom}
                className="rounded-full bg-gradient-to-r from-[#ffb545] to-[#ff7d4d] px-3.5 py-1.5 text-xs font-black text-white shadow-md transition hover:shadow-lg"
              >
                ✨ Ngẫu Nhiên
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="rounded-full bg-gradient-to-r from-[#4b8fff] to-[#2cc6ff] px-3.5 py-1.5 text-xs font-black text-white shadow-md transition hover:shadow-lg"
              >
                ↺ Mặc Định
              </motion.button>
            </div>
          </div>

          <div className={fullScreen ? 'flex-1 space-y-2 overflow-y-auto pr-1' : 'space-y-2'}>
            {CATEGORIES.map((category) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border-4 border-white bg-white/95 p-2.5 shadow-md backdrop-blur"
              >
                <h3 className="mb-2 text-sm font-black text-[#5d2e88] xl:text-[15px]">
                  {category.icon} {category.title}
                </h3>

                <div className="flex gap-3 overflow-x-auto pb-1">
                  {category.options.map((option) => {
                    const isSelected = merged[category.key] === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleSelect(category.key, option.value)}
                        className={`relative flex h-[92px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-purple-500 ring-2 ring-pink-300 shadow-lg'
                            : 'border-slate-300 shadow-sm'
                        }`}
                      >
                        <div className="bg-white p-2">
                          <Avatar
                            style={{ width: '72px', height: '72px' }}
                            {...{
                              ...BASE_CONFIG,
                              ...option.props,
                            }}
                          />
                        </div>

                        {isSelected ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                            <motion.div
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ repeat: Infinity, duration: 0.9 }}
                              className="text-lg"
                            >
                              ✨
                            </motion.div>
                          </div>
                        ) : null}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={fullScreen ? 'grid h-full grid-rows-[1fr_auto_auto] gap-3' : 'space-y-3'}>
          <div className="rounded-3xl border-8 border-white bg-gradient-to-b from-[#7fc6ff] to-[#ffb9d6] p-3 shadow-xl flex items-center justify-center">
            <motion.div
              key={reactionKey}
              animate={{
                scale: [1, 1.05, 0.98, 1],
                rotate: [0, 2, -2, 0],
                y: [0, -5, 0],
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex justify-center"
            >
              <Avatar
                style={{ width: fullScreen ? '220px' : '170px', height: fullScreen ? '220px' : '170px' }}
                {...merged}
              />
            </motion.div>
          </div>

          <div className="rounded-2xl border-2 border-white/80 bg-white/80 p-2 text-center text-xs font-bold text-[#2a3a60]">
            Avatar được cập nhật theo lựa chọn ở từng hàng.
          </div>

          {showActionButtons ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {typeof onSave === 'function' ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSave}
                  className="rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 px-5 py-2 text-sm font-black text-white shadow-lg transition hover:shadow-xl"
                >
                  💾 Lưu Nhân Vật
                </motion.button>
              ) : null}
              {typeof onNext === 'function' ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNext}
                  className="rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 px-5 py-2 text-sm font-black text-white shadow-lg transition hover:shadow-xl"
                >
                  ➜ Sang Đăng Nhập
                </motion.button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
