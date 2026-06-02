'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import SmokeParticles from './SmokeParticles';
import ZenChatUI from './ZenChatUI';
import DonationModal from './DonationModal';
import LanternSystem from './LanternSystem';
import DailyWisdom from './DailyWisdom';
import Link from 'next/link';

export type Language = 'en' | 'hi' | 'zh';

export default function MainTemple() {
  const [showHalo, setShowHalo] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isMuted, setIsMuted] = useState(false);
  const [localLanternTrigger, setLocalLanternTrigger] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play workaround: sometimes autoPlay attribute isn't enough depending on browser state.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30% so it's not too intrusive
      audioRef.current.play().catch((e) => console.log("Audio autoplay was prevented.", e));
    }
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-[#050505]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 2, ease: 'easeOut' } }}
    >
      {/* Background Audio */}
      <audio 
        ref={audioRef}
        src="/bgm.mp3" 
        autoPlay 
        loop 
        muted={isMuted} 
        style={{ display: 'none' }} 
      />

      {/* 1. Base Background Image (맨 뒷배경) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/buddha-web.webp" 
          alt="Base Background" 
          fill
          className="object-cover object-center opacity-80"
          priority
          quality={100}
          unoptimized
        />
      </div>

      {/* 2. 후광 효과 (Halo) - 배경과 부처님 누끼 사이에 위치 */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {showHalo && (
            <motion.div 
              key="halo-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {/* mb-[20vh]를 주어 후광의 위치를 부처님의 가슴/머리 뒤쪽으로 끌어올림 */}
              <motion.div 
                animate={{ 
                  opacity: [0.7, 1, 0.7], 
                  scale: [1, 1.05, 1],
                  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full mix-blend-screen mb-[20vh]" 
                style={{ 
                  background: 'radial-gradient(circle, rgba(255, 220, 120, 0.85) 0%, rgba(220, 150, 70, 0.45) 45%, rgba(0, 0, 0, 0) 75%)',
                  filter: 'blur(40px)'
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2.5. 익명 연등 시스템 (가상 + 로컬) */}
      <LanternSystem localTrigger={localLanternTrigger} />

      {/* 3. 부처님 누끼 이미지 (후광 앞) */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <Image 
          src="/onlybuddha.webp" 
          alt="Buddha Cutout" 
          fill
          className="object-cover object-center opacity-80"
          priority
          quality={100}
          unoptimized
        />
      </div>

      {/* 4. 공통 어두운 그라데이션 (배경과 누끼를 자연스럽게 묶어주고 하단을 어둡게) */}
      <div className="absolute inset-0 z-[3] pointer-events-none bg-gradient-to-t from-black via-black/60 to-transparent" />

      {/* 5. 향로 이미지 */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 z-[5] pointer-events-none mix-blend-screen opacity-25 flex flex-col items-center"
        style={{ top: '81.3%' }}
      >
        <img 
          src="/burner.png" 
          alt="Incense Burner" 
          className="w-[120px] md:w-[140px] h-auto object-contain"
          style={{ transform: 'translateY(-20%)' }}
        />
      </div>

      {/* 6. Interactive Smoke Particles */}
      <div className="z-[10]">
        <SmokeParticles />
      </div>

      {/* 7. 1:1 Zen Chat UI Overlay */}
      <div className="z-[20] absolute inset-0">
        <ZenChatUI 
          onReplyChange={setShowHalo} 
          language={language} 
          onMessageSent={() => setLocalLanternTrigger(prev => prev + 1)}
        />
      </div>

      {/* 8. 우측 상단 컨트롤 (언어 선택, 음소거, 시주 버튼) */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-[30] flex items-center gap-3">
        
        {/* Mute Toggle Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 bg-black/20 hover:bg-black/50 text-white/60 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Language Selector */}
        <div className="flex bg-black/20 rounded-full p-1 backdrop-blur-md border border-white/10">
          <button 
            onClick={() => setLanguage('en')} 
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${language === 'en' ? 'bg-[#cfa670]/30 text-[#cfa670] shadow-[0_0_10px_rgba(207,166,112,0.2)]' : 'text-white/40 hover:text-white/80'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('hi')} 
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${language === 'hi' ? 'bg-[#cfa670]/30 text-[#cfa670] shadow-[0_0_10px_rgba(207,166,112,0.2)]' : 'text-white/40 hover:text-white/80'}`}
          >
            हिंदी
          </button>
          <button 
            onClick={() => setLanguage('zh')} 
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${language === 'zh' ? 'bg-[#cfa670]/30 text-[#cfa670] shadow-[0_0_10px_rgba(207,166,112,0.2)]' : 'text-white/40 hover:text-white/80'}`}
          >
            中
          </button>
        </div>

        <button 
          onClick={() => setIsDonationOpen(true)}
          className="px-5 py-2.5 text-xs md:text-sm tracking-[0.2em] uppercase font-light text-[#cfa670]/90 hover:text-[#cfa670] transition-all bg-black/20 hover:bg-black/50 rounded-full backdrop-blur-md border border-[#cfa670]/30 hover:border-[#cfa670]/60 hover:shadow-[0_0_15px_rgba(207,166,112,0.3)]"
        >
          {language === 'en' ? 'Offerings' : language === 'hi' ? 'भेंट' : '供奉'}
        </button>
      </div>

      {/* 9. Daily Wisdom */}
      <DailyWisdom />

      {/* 10. Minimal Footer for AdSense Compliance */}
      <div className="absolute bottom-4 left-0 right-0 z-[30] flex justify-center gap-4 text-[10px] md:text-xs text-white/30 font-sans tracking-widest pointer-events-auto">
        <Link href="/about" className="hover:text-white/70 transition-colors">ABOUT</Link>
        <span>|</span>
        <Link href="/privacy" className="hover:text-white/70 transition-colors">PRIVACY</Link>
        <span>|</span>
        <Link href="/terms" className="hover:text-white/70 transition-colors">TERMS</Link>
        <span>|</span>
        <a href="mailto:hello@validschwenk.com" className="hover:text-white/70 transition-colors">CONTACT</a>
      </div>

      {/* 11. 시주 결제 모달 */}
      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} language={language} />
      
    </motion.div>
  );
}
