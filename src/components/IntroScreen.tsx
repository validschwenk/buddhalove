'use client';

import { motion } from 'framer-motion';

interface IntroScreenProps {
  onEnter: () => void;
}

export default function IntroScreen({ onEnter }: IntroScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-xl md:text-3xl font-light text-white/80 tracking-wide mb-10 text-center px-4 font-serif">
          What is burdening your mind today?
        </h1>
        <button
          onClick={onEnter}
          className="px-10 py-3 rounded-full border border-white/30 text-white/60 hover:text-white hover:border-white/60 hover:bg-white/5 transition-all duration-500 tracking-widest uppercase text-sm font-serif"
        >
          Enter
        </button>
      </motion.div>
    </motion.div>
  );
}
