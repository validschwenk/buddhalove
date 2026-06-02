'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Lantern = {
  id: string;
  x: number; // percentage width
  yStart: number; // starting y position percentage (bottom)
  duration: number; // animation duration
  size: number; // size in px
  isLocal: boolean;
};

export default function LanternSystem({ localTrigger }: { localTrigger: number }) {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);

  // 1. 유저 본인의 기도 (특별 연출)
  useEffect(() => {
    if (localTrigger > 0) {
      const newLantern: Lantern = {
        id: `local-${Date.now()}`,
        x: 50, // 화면 정중앙 (향로 위치)
        yStart: 85, // 향로 높이 근처
        duration: 12, // 조금 더 천천히 우아하게
        size: 24, // 확실히 눈에 띄게 큰 사이즈
        isLocal: true,
      };
      setLanterns(prev => [...prev, newLantern]);
    }
  }, [localTrigger]);

  // 2. 다른 사람들의 가상 연등 (시뮬레이션)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const spawnVirtualLantern = () => {
      const isMobile = window.innerWidth < 768;
      // 랜덤 X 위치 (가장자리는 피함 10% ~ 90%)
      const randomX = 10 + Math.random() * 80;
      // 랜덤 시작 Y 위치 (바닥 근처 90% ~ 100%)
      const randomYStart = 90 + Math.random() * 10;
      // 랜덤 지속시간 (15초 ~ 25초, 천천히 유영)
      const randomDuration = 15 + Math.random() * 10;
      // 랜덤 사이즈 (작은 빛무리 8px ~ 14px)
      const randomSize = isMobile ? 6 + Math.random() * 6 : 8 + Math.random() * 6;

      const newLantern: Lantern = {
        id: `virt-${Date.now()}`,
        x: randomX,
        yStart: randomYStart,
        duration: randomDuration,
        size: randomSize,
        isLocal: false,
      };

      setLanterns(prev => {
        const next = [...prev, newLantern];
        // 렌더링 부하를 막기 위해 최대 15개까지만 유지
        if (next.length > 15) return next.slice(next.length - 15);
        return next;
      });

      // 다음 연등 생성 시간 (4초 ~ 15초 사이 랜덤)
      const nextDelay = 4000 + Math.random() * 11000;
      timeoutId = setTimeout(spawnVirtualLantern, nextDelay);
    };

    // 처음 접속 후 2초 뒤 첫 연등 띄우기
    timeoutId = setTimeout(spawnVirtualLantern, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {lanterns.map((lantern) => (
          <motion.div
            key={lantern.id}
            initial={{ 
              opacity: 0, 
              y: `${lantern.yStart}vh`, 
              x: `calc(${lantern.x}vw - ${lantern.size / 2}px)`
            }}
            animate={{ 
              opacity: [0, 0.8, 0.8, 0], 
              y: '-10vh', 
              // 올라가면서 약간 흔들리며(바람 부는 느낌) 랜덤한 X축으로 이동
              x: `calc(${lantern.x + (Math.random() * 10 - 5)}vw - ${lantern.size / 2}px)`
            }}
            transition={{ 
              duration: lantern.duration, 
              ease: "easeOut" 
            }}
            onAnimationComplete={() => {
              setLanterns(prev => prev.filter(l => l.id !== lantern.id));
            }}
            className={`absolute rounded-full flex items-center justify-center`}
            style={{
              width: lantern.size,
              height: lantern.size,
              background: lantern.isLocal ? '#ffeaae' : '#e6c88e',
              boxShadow: lantern.isLocal 
                ? `0 0 ${lantern.size * 2}px ${lantern.size}px rgba(255,220,120,0.6)` 
                : `0 0 ${lantern.size * 1.5}px ${lantern.size * 0.8}px rgba(220,150,70,0.3)`,
              filter: 'blur(1px)',
              // 가상 연등은 부처님 뒤(z=1), 내 연등은 부처님 앞 향로 위(z=3)
              zIndex: lantern.isLocal ? 3 : 1 
            }}
          >
            {/* 코어 빛 */}
            <div 
              className="rounded-full bg-white opacity-80"
              style={{ width: lantern.size * 0.4, height: lantern.size * 0.4 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
