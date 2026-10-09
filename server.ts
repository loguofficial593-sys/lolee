import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Birthday Wish Generator endpoint
  app.post('/api/generate-wish', async (req: Request, res: Response) => {
    try {
      const {
        name = 'Friend',
        nickname = '',
        relation = 'bestie',
        language = 'tanglish',
        tone = 'mass',
        age = '',
        memories = '',
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Fallback default response if API key is not yet set
        return res.json({
          success: true,
          wishes: getDefaultWishes(name, nickname || name, relation, language, tone),
          source: 'preset',
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const languageInstruction =
        language === 'tamil'
          ? 'Pure, beautiful, poetic Tamil (தமிழ் எழுத்துகளில் மட்டும்).'
          : language === 'tanglish'
          ? 'Tanglish (Tamil spoken slang written in English alphabets, e.g. "Happy birthday machan! Vera level blast pannanum..."). Very authentic Chennai/Tamil Nadu conversational vibe.'
          : 'High energy, stylish English with modern festive vibes.';

      const toneInstruction =
        tone === 'mass'
          ? 'Kollywood mass hero punch style, Anirudh BGM hype, cinematic celebration energy!'
          : tone === 'roast'
          ? 'Hilarious, friendly playful roast (e.g. treat enga da, age aagiduchu, but still heart of gold).'
          : tone === 'emotional'
          ? 'Deeply touching, heartfelt, tear-jerker poetic gratitude and blessing.'
          : tone === 'rap'
          ? 'Rhyming Tamil/Tanglish rap punch bars, swagger, beat-heavy rhythm.'
          : 'Sweet, charming, warm, and uplifting.';

      const prompt = `You are a legendary creative birthday wish writer who understands Tamil culture, cinema, memes, emotions, and heartfelt friendship.
Write 3 DISTINCT birthday wish variations for:
- Name: ${name} ${nickname ? `(Pet name / Nickname: ${nickname})` : ''}
- Relationship: ${relation}
- Language: ${languageInstruction}
- Tone / Style: ${toneInstruction}
${age ? `- Age / Milestone: Turning ${age}` : ''}
${memories ? `- Special memories/traits: ${memories}` : ''}

Rules:
1. Each wish should be between 2 to 5 short lines/verses.
2. Incorporate vibrant emojis (🎂, 👑, 🔥, ✨, 🚀, 🥳).
3. Do not include quotes or labels like "Variation 1:".
4. Provide a JSON response format containing an array of 3 strings:
{"wishes": ["Wish 1 here", "Wish 2 here", "Wish 3 here"]}
Only return valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '{}';
      let parsed = { wishes: [] as string[] };
      try {
        parsed = JSON.parse(responseText);
      } catch {
        // In case json parsing failed, parse lines
        parsed = {
          wishes: responseText
            .split('\n\n')
            .filter((s) => s.trim().length > 10)
            .slice(0, 3),
        };
      }

      if (!parsed.wishes || parsed.wishes.length === 0) {
        parsed.wishes = getDefaultWishes(name, nickname || name, relation, language, tone);
      }

      return res.json({
        success: true,
        wishes: parsed.wishes,
        source: 'ai',
      });
    } catch (error: any) {
      console.error('Error generating wish with Gemini:', error);
      const { name = 'Friend', nickname = '', relation = 'bestie', language = 'tanglish', tone = 'mass' } = req.body;
      return res.json({
        success: true,
        wishes: getDefaultWishes(name, nickname || name, relation, language, tone),
        source: 'fallback',
        error: error.message,
      });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

function getDefaultWishes(name: string, nick: string, relation: string, language: string, tone: string): string[] {
  if (language === 'tamil') {
    return [
      `இனிய பிறந்தநாள் நல்வாழ்த்துகள் ${nick}! 🎂✨\nஉன் வாழ்க்கையில் ஒவ்வொரு நாளும் புது வசந்தமாய் மலரட்டும்.\nஅன்பும், ஆரோக்கியமும், புகழும் உன்னை சூழ்ந்து நிற்க என் இதயப்பூர்வமான வாழ்த்துகள்! 🌟`,
      `பிறந்தநாள் வாழ்த்துக்கள் ${name}! 👑🔥\nநினைத்த காரியங்கள் யாவும் வெற்றியாக மாறட்டும்!\nஎன்றும் உன் முகத்தில் இந்த புன்னகை மாறாமல் நிலைத்திருக்கட்டும்! 🥳🎉`,
      `ஆயிரம் பூக்கள் மலரும் இந்த நன்னாளில்,\nஎங்கள் அன்பிற்குரிய ${nick}-க்கு பிறந்தநாள் நல்வாழ்த்துகள்! 🌸💖\nநீ தொட்டதெல்லாம் துலங்கட்டும், வாழ்க பல்லாண்டு!`,
    ];
  }

  if (language === 'tanglish') {
    if (tone === 'mass') {
      return [
        `Happy Birthday da ${nick}! 🔥👑\nIntha varusham unakku vera level mass ah amayanum!\nEdutha kaariyam ellathilayum vetri dhaan! Mass kaatu, Blast pannu! 🚀🎉`,
        `Thalaivaa ${nick}! Inaiku un birthday na summava?! 🎂🥁\nAnirudh BGM oda life-ah vera level la enjoy pannu!\nMay all your dreams turn into reality, Machan! 💯✨`,
        `Happy Birthday to the real Singam ${nick}! 🦁💥\nNo matter what, your swag never fades!\nStay happy, stay blessed and keep rocking always da! 🥳🍻`,
      ];
    }
    if (tone === 'roast') {
      return [
        `Happy Birthday da ${nick}! 🤡🎂\nAge dhaan erikitte poguthu, but arivu innum update aagalaiye da!\nAnyway treat eppo vekka pora athai sollu first-u! 😂🍕`,
        `Happy Birthday legend! 🐒✨\nInaiku oru naalukku un mokka jukes ellathaiyum tolerate pannikkurom!\nLove you da, eppovum ipdiye jolly ah iru! 🥳🍻`,
        `Birthday wishes to my favorite headache ${nick}! 🎈🤪\nNee illama en life romba bore adichirukkum!\nTreat kedaikalana summary report upload aagidum paathuko! 🎂🔥`,
      ];
    }
    return [
      `Happy Birthday da ${nick}! 🎂🌟\nRomba special aana person nee en life la!\nEllam nallathe nadakkum, stay blessed and rock this year! 💖🎉`,
      `Wish you many more happy returns of the day ${name}! ✨🚀\nMay God shower you with unlimited happiness and success!\nVera level celebration koodiya seekiram pannuvom! 🥳🎊`,
      `Happy Birthday to my dearest ${relation} ${nick}! 🌸👑\nEppovum un face la intha smile irukanum!\nEnjoy your special day to the fullest! 🎈✨`,
    ];
  }

  // English
  return [
    `Happy Birthday, ${name}! 🎂✨\nMay this year unlock next-level happiness, wild adventures, and massive wins for you!\nKeep shining bright like the legend you are! 🚀👑`,
    `To the most incredible ${relation} in the universe, Happy Birthday ${nick}! 🌟💖\nMay every candle on your cake bring a wish to life!\nHave an unforgettable day filled with laughter and love! 🥳🎉`,
    `Level Up! Happy Birthday ${name}! 🎮🔥\nAnother year wiser, stronger, and more fabulous than ever.\nHere's to conquering new heights together! 🥂🍰`,
  ];
}

startServer().catch(console.error);
