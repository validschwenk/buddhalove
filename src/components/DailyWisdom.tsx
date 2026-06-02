'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const wisdomQuotes = [
  "Peace comes from within.",
  "What we think, we become.",
  "Begin again.",
  "Silence is the truest answer.",
  "Let go, and be free.",
  "Breathe. You are alive.",
  "Be still. Be present.",
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
