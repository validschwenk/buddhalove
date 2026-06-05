import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { question, answer, language } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 1. Moderate the question to prevent toxic/NSFW content sharing
    const moderation = await openai.moderations.create({
      input: question,
    });

    if (moderation.results[0].flagged) {
      return NextResponse.json({ 
        error: "Content flagged by moderation filter.",
        flagged: true 
      }, { status: 400 });
    }

    // 2. Insert into Supabase
    const { data, error } = await supabase
      .from('shared_wisdom')
      .insert([
        { 
          question, 
          answer, 
          language: language || 'en'
        }
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save wisdom" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error("Error in share-wisdom:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
