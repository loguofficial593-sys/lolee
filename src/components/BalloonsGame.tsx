import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface BalloonItem {
  id: number;
  color: string;
  fortune: string;
  emoji: string;
  popped: boolean;
}

const BALLOON_DATA: Omit<BalloonItem, 'popped'>[] = [
  { id: 1, color: '#F43F5E', emoji: '🍕', fortune: 'Treat Voucher: Sender owes you a Biryani feast!' },
  { id: 2, color: '#F59E0B', emoji: '👑', fortune: 'Certified Legend: Unstoppable Mass Aura forever!' },
  { id: 3, color: '#10B981', emoji: '💰', fortune: 'Money Magnet: Wealth & promotions incoming this year!' },
  { id: 4, color: '#06B6D4', emoji: '✈️', fortune: 'Dream Journey: A dream trip is loading soon!' },
  { id: 5, color: '#8B5CF6', emoji: '🌟', fortune: 'Ageless Star: You are shining 10x brighter today!' },
  { id: 6, color: '#EC4899', emoji: '💝', fortune: 'Pure Soul: You bring endless joy to all your friends!' },
];

export default function BalloonsGame() {
  const [balloons, setBalloons] = useState<BalloonItem[]>(
    BALLOON_DATA.map((b) => ({ ...b, popped: false }))
  );
  const [activeFortune, setActiveFortune] = useState<string | null>(null);

  const popBalloon = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playBalloonPop();

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { x, y },
    });

    setBalloons((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          setActiveFortune(`${b.emoji} ${b.fortune}`);
          return { ...b, popped: true };
        }
        return b;
      })
    );
  };

  const resetBalloons = () => {
    sound.playTap();
    setBalloons(BALLOON_DATA.map((b) => ({ ...b, popped: false })));
    setActiveFortune(null);
  };

  const poppedCount = balloons.filter((b) => b.popped).length;

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-2 select-none">
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>🎈</span>
            <span>Pop The Birthday Balloons</span>
          </h4>
          <p className="text-xs text-slate-400">
            Tap each balloon to pop it & unlock secret birthday blessings!
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
            {poppedCount} / {balloons.length} Popped
          </span>
        </div>
      </div>

      {/* Balloons Row / Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 my-2">
        {balloons.map((b, idx) => (
          <div key={b.id} className="relative flex flex-col items-center">
            <AnimatePresence>
              {!b.popped ? (
                <motion.div
                  onClick={(e) => popBalloon(b.id, e)}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [idx % 2 === 0 ? -3 : 3, idx % 2 === 0 ? 3 : -3, idx % 2 === 0 ? -3 : 3],
                  }}
                  transition={{
                    duration: 2.2 + (idx % 3) * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.85 }}
                  className="cursor-pointer flex flex-col items-center"
                >
                  {/* Balloon Oval */}
                  <div
                    className="w-14 h-18 sm:w-16 sm:h-20 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-lg flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundColor: b.color,
                      boxShadow: `0 8px 20px -4px ${b.color}90`,
                    }}
                  >
                    {/* Light reflection */}
                    <div className="absolute top-2 left-2 w-3 h-5 bg-white/40 rounded-full blur-[1px] transform -rotate-25"></div>
                    <span className="text-lg opacity-80">{b.emoji}</span>
                  </div>

                  {/* Balloon Knot */}
                  <div
                    className="w-2.5 h-1.5 -mt-0.5 rounded-b-xs"
                    style={{ backgroundColor: b.color }}
                  ></div>

                  {/* Balloon String */}
                  <div className="w-0.5 h-8 bg-slate-400/50"></div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-14 h-24 sm:w-16 sm:h-28 flex flex-col items-center justify-center text-center p-1"
                >
                  <span className="text-xl">{b.emoji}</span>
                  <span className="text-[10px] text-emerald-400 font-bold mt-1">UNLOCKED</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Revealed Fortune Toast */}
      <AnimatePresence>
        {activeFortune && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-amber-400/40 shadow-xl text-center"
          >
            <p className="text-xs sm:text-sm font-semibold text-amber-200">
              {activeFortune}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {poppedCount === balloons.length && (
        <div className="text-center mt-3">
          <button
            onClick={resetBalloons}
            className="text-xs text-amber-300 hover:text-amber-200 underline underline-offset-4 cursor-pointer"
          >
            Blow New Balloons 🎈
          </button>
        </div>
      )}
    </div>
  );
}
