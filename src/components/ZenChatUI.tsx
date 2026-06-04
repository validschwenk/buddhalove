'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
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

  useEffect(() => {
    // Preload images as base64 for native canvas drawing
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

  const generateCanvasImage = async (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Prevent hanging if fonts fail to load
        await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 200))]);
        
        const canvas = document.createElement('canvas');
        const width = 1080;
        const height = 1920;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Failed to get 2d context");

        const loadImage = (src: string): Promise<HTMLImageElement> => {
          return new Promise((res, rej) => {
            const img = new Image();
            // IMPORTANT: Setting crossOrigin on data: URIs blocks onload in Safari
            if (!src.startsWith('data:')) {
              img.crossOrigin = "anonymous";
            }
            img.onload = () => res(img);
            img.onerror = () => rej(new Error("Failed to load image: " + src.substring(0, 50)));
            img.src = src;
          });
        };

        // 1. Draw Background
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);
        
        const bgImg = await loadImage(imagesBase64.bg || '/buddha-web.webp');
        ctx.globalAlpha = 0.8;
        const bgRatio = bgImg.width / bgImg.height;
        const canvasRatio = width / height;
        let drawW = width, drawH = height, drawX = 0, drawY = 0;
        if (bgRatio > canvasRatio) {
          drawW = height * bgRatio;
          drawX = (width - drawW) / 2;
        } else {
          drawH = width / bgRatio;
          drawY = (height - drawH) / 2;
        }
        ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
        ctx.globalAlpha = 1.0;

        // 2. Halo (Radial Gradient)
        if (buddhaReply) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const cx = width / 2;
          const cy = height / 2 - (192 * 2); 
          const radius = 600;
          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
          gradient.addColorStop(0, 'rgba(255, 220, 120, 0.85)');
          gradient.addColorStop(0.45, 'rgba(220, 150, 70, 0.45)');
          gradient.addColorStop(0.75, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
          ctx.restore();
        }

        // 3. Buddha
        const buddhaImg = await loadImage(imagesBase64.buddha || '/onlybuddha.webp');
        ctx.globalAlpha = 0.8;
        let bDrawW = width, bDrawH = height, bDrawX = 0, bDrawY = 0;
        const bRatio = buddhaImg.width / buddhaImg.height;
        if (bRatio > canvasRatio) {
          bDrawW = height * bRatio;
          bDrawX = (width - bDrawW) / 2;
        } else {
          bDrawH = width / bRatio;
          bDrawY = (height - bDrawH) / 2;
        }
        ctx.drawImage(buddhaImg, bDrawX, bDrawY, bDrawW, bDrawH);
        ctx.globalAlpha = 1.0;

        // 4. Dark Overlay (Gradient to top)
        const overlayGrad = ctx.createLinearGradient(0, height, 0, 0);
        overlayGrad.addColorStop(0, 'rgba(0,0,0,1)');
        overlayGrad.addColorStop(0.6, 'rgba(0,0,0,0.6)');
        overlayGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = overlayGrad;
        ctx.fillRect(0, 0, width, height);

        // 5. SVG Smoke
        if (buddhaReply) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = 0.8;
          const smokeSvg = `
            <svg width="300" height="800" viewBox="0 0 150 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="maskGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stop-color="white" />
                  <stop offset="15%" stop-color="white" />
                  <stop offset="90%" stop-color="black" stop-opacity="0" />
                </linearGradient>
                <mask id="fadeMask"><rect width="150" height="400" fill="url(#maskGrad)"/></mask>
              </defs>
              <g mask="url(#fadeMask)">
                <path d="M75 400 Q50 300 90 200 T70 50" fill="none" stroke="white" stroke-width="12" opacity="1" />
                <path d="M75 400 Q95 320 50 180 T85 40" fill="none" stroke="white" stroke-width="10" opacity="0.7" />
                <path d="M75 400 Q65 280 95 150 T75 20" fill="none" stroke="white" stroke-width="8" opacity="0.8" />
                <path d="M75 400 Q100 250 55 120 T80 0" fill="none" stroke="white" stroke-width="6" opacity="0.5" />
              </g>
            </svg>`;
          const smokeImg = await loadImage('data:image/svg+xml;base64,' + btoa(smokeSvg));
          ctx.filter = 'blur(10px)'; 
          const sWidth = 300;
          const sHeight = 800;
          const sX = width / 2 - sWidth / 2;
          const sY = height - (height * 0.187) - sHeight; 
          ctx.drawImage(smokeImg, sX, sY, sWidth, sHeight);
          ctx.restore();
        }

        // 6. Burner
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.25;
        const burnerImg = await loadImage(imagesBase64.burner || '/burner.png');
        const buWidth = 240;
        const buHeight = burnerImg.height * (buWidth / burnerImg.width);
        const buX = width / 2 - buWidth / 2;
        const buY = (height * 0.813) - (buHeight * 0.2); 
        ctx.drawImage(burnerImg, buX, buY, buWidth, buHeight);
        ctx.restore();

        // 7. Text (Buddha Reply)
        if (buddhaReply) {
          ctx.save();
          const tcx = width / 2;
          const tcy = height * 0.28; 
          const trad = 450;
          const tgrad = ctx.createRadialGradient(tcx, tcy, 0, tcx, tcy, trad);
          tgrad.addColorStop(0, 'rgba(0,0,0,0.85)');
          tgrad.addColorStop(0.5, 'rgba(0,0,0,0.6)');
          tgrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = tgrad;
          ctx.fillRect(tcx - trad, tcy - trad, trad * 2, trad * 2);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#f3e8dd';
          ctx.font = '300 40px "Cinzel", "Noto Serif KR", serif';
          (ctx as any).letterSpacing = "8px"; // Modern canvas API

          const maxWidth = width - 160;
          const words = buddhaReply.toUpperCase().split(' ');
          let lines = [];
          let currentLine = words[0];
          for (let i = 1; i < words.length; i++) {
            let word = words[i];
            let mWidth = ctx.measureText(currentLine + " " + word).width;
            if (mWidth < maxWidth) {
              currentLine += " " + word;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          }
          lines.push(currentLine);
          
          let lineHeight = 65;
          let startY = tcy - ((lines.length - 1) * lineHeight) / 2;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Glow
            ctx.shadowColor = 'rgba(207,166,112,0.8)';
            ctx.shadowBlur = 40;
            ctx.fillText(line, tcx, startY + (i * lineHeight));
            ctx.fillText(line, tcx, startY + (i * lineHeight));
            // Core shadow
            ctx.shadowColor = 'rgba(0,0,0,1)';
            ctx.shadowBlur = 10;
            ctx.fillText(line, tcx, startY + (i * lineHeight));
          }
          ctx.restore();
        }

        // 8. Footer (Instagram Logo & URL)
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const fx = width / 2;
        const fy = height - 120;
        
        const instaSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cfa670" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>`;
        const instaImg = await loadImage('data:image/svg+xml;base64,' + btoa(instaSvg));
        
        ctx.font = '300 24px sans-serif';
        (ctx as any).letterSpacing = "1.2px";
        const tWidth = ctx.measureText('@buddhashareslove').width;
        const totalW = 28 + 10 + tWidth;
        const startX = fx - totalW / 2;
        
        ctx.drawImage(instaImg, startX, fy - 20 - 14, 28, 28);
        ctx.fillStyle = 'rgba(207,166,112,0.9)';
        ctx.fillText('@buddhashareslove', startX + 28 + 10 + tWidth/2, fy - 20);
        
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '300 18px sans-serif';
        (ctx as any).letterSpacing = "5.4px";
        ctx.fillText('buddhashareslove.vercel.app', fx, fy + 20);
        ctx.restore();

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleDownload = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      const dataUrl = await generateCanvasImage();
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'buddhas-wisdom.jpg', { type: 'image/jpeg' });
      
      try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'BuddhaLove Wisdom',
          });
        } else {
          const link = document.createElement('a');
          link.download = 'buddhas-wisdom.jpg';
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (shareError) {
        const link = document.createElement('a');
        link.download = 'buddhas-wisdom.jpg';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

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
      
      {/* 1. 중앙: 부처님의 답변 텍스트 */}
      <div className="absolute top-[25vh] md:top-[30vh] left-0 right-0 flex items-center justify-center">
        
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

      {/* 2. 하단: 사용자의 고민 & 고정된 입력창 */}
      <div className="absolute bottom-[4vh] md:bottom-[10vh] left-1/2 -translate-x-1/2 w-full max-w-lg pointer-events-auto px-4 flex flex-col justify-end">
        
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
