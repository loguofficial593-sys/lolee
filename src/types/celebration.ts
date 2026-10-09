export type VisualTheme = 'gold' | 'neon' | 'pastel' | 'arcade' | 'cosmic';

export interface VibeScores {
  swag: number;
  kindness: number;
  humor: number;
  treatDue: number; // e.g., 100% treat due!
}

export interface CelebrationData {
  id: string;
  name: string;
  nickname: string;
  senderName: string;
  age?: string;
  relation: string;
  language: 'tanglish' | 'tamil' | 'english';
  tone: 'mass' | 'emotional' | 'roast' | 'cute' | 'rap';
  message: string;
  theme: VisualTheme;
  photoUrl?: string;
  avatarPreset?: string;
  badges: string[];
  vibeScores: VibeScores;
  createdAt: number;
}

export interface ThemeConfig {
  id: VisualTheme;
  name: string;
  tagline: string;
  bgGradient: string;
  accentColor: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  borderGlow: string;
  balloonColors: string[];
  cakeColor: string;
  candleColor: string;
  icon: string;
}

export const THEMES: Record<VisualTheme, ThemeConfig> = {
  gold: {
    id: 'gold',
    name: 'Midnight Gold & Royal',
    tagline: 'Luxury black & metallic champagne glow',
    bgGradient: 'from-amber-950 via-slate-950 to-black',
    accentColor: '#F59E0B',
    cardBg: 'bg-black/70 backdrop-blur-xl border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]',
    textPrimary: 'text-amber-100',
    textSecondary: 'text-amber-200/70',
    borderGlow: 'border-amber-500/40 hover:border-amber-400',
    balloonColors: ['#F59E0B', '#FCD34D', '#FEF3C7', '#D97706', '#B45309'],
    cakeColor: '#78350F',
    candleColor: '#FBBF24',
    icon: '👑',
  },
  neon: {
    id: 'neon',
    name: 'Kollywood Party Blast',
    tagline: 'High octane neon magenta & cyan celebration',
    bgGradient: 'from-fuchsia-950 via-slate-950 to-indigo-950',
    accentColor: '#EC4899',
    cardBg: 'bg-slate-950/80 backdrop-blur-xl border border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.2)]',
    textPrimary: 'text-pink-100',
    textSecondary: 'text-pink-200/70',
    borderGlow: 'border-pink-500/40 hover:border-pink-400',
    balloonColors: ['#EC4899', '#06B6D4', '#8B5CF6', '#F43F5E', '#10B981'],
    cakeColor: '#831843',
    candleColor: '#F472B6',
    icon: '🎸',
  },
  pastel: {
    id: 'pastel',
    name: 'Sweet Blossom Floral',
    tagline: 'Soft rose, lavender petals, and warm sunshine',
    bgGradient: 'from-rose-950/80 via-purple-950 to-slate-950',
    accentColor: '#FB7185',
    cardBg: 'bg-slate-900/75 backdrop-blur-xl border border-rose-400/25 shadow-[0_0_40px_rgba(251,113,133,0.15)]',
    textPrimary: 'text-rose-100',
    textSecondary: 'text-rose-200/70',
    borderGlow: 'border-rose-400/30 hover:border-rose-300',
    balloonColors: ['#FB7185', '#C084FC', '#FDA4AF', '#F472B6', '#A78BFA'],
    cakeColor: '#FB7185',
    candleColor: '#FDA4AF',
    icon: '🌸',
  },
  arcade: {
    id: 'arcade',
    name: 'Retro 8-Bit Cyber Arcade',
    tagline: 'Pixel quest, level-up vibes, and high scores',
    bgGradient: 'from-emerald-950 via-slate-950 to-teal-950',
    accentColor: '#10B981',
    cardBg: 'bg-slate-950/85 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]',
    textPrimary: 'text-emerald-100',
    textSecondary: 'text-emerald-200/70',
    borderGlow: 'border-emerald-500/40 hover:border-emerald-400',
    balloonColors: ['#10B981', '#06B6D4', '#EAB308', '#EF4444', '#8B5CF6'],
    cakeColor: '#064E3B',
    candleColor: '#34D399',
    icon: '👾',
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Starlight & Nebula',
    tagline: 'Stellar galaxies, constellations & infinite wishes',
    bgGradient: 'from-blue-950 via-indigo-950 to-slate-950',
    accentColor: '#6366F1',
    cardBg: 'bg-slate-950/80 backdrop-blur-xl border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]',
    textPrimary: 'text-indigo-100',
    textSecondary: 'text-indigo-200/70',
    borderGlow: 'border-indigo-500/40 hover:border-indigo-400',
    balloonColors: ['#6366F1', '#38BDF8', '#818CF8', '#C084FC', '#60A5FA'],
    cakeColor: '#1E1B4B',
    candleColor: '#818CF8',
    icon: '🌌',
  },
};

export const PRESET_AVATARS = [
  { id: 'hero', name: 'Mass Hero / Thalaivaa', emoji: '👑' },
  { id: 'star', name: 'Superstar / Diva', emoji: '🌟' },
  { id: 'gamer', name: 'Gamer Legend', emoji: '🎮' },
  { id: 'rockstar', name: 'Anirudh Vibe Rocker', emoji: '🎸' },
  { id: 'cute', name: 'Chella Kutty', emoji: '🧸' },
  { id: 'champ', name: 'Winning Champion', emoji: '🏆' },
];

export const DEFAULT_CELEBRATION: CelebrationData = {
  id: 'bday-default',
  name: 'Leethiyal',
  nickname: 'Queen of in my heart 💌',
  senderName: 'Logu 💝',
  age: '21',
  relation: 'crush',
  language: 'tanglish',
  tone: 'cute',
  message: 'Happy Birthday Leethiyal! 💝\nQueen of in my heart 💌\nI made a little something just for you... 💝\nMay all your dreams sparkle like gold and your smile shine forever! ✨🎂',
  theme: 'gold',
  avatarPreset: 'hero',
  badges: ['👑 Queen Of My Heart', '✨ Endless Magic', '💝 Pure Golden Soul', '🌸 Irreplaceable'],
  vibeScores: {
    swag: 100,
    kindness: 100,
    humor: 96,
    treatDue: 100,
  },
  createdAt: Date.now(),
};
