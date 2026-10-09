import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wind, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { CelebrationData, THEMES } from '../types/celebration';

interface InteractiveCakeProps {
  data: CelebrationData;
  onCakeCutCompleted?: () => void;
}

export default function InteractiveCake({ data, onCakeCutCompleted }: InteractiveCakeProps) {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [isCutting, setIsCutting] = useState(false);

  const theme = THEMES[data.theme] || THEMES.gold;
  const candleCount = 5;

  const handleBlowCandles = () => {
    if (candlesBlown) return;
    sound.playBlowSound();
    setCandlesBlown(true);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FBBF24', '#F472B6', '#38BDF8'],
    });
  };

  const handleCutCake = () => {
    if (!candlesBlown || cakeCut || isCutting) return;
    setIsCutting(true);
    sound.playCakeCutSound();

    setTimeout(() => {
      setCakeCut(true);
      setIsCutting(false);
      sound.playFanfare();

      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.55 },
      });

      if (onCakeCutCompleted) {
        onCakeCutCompleted();
      }
    }, 600);
  };

  const handleReset = () => {
    setCandlesBlown(false);
    setCakeCut(false);
    setIsCutting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 select-none">
      {/* Stage Banner */}
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">
          {!candlesBlown
            ? `Blow the Candles, ${data.nickname || data.name}! 🕯️`
            : !cakeCut
            ? `Now Cut the Birthday Cake! 🍰`
            : `Hooray! Cake is Served! 🥳`}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
          {!candlesBlown
            ? 'Tap the blow button below to extinguish the flames & make your secret wish!'
            : !cakeCut
            ? 'Slice the cake to start the feast!'
            : 'May every bite bring infinite joy, sweetness, and success to your year!'}
        </p>
      </div>

      {/* The Layered Birthday Cake Illustration */}
      <div className="relative w-72 sm:w-80 h-64 sm:h-72 flex flex-col items-center justify-end">
        {/* Knife slicing animation */}
        <AnimatePresence>
          {isCutting && (
            <motion.div
              initial={{ x: 60, y: -40, rotate: -45, opacity: 0 }}
              animate={{ x: 0, y: 30, rotate: -15, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute z-40 top-12 pointer-events-none"
            >
              <div className="w-4 h-32 bg-gradient-to-b from-slate-200 via-slate-100 to-amber-200 rounded-sm shadow-2xl border border-white transform rotate-12 flex flex-col justify-end items-center">
                <div className="w-7 h-10 bg-amber-800 rounded-sm mb-[-12px] border border-amber-950"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Candles Row */}
        <div className="relative z-20 flex justify-center gap-4 sm:gap-6 mb-[-6px]">
          {[...Array(candleCount)].map((_, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={handleBlowCandles}
            >
              {/* Flame / Smoke */}
              <AnimatePresence>
                {!candlesBlown ? (
                  <motion.div
                    animate={{
                      scaleY: [1, 1.25, 0.9, 1.15, 1],
                      scaleX: [1, 0.9, 1.1, 0.95, 1],
                      rotate: [0, -3, 3, -2, 0],
                    }}
                    transition={{
                      duration: 0.8 + (i % 3) * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative w-4 h-6 mb-1"
                  >
                    {/* Flame glow */}
                    <div className="absolute inset-0 bg-amber-400 blur-sm rounded-full opacity-70"></div>
                    {/* Outer flame */}
                    <div className="w-3.5 h-5 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full mx-auto shadow-md"></div>
                    {/* Inner core */}
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-2.5 bg-blue-300 rounded-full opacity-80"></div>
                  </motion.div>
                ) : (
                  /* Smoke puff */
                  <motion.div
                    initial={{ opacity: 0.8, y: 0, scale: 0.6 }}
                    animate={{ opacity: 0, y: -20, scale: 1.6 }}
                    transition={{ duration: 1.2 }}
                    className="w-3 h-5 mb-1 flex items-center justify-center"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300/60 blur-xs"></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Candle Wick */}
              <div className="w-0.5 h-2 bg-slate-800 -mb-0.5"></div>

              {/* Candle Body */}
              <div
                className="w-3.5 sm:w-4 h-12 rounded-t-md shadow-md border-x border-t border-white/30"
                style={{
                  background:
                    i % 2 === 0
                      ? 'repeating-linear-gradient(45deg, #f43f5e, #f43f5e 4px, #ffffff 4px, #ffffff 8px)'
                      : 'repeating-linear-gradient(45deg, #0ea5e9, #0ea5e9 4px, #ffffff 4px, #ffffff 8px)',
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Top Tier Cake */}
        <div className="relative z-10 w-44 sm:w-52 h-14 rounded-2xl bg-gradient-to-b from-pink-200 via-rose-300 to-rose-400 shadow-md border-t-2 border-white/50 flex flex-col items-center justify-between overflow-hidden">
          {/* Dripping Frosting */}
          <div className="w-full flex justify-between px-1">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-3 bg-white/90 rounded-b-full shadow-xs -mt-0.5"
                style={{ height: i % 2 === 0 ? '12px' : '8px' }}
              ></div>
            ))}
          </div>
          {/* Cherries / Sprinkles */}
          <div className="flex gap-4 pb-1">
            <span className="text-xs">🍓</span>
            <span className="text-xs">✨</span>
            <span className="text-xs">🍓</span>
            <span className="text-xs">✨</span>
            <span className="text-xs">🍓</span>
          </div>
        </div>

        {/* Bottom Tier Cake */}
        <div className="relative z-0 w-64 sm:w-72 h-20 rounded-2xl bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 shadow-2xl border-t-2 border-amber-300/40 flex flex-col justify-between overflow-hidden mt-[-4px]">
          {/* Frosting Swirls */}
          <div className="w-full flex justify-between px-2">
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className="w-5 bg-amber-100 rounded-b-full shadow-xs"
                style={{ height: i % 2 === 0 ? '14px' : '9px' }}
              ></div>
            ))}
          </div>

          {/* Sliced Section / Normal Section */}
          <div className="relative flex-1 flex items-center justify-center">
            {cakeCut ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1 bg-amber-950/80 rounded-lg border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-lg"
              >
                <span>🍰 PERFECTLY SLICED!</span>
              </motion.div>
            ) : (
              <div className="text-[11px] font-semibold text-amber-200/80 tracking-wider">
                HAPPY BIRTHDAY {data.nickname || data.name}
              </div>
            )}
          </div>

          {/* Cake Base Rim */}
          <div className="h-2 w-full bg-gradient-to-r from-amber-900 via-amber-600 to-amber-900"></div>
        </div>

        {/* Golden Cake Platter / Stand */}
        <div className="w-72 sm:w-84 h-3 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 rounded-full shadow-2xl mt-1 border-t border-white/60"></div>
        <div className="w-28 h-2 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 rounded-b-md shadow-md"></div>
      </div>

      {/* Interactive Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        {!candlesBlown ? (
          <button
            onClick={handleBlowCandles}
            className="px-6 py-3 rounded-full text-base font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Wind className="w-5 h-5 animate-pulse" />
            <span>Blow Out Candles 💨</span>
          </button>
        ) : !cakeCut ? (
          <button
            onClick={handleCutCake}
            disabled={isCutting}
            className="px-7 py-3 rounded-full text-base font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>🔪</span>
            <span>{isCutting ? 'Cutting Cake...' : 'Cut The Cake Now! 🍰'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-emerald-400" />
              <span>Birthday Feast Unlocked!</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Relight & Cut Again 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
