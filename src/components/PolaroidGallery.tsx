import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, Pin, RefreshCw, ZoomIn, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { CelebrationData } from '../types/celebration';

interface PolaroidItem {
  id: number;
  caption: string;
  date: string;
  tag: string;
  gradient: string;
  illustration: string;
  note: string;
  initialRotate: number;
  floatDuration: number;
  tapeColor: string;
}

interface PolaroidGalleryProps {
  data: CelebrationData;
}

export default function PolaroidGallery({ data }: PolaroidGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidItem | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);

  // 4 curated polaroid memory snapshots tailored for the celebration
  const polaroids: PolaroidItem[] = [
    {
      id: 1,
      caption: `Queen of the day 💝`,
      date: 'Today • Special Day',
      tag: 'Royalty ✨',
      gradient: 'from-amber-400 via-rose-400 to-purple-600',
      illustration: '👑',
      note: `Unforgettable birthday celebration for ${data.name}!`,
      initialRotate: -5,
      floatDuration: 4.8,
      tapeColor: 'rgba(254, 240, 138, 0.65)',
    },
    {
      id: 2,
      caption: `Sweetest Wishes & Smiles ✨`,
      date: 'Pure Happiness',
      tag: 'Best Vibes 🌸',
      gradient: 'from-pink-400 via-rose-500 to-red-400',
      illustration: '🎂',
      note: 'Warmest moments, endless laughter, and true joy.',
      initialRotate: 3.5,
      floatDuration: 5.4,
      tapeColor: 'rgba(251, 207, 232, 0.65)',
    },
    {
      id: 3,
      caption: `Golden Memories 💝`,
      date: 'Timeless Keepsake',
      tag: 'Precious 🌟',
      gradient: 'from-sky-400 via-indigo-500 to-purple-600',
      illustration: '✨',
      note: 'Every memory shared with you is a shining gem.',
      initialRotate: -2.8,
      floatDuration: 4.2,
      tapeColor: 'rgba(186, 230, 253, 0.65)',
    },
    {
      id: 4,
      caption: `Forever Loved & Cherished 💝`,
      date: 'Happy Birthday',
      tag: 'Celebration 🥂',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      illustration: '🎉',
      note: `From ${data.senderName || 'Your Nanban'} with all our love!`,
      initialRotate: 4.5,
      floatDuration: 5.8,
      tapeColor: 'rgba(167, 243, 208, 0.65)',
    },
  ];

  const handlePhotoClick = (item: PolaroidItem) => {
    sound.playTap();
    setSelectedPhoto(item);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleShuffle = () => {
    sound.playTap();
    setShuffleKey((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-2 select-none">
      <div className="rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl shadow-2xl p-5 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative background light */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Snapshot Gallery</span>
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
              <span>Polaroid Memories</span>
              <span className="text-sm font-normal text-slate-400 hidden sm:inline">
                (Tap to spotlight ✨)
              </span>
            </h3>
          </div>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer shadow-sm"
            title="Randomize rotation and float"
          >
            <RefreshCw className="w-3 h-3 text-amber-400" />
            <span>Shuffle Angles</span>
          </button>
        </div>

        {/* Polaroid Gallery Grid */}
        <div
          key={shuffleKey}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 md:gap-6 justify-items-center py-4"
        >
          {polaroids.map((photo, index) => {
            // Dynamic slight variation on shuffle
            const randomOffset = ((shuffleKey * (index + 1) * 7) % 6) - 3;
            const currentRotation = photo.initialRotate + randomOffset;

            return (
              <motion.div
                key={photo.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: [0, -10, 0],
                  rotate: [currentRotation - 1.2, currentRotation + 1.2, currentRotation - 1.2],
                }}
                transition={{
                  y: {
                    duration: photo.floatDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  rotate: {
                    duration: photo.floatDuration * 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  opacity: { duration: 0.5, delay: index * 0.1 },
                }}
                whileHover={{
                  scale: 1.07,
                  rotate: 0,
                  zIndex: 20,
                  transition: { duration: 0.25 },
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePhotoClick(photo)}
              >
                {/* Vintage Washi Tape Top Accent */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 rounded-sm shadow-sm z-10 opacity-85 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    backgroundColor: photo.tapeColor,
                    backdropFilter: 'blur(2px)',
                    transform: `translateX(-50%) rotate(${index % 2 === 0 ? '-2deg' : '3deg'})`,
                  }}
                />

                {/* Classic Polaroid Card */}
                <div className="w-56 sm:w-52 md:w-56 bg-slate-50 p-3 pt-3 pb-5 rounded-md shadow-2xl border border-slate-200/80 transition-shadow group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                  {/* Photo Canvas */}
                  <div
                    className={`relative w-full aspect-square rounded-sm overflow-hidden bg-gradient-to-br ${photo.gradient} p-4 flex flex-col items-center justify-center text-center shadow-inner`}
                  >
                    {/* Inner glossy vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20 pointer-events-none" />

                    {/* Badge Pill */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-md border border-white/20">
                      {photo.tag}
                    </span>

                    {/* Central Emoji / Illustration */}
                    <span className="text-5xl sm:text-4xl md:text-5xl filter drop-shadow-lg transform group-hover:scale-115 transition-transform duration-300">
                      {photo.illustration}
                    </span>

                    {/* Small note inside photo */}
                    <p className="mt-2 text-xs font-semibold text-white/90 line-clamp-2 px-1 drop-shadow">
                      {photo.note}
                    </p>

                    {/* Hover Zoom Prompt */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <span className="px-3 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1 shadow-lg">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Enlarge</span>
                      </span>
                    </div>
                  </div>

                  {/* Polaroid Bottom Border & Handwritten Caption */}
                  <div className="mt-3 px-1 text-center">
                    <p className="text-slate-800 font-bold text-sm tracking-tight font-serif italic truncate">
                      {photo.caption}
                    </p>
                    <p className="text-slate-400 text-[10px] mt-0.5 tracking-wider uppercase font-semibold">
                      {photo.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enlarged Spotlight Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -4 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-sm w-full bg-slate-50 p-5 pb-7 rounded-lg shadow-2xl border border-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg cursor-pointer z-20 border border-white/20"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Tape on modal */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-7 rounded-sm shadow z-10"
                style={{ backgroundColor: selectedPhoto.tapeColor }}
              />

              {/* High-res Photo Area */}
              <div
                className={`relative w-full aspect-square rounded-sm overflow-hidden bg-gradient-to-br ${selectedPhoto.gradient} p-6 flex flex-col items-center justify-center text-center shadow-inner`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/20 pointer-events-none" />

                <span className="text-7xl filter drop-shadow-2xl mb-3 animate-bounce">
                  {selectedPhoto.illustration}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 text-white backdrop-blur-md border border-white/20 mb-2">
                  {selectedPhoto.tag}
                </span>

                <p className="text-sm font-semibold text-white px-2 drop-shadow-md">
                  {selectedPhoto.note}
                </p>
              </div>

              {/* Handwritten Title & Love Note */}
              <div className="mt-4 text-center">
                <h4 className="text-slate-900 font-bold text-lg font-serif italic">
                  {selectedPhoto.caption}
                </h4>
                <p className="text-slate-500 text-xs mt-1 font-medium">
                  {selectedPhoto.date}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-center gap-1.5 text-xs text-amber-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Celebrated with joy for {data.name} 💝</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
