import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Gift,
  Edit3,
  Share2,
  Volume2,
  VolumeX,
  RotateCcw,
  Cake as CakeIcon,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CelebrationData, DEFAULT_CELEBRATION, THEMES } from './types/celebration';
import { decodeCelebrationFromUrl, encodeCelebrationToUrl } from './utils/urlState';
import { sound } from './utils/audio';
import GiftBoxIntro from './components/GiftBoxIntro';
import InteractiveCake from './components/InteractiveCake';
import BalloonsGame from './components/BalloonsGame';
import CelebrationCard from './components/CelebrationCard';
import PolaroidGallery from './components/PolaroidGallery';
import MakeAWishStar from './components/MakeAWishStar';
import CreatorStudio from './components/CreatorStudio';

export default function App() {
  const [data, setData] = useState<CelebrationData>(DEFAULT_CELEBRATION);
  const [activeTab, setActiveTab] = useState<'celebration' | 'studio'>('celebration');
  const [celebrationStage, setCelebrationStage] = useState<'gift-box' | 'hall'>('gift-box');
  const [isMuted, setIsMuted] = useState(false);
  const [isUrlLoadedSurprise, setIsUrlLoadedSurprise] = useState(false);

  // Check URL on initial mount
  useEffect(() => {
    const loadedData = decodeCelebrationFromUrl();
    if (loadedData) {
      setData(loadedData);
      setIsUrlLoadedSurprise(true);
      setActiveTab('celebration');
      setCelebrationStage('gift-box');
    } else {
      // Check localStorage for any draft saved
      const saved = localStorage.getItem('vera_level_bday_draft');
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Sync state to localStorage draft
  useEffect(() => {
    localStorage.setItem('vera_level_bday_draft', JSON.stringify(data));
  }, [data]);

  const theme = THEMES[data.theme] || THEMES.gold;

  const handleUnwrapGift = () => {
    setCelebrationStage('hall');
    // Start festive happy birthday synthesizer song on opening!
    sound.startMelody();

    // Double firework confetti
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: theme.balloonColors,
    });
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const handleQuickShare = () => {
    sound.playTap();
    const link = encodeCelebrationToUrl(data);
    const text = `🎉 Birthday Surprise for *${data.name}* (${data.nickname || 'Thala'})!\n\nOpen your interactive birthday celebration here:\n${link}\n\nFrom: ${data.senderName || 'Your Nanban'} 🎂✨`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleResetCelebration = () => {
    sound.playTap();
    setCelebrationStage('gift-box');
  };

  const handleStudioSaveAndPreview = (updatedData: CelebrationData) => {
    setData(updatedData);
    setActiveTab('celebration');
    setCelebrationStage('gift-box');
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} text-white flex flex-col justify-between selection:bg-amber-400 selection:text-black transition-colors duration-700`}
    >
      {/* Dynamic Background Twinkling Ambient Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] opacity-20"
          style={{ backgroundColor: theme.accentColor }}
        />
        <div
          className="absolute top-1/2 -right-40 w-96 h-96 rounded-full blur-[160px] opacity-20"
          style={{ backgroundColor: theme.accentColor }}
        />
      </div>

      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/70 border-b border-white/10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Logo / Brand */}
          <div
            onClick={() => setActiveTab('celebration')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <PartyPopper className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1 font-['Outfit']">
                <span>Vera Level</span>
                <span className="text-amber-400">Wishes</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block -mt-1 hidden sm:block">
                Interactive Birthday Experience
              </span>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-white/10 rounded-xl">
            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('celebration');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'celebration'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Surprise View</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('studio');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Wish Studio</span>
            </button>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-300" />
              )}
            </button>

            <button
              onClick={handleQuickShare}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#25D366] text-slate-950 hover:bg-[#20ba5a] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hidden sm:flex"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Send WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        {activeTab === 'studio' ? (
          <CreatorStudio
            currentData={data}
            onSaveAndPreview={handleStudioSaveAndPreview}
          />
        ) : (
          <div>
            {celebrationStage === 'gift-box' ? (
              <GiftBoxIntro data={data} onUnwrap={handleUnwrapGift} />
            ) : (
              <div className="max-w-4xl mx-auto py-6 px-4 space-y-8 animate-fadeIn">
                {/* Secondary Bar in Hall */}
                <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold">
                      Celebration in progress for {data.name}!
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCelebration}
                      className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Replay Box</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('studio')}
                      className="text-xs font-semibold text-amber-300 hover:text-amber-200 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Wishes</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Birthday Cake Cutting */}
                <div className="rounded-3xl bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-2xl p-4 sm:p-6">
                  <InteractiveCake
                    data={data}
                    onCakeCutCompleted={() => {
                      confetti({
                        particleCount: 50,
                        spread: 70,
                        origin: { y: 0.6 },
                      });
                    }}
                  />
                </div>

                {/* Grand Birthday Wish Card */}
                <CelebrationCard
                  data={data}
                  onReopenCake={() => {
                    const el = document.getElementById('cake-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onEditRequested={() => setActiveTab('studio')}
                />

                {/* Floating Polaroid Photo Gallery */}
                <PolaroidGallery data={data} />

                {/* Balloons Popping Mini-Game */}
                <div className="rounded-3xl bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-2xl p-4 sm:p-6">
                  <BalloonsGame />
                </div>

                {/* Make A Wish & Star Launch into Universe */}
                <div className="rounded-3xl bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-2xl p-4 sm:p-6">
                  <MakeAWishStar personName={data.nickname || data.name} />
                </div>

                {/* Create Your Own Wish for Someone Else Footer Prompt */}
                <div className="text-center py-6 border-t border-white/10">
                  <h4 className="text-lg font-bold text-white mb-2">
                    Want to wish someone special like this? 🎁
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 mb-4 max-w-md mx-auto">
                    Create your own personalized interactive birthday experience in Tanglish, Tamil, or English and surprise them on WhatsApp!
                  </p>
                  <button
                    onClick={() => {
                      sound.playTap();
                      setActiveTab('studio');
                    }}
                    className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-amber-400 text-slate-950 shadow-xl hover:bg-amber-300 transition-all cursor-pointer transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Create a Birthday Surprise Now</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 py-6 px-4 border-t border-white/10 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Made with vera level love for birthdays</span>
            <span className="text-rose-400">💖</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Interactive Web Audio Melody</span>
            <span>·</span>
            <span>Tamil & Tanglish Supported</span>
            <span>·</span>
            <span>100% Free & Shareable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
