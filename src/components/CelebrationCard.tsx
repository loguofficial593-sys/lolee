import { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Share2, Copy, Check, Cake, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { CelebrationData, THEMES } from '../types/celebration';
import { encodeCelebrationToUrl } from '../utils/urlState';

interface CelebrationCardProps {
  data: CelebrationData;
  onReopenCake: () => void;
  onEditRequested: () => void;
}

export default function CelebrationCard({ data, onReopenCake, onEditRequested }: CelebrationCardProps) {
  const [isPlayingMelody, setIsPlayingMelody] = useState(sound.isPlayingMelody());
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [copied, setCopied] = useState(false);

  const theme = THEMES[data.theme] || THEMES.gold;

  const toggleMelody = () => {
    if (isPlayingMelody) {
      sound.stopMelody();
      setIsPlayingMelody(false);
    } else {
      sound.setMuted(false);
      setIsMuted(false);
      sound.startMelody(() => setIsPlayingMelody(false));
      setIsPlayingMelody(true);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (nextMuted) {
      setIsPlayingMelody(false);
    }
  };

  const triggerBlast = () => {
    sound.playFanfare();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: theme.balloonColors,
    });
  };

  const handleCopyLink = () => {
    sound.playTap();
    const link = encodeCelebrationToUrl(data);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    sound.playTap();
    const link = encodeCelebrationToUrl(data);
    const text = `🎉 Birthday Surprise for *${data.name}* (${data.nickname || 'Thala'})!\n\nOpen your interactive birthday celebration here:\n${link}\n\nFrom: ${data.senderName || 'Your Nanban'} 🎂✨`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-2 select-none">
      {/* The Main Golden Birthday Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative rounded-3xl p-6 sm:p-8 ${theme.cardBg} border border-amber-500/30 overflow-hidden shadow-2xl`}
      >
        {/* Decorative corner stars */}
        <div className="absolute top-3 left-4 text-amber-400/30 text-xl pointer-events-none">✦</div>
        <div className="absolute top-3 right-4 text-amber-400/30 text-xl pointer-events-none">✦</div>

        {/* Header Audio Bar & Status */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMelody}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              {/* Dancing visualizer bars */}
              <span className="flex items-end gap-0.5 h-3">
                <span className={`w-0.5 bg-amber-400 rounded-full transition-all ${isPlayingMelody ? 'h-3 animate-pulse' : 'h-1'}`}></span>
                <span className={`w-0.5 bg-amber-400 rounded-full transition-all ${isPlayingMelody ? 'h-2 animate-bounce' : 'h-1.5'}`}></span>
                <span className={`w-0.5 bg-amber-400 rounded-full transition-all ${isPlayingMelody ? 'h-3 animate-pulse' : 'h-2'}`}></span>
              </span>
              <span>{isPlayingMelody ? 'Stop Birthday Song' : 'Play Birthday Song 🎵'}</span>
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-200" />}
            </button>
          </div>

          <button
            onClick={triggerBlast}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Blast Confetti 🎊</span>
          </button>
        </div>

        {/* Profile Avatar / Hero Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
          <div className="relative group">
            {/* Avatar Frame */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300 p-1 shadow-xl">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden">
                {data.photoUrl ? (
                  <img
                    src={data.photoUrl}
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl">
                    {data.theme === 'neon' ? '🎸' : data.theme === 'pastel' ? '🌸' : data.theme === 'arcade' ? '👾' : '👑'}
                  </span>
                )}
              </div>
            </div>

            {/* Age Badge */}
            {data.age && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg border border-white/60">
                Lvl {data.age} 🚀
              </div>
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
                {data.name}
              </h2>
              {data.nickname && (
                <span className="text-sm sm:text-base font-bold text-amber-400 bg-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-lg">
                  {data.nickname}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-3">
              Official Birthday Celebration 🎂 · {data.relation.toUpperCase()} EDITION
            </p>

            {/* Badges List */}
            {data.badges && data.badges.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                {data.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold text-slate-200 bg-white/10 px-2.5 py-1 rounded-md border border-white/15"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Personalized Birthday Wish Content Box */}
        <div className="relative my-6 p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-amber-500/25 shadow-inner">
          <div className="absolute top-3 right-4 text-3xl opacity-20 font-serif">“</div>
          <div className="whitespace-pre-line text-sm sm:text-base font-medium text-slate-100 leading-relaxed font-['Noto_Sans_Tamil',sans-serif]">
            {data.message}
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>
              With endless love & wishes,
            </span>
            <span className="font-bold text-white flex items-center gap-1">
              <span>💝</span>
              {data.senderName || 'Your Nanban'}
            </span>
          </div>
        </div>

        {/* Vibe / Roast Stats Bar */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
            <span>📊</span>
            <span>Birthday Person Vibe Analysis</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Swag Level</span>
              <span className="text-base font-black text-amber-400">{data.vibeScores?.swag || 100}%</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Kindness</span>
              <span className="text-base font-black text-pink-400">{data.vibeScores?.kindness || 98}%</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Humor & Fun</span>
              <span className="text-base font-black text-sky-400">{data.vibeScores?.humor || 95}%</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-amber-500/30 text-center bg-amber-950/20">
              <span className="text-[10px] uppercase text-amber-300 block font-semibold">Treat Due 🍕</span>
              <span className="text-base font-black text-emerald-400">{data.vibeScores?.treatDue || 100}%</span>
            </div>
          </div>
        </div>

        {/* Share & Actions Toolbar */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#25D366] text-slate-950 hover:bg-[#20ba5a] shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Surprise Link'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReopenCake}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Cake className="w-3.5 h-3.5 text-amber-400" />
              <span>View Cake</span>
            </button>

            <button
              onClick={onEditRequested}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
            >
              Customize / Edit ✍️
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
