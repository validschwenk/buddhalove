'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { X } from 'lucide-react';
import { Language } from './MainTemple';

type Wisdom = {
  id: string;
  question: string;
  answer: string;
  likes: number;
  created_at: string;
};

type WisdomScrollProps = {
  onClose: () => void;
  language: Language;
};

const uiTexts = {
  en: { title: "Wisdom Scroll", empty: "The scroll is empty. Be the first to share wisdom.", loading: "Unrolling the scroll..." },
  hi: { title: "ज्ञान पट्टिका", empty: "स्क्रॉल खाली है। ज्ञान साझा करने वाले पहले व्यक्ति बनें।", loading: "स्क्रॉल खोला जा रहा है..." },
  zh: { title: "智慧画卷", empty: "画卷是空的。成为第一个分享智慧的人吧。", loading: "正在展开画卷..." }
};

export default function WisdomScroll({ onClose, language }: WisdomScrollProps) {
  const [wisdoms, setWisdoms] = useState<Wisdom[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWisdoms();
  }, []);

  const fetchWisdoms = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_wisdom')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setWisdoms(data || []);
    } catch (err) {
      console.error("Error fetching wisdom:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    if (likedIds.has(id)) return;
    
    // Optimistic UI update
    setLikedIds(prev => new Set(prev).add(id));
    setWisdoms(prev => prev.map(w => w.id === id ? { ...w, likes: w.likes + 1 } : w));

    // Supabase RPC or direct update
    // Since we enabled update access, we can do a simple read then update,
    // but a safer way is using an RPC. For MVP, we'll do direct update.
    try {
      const target = wisdoms.find(w => w.id === id);
      if (target) {
        await supabase
          .from('shared_wisdom')
          .update({ likes: target.likes + 1 })
          .eq('id', id);
      }
    } catch (err) {
      console.error("Error liking:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center px-2 md:px-8 bg-black/80 backdrop-blur-md overflow-hidden"
    >
      <div className="relative w-full max-w-3xl flex flex-col items-center mt-[5vh]">
        {/* Top Roller */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-[-10px] md:top-[-20px] left-0 right-0 z-30 pointer-events-none flex justify-center"
        >
          <img 
            src="/scroll-bar.webp" 
            alt="Top Roller" 
            className="w-full h-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]"
            style={{ transform: 'scaleY(-1)' }} 
          />
        </motion.div>

        {/* Master Animating Container */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "85vh" }}
          exit={{ height: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative w-full flex flex-col items-center z-10"
        >
          {/* Overflow hidden wrapper to reveal paper without stretching */}
          <div className="w-full h-full overflow-hidden relative flex justify-center">
            {/* The actual paper content, fixed to final height so it doesn't squish */}
            <div className="absolute top-0 w-full h-[85vh] flex justify-center">
              {/* Paper Background */}
              <div 
                className="absolute top-0 bottom-[20px] md:bottom-[40px] left-[3%] right-[3%] z-0 pointer-events-none"
                style={{
                  backgroundImage: "url('/scroll.webp')",
                  backgroundSize: "100% 100%",
                }}
              />

              {/* Inner Content Wrapper */}
              <div className="relative z-10 w-[94%] h-full flex flex-col pb-8 md:pb-16 pt-8 md:pt-12">
                {/* Header */}
                <div className="flex justify-between items-center p-4 md:p-6 border-b border-[#2b1d0f]/20">
                  <h2 className="text-xl md:text-3xl font-serif text-[#3e2723] font-bold tracking-widest uppercase" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}>
                    {uiTexts[language].title}
                  </h2>
                  <button 
                    onClick={onClose}
                    className="p-2 text-[#3e2723]/60 hover:text-[#3e2723] transition-colors rounded-full hover:bg-[#3e2723]/10"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#3e2723]/30 scrollbar-track-transparent">
                  {loading ? (
                    <div className="text-center text-[#3e2723]/60 py-12 italic font-light tracking-wider">
                      {uiTexts[language].loading}
                    </div>
                  ) : wisdoms.length === 0 ? (
                    <div className="text-center text-[#3e2723]/60 py-12 italic font-light tracking-wider">
                      {uiTexts[language].empty}
                    </div>
                  ) : (
                    <AnimatePresence>
                      {wisdoms.map((wisdom, i) => (
                        <motion.div
                          key={wisdom.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 + 0.6 }} // Re-adjusted delay to match unroll
                          className="p-6 rounded-xl bg-gradient-to-br from-[#ffffff]/10 to-transparent border border-[#3e2723]/10 hover:border-[#3e2723]/30 transition-colors group"
                        >
                          <p className="text-[#3e2723]/80 italic text-sm md:text-base mb-4 leading-relaxed font-serif">
                            "{wisdom.question}"
                          </p>
                          <p className="text-[#1a0f0a] font-serif text-lg md:text-xl leading-relaxed mb-6 font-bold"
                             style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}>
                            {wisdom.answer}
                          </p>
                          
                          <div className="flex justify-end items-center border-t border-[#3e2723]/10 pt-4">
                            <button 
                              onClick={() => handleLike(wisdom.id)}
                              disabled={likedIds.has(wisdom.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                                likedIds.has(wisdom.id) 
                                  ? 'bg-[#3e2723]/20 text-[#3e2723]' 
                                  : 'bg-[#3e2723]/5 text-[#3e2723]/60 hover:bg-[#3e2723]/10 hover:text-[#3e2723]'
                              }`}
                            >
                              <span className="text-lg">🙏</span>
                              <span className="text-sm font-semibold">{wisdom.likes}</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Roller - Firmly pinned to the absolute bottom of the growing container */}
          <div className="absolute bottom-[-10px] md:bottom-[-20px] left-0 right-0 z-20 pointer-events-none flex justify-center">
            <img src="/scroll-bar.webp" alt="Scroll Roller" className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
