import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wand2, Eye, Share2, Copy, Check, Palette } from 'lucide-react';
import { CelebrationData, THEMES, VisualTheme, PRESET_AVATARS } from '../types/celebration';
import { PRESET_WISHES } from '../utils/presetWishes';
import { encodeCelebrationToUrl } from '../utils/urlState';
import { sound } from '../utils/audio';

interface CreatorStudioProps {
  currentData: CelebrationData;
  onSaveAndPreview: (data: CelebrationData) => void;
}

export default function CreatorStudio({ currentData, onSaveAndPreview }: CreatorStudioProps) {
  const [formData, setFormData] = useState<CelebrationData>({ ...currentData });
  const [memoriesInput, setMemoriesInput] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [newBadgeText, setNewBadgeText] = useState('');

  const handleTextChange = (field: keyof CelebrationData, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleVibeChange = (field: keyof typeof formData.vibeScores, val: number) => {
    setFormData((prev) => ({
      ...prev,
      vibeScores: {
        ...prev.vibeScores,
        [field]: val,
      },
    }));
  };

  const handleAddBadge = () => {
    if (!newBadgeText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      badges: [...prev.badges, newBadgeText.trim()],
    }));
    setNewBadgeText('');
  };

  const handleRemoveBadge = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.filter((_, i) => i !== idx),
    }));
  };

  // Generate wishes with backend AI endpoint /api/generate-wish
  const handleGenerateAI = async () => {
    sound.playTap();
    setIsGeneratingAI(true);
    setAiSuggestions([]);

    try {
      const res = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          nickname: formData.nickname,
          relation: formData.relation,
          language: formData.language,
          tone: formData.tone,
          age: formData.age,
          memories: memoriesInput,
        }),
      });

      const json = await res.json();
      if (json.wishes && json.wishes.length > 0) {
        setAiSuggestions(json.wishes);
        // Automatically set the first wish
        handleTextChange('message', json.wishes[0]);
      }
    } catch (err) {
      console.error('AI generation error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleApplyPresetWish = (wishText: string) => {
    sound.playTap();
    handleTextChange('message', wishText);
  };

  const handleCopyLink = () => {
    sound.playTap();
    const link = encodeCelebrationToUrl(formData);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    sound.playTap();
    const link = encodeCelebrationToUrl(formData);
    const text = `🎉 Special Birthday Surprise for *${formData.name}* (${formData.nickname || 'Thala'})!\n\nOpen your interactive celebration:\n${link}\n\nFrom: ${formData.senderName || 'Your Nanban'} 🎂✨`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Filter curated wishes for current language & tone
  const matchingPresets = PRESET_WISHES.filter(
    (w) => w.language === formData.language
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Vera Level Wish Creator Studio</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Customize Birthday Surprise Experience
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Design an interactive celebration for your friend with music, candles, cake cutting & custom wishes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSaveAndPreview(formData)}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Surprise Experience</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Details & Style */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Who is it for? */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>👤</span>
              <span>1. Birthday Person Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Friend&apos;s Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleTextChange('name', e.target.value)}
                  placeholder="e.g. Karthik, Priya, Vijay"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Pet Name / Nickname (Mass tag)
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleTextChange('nickname', e.target.value)}
                  placeholder="e.g. Thala, Machi, Chella Kutty, Rowdy"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Your Name / Sender (Nanban) *
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => handleTextChange('senderName', e.target.value)}
                  placeholder="e.g. Logu & Gang, Un Nanban"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Age / Milestone (Optional)
                </label>
                <input
                  type="text"
                  value={formData.age || ''}
                  onChange={(e) => handleTextChange('age', e.target.value)}
                  placeholder="e.g. 21, 25, 30"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Relationship / Bond
                </label>
                <select
                  value={formData.relation}
                  onChange={(e) => handleTextChange('relation', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="bestie">Bestie / Machan</option>
                  <option value="brother">Brother / Thambi / Anna</option>
                  <option value="sister">Sister / Thangachi / Akka</option>
                  <option value="love">Crush / Sweetheart / Love</option>
                  <option value="colleague">Colleague / Work Mate</option>
                  <option value="family">Family Member</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Avatar / Character Icon
                </label>
                <div className="flex items-center gap-1.5">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => handleTextChange('avatarPreset', av.id)}
                      className={`p-1.5 rounded-lg border text-lg transition-all cursor-pointer ${
                        formData.avatarPreset === av.id
                          ? 'border-amber-400 bg-amber-500/20'
                          : 'border-slate-700 bg-slate-950 hover:border-slate-500'
                      }`}
                      title={av.name}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Language & Tone Selection */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>✍️</span>
              <span>2. Language & Wish Style</span>
            </h3>

            {/* Language Tabs */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Preferred Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'tanglish', label: '🔥 Tanglish (Machi Style)', desc: 'Kollywood slang in English' },
                  { id: 'tamil', label: '🌸 தமிழ் (Pure Tamil)', desc: 'நெஞ்சார்ந்த கவிதை & வாழ்த்து' },
                  { id: 'english', label: '✨ English', desc: 'Modern & heartfelt' },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleTextChange('language', lang.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.language === lang.id
                        ? 'border-amber-400 bg-amber-500/15 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{lang.label}</div>
                    <div className="text-[10px] text-slate-400">{lang.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Tone / Vibe
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'mass', label: '👑 Kollywood Mass Hype' },
                  { id: 'roast', label: '🤡 Funny Roast (Treat Enga)' },
                  { id: 'emotional', label: '💖 Deep Heartfelt' },
                  { id: 'rap', label: '🎤 Chennai Rap Punch' },
                  { id: 'cute', label: '🌸 Sweet & Wholesome' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTextChange('tone', t.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      formData.tone === t.id
                        ? 'border-amber-400 bg-amber-400 text-slate-950 font-bold'
                        : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generator Helper Box */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>AI Wish Crafter (Gemini Powered)</span>
                </span>
                <span className="text-[10px] text-slate-400">Customized to your friend</span>
              </div>
              <input
                type="text"
                value={memoriesInput}
                onChange={(e) => setMemoriesInput(e.target.value)}
                placeholder="Optional: Inside joke or habit (e.g. Always late, Biryani lover, Gym bro)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 mb-2"
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI}
                className="w-full py-2 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Custom Wishes with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate 3 Unique AI Wishes</span>
                  </>
                )}
              </button>

              {/* AI suggestions pills */}
              {aiSuggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Choose one of the generated options:
                  </span>
                  {aiSuggestions.map((wish, i) => (
                    <div
                      key={i}
                      onClick={() => handleApplyPresetWish(wish)}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs text-slate-200 cursor-pointer transition-all line-clamp-3"
                    >
                      {wish}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Master Presets */}
            {matchingPresets.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Or pick a curated masterpiece:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {matchingPresets.map((preset) => {
                    const text = preset.template(
                      formData.name,
                      formData.nickname || formData.name,
                      formData.relation,
                      formData.age
                    );
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPresetWish(text)}
                        className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:border-amber-400 hover:text-white transition-all cursor-pointer text-left"
                      >
                        {preset.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message Textarea */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Celebration Wish Message * (Editable)
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => handleTextChange('message', e.target.value)}
                placeholder="Write your heartfelt birthday wishes here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 font-['Noto_Sans_Tamil',sans-serif]"
              />
            </div>
          </div>
        </div>

        {/* Right Form: Visual Theme, Badges & Vibe Meters */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Theme Selector */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>3. Visual Theme</span>
            </h3>

            <div className="space-y-2">
              {(Object.keys(THEMES) as VisualTheme[]).map((themeKey) => {
                const t = THEMES[themeKey];
                const isSelected = formData.theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => handleTextChange('theme', themeKey)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{t.name}</div>
                        <div className="text-[10px] text-slate-400">{t.tagline}</div>
                      </div>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: t.accentColor }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vibe Meter Sliders */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>4. Vibe & Roast Sliders</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Swag Level</span>
                  <span className="font-bold text-amber-400">{formData.vibeScores?.swag || 100}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.vibeScores?.swag || 100}
                  onChange={(e) => handleVibeChange('swag', parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Kindness</span>
                  <span className="font-bold text-pink-400">{formData.vibeScores?.kindness || 98}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.vibeScores?.kindness || 98}
                  onChange={(e) => handleVibeChange('kindness', parseInt(e.target.value))}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Humor & Fun</span>
                  <span className="font-bold text-sky-400">{formData.vibeScores?.humor || 95}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.vibeScores?.humor || 95}
                  onChange={(e) => handleVibeChange('humor', parseInt(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-300 font-semibold">Treat Due (Urgent! 🍕)</span>
                  <span className="font-bold text-emerald-400">{formData.vibeScores?.treatDue || 100}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="100"
                  value={formData.vibeScores?.treatDue || 100}
                  onChange={(e) => handleVibeChange('treatDue', parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Badges / Medals Tagging */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>🏅</span>
              <span>5. Custom Friendship Badges</span>
            </h3>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {formData.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-950 border border-slate-700 text-slate-200"
                >
                  <span>{b}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBadge(idx)}
                    className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newBadgeText}
                onChange={(e) => setNewBadgeText(e.target.value)}
                placeholder="e.g. 🍕 Biryani Champion"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddBadge}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Instant Share & Preview Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-2">
              Ready to Share? 🚀
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Send the interactive link to your friend! When they open it, the unboxing, song & cake cutting surprise begins!
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#25D366] text-slate-950 hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Surprise Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
