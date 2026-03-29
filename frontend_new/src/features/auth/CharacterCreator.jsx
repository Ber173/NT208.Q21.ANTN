import { useState } from 'react';
import Avatar from 'avataaars';
import { motion } from 'framer-motion';

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
      { value: 'ShortHairShortFlat', props: { topType: 'ShortHairShortFlat', hairColor: 'BrownDark' } },
      { value: 'ShortHairFrizzle', props: { topType: 'ShortHairFrizzle', hairColor: 'Black' } },
      { value: 'LongHairStraight', props: { topType: 'LongHairStraight', hairColor: 'BlondeGolden' } },
      { value: 'LongHairMiaWallace', props: { topType: 'LongHairMiaWallace', hairColor: 'Brown' } },
      { value: 'Hat', props: { topType: 'Hat', hairColor: 'BrownDark' } },
      { value: 'WinterHat1', props: { topType: 'WinterHat1', hairColor: 'Black' } },
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
    ],
  },
];

export default function CharacterCreator({ avatarConfig, onChange, onSave, onNext }) {
  const merged = { ...BASE_CONFIG, ...avatarConfig };
  const [reactionKey, setReactionKey] = useState(0);

  const handleSelect = (key, value) => {
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

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 p-4 flex flex-col">
      <div className="mx-auto max-w-6xl flex-1">
        <h2 className="mb-6 text-center text-3xl font-black text-white drop-shadow-lg">
          ✨ Tạo Nhân Vật Của Bé ✨
        </h2>

        {/* Header with Action Buttons */}
        <div className="mb-6 flex justify-center gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRandom}
            className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-6 py-3 font-black text-white shadow-lg transition hover:shadow-xl"
          >
            ✨ Ngẫu Nhiên
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 px-6 py-3 font-black text-white shadow-lg transition hover:shadow-xl"
          >
            ↺ Mặc Định
          </motion.button>
        </div>

        {/* Preview */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-3xl border-8 border-white bg-gradient-to-b from-blue-300 to-pink-300 p-8 shadow-2xl">
            <motion.div
              key={reactionKey}
              animate={{
                scale: [1, 1.08, 0.98, 1],
                rotate: [0, 3, -3, 0],
                y: [0, -8, 0],
              }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <Avatar 
                style={{ width: '280px', height: '280px' }} 
                {...merged} 
              />
            </motion.div>
          </div>
        </div>

        {/* Instruction */}
        <div className="mb-6 text-center">
          <p className="text-xl font-black text-white drop-shadow-lg">
            🎨 Bây giờ bé hãy chọn nhân vật bằng hình ảnh nhé! 🎨
          </p>
        </div>

        {/* Categories Grid - Centered Horizontal */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border-4 border-white bg-white/95 p-4 shadow-lg backdrop-blur"
            >
              <h3 className="mb-3 text-center text-base font-black text-purple-700">
                {category.icon} {category.title}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {category.options.map((option) => {
                  const isSelected = merged[category.key] === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleSelect(category.key, option.value)}
                      className={`relative overflow-hidden rounded-2xl transition-all ${
                        isSelected
                          ? 'border-4 border-purple-500 ring-4 ring-pink-300 shadow-xl'
                          : 'border-3 border-slate-300 shadow-md'
                      }`}
                    >
                      <div className="bg-white p-1.5">
                        <Avatar 
                          style={{ width: '60px', height: '60px' }} 
                          {...{
                            ...BASE_CONFIG,
                            ...option.props,
                          }} 
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="text-xl"
                          >
                            ✨
                          </motion.div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 px-4">
        <div className="mx-auto max-w-6xl grid gap-4 grid-cols-1 sm:grid-cols-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSave}
            className="rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-4 font-black text-white shadow-lg transition hover:shadow-xl text-lg"
          >
            💾 Lưu Nhân Vật
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-4 font-black text-white shadow-lg transition hover:shadow-xl text-lg"
          >
            ➜ Tiếp Tục
          </motion.button>
        </div>
      </div>
    </div>
  );
}
