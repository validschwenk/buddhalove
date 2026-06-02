'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from './MainTemple';

type ZenChatUIProps = {
  onReplyChange?: (hasReply: boolean) => void;
  language: Language;
};

const placeholders = {
  en: "What is burdening your mind today?",
  hi: "आज आपके मन पर क्या बोझ है?",
  zh: "今天有什么让你烦心？"
};

export default function ZenChatUI({ onReplyChange, language }: ZenChatUIProps) {
  const [userQuery, setUserQuery] = useState<string | null>(null);
  const [buddhaReply, setBuddhaReply] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (onReplyChange) {
      onReplyChange(!!buddhaReply);
    }
  }, [buddhaReply, onReplyChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

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
                className="text-lg md:text-2xl text-[#f3e8dd] text-center leading-relaxed font-light uppercase tracking-[0.15em] md:tracking-[0.2em] px-8 py-6 rounded-3xl font-serif"
                style={{ 
                  textShadow: '0 0 10px rgba(0,0,0,1), 0 0 20px rgba(207,166,112,0.8), 0 0 40px rgba(207,166,112,0.5)',
                  background: 'radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)'
                }}
              >
                {buddhaReply}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. 하단: 사용자의 고민(채팅박스 바로 위) & 고정된 입력창 */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg pointer-events-auto px-4 flex flex-col justify-end">
        
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
    </div>
  );
}
