import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, X } from 'lucide-react';
import { Language } from './MainTemple';

type DonationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
};

const texts = {
  en: {
    title: "Offerings",
    desc: "Send USDT or USDC via TRC-20 network to the address below.",
    button: "I Have Made the Offering"
  },
  hi: {
    title: "भेंट",
    desc: "नीचे दिए गए पते पर TRC-20 नेटवर्क के माध्यम से USDT या USDC भेजें।",
    button: "मैंने भेंट चढ़ा दी है"
  },
  zh: {
    title: "供奉",
    desc: "请通过 TRC-20 网络将 USDT 或 USDC 发送至下方地址。",
    button: "我已完成供奉"
  }
};

export default function DonationModal({ isOpen, onClose, language }: DonationModalProps) {
  const [copied, setCopied] = useState(false);

  // Real USDT (TRC-20) address for receiving offerings
  const walletAddress = "TJKjTUCLGqejaQbdT4abAahfTc6nmFfYiT";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = texts[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md cursor-pointer"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-md p-6 md:p-8 overflow-hidden bg-[#0A0A0A] border border-[#cfa670]/30 rounded-3xl shadow-[0_0_50px_rgba(207,166,112,0.1)] cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Background subtle glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle at top, rgba(207,166,112,0.1) 0%, transparent 70%)' }} />

            <div className="relative z-10 flex flex-col h-full items-center">
              <h2 className={`text-2xl font-light text-center uppercase tracking-[0.2em] text-[#f3e8dd] mb-6 ${language === 'en' ? 'font-serif' : 'font-sans'}`}>
                {t.title}
              </h2>
              
              <div className="flex flex-col items-center w-full">
                <p className="text-sm text-center text-white/60 mb-6 font-light font-sans">
                  {language === 'en' ? (
                    <>Send <span className="text-[#cfa670] font-medium">USDT</span> or <span className="text-[#cfa670] font-medium">USDC</span> via <span className="text-white">TRC-20</span> network to the address below.</>
                  ) : (
                    t.desc
                  )}
                </p>
                
                <div className="bg-white p-3 rounded-2xl mb-6 shadow-[0_0_30px_rgba(207,166,112,0.15)]">
                  <QRCodeSVG 
                    value={walletAddress}
                    size={180}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    marginSize={1}
                  />
                </div>

                <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between mb-8">
                  <span className="text-white/80 font-mono text-sm truncate mr-4">
                    {walletAddress}
                  </span>
                  <button 
                    onClick={copyAddress}
                    className="p-2 bg-white/5 hover:bg-white/10 text-[#cfa670] rounded-lg transition-colors flex-shrink-0"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-full border border-[#cfa670]/50 text-[#cfa670] font-medium tracking-[0.1em] uppercase hover:bg-[#cfa670]/10 transition-all font-sans"
                >
                  {t.button}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
