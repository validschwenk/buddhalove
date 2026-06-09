'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Language } from './MainTemple';

type Props = { onClose: () => void; language: Language };

/* ── per-slide visual mockups ── */

function ChatVisual() {
  return (
    <div className="relative w-full h-full bg-[#050505] rounded-2xl overflow-hidden flex flex-col">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 25%, rgba(60,30,0,0.8) 0%, transparent 70%)' }} />
      {/* Halo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(255,210,100,0.5) 0%, transparent 70%)', filter: 'blur(12px)' }} />
      {/* Buddha silhouette */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-5xl opacity-50 select-none">🙏</div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      {/* Reply text */}
      <div className="absolute inset-x-4 top-[38%] text-center">
        <p className="text-[#f3e8dd] text-[11px] md:text-xs tracking-[0.15em] uppercase font-light leading-relaxed"
           style={{ textShadow: '0 0 12px rgba(207,166,112,0.9), 0 0 25px rgba(207,166,112,0.5)' }}>
          "Your suffering<br/>becomes your strength."
        </p>
      </div>
      {/* Chat input */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
        <div className="flex-1 bg-black/70 border border-white/20 rounded-full py-2 px-3">
          <span className="text-white/30 text-[9px]">What burdens your mind today?</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-[#cfa670]/20 border border-[#cfa670]/30 flex items-center justify-center flex-shrink-0">
          <div className="w-2 h-2 border-r-2 border-t-2 border-[#cfa670] rotate-45 -translate-x-px" />
        </div>
      </div>
    </div>
  );
}

function SaveVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center gap-4">
      {/* Phone frame */}
      <div className="w-28 h-52 border-2 border-white/20 rounded-[18px] overflow-hidden bg-[#050505] relative shadow-2xl flex-shrink-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(207,166,112,0.25) 0%, transparent 65%)' }} />
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-2 w-full">
          <p className="text-[#f3e8dd] text-[7px] tracking-widest uppercase font-light leading-relaxed"
             style={{ textShadow: '0 0 6px rgba(207,166,112,0.9)' }}>
            "Silence<br/>is the<br/>answer."
          </p>
        </div>
        <div className="absolute bottom-3 left-0 right-0 text-center flex flex-col gap-0.5">
          <div className="text-[#cfa670]/60 text-[5px] tracking-widest">@buddhashareslove</div>
          <div className="text-white/20 text-[4px] tracking-widest">buddhashareslove.vercel.app</div>
        </div>
      </div>
      {/* Arrows & buttons */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 border border-[#cfa670]/50 rounded-full bg-black/60">
          <Download size={9} className="text-[#cfa670]" />
          <span className="text-[#cfa670] text-[9px] tracking-widest uppercase">Save</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 border border-[#cfa670]/50 rounded-full bg-black/60">
          <span className="text-[9px]">🙏</span>
          <span className="text-[#cfa670] text-[9px] tracking-widest uppercase">Share</span>
        </div>
      </div>
    </div>
  );
}

function ScrollVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Scroll body */}
      <div className="w-[72%] h-[85%] rounded-lg overflow-hidden relative shadow-xl"
           style={{ backgroundImage: "url('/scroll.webp')", backgroundSize: '100% 100%' }}>
        <div className="absolute inset-x-[10%] top-[18%] flex flex-col gap-2">
          <p className="text-[#3e2723] text-[9px] tracking-[0.2em] uppercase font-bold text-center font-serif">
            Wisdom Scroll
          </p>
          <div className="border-b border-[#3e2723]/20 mb-1" />
          {[
            '"I feel lost" → The path reveals itself in stillness.',
            '"I am afraid" → Fear dissolves in the light of presence.',
          ].map((t, i) => (
            <div key={i} className="bg-white/20 rounded p-1.5 border border-[#3e2723]/10">
              <p className="text-[#3e2723] text-[7px] leading-relaxed font-serif">{t}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Roller */}
      <div className="absolute bottom-1 left-[14%] right-[14%] h-4 rounded-full"
           style={{ backgroundImage: "url('/scroll-bar.webp')", backgroundSize: '100% 100%' }} />
    </div>
  );
}

function LanternVisual() {
  const lanterns = [
    { x: '20%', y: '15%', size: 'text-3xl', delay: '0s' },
    { x: '55%', y: '8%',  size: 'text-2xl', delay: '0.3s' },
    { x: '75%', y: '22%', size: 'text-xl',  delay: '0.15s' },
    { x: '38%', y: '30%', size: 'text-2xl', delay: '0.5s' },
    { x: '12%', y: '40%', size: 'text-xl',  delay: '0.7s' },
    { x: '65%', y: '42%', size: 'text-3xl', delay: '0.2s' },
  ];
  return (
    <div className="relative w-full h-full bg-[#050505] rounded-2xl overflow-hidden"
         style={{ background: 'radial-gradient(ellipse at 50% 60%, #0a0510 0%, #050505 100%)' }}>
      {lanterns.map((l, i) => (
        <div key={i} className={`absolute ${l.size} select-none`}
             style={{
               left: l.x, top: l.y,
               animation: `float 3s ease-in-out infinite`,
               animationDelay: l.delay,
               filter: 'drop-shadow(0 0 8px rgba(255,180,50,0.6))'
             }}>
          🏮
        </div>
      ))}
      {/* Glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16"
           style={{ background: 'linear-gradient(to top, rgba(207,100,30,0.15), transparent)' }} />
      {/* Chat input hint */}
      <div className="absolute bottom-3 left-3 right-3 bg-black/60 border border-white/10 rounded-full py-1.5 px-3 text-center">
        <span className="text-white/40 text-[9px] tracking-widest">Send a message → light a lantern</span>
      </div>
    </div>
  );
}

function OfferingsVisual() {
  const items = [
    { icon: '🕯️', name: 'Light an Incense', price: '~$1' },
    { icon: '🪷', name: 'Offer a Lotus',    price: '~$3' },
    { icon: '🏮', name: 'Hang a Lantern',   price: '~$5' },
    { icon: '🙏', name: 'Heartfelt Offering', price: 'Any' },
  ];
  return (
    <div className="relative w-full h-full bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#cfa670]/20 p-3"
         style={{ background: 'radial-gradient(circle at top, rgba(207,166,112,0.07) 0%, transparent 60%)' }}>
      <p className="text-[#f3e8dd] text-[10px] tracking-[0.2em] uppercase text-center mb-2 font-light">Offerings</p>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.name}
               className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-black/40 border border-[#cfa670]/20">
            <div className="flex items-center gap-2">
              <span className="text-sm">{item.icon}</span>
              <span className="text-[#f3e8dd] text-[9px] font-light">{item.name}</span>
            </div>
            <span className="text-[#cfa670] text-[9px] tracking-widest">{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlsVisual() {
  return (
    <div className="relative w-full h-full bg-[#050505] rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-5">
      {/* Wisdom scroll button */}
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-white/30 text-[8px] tracking-widest uppercase">Top Center</p>
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
          <span className="text-xs">📜</span>
          <span className="text-white/60 text-[10px] tracking-widest uppercase">Wisdom</span>
        </div>
      </div>
      {/* Top right controls */}
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-white/30 text-[8px] tracking-widest uppercase">Top Right</p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="px-3 py-1 rounded-full border border-[#cfa670]/40 bg-black/30 text-[#cfa670] text-[9px] tracking-widest">
            Offerings
          </div>
          <div className="flex bg-black/40 rounded-full p-0.5 border border-white/10 gap-0.5">
            {['EN', 'हिं', '中'].map((l, i) => (
              <div key={l} className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${i === 0 ? 'bg-[#cfa670]/30 text-[#cfa670]' : 'text-white/40'}`}>{l}</div>
            ))}
          </div>
          <div className="p-1.5 rounded-full border border-white/10 bg-black/30 text-white/60">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function DailyVisual() {
  return (
    <div className="relative w-full h-full bg-[#050505] rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0505] to-[#050505]" />
      {/* Scroll down hint */}
      <div className="relative flex flex-col items-center gap-1 opacity-60">
        <div className="w-px h-6 bg-white/30" />
        <div className="w-2 h-2 border-r border-b border-white/40 rotate-45" />
        <span className="text-white/40 text-[8px] tracking-[0.2em] uppercase mt-1">Scroll</span>
      </div>
      {/* Daily wisdom card */}
      <div className="relative mx-4 p-3 rounded-xl border border-[#cfa670]/20 bg-black/40"
           style={{ background: 'linear-gradient(135deg, rgba(207,166,112,0.07) 0%, rgba(0,0,0,0.5) 100%)' }}>
        <p className="text-[#cfa670] text-[8px] tracking-[0.2em] uppercase mb-1 text-center">Daily Wisdom</p>
        <p className="text-[#f3e8dd]/80 text-[9px] text-center leading-relaxed font-serif italic">
          "Even a small candle<br/>dispels great darkness."
        </p>
      </div>
    </div>
  );
}

/* ── slide definitions ── */

const slides = [
  {
    step: '01',
    titles: { en: 'Ask Buddha Anything', hi: 'बुद्ध से कुछ भी पूछें', zh: '向佛陀提问' },
    descs: {
      en: 'Type any worry, question, or feeling into the chat bar at the bottom of the screen. Buddha will respond with ancient wisdom personalized for you.',
      hi: 'स्क्रीन के नीचे चैट बार में अपनी कोई भी चिंता, प्रश्न या भावना टाइप करें। बुद्ध आपके लिए ज्ञान देंगे।',
      zh: '在屏幕底部的聊天栏输入任何烦恼、疑问或感受，佛陀将以专属于你的古老智慧回应。'
    },
    visual: <ChatVisual />,
  },
  {
    step: '02',
    titles: { en: 'Save & Share Wisdom', hi: 'ज्ञान सहेजें और साझा करें', zh: '保存与分享智慧' },
    descs: {
      en: 'After receiving a reply, tap "Save Wisdom" to download a beautiful shareable image. Tap "Share Wisdom" 🙏 to add it to the community scroll.',
      hi: 'उत्तर मिलने के बाद "Save Wisdom" दबाएं। एक सुंदर छवि डाउनलोड होगी। 🙏 से समुदाय के साथ साझा करें।',
      zh: '收到回复后，点击"Save Wisdom"下载精美分享图片，点击🙏将其分享到社区卷轴。'
    },
    visual: <SaveVisual />,
  },
  {
    step: '03',
    titles: { en: 'Wisdom Scroll 📜', hi: 'ज्ञान पट्टिका 📜', zh: '智慧画卷 📜' },
    descs: {
      en: 'Tap the 📜 Wisdom button at the top center to open the community scroll — a living collection of questions and Buddha\'s answers shared by seekers worldwide.',
      hi: 'ऊपर केंद्र में 📜 बटन दबाएं। दुनिया भर के साधकों के प्रश्न और बुद्ध के उत्तरों का संग्रह देखें।',
      zh: '点击顶部中央的📜按钮，打开社区卷轴——浏览来自世界各地求道者与佛陀智慧的汇集。'
    },
    visual: <ScrollVisual />,
  },
  {
    step: '04',
    titles: { en: 'Light a Lantern 🏮', hi: 'एक लालटेन जलाएं 🏮', zh: '点亮灯笼 🏮' },
    descs: {
      en: 'Every message you send releases a glowing lantern into the night sky. Watch as your prayer joins the lights of seekers around the world.',
      hi: 'आपका हर संदेश रात के आकाश में एक चमकता लालटेन उड़ाता है। दुनिया भर के साधकों की रोशनी के साथ जुड़ें।',
      zh: '你发送的每条消息都会在夜空中放飞一盏发光的灯笼，与世界各地求道者的心灯汇聚。'
    },
    visual: <LanternVisual />,
  },
  {
    step: '05',
    titles: { en: 'Make an Offering', hi: 'भेंट चढ़ाएं', zh: '虔诚供奉' },
    descs: {
      en: 'Tap "Offerings" in the top right to support the temple. Choose from incense, lotus, lantern, or a heartfelt offering of any amount via card or crypto.',
      hi: 'ऊपर दाईं ओर "Offerings" दबाएं। कार्ड या क्रिप्टो से धूप, कमल, लालटेन या कोई भी भेंट चढ़ाएं।',
      zh: '点击右上角"供奉"，通过卡片或加密货币，以香烛、莲花、灯笼或任意金额表达虔诚。'
    },
    visual: <OfferingsVisual />,
  },
  {
    step: '06',
    titles: { en: 'Daily Wisdom', hi: 'दैनिक ज्ञान', zh: '每日智慧' },
    descs: {
      en: 'Scroll down past the main screen to find today\'s hand-picked wisdom. A new teaching appears each day for quiet reflection.',
      hi: 'मुख्य स्क्रीन के नीचे स्क्रॉल करें। हर दिन एक नई शिक्षा शांत चिंतन के लिए प्रकट होती है।',
      zh: '向下滚动主屏幕，发现今日精选智慧。每天更新一则教义，供你静心思考。'
    },
    visual: <DailyVisual />,
  },
  {
    step: '07',
    titles: { en: 'Language & Sound', hi: 'भाषा और ध्वनि', zh: '语言与音效' },
    descs: {
      en: 'Switch between English, Hindi, and Chinese using the language buttons. Toggle the temple ambient sounds on or off with the volume button — all in the top right.',
      hi: 'भाषा बटन से English, Hindi या Chinese चुनें। वॉल्यूम बटन से मंदिर की ध्वनि चालू/बंद करें।',
      zh: '使用语言按钮切换中文、英文或印地语。点击音量按钮开关寺庙环境音——均在右上角。'
    },
    visual: <ControlsVisual />,
  },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function GuideModal({ onClose, language }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (idx: number) => {
    if (idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };
  const next = () => { if (current < slides.length - 1) goTo(current + 1); };
  const prev = () => { if (current > 0) goTo(current - 1); };

  const slide = slides[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-sm md:max-w-md bg-[#0a0a0a] border border-white/10 rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '90dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[#cfa670]/50 text-[10px] font-mono tracking-widest">{slide.step} / {String(slides.length).padStart(2,'0')}</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/30 hover:text-white/70 rounded-full hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Visual area */}
        <div className="relative mx-4 overflow-hidden rounded-2xl" style={{ height: '40vw', maxHeight: 220, minHeight: 160 }}>
          <AnimatePresence custom={direction} mode="popLayout">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) next();
                else if (info.offset.x > 60) prev();
              }}
            >
              {slide.visual}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text */}
        <div className="px-5 pt-4 pb-2 min-h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current + 'text'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-[#f3e8dd] text-base font-light tracking-wide mb-2">
                {slide.titles[language]}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed font-light">
                {slide.descs[language]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 rounded-full border border-white/10 text-white/40 hover:text-white/80 hover:border-white/30 disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all ${i === current ? 'w-4 h-1.5 bg-[#cfa670]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>

          <button
            onClick={current === slides.length - 1 ? onClose : next}
            className="p-2 rounded-full border border-[#cfa670]/30 text-[#cfa670] hover:border-[#cfa670]/70 hover:bg-[#cfa670]/10 transition-colors"
          >
            {current === slides.length - 1 ? <X size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </motion.div>
  );
}
