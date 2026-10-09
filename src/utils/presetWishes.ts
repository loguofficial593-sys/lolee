export interface WishTemplate {
  id: string;
  title: string;
  category: string;
  language: 'tanglish' | 'tamil' | 'english';
  tone: 'mass' | 'emotional' | 'roast' | 'cute' | 'rap';
  template: (name: string, nick: string, relation: string, age?: string) => string;
}

export const PRESET_WISHES: WishTemplate[] = [
  {
    id: 'tgl-mass-1',
    title: '🔥 Vera Level Mass Entry (Kollywood Style)',
    category: 'Mass & Cinema',
    language: 'tanglish',
    tone: 'mass',
    template: (name, nick) =>
      `Happy Birthday da ${nick}! 🔥👑\nIntha varusham unakku vera level mass ah amayanum!\nEdutha kaariyam ellathilayum vetri dhaan! Mass kaatu, Blast pannu! 🚀🎉`,
  },
  {
    id: 'tgl-anirudh-bgm',
    title: '🥁 Anirudh BGM Hype Beat',
    category: 'Mass & Cinema',
    language: 'tanglish',
    tone: 'mass',
    template: (_name, nick) =>
      `Thalaivaa ${nick}! Inaiku un birthday na summava?! 🎂🥁\nAnirudh BGM oda life-ah vera level la enjoy pannu!\nMay all your dreams turn into reality, Machan! 💯✨`,
  },
  {
    id: 'tgl-roast-treat',
    title: '🍕 Treat Enga Da?! (Funny Roast)',
    category: 'Comedy & Roast',
    language: 'tanglish',
    tone: 'roast',
    template: (_name, nick) =>
      `Happy Birthday da ${nick}! 🤡🎂\nAge dhaan erikitte poguthu, but arivu innum update aagalaiye da!\nAnyway treat eppo vekka pora athai sollu first-u! 😂🍕`,
  },
  {
    id: 'tgl-roast-fav-headache',
    title: '🤪 Favorite Headache Ever',
    category: 'Comedy & Roast',
    language: 'tanglish',
    tone: 'roast',
    template: (_name, nick) =>
      `Birthday wishes to my favorite headache ${nick}! 🎈🤪\nNee illama en life romba bore adichirukkum!\nTreat kedaikalana summary report upload aagidum paathuko! 🎂🔥`,
  },
  {
    id: 'tgl-rap-bars',
    title: '🎤 Chennai Rap Punch Bars',
    category: 'Rap & Rhyme',
    language: 'tanglish',
    tone: 'rap',
    template: (name, nick) =>
      `Mic check 1-2, shoutout to ${name}! 🎤🔥\nFriendship-la No. 1, swag-la No. 1!\nBirthday beat dropping, sound-ah ethi vai!\nVera yaarume kitte vara mudiyaatha vibe! 🚀💥`,
  },
  {
    id: 'tgl-emotional-brother',
    title: '💖 Blood Beyond Blood (Heartfelt)',
    category: 'Heartfelt',
    language: 'tanglish',
    tone: 'emotional',
    template: (_name, nick, relation) =>
      `Happy Birthday to my dear ${nick}! 💖✨\nNeenga en life-la kedaicha periya blessing.\nEntha problem vanthalum un kooda naan irupen.\nStay happy and blessed always! 🌸🙏`,
  },
  // Pure Tamil
  {
    id: 'tam-kavithai-vasantham',
    title: '🌸 புது வசந்தம் மலரட்டும் (தூய கவிதை)',
    category: 'Tamil Kavithai',
    language: 'tamil',
    tone: 'emotional',
    template: (_name, nick) =>
      `இனிய பிறந்தநாள் நல்வாழ்த்துகள் ${nick}! 🎂✨\nஉன் வாழ்க்கையில் ஒவ்வொரு நாளும் புது வசந்தமாய் மலரட்டும்.\nஅன்பும், ஆரோக்கியமும், புகழும் உன்னை சூழ்ந்து நிற்க என் இதயப்பூர்வமான வாழ்த்துகள்! 🌟`,
  },
  {
    id: 'tam-vetri-nayagan',
    title: '👑 வெற்றி நாயகன் (மாஸ் வாழ்த்து)',
    category: 'Tamil Mass',
    language: 'tamil',
    tone: 'mass',
    template: (name, _nick) =>
      `பிறந்தநாள் வாழ்த்துக்கள் ${name}! 👑🔥\nநினைத்த காரியங்கள் யாவும் வெற்றியாக மாறட்டும்!\nஎன்றும் உன் முகத்தில் இந்த புன்னகை மாறாமல் நிலைத்திருக்கட்டும்! 🥳🎉`,
  },
  {
    id: 'tam-pallandu-vazhga',
    title: '🌺 வாழ்க பல்லாண்டு நல்வாழ்த்துகள்',
    category: 'Tamil Blessings',
    language: 'tamil',
    tone: 'emotional',
    template: (_name, nick) =>
      `ஆயிரம் பூக்கள் மலரும் இந்த நன்னாளில்,\nஎங்கள் அன்பிற்குரிய ${nick}-க்கு பிறந்தநாள் நல்வாழ்த்துகள்! 🌸💖\nநீ தொட்டதெல்லாம் துலங்கட்டும், வாழ்க பல்லாண்டு!`,
  },
  // English
  {
    id: 'eng-legend-born',
    title: '🚀 A Legend Was Born',
    category: 'Stylish English',
    language: 'english',
    tone: 'mass',
    template: (name, _nick, _relation, age) =>
      `Happy Birthday ${name}! 🎂✨\n${age ? `Level ${age} Unlocked! ` : ''}May this year bring wild adventures, unstoppable success, and boundless joy!\nKeep shining bright like the absolute rockstar you are! 🚀👑`,
  },
  {
    id: 'eng-cherished-soul',
    title: '🌟 Wholesome & Heartfelt',
    category: 'Wholesome',
    language: 'english',
    tone: 'emotional',
    template: (name, nick, relation) =>
      `To the most genuine and wonderful ${relation}, Happy Birthday ${nick}! 💖🎈\nThank you for bringing so much light and laughter into my life.\nHere is to celebrating you today and always! 🥂✨`,
  },
  {
    id: 'eng-level-up-gamer',
    title: '🎮 Level Up Boss Battle Won',
    category: 'Gamer & Fun',
    language: 'english',
    tone: 'mass',
    template: (name, _nick, _relation, age) =>
      `Achievement Unlocked: Level ${age || 'New'} Reached! 🎮✨\n+100 Wisdom, +500 Charisma, Infinite Energy!\nHappy Birthday ${name}, keep dominating the game of life! 👾🔥`,
  },
];
