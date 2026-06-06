'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
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
  en: { title: "Wisdom Scroll", empty: "The scroll is empty. Be the first to share wisdom.", loading: "Unrolling the scroll...", loadingMore: "Loading more..." },
  hi: { title: "ज्ञान पट्टिका", empty: "स्क्रॉल खाली है। ज्ञान साझा करने वाले पहले व्यक्ति बनें।", loading: "स्क्रॉल खोला जा रहा है...", loadingMore: "अधिक लोड हो रहा है..." },
  zh: { title: "智慧画卷", empty: "画卷是空的。成为第一个分享智慧的人吧。", loading: "正在展开画卷...", loadingMore: "加载更多..." }
};

const ABOVE = 220;
const PAGE_SIZE = 10;

export default function WisdomScroll({ onClose, language }: WisdomScrollProps) {
  const [wisdoms, setWisdoms] = useState<Wisdom[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const fetchPage = useCallback((pageIndex: number) => {
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    return supabase
      .from('shared_wisdom')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)
      .then(({ data, error }: { data: Wisdom[] | null; error: unknown }) => {
        if (error) console.error("Error fetching wisdom:", error);
        return data || [];
      });
  }, []);

  useEffect(() => {
    fetchPage(0).then((data) => {
      setWisdoms(data);
      setHasMore(data.length === PAGE_SIZE);
      setLoading(false);
    });
  }, [fetchPage]);

  // Infinite scroll — observe sentinel div at bottom of list
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loadingMore) return;
    const sentinel = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadingMore(true);
          const nextPage = page + 1;
          fetchPage(nextPage).then((data) => {
            setWisdoms(prev => [...prev, ...data]);
            setPage(nextPage);
            setHasMore(data.length === PAGE_SIZE);
            setLoadingMore(false);
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, page, fetchPage]);

  const handleLike = async (id: string) => {
    if (likedIds.has(id)) return;
    setLikedIds(prev => new Set(prev).add(id));
    setWisdoms(prev => prev.map(w => w.id === id ? { ...w, likes: w.likes + 1 } : w));
    try {
      const target = wisdoms.find(w => w.id === id);
      if (target) {
        await supabase.from('shared_wisdom').update({ likes: target.likes + 1 }).eq('id', id);
      }
    } catch (err) {
      console.error("Error liking:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.1 } }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-start justify-center px-2 md:px-8 bg-black/80 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      {/* stopPropagation prevents backdrop click from closing when clicking scroll content */}
      <div
        className="relative w-full max-w-3xl flex flex-col items-center"
        style={{ marginTop: `-${ABOVE}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `calc(90vh + ${ABOVE}px)`, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 } }}
          exit={{ height: 0, transition: { duration: 1.0, ease: [0.0, 0.0, 0.2, 1.0] } }}
          className="relative w-full flex flex-col items-center z-10"
        >
          {/* Paper background — lives outside overflow-hidden so it grows with motion.div.
              This keeps the torn edge always near the roller and syncs the animation. */}
          <div
            className="absolute top-0 h-full left-[3%] right-[3%] z-0 pointer-events-none"
            style={{
              backgroundImage: "url('/scroll.webp')",
              backgroundSize: "100% 100%",
            }}
          />

          <div className="w-full h-full overflow-hidden relative flex justify-center">
            <div
              className="absolute top-0 w-full flex justify-center"
              style={{ height: `calc(90vh + ${ABOVE}px)` }}
            >
              {/* Content — narrower width keeps text inside the paper writing area */}
              <div
                className="relative z-10 w-[68%] md:w-[65%] h-full flex flex-col pb-20 md:pb-28"
                style={{ paddingTop: `${ABOVE + 50}px` }}
              >
                {/* Header — title centered */}
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="flex justify-center items-center px-4 py-3 md:px-6 md:py-4 border-b border-[#2b1d0f]/20"
                >
                  <h2
                    className="text-2xl md:text-4xl font-serif text-[#3e2723] font-bold tracking-widest uppercase text-center"
                    style={{ textShadow: '0 1px 2px rgba(255,255,255,0.3)' }}
                  >
                    {uiTexts[language].title}
                  </h2>
                </motion.div>

                {/* Scrollable wisdom list */}
                <div className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin scrollbar-thumb-[#3e2723]/30 scrollbar-track-transparent">
                  {loading ? (
                    <div className="text-center text-[#3e2723]/60 py-12 italic font-light tracking-wider">
                      {uiTexts[language].loading}
                    </div>
                  ) : wisdoms.length === 0 ? (
                    <div className="text-center text-[#3e2723]/60 py-12 italic font-light tracking-wider">
                      {uiTexts[language].empty}
                    </div>
                  ) : (
                    <>
                      <AnimatePresence>
                        {wisdoms.map((wisdom, i) => (
                          <motion.div
                            key={wisdom.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i < PAGE_SIZE ? i * 0.05 + 2.0 : 0.1 }}
                            className="p-3 rounded-xl bg-gradient-to-br from-[#ffffff]/10 to-transparent border border-[#3e2723]/10 hover:border-[#3e2723]/30 transition-colors"
                          >
                            <p className="text-[#3e2723]/80 italic text-xs mb-1.5 leading-snug font-serif">
                              &ldquo;{wisdom.question}&rdquo;
                            </p>
                            <p
                              className="text-[#1a0f0a] font-serif text-sm md:text-base leading-snug mb-2 font-bold"
                              style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}
                            >
                              {wisdom.answer}
                            </p>
                            <div className="flex justify-end items-center border-t border-[#3e2723]/10 pt-2">
                              <button
                                onClick={() => handleLike(wisdom.id)}
                                disabled={likedIds.has(wisdom.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm ${
                                  likedIds.has(wisdom.id)
                                    ? 'bg-[#3e2723]/20 text-[#3e2723]'
                                    : 'bg-[#3e2723]/5 text-[#3e2723]/60 hover:bg-[#3e2723]/10 hover:text-[#3e2723]'
                                }`}
                              >
                                <span>🙏</span>
                                <span className="font-semibold">{wisdom.likes}</span>
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Infinite scroll sentinel */}
                      <div ref={sentinelRef} className="h-2" />
                      {loadingMore && (
                        <div className="text-center text-[#3e2723]/40 py-4 italic text-xs tracking-wider">
                          {uiTexts[language].loadingMore}
                        </div>
                      )}
                      {!hasMore && wisdoms.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: Math.min(wisdoms.length, PAGE_SIZE) * 0.05 + 2.0 }}
                          className="text-center text-[#3e2723]/30 py-3 text-xs"
                        >— ∞ —</motion.div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom roller */}
          <div className="absolute bottom-[-10px] md:bottom-[-20px] left-0 right-0 z-20 pointer-events-none flex justify-center">
            <img
              src="/scroll-bar.webp"
              alt="Scroll Roller"
              className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
              style={{ transform: 'scaleY(0.8)', transformOrigin: 'top center' }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
