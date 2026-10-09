import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface MakeAWishStarProps {
  personName: string;
}

export default function MakeAWishStar({ personName }: MakeAWishStarProps) {
  const [wishText, setWishText] = useState('');
  const [launchedWishes, setLaunchedWishes] = useState<string[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim() || isLaunching) return;

    setIsLaunching(true);
    sound.playStarWishSound();

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#FCD34D', '#FFFFFF', '#60A5FA'],
    });

    const current = wishText.trim();
    setWishText('');

    setTimeout(() => {
      setLaunchedWishes((prev) => [current, ...prev]);
      setIsLaunching(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-2 select-none">
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h4 className="text-sm sm:text-base font-bold text-white font-['Outfit']">
            Make A Secret Birthday Wish ✨
          </h4>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Dear {personName}, write your biggest dream or prayer for this upcoming year and launch it into the cosmic sky!
        </p>

        <form onSubmit={handleLaunch} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            placeholder="Type your secret wish here (e.g. Dream career, peace & happiness)..."
            maxLength={100}
            className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors"
          />
          <button
            type="submit"
            disabled={!wishText.trim() || isLaunching}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isLaunching ? (
              <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Launch Wish</span>
          </button>
        </form>

        {/* Shooting Star Animation Container */}
        <AnimatePresence>
          {isLaunching && (
            <motion.div
              initial={{ x: -20, y: 40, opacity: 1, scale: 0.5 }}
              animate={{ x: 300, y: -200, opacity: [1, 1, 0], scale: 1.5 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="fixed pointer-events-none z-50 text-2xl"
            >
              🌟💫
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launched wishes display */}
        {launchedWishes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider block mb-2">
              Wishes Launched Into The Cosmos 🌌
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {launchedWishes.map((w, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-xs text-slate-200 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800"
                >
                  <span className="text-amber-400">✨</span>
                  <span className="italic font-medium">&ldquo;{w}&rdquo;</span>
                  <span className="ml-auto text-[10px] text-emerald-400">Sent to Universe</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
