'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const wisdomQuotes = [
  "Peace comes from within. Do not seek it without.",
  "What we think, we become.",
  "No matter how hard the past, you can always begin again.",
  "Silence is an empty space, space is the home of the awakened mind.",
  "The root of suffering is attachment.",
  "Radiate boundless love towards the entire world.",
  "In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go of things not meant for you.",
];

export default function DailyWisdom() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Select a random quote on mount
    const randomQuote = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)];
    setQuote(randomQuote);
  }, []);

  if (!quote) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 1 }}
      className="absolute bottom-16 left-0 right-0 mx-auto text-center pointer-events-none z-10 px-4"
    >
      <p className="font-serif text-white/50 text-xs md:text-sm italic tracking-wide">
        "{quote}"
      </p>
    </motion.div>
  );
}
