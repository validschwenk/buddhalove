'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroScreen from '@/components/IntroScreen';
import MainTemple from '@/components/MainTemple';

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 임시 오디오 객체 설정 (실제 파일이 오면 경로 변경 필요)
    // 오디오 파일이 없으면 에러가 날 수 있으므로 예외 처리를 해둡니다.
    audioRef.current = new Audio('/sounds/nature.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0; 
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    
    // 오디오 페이드인 재생
    if (audioRef.current) {
      audioRef.current.play().catch(e => {
        console.log("오디오 파일이 아직 없거나 재생이 차단되었습니다:", e);
      });
      
      let vol = 0;
      const fadeInterval = setInterval(() => {
        if (vol < 0.4) {
          vol += 0.05;
          if (audioRef.current) {
            audioRef.current.volume = Math.min(vol, 0.4);
          }
        } else {
          clearInterval(fadeInterval);
        }
      }, 200);
    }
  };

  return (
    <main className="relative w-full min-h-[100dvh] bg-[#050505] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <IntroScreen key="intro" onEnter={handleEnter} />
        ) : (
          <MainTemple key="temple" />
        )}
      </AnimatePresence>
    </main>
  );
}
