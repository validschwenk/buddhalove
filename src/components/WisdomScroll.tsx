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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-[#0f0a05] border border-[#cfa670]/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(207,166,112,0.1)]"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#cfa670]/20 bg-gradient-to-b from-[#1a120a] to-transparent">
          <h2 className="text-2xl md:text-3xl font-serif text-[#cfa670] tracking-widest uppercase">
            {uiTexts[language].title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#cfa670]/30 scrollbar-track-transparent">
          {loading ? (
            <div className="text-center text-white/50 py-12 italic font-light tracking-wider">
              {uiTexts[language].loading}
            </div>
          ) : wisdoms.length === 0 ? (
            <div className="text-center text-white/50 py-12 italic font-light tracking-wider">
              {uiTexts[language].empty}
            </div>
          ) : (
            <AnimatePresence>
              {wisdoms.map((wisdom, i) => (
                <motion.div
                  key={wisdom.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-[#cfa670]/20 transition-colors group"
                >
                  <p className="text-white/60 italic text-sm md:text-base mb-4 leading-relaxed">
                    "{wisdom.question}"
                  </p>
                  <p className="text-[#f3e8dd] font-serif text-lg md:text-xl leading-relaxed mb-6"
                     style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {wisdom.answer}
                  </p>
                  
                  <div className="flex justify-end items-center border-t border-white/5 pt-4">
                    <button 
                      onClick={() => handleLike(wisdom.id)}
                      disabled={likedIds.has(wisdom.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        likedIds.has(wisdom.id) 
                          ? 'bg-[#cfa670]/20 text-[#cfa670]' 
                          : 'bg-black/40 text-white/40 hover:bg-black/60 hover:text-[#cfa670]'
                      }`}
                    >
                      <span className="text-lg">🙏</span>
                      <span className="text-sm font-light">{wisdom.likes}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
