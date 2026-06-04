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
  const [imagesBase64, setImagesBase64] = useState({ bg: '', buddha: '', burner: '' });
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Preload images as base64 to fix iOS Safari blank image bugs in html-to-image
    const loadBase64 = async (url: string) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        return '';
      }
    };

    Promise.all([
      loadBase64('/buddha-web.webp'),
      loadBase64('/onlybuddha.webp'),
      loadBase64('/burner.png')
    ]).then(([bg, buddha, burner]) => {
      setImagesBase64({ bg, buddha, burner });
    });
  }, []);

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
      });
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'buddhas-wisdom.png', { type: 'image/png' });
      
      try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'BuddhaLove Wisdom',
          });
        } else {
          // Direct download for PC/Desktop (or if share not supported)
          const link = document.createElement('a');
          link.download = 'buddhas-wisdom.png';
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (shareError) {
        // Fallback to standard download if share fails (e.g., due to user gesture timeout)
        const link = document.createElement('a');
        link.download = 'buddhas-wisdom.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Show success message
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error: any) {
      alert(`Download Error: ${error.message || error}`);
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
      <div className="absolute top-0 left-0 z-[-50] opacity-0 pointer-events-none">
        <div 
          ref={printRef}
          className="w-[540px] h-[960px] bg-[#050505] flex flex-col relative overflow-hidden"
          style={{ fontFamily: 'var(--font-cinzel), var(--font-noto-serif-kr), serif' }}
        >
          {/* 1. Base Background Image */}
          <img 
            src={imagesBase64.bg || '/buddha-web.webp'}
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 1.5. Dark Overlays (Match web) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80 z-[1]" />
          <div className="absolute inset-0 bg-black/30 z-[1]" />
          
          {/* Halo Glow behind Buddha */}
          {buddhaReply && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-[40%] -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-screen z-[2]"
              style={{ 
                background: 'radial-gradient(circle, rgba(255, 220, 120, 0.6) 0%, rgba(255, 180, 50, 0.2) 35%, transparent 65%)',
              }}
            />
          )}

          {/* 2. Buddha Cutout */}
          <img 
            src={imagesBase64.buddha || '/onlybuddha.webp'}
            alt="Buddha" 
            className="absolute inset-0 w-full h-full object-cover z-[5]"
          />

          {/* 5.5. Static Smoke for Generated Image */}
          {buddhaReply && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 z-[6] pointer-events-none mix-blend-screen"
              style={{
                bottom: '18.7%',
                width: '140px',
                height: '450px',
                background: 'linear-gradient(to top, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 40%, transparent 100%)',
                filter: 'blur(18px)',
                WebkitFilter: 'blur(18px)',
                transform: 'rotate(-3deg)',
                transformOrigin: 'bottom center',
                borderRadius: '100% 100% 0 0',
              }}
            />
          )}

          {/* 6. Incense Burner */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 z-[7] mix-blend-screen opacity-25 flex flex-col items-center"
            style={{ top: '81.3%' }}
          >
            <img 
              src={imagesBase64.burner || '/burner.png'}
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
