import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import dhammapada from '@/data/dhammapada.json';

type LocalizedText = { en: string; hi: string; zh: string };

type Verse = {
  id: number;
  chapter: string;
  themes: string[];
  text: LocalizedText;
  citation: LocalizedText;
};

const verses = dhammapada as Verse[];

type SelectionResult = { id?: number; intro?: string };

// General-comfort verse used whenever the model's selection cannot be trusted.
const DEFAULT_VERSE_ID = 25;
const DEFAULT_VERSE = verses.find((v) => v.id === DEFAULT_VERSE_ID)!;

// Non-scripture UI copy (like the rest of the site's translated strings) — safe to write
// directly, unlike the Dhammapada text itself which awaits reviewed translations.
const FALLBACK_INTROS: LocalizedText = {
  en: "In this moment, the Buddha offers you these words:",
  hi: "इस क्षण में, बुद्ध आपके लिए ये शब्द भेंट करते हैं:",
  zh: "此刻，佛陀为你献上这句话：",
};

// Falls back to English if the localized field hasn't been translated yet — never blank.
function localizedField(field: LocalizedText, lang: keyof LocalizedText): string {
  return field[lang] || field.en;
}

// Cheap secondary fallback: match the worry's words against verse themes before
// resorting to the generic default. Used only when the model's own selection is invalid.
function selectFallbackVerse(message: string): Verse {
  const lowerMsg = message.toLowerCase();
  let best: Verse | null = null;
  let bestScore = 0;

  for (const v of verses) {
    let score = 0;
    for (const theme of v.themes) {
      for (const word of theme.split('-')) {
        if (word.length > 2 && lowerMsg.includes(word)) score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = v;
    }
  }

  return bestScore > 0 && best ? best : DEFAULT_VERSE;
}

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();
    const lang: keyof LocalizedText = language === 'hi' || language === 'zh' ? language : 'en';

    if (!process.env.OPENAI_API_KEY) {
      // Fallback response when API key is not configured
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({
        intro: "API KEY IS MISSING. PLEASE PROVIDE OPENAI_API_KEY IN VERCEL ENVIRONMENT VARIABLES TO AWAKEN THE TRUTH.",
        verse: null,
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let languageInstruction = "Write the intro ONLY IN ENGLISH.";
    if (lang === 'hi') {
      languageInstruction = "Write the intro in HINDI. IMPORTANT: If the user writes in Hinglish (Hindi written with the English alphabet), you may write the intro in either Hindi script or Hinglish, whichever matches their tone.";
    } else if (lang === 'zh') {
      languageInstruction = "Write the intro ONLY IN CHINESE (Simplified or Traditional depending on the user's query).";
    }

    // Only id, themes, and the English gloss are sent — never hi/zh scripture text.
    const candidates = verses.map((v) => ({
      id: v.id,
      themes: v.themes,
      text: v.text.en,
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are helping select a real Buddhist scripture verse for someone's worry. Read their worry and infer their emotional state. Choose the SINGLE most fitting verse FROM THE PROVIDED LIST ONLY. You must NOT write, paraphrase, quote, or invent any scripture. Respond ONLY in strict JSON: {"id": <number>, "intro": "<one short compassionate sentence introducing the verse>"}. The id MUST be one of the ids in the provided list. The intro is your own gentle bridging sentence (e.g. 'For the restless mind that cannot find sleep, the Buddha taught:'). Output nothing except the JSON. ${languageInstruction}

Candidate verses:
${JSON.stringify(candidates)}`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '{}';

    let selection: SelectionResult;
    try {
      selection = JSON.parse(raw);
    } catch {
      // Malformed JSON — never trust whatever text the model produced.
      selection = {};
    }

    let verse = verses.find((v) => v.id === selection.id);
    let intro: string;

    if (verse) {
      intro = selection.intro || FALLBACK_INTROS[lang];
    } else {
      // id missing or not in our list — model output is untrustworthy here.
      // Never show its text as scripture; pick a verse ourselves instead.
      verse = selectFallbackVerse(message);
      intro = FALLBACK_INTROS[lang];
    }

    return NextResponse.json({
      intro,
      verse: {
        id: verse.id,
        text: localizedField(verse.text, lang),
        citation: localizedField(verse.citation, lang),
      },
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    // Even on a hard failure (network/API error), still surface a real verse —
    // never an error-only response with no scripture on screen.
    return NextResponse.json({
      intro: FALLBACK_INTROS.en,
      verse: {
        id: DEFAULT_VERSE.id,
        text: localizedField(DEFAULT_VERSE.text, 'en'),
        citation: localizedField(DEFAULT_VERSE.citation, 'en'),
      },
    });
  }
}
