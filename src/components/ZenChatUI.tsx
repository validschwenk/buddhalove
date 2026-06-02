'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { Language } from './MainTemple';

type ZenChatUIProps = {
  onReplyChange?: (hasReply: boolean) => void;
  language: Language;
  onMessageSent?: () => void;
};

const placeholders = {
  en: "What is burdening your mind today?",
  hi: "आज आपके मन पर क्या बोझ है?",
  zh: "今天有什么让你烦心？"
};

const saveTexts = {
  en: "Save Wisdom",
  hi: "ज्ञान सहेजें",
  zh: "保存智慧"
};

export default function ZenChatUI({ onReplyChange, language, onMessageSent }: ZenChatUIProps) {
  const [userQuery, setUserQuery] = useState<string | null>(null);
  const [buddhaReply, setBuddhaReply] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onReplyChange) {
      onReplyChange(!!buddhaReply);
    }
  }, [buddhaReply, onReplyChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    onMessageSent?.();

    setUserQuery(input.trim());
    setBuddhaReply(null);
    setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim(), language })
      });
      const data = await res.json();
      
      setBuddhaReply(data.reply);
    } catch (error) {
      console.error(error);
      const fallbackMsg = language === 'hi' ? "मौन ही सबसे अच्छा उत्तर है। कृपया पुनः प्रयास करें।" : language === 'zh' ? "沉默便是答案。请重试。" : "Even silence is an answer. Please try again.";
      setBuddhaReply(fallbackMsg);
    } finally {
      setIsThinking(false);
    }
  };

  const handleDownload = async () => {
    if (!printRef.current || isSaving) return;
    setIsSaving(true);
    
    try {
      // Small delay to ensure fonts/styles are fully rendered before capturing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await htmlToImage.toPng(printRef.current, {
        pixelRatio: 2,
        backgroundColor: '#050505',
        // Next.js Image caching might cause issues with html-to-image, so using basic imgs
      });
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'buddhas-wisdom.png', { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'BuddhaLove Wisdom',
        });
      } else {
        const link = document.createElement('a');
        link.download = 'buddhas-wisdom.png';
        link.href = dataUrl;
        link.click();
      }

      // Show success message
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      
      {/* 1. 중앙: 부처님의 답변 텍스트 (얼굴/가슴 쪽에 가깝도록 위로 배치) */}
      <div className="absolute top-[25vh] md:top-[30vh] left-0 right-0 flex items-center justify-center">
        
        {/* 답변 텍스트 또는 로딩(Thinking) 상태 */}
        <div className="relative z-10 w-full max-w-2xl px-6 flex justify-center">
          <AnimatePresence mode="wait">
            {isThinking && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, filter: 'blur(5px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(5px)' }}
                transition={{ duration: 1 }}
                className="flex items-center space-x-3 px-6 py-4 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 80%)' }}
              >
                <div className="w-1.5 h-1.5 bg-[#cfa670]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#cfa670]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#cfa670]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </motion.div>
            )}
            
            {buddhaReply && !isThinking && (
              <motion.div
                key={buddhaReply}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <div
                  className="text-lg md:text-2xl text-[#f3e8dd] text-center leading-relaxed font-light uppercase tracking-[0.15em] md:tracking-[0.2em] px-8 py-6 rounded-3xl font-serif mb-6"
                  style={{ 
                    textShadow: '0 0 10px rgba(0,0,0,1), 0 0 20px rgba(207,166,112,0.8), 0 0 40px rgba(207,166,112,0.5)',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)'
                  }}
                >
                  {buddhaReply}
                </div>

                {/* Save Wisdom Button */}
                <button
                  onClick={handleDownload}
                  disabled={isSaving || isSaved}
                  className="pointer-events-auto flex items-center gap-3 px-6 py-3 bg-black/60 hover:bg-black/80 border border-[#cfa670]/40 hover:border-[#cfa670]/80 text-[#cfa670] rounded-full backdrop-blur-md transition-all shadow-[0_0_20px_rgba(207,166,112,0.15)] hover:shadow-[0_0_30px_rgba(207,166,112,0.4)] disabled:opacity-50"
                >
                  {isSaved ? (
                    <span className="text-[#a3e635] text-lg leading-none">✓</span>
                  ) : (
                    <Download size={18} />
                  )}
                  <span className={`text-sm font-light uppercase tracking-widest ${isSaved ? 'text-[#a3e635]' : ''}`}>
                    {isSaving ? "Saving..." : isSaved ? "Saved! (Check Img)" : saveTexts[language]}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. 하단: 사용자의 고민(채팅박스 바로 위) & 고정된 입력창 */}
      <div className="absolute bottom-[4vh] md:bottom-[10vh] left-1/2 -translate-x-1/2 w-full max-w-lg pointer-events-auto px-4 flex flex-col justify-end">
        
        {/* 사용자가 방금 입력한 말 (타이핑 박스 바로 위 중앙에 표시) */}
        <AnimatePresence mode="wait">
          {userQuery && (
            <motion.div 
              key={userQuery}
              initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="w-full flex justify-center text-center mb-4"
            >
              <span 
                className="text-sm md:text-base text-white/90 tracking-widest font-light italic max-w-xl px-6 py-2 bg-black/40 rounded-full backdrop-blur-sm shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/5"
              >
                "{userQuery}"
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[language]}
            className="w-full bg-black/70 border border-white/20 text-white rounded-full py-4 pl-6 pr-16 outline-none focus:border-[#cfa670]/60 transition-colors backdrop-blur-lg shadow-2xl placeholder:text-white/40 text-base md:text-lg"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isThinking}
            className="absolute right-2 p-3 bg-[#cfa670]/20 hover:bg-[#cfa670]/40 text-[#cfa670] rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-[#cfa670]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      {/* Hidden Card for Image Generation */}
      <div className="fixed top-0 left-0 z-[-50] opacity-0 pointer-events-none">
        <div 
          ref={printRef}
          className="w-[540px] h-[960px] bg-[#050505] flex flex-col relative overflow-hidden"
          style={{ fontFamily: 'var(--font-cinzel), var(--font-noto-serif-kr), serif' }}
        >
          {/* 1. Base Background Image */}
          <img 
            src="/buddha-web.webp" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          
          {/* 1.5. Halo Glow behind Buddha */}
          {buddhaReply && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none mix-blend-screen mb-[20vh]"
              style={{ 
                background: 'radial-gradient(circle, rgba(255, 220, 120, 0.85) 0%, rgba(220, 150, 70, 0.45) 45%, transparent 75%)',
                filter: 'blur(20px)'
              }}
            />
          )}

          {/* 2. Buddha Cutout */}
          <img 
            src="/onlybuddha.webp" 
            alt="Buddha" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 z-[5]"
          />

          {/* 3. Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-[6]" />

          {/* 4. Incense Burner */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 z-[7] mix-blend-screen opacity-25 flex flex-col items-center"
            style={{ top: '81.3%' }}
          >
            <img 
              src="/burner.png" 
              alt="Incense Burner" 
              className="w-[120px] h-auto object-contain"
              style={{ transform: 'translateY(-20%)' }}
            />
          </div>

          {/* 5. Text (Exact match to web) */}
          {buddhaReply && (
            <div className="absolute top-[28%] w-full px-6 flex justify-center z-10">
              <div
                className="text-[20px] text-[#f3e8dd] text-center leading-relaxed font-light uppercase tracking-[0.2em] px-8 py-6 rounded-3xl font-serif"
                style={{ 
                  textShadow: '0 0 10px rgba(0,0,0,1), 0 0 20px rgba(207,166,112,0.8), 0 0 40px rgba(207,166,112,0.5)',
                  background: 'radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)'
                }}
              >
                {buddhaReply}
              </div>
            </div>
          )}

          {/* 6. Watermark */}
          <div className="absolute bottom-6 w-full flex flex-col items-center opacity-60 z-10">
            <div className="text-white text-[10px] font-mono tracking-widest" style={{ textShadow: '0 0 10px rgba(0,0,0,1)' }}>
              buddhashareslove.app
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
