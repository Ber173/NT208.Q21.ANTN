import { useEffect, useState } from 'react';
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

const CATEGORY_ROWS = [
  {
    key: 'topType',
    label: '👨‍🦱 Tóc',
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
    label: '👀 Mắt',
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
    label: '👄 Miệng',
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
    label: '🎨 Màu da',
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

export default function AvatarVisualPicker({ avatarConfig, onChange }) {
  const [bounceKey, setBounceKey] = useState(0);

  useEffect(() => {
    setBounceKey((prev) => prev + 1);
  }, [avatarConfig.topType, avatarConfig.eyeType, avatarConfig.mouthType, avatarConfig.skinColor]);

  const setPart = (key, value) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  const merged = { ...BASE_CONFIG, ...avatarConfig };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 p-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center text-3xl font-black text-white drop-shadow-lg">
          ✨ Tạo nhân vật của bạn ✨
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Preview Column */}
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-3xl border-8 border-white bg-gradient-to-b from-blue-300 to-pink-300 p-8 shadow-2xl">
              <motion.div
                key={bounceKey}
                animate={{
                  scale: [1, 1.05, 0.98, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <Avatar 
                  style={{ width: '300px', height: '300px' }} 
                  {...merged} 
                />
              </motion.div>
            </div>
          </div>

          {/* Customization Column */}
          <div className="space-y-4">
            {CATEGORY_ROWS.map((row) => (
              <motion.div 
                key={row.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border-4 border-white bg-white/95 p-5 shadow-lg backdrop-blur"
              >
                <h3 className="mb-4 text-lg font-black text-purple-700">{row.label}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {row.options.map((option) => {
                    const isSelected = merged[row.key] === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setPart(row.key, option.value)}
                        className={`relative overflow-hidden rounded-2xl transition-all ${
                          isSelected
                            ? 'border-4 border-purple-500 ring-4 ring-pink-300 shadow-xl'
                            : 'border-3 border-slate-300 shadow-md'
                        }`}
                      >
                        <div className="bg-white p-2">
                          <Avatar 
                            style={{ width: '70px', height: '70px' }} 
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
                              className="text-2xl"
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
      </div>
    </div>
  );
}
