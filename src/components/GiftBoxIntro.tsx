import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { CelebrationData, THEMES } from '../types/celebration';

interface GiftBoxIntroProps {
  data: CelebrationData;
  onUnwrap: () => void;
}

export default function GiftBoxIntro({ data, onUnwrap }: GiftBoxIntroProps) {
  const [tapCount, setTapCount] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const theme = THEMES[data.theme] || THEMES.gold;
  const targetTaps = 3;

  const handleBoxTap = () => {
    sound.playTap();
    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    // Mini confetti on each tap
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { y: 0.6 },
      colors: theme.balloonColors,
    });

    if (nextCount >= targetTaps && !isOpening) {
      setIsOpening(true);
      sound.playFanfare();

      // Big celebratory blast
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onUnwrap();
      }, 900);
    }
  };

  const tapsRemaining = targetTaps - tapCount;

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 select-none">
      {/* Background ambient glow */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 max-w-md z-10"
      >
        <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-semibold text-amber-300/80 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          A Special Birthday Delivery
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 font-['Outfit']">
          For {data.name}!
        </h1>
        {data.nickname && (
          <p className="text-lg text-amber-200/90 font-medium">
            (The One & Only &ldquo;{data.nickname}&rdquo;)
          </p>
        )}
        <p className="text-sm text-slate-300 mt-2">
          From <span className="font-semibold text-white">{data.senderName || 'Your Nanban'}</span> with love <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" />
        </p>
      </motion.div>

      {/* 3D Gift Box */}
      <div className="relative z-10 my-4 cursor-pointer" onClick={handleBoxTap}>
        <motion.div
          animate={
            isOpening
              ? { scale: [1, 1.25, 0.2], rotate: [0, 8, -8, 25], opacity: [1, 1, 0] }
              : {
                  scale: [1, 1.04, 1],
                  rotate: tapCount % 2 === 0 ? [-2, 2, -2] : [2, -2, 2],
                  y: [0, -8, 0],
                }
          }
          transition={
            isOpening
              ? { duration: 0.85, ease: 'easeInOut' }
              : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          }
          whileTap={{ scale: 0.94 }}
          className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center"
        >
          {/* Box Body */}
          <div
            className="w-52 h-48 sm:w-60 sm:h-52 rounded-2xl relative shadow-2xl flex items-center justify-center border transition-all"
            style={{
              backgroundColor: theme.accentColor,
              borderColor: 'rgba(255, 255, 255, 0.4)',
              boxShadow: `0 20px 50px -10px ${theme.accentColor}80`,
            }}
          >
            {/* Box Lid */}
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-56 sm:w-64 h-12 rounded-xl shadow-lg border border-white/40 flex items-center justify-center"
              style={{
                backgroundColor: theme.accentColor,
                filter: 'brightness(1.12)',
              }}
            >
              {/* Ribbon Bow */}
              <div className="absolute -top-7 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-amber-300 rotate-45 -mr-2 bg-amber-400/90 shadow-md"></div>
                <div className="w-10 h-10 rounded-full border-4 border-amber-300 -rotate-45 -ml-2 bg-amber-400/90 shadow-md"></div>
                <div className="absolute w-5 h-5 rounded-full bg-amber-200 border-2 border-amber-400"></div>
              </div>
            </div>

            {/* Vertical Ribbon */}
            <div className="absolute top-0 bottom-0 w-10 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 shadow-inner flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-900/70 opacity-60" />
            </div>

            {/* Horizontal Ribbon */}
            <div className="absolute left-0 right-0 h-10 bg-gradient-to-b from-amber-300 via-amber-200 to-amber-400 shadow-inner"></div>

            {/* Central Badge */}
            <div className="relative z-10 w-16 h-16 rounded-full bg-slate-950/90 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-center">
              <span className="text-xl">🎁</span>
              <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase">
                OPEN
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tap Instruction Pill */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="z-10 mt-6 flex flex-col items-center gap-2"
          >
            <button
              onClick={handleBoxTap}
              className="px-6 py-3 rounded-full text-base font-bold bg-white text-slate-900 shadow-xl hover:bg-amber-300 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>{tapsRemaining === 3 ? 'Tap to Unwrap Surprise' : `Tap ${tapsRemaining} more time${tapsRemaining > 1 ? 's' : ''}!`}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            </button>
            <div className="flex items-center gap-1.5 mt-1">
              {[...Array(targetTaps)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < tapCount ? 'bg-amber-400 scale-125 shadow-md shadow-amber-400/50' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Surprise gift box requires {targetTaps} magical taps ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
