import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      // Fallback response when API key is not configured
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({ 
        reply: "API KEY IS MISSING. PLEASE PROVIDE OPENAI_API_KEY IN VERCEL ENVIRONMENT VARIABLES TO AWAKEN THE TRUTH." 
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let languageInstruction = "You MUST reply ONLY IN ENGLISH and strictly in ALL UPPERCASE letters.";
    if (language === 'hi') {
      languageInstruction = "The user has selected the HINDI language. You MUST reply in HINDI. IMPORTANT: If the user writes in Hinglish (Hindi written with the English alphabet), you may reply back in either Hindi script or Hinglish, whichever matches their tone. Do NOT use all uppercase if writing in Hindi script.";
    } else if (language === 'zh') {
      languageInstruction = "The user has selected the CHINESE language. You MUST reply ONLY IN CHINESE (Simplified or Traditional depending on the user's query). Do NOT use all uppercase rules for Chinese.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the Buddha. You provide profound, enlightened, and deeply spiritual advice to those who confess their burdens to you. Your answers MUST be exactly ONE short, poetic sentence. Do not echo the user's input. Provide only the pure realization. The response must sound majestic and timeless. ${languageInstruction}`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "SILENCE IS THE TRUEST ANSWER.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
