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

const shareTexts = {
  en: "Share Wisdom",
  hi: "ज्ञान साझा करें",
  zh: "分享智慧"
};

type VerseResponse = {
  intro: string;
  text: string;
  citation: string;
};

export default function ZenChatUI({ onReplyChange, language, onMessageSent }: ZenChatUIProps) {
  const [userQuery, setUserQuery] = useState<string | null>(null);
  const [verseResponse, setVerseResponse] = useState<VerseResponse | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const smoothScrollToTop = () => {
    const startY = window.scrollY;
    if (startY === 0) return;
    const duration = 700;
    const startTime = performance.now();
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY * (1 - easeOutQuart(progress)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);
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
      onReplyChange(!!verseResponse);
    }
  }, [verseResponse, onReplyChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    // Dismiss keyboard and scroll to top so Buddha image is visible
    inputRef.current?.blur();
    smoothScrollToTop();

    onMessageSent?.();

    setUserQuery(input.trim());
    setVerseResponse(null);
    setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim(), language })
      });
      const data = await res.json();

      if (data.verse) {
        setVerseResponse({
          intro: data.intro || '',
          text: data.verse.text,
          citation: data.verse.citation,
        });
      } else {
        // No-API-key diagnostic path: show the message itself, no fabricated citation.
        setVerseResponse({ intro: '', text: data.intro || '', citation: '' });
      }
    } catch (error) {
      console.error(error);
      const fallbackMsg = language === 'hi' ? "मौन ही सबसे अच्छा उत्तर है। कृपया पुनः प्रयास करें।" : language === 'zh' ? "沉默便是答案。请重试。" : "Even silence is an answer. Please try again.";
      setVerseResponse({ intro: '', text: fallbackMsg, citation: '' });
    } finally {
      setIsThinking(false);
    }
  };

  const generateCanvasImage = async (): Promise<string> => {
    const verse = verseResponse; // stable snapshot for narrowing inside the closure below
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
        ctx.globalAlpha = 0.9;
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
        if (verse) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const cx = width / 2;
          const cy = height * 0.4; // Perfectly positioned behind Buddha's chest
          const radius = 800; // Expanded to emulate heavy CSS blur
          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
          gradient.addColorStop(0, 'rgba(255, 230, 150, 0.9)');
          gradient.addColorStop(0.2, 'rgba(255, 200, 100, 0.6)');
          gradient.addColorStop(0.5, 'rgba(220, 150, 70, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
          ctx.restore();
        }

        // 3. Buddha
        const buddhaImg = await loadImage(imagesBase64.buddha || '/onlybuddha.webp');
        ctx.globalAlpha = 0.95;
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
        // Limits darkening to bottom 70% to keep Buddha's face bright
        const overlayGrad = ctx.createLinearGradient(0, height, 0, height * 0.3);
        overlayGrad.addColorStop(0, 'rgba(0,0,0,1)');
        overlayGrad.addColorStop(0.5, 'rgba(0,0,0,0.6)');
        overlayGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = overlayGrad;
        ctx.fillRect(0, 0, width, height);

        // 5. Native Canvas Soft Smoke
        if (verse) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          
          const sX = width / 2;
          // Moved down by 40px so the converging point hides behind the burner
          const sY = (height * 0.813) + 40; 
          
          const strokeGrad = ctx.createLinearGradient(0, sY, 0, sY - 800);
          // Fast fade-in so it connects directly to the sticks, then fades out slowly
          strokeGrad.addColorStop(0, 'rgba(255,255,255,0)');
          strokeGrad.addColorStop(0.02, 'rgba(255,255,255,0.4)'); 
          strokeGrad.addColorStop(0.3, 'rgba(255,255,255,0.2)');
          strokeGrad.addColorStop(1, 'rgba(255,255,255,0)');

          ctx.shadowColor = 'rgba(255,255,255,0.8)';
          ctx.shadowBlur = 40;
          ctx.lineCap = 'round';
          ctx.strokeStyle = strokeGrad;
          
          const drawSmokePath = (startX: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number, endX: number, endY: number, lineWidth: number) => {
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(startX, sY);
            ctx.bezierCurveTo(startX + cp1x, sY - cp1y, startX + cp2x, sY - cp2y, startX + endX, sY - endY);
            ctx.stroke();
            ctx.stroke(); // Double stroke for intense core glow
          };

          // Spread out origins to mimic 3 separate incense sticks, and use thinner lines
          drawSmokePath(sX - 15, -80, 200, 60, 500, 0, 800, 8);
          drawSmokePath(sX + 15, 60, 150, -70, 400, 20, 750, 6);
          drawSmokePath(sX, -30, 250, 80, 550, 0, 850, 5);
          drawSmokePath(sX, 40, 300, -40, 600, -10, 700, 10);

          const colGrad = ctx.createLinearGradient(0, sY, 0, sY - 600);
          colGrad.addColorStop(0, 'rgba(255,255,255,0)');
          colGrad.addColorStop(0.05, 'rgba(255,255,255,0.25)');
          colGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = colGrad;
          ctx.shadowBlur = 0;
          ctx.fillRect(sX - 40, sY - 600, 80, 600);

          ctx.restore();
        }

        // 6. Burner (Drawn after smoke to cover the smoke origin)
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.4; // Slightly increased opacity for better visibility
        const burnerImg = await loadImage(imagesBase64.burner || '/burner.png');
        const buWidth = 240;
        const buHeight = burnerImg.height * (buWidth / burnerImg.width);
        const buX = width / 2 - buWidth / 2;
        const buY = (height * 0.813) - (buHeight * 0.2); 
        ctx.drawImage(burnerImg, buX, buY, buWidth, buHeight);
        ctx.restore();

        // 7. Text (Verse quote + citation)
        if (verse) {
          ctx.save();
          const tcx = width / 2;
          const tcy = height * 0.42; // Raised up towards the chest

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '300 40px "Cinzel", "Noto Serif KR", serif';
          (ctx as any).letterSpacing = "8px";

          const maxWidth = width - 160;
          const words = verse.text.toUpperCase().split(' ');
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

          // Accurately replicate CSS radial-gradient inside div
          const boxPaddingX = 80;
          const boxPaddingY = 50;
          let longestLineWidth = 0;
          for (let i = 0; i < lines.length; i++) {
             const w = ctx.measureText(lines[i]).width;
             if (w > longestLineWidth) longestLineWidth = w;
          }
          const boxW = Math.min(longestLineWidth + (boxPaddingX * 2), width - 60);
          const citationLineHeight = 36;
          const citationExtraH = verse.citation ? citationLineHeight + 10 : 0;
          const boxH = (lines.length * lineHeight) + (boxPaddingY * 2) + citationExtraH;
          const boxX = tcx - boxW / 2;
          const boxY = startY - (lineHeight / 2) - boxPaddingY;
          
          ctx.save();
          // CSS exact radius for radial-gradient(circle) is the distance to the farthest corner
          const radius = Math.sqrt(Math.pow(boxW / 2, 2) + Math.pow(boxH / 2, 2));
          
          const tgrad = ctx.createRadialGradient(tcx, tcy, 0, tcx, tcy, radius);
          tgrad.addColorStop(0, 'rgba(0,0,0,0.85)');
          tgrad.addColorStop(0.5, 'rgba(0,0,0,0.6)');
          tgrad.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = tgrad;
          ctx.fillRect(boxX, boxY, boxW, boxH);
          ctx.restore();

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // 1. Outer Golden Glow
            ctx.shadowColor = 'rgba(207,166,112,0.6)';
            ctx.shadowBlur = 40;
            ctx.fillStyle = 'rgba(207,166,112,0.1)'; 
            ctx.fillText(line, tcx, startY + (i * lineHeight));
            ctx.fillText(line, tcx, startY + (i * lineHeight));
            
            // 2. Inner Black Core Shadow
            ctx.shadowColor = 'rgba(0,0,0,1)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = 'rgba(0,0,0,0.1)'; 
            ctx.fillText(line, tcx, startY + (i * lineHeight));
            ctx.fillText(line, tcx, startY + (i * lineHeight));
            
            // 3. Bright Text
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#f3e8dd';
            ctx.fillText(line, tcx, startY + (i * lineHeight));
          }

          // Citation — subtle, muted gold, italic, below the quote
          if (verse.citation) {
            const citationY = startY + ((lines.length - 1) * lineHeight) + (lineHeight / 2) + citationLineHeight;
            ctx.font = 'italic 300 22px "Cinzel", "Noto Serif KR", serif';
            (ctx as any).letterSpacing = "2px";
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = 'rgba(207,166,112,0.7)';
            ctx.fillText(verse.citation.toUpperCase(), tcx, citationY);
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

  const handleShare = async () => {
    if (isSharing || isShared || !userQuery || !verseResponse?.text) return;
    setIsSharing(true);
    try {
      // No "citation" column exists in shared_wisdom yet, so the attribution travels
      // inline with the verse text rather than as fabricated/missing data.
      const answer = verseResponse.citation
        ? `${verseResponse.text} — ${verseResponse.citation}`
        : verseResponse.text;

      const res = await fetch('/api/share-wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQuery,
          answer,
          language
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsShared(true);
      } else {
        alert(data.error || 'Failed to share. Maybe inappropriate content?');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while sharing.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">

      {/* 1. 중앙: 부처님의 답변 텍스트 — flex-1로 남는 공간만 차지하고, 넘치면 스크롤되어 입력창과 절대 겹치지 않음 */}
      <div className="flex-1 min-h-0 flex flex-col items-center overflow-y-auto pointer-events-auto pt-[19vh] sm:pt-[25vh] md:pt-[30vh] pb-4">

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
            
            {verseResponse && !isThinking && (
              <motion.div
                key={verseResponse.text}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                {/* Intro — small, lighter, compassionate bridging line */}
                {verseResponse.intro && (
                  <div className="text-xs md:text-sm text-white/60 text-center font-light italic tracking-wide px-8 mb-1.5 sm:mb-3 max-w-xl">
                    {verseResponse.intro}
                  </div>
                )}

                <div
                  className={`text-base sm:text-lg md:text-2xl text-[#f3e8dd] text-center leading-relaxed font-light uppercase tracking-[0.15em] md:tracking-[0.2em] px-8 py-4 sm:py-6 font-serif ${verseResponse.citation ? 'mb-1.5 sm:mb-2' : 'mb-3 sm:mb-6'}`}
                  style={{
                    textShadow: '0 0 10px rgba(0,0,0,1), 0 0 20px rgba(207,166,112,0.8), 0 0 40px rgba(207,166,112,0.5)',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)'
                  }}
                >
                  {verseResponse.text}
                </div>

                {/* Citation — subtle, muted gold, source attribution */}
                {verseResponse.citation && (
                  <div
                    className="text-[10px] md:text-xs text-[#cfa670]/60 text-center italic uppercase tracking-[0.25em] font-light mb-3 sm:mb-6"
                    style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}
                  >
                    {verseResponse.citation}
                  </div>
                )}

                {/* Action Buttons — always side-by-side, compact on mobile to save vertical space */}
                <div className="flex flex-row gap-2 sm:gap-4 mt-2">
                  <button
                    onClick={handleDownload}
                    disabled={isSaving || isSaved}
                    className="pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-3 px-3.5 py-2 sm:px-6 sm:py-3 bg-black/60 hover:bg-black/80 border border-[#cfa670]/40 hover:border-[#cfa670]/80 text-[#cfa670] rounded-full backdrop-blur-md transition-all shadow-[0_0_20px_rgba(207,166,112,0.15)] hover:shadow-[0_0_30px_rgba(207,166,112,0.4)] disabled:opacity-50"
                  >
                    {isSaved ? (
                      <span className="text-[#a3e635] text-sm sm:text-lg leading-none">✓</span>
                    ) : (
                      <Download size={14} className="sm:hidden" />
                    )}
                    {!isSaved && <Download size={18} className="hidden sm:inline" />}
                    <span className={`text-[11px] sm:text-sm font-light uppercase tracking-wide sm:tracking-widest whitespace-nowrap ${isSaved ? 'text-[#a3e635]' : ''}`}>
                      {isSaving ? "Saving..." : isSaved ? "Saved!" : saveTexts[language]}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    disabled={isSharing || isShared}
                    className="pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-3 px-3.5 py-2 sm:px-6 sm:py-3 bg-black/60 hover:bg-black/80 border border-[#cfa670]/40 hover:border-[#cfa670]/80 text-[#cfa670] rounded-full backdrop-blur-md transition-all shadow-[0_0_20px_rgba(207,166,112,0.15)] hover:shadow-[0_0_30px_rgba(207,166,112,0.4)] disabled:opacity-50"
                  >
                    {isShared ? (
                      <span className="text-[#a3e635] text-sm sm:text-lg leading-none">✓</span>
                    ) : (
                      <span className="text-sm sm:text-lg leading-none">🙏</span>
                    )}
                    <span className={`text-[11px] sm:text-sm font-light uppercase tracking-wide sm:tracking-widest whitespace-nowrap ${isShared ? 'text-[#a3e635]' : ''}`}>
                      {isSharing ? "Sharing..." : isShared ? "Shared!" : shareTexts[language]}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. 하단: 사용자의 고민 & 고정된 입력창 — 항상 자기 높이만큼만 차지하므로 위 응답 영역과 겹치지 않음 */}
      <div className="flex-shrink-0 mx-auto w-full max-w-lg pointer-events-auto px-4 pb-[4vh] md:pb-[10vh] flex flex-col justify-end">

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
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[language]}
            onFocus={smoothScrollToTop}
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
