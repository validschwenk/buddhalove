import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, X, Coffee, Bitcoin } from 'lucide-react';
import { Language } from './MainTemple';

type DonationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
};

const texts = {
  en: {
    title: "Offerings",
    fiatTab: "Ko-fi / PayPal",
    cryptoTab: "Crypto",
    fiatDesc: "Support our temple by lighting an incense on Ko-fi.",
    fiatButton: "Light an Incense (Ko-fi)",
    cryptoDesc: "Send USDT or USDC via TRC-20 network.",
    cryptoButton: "I Have Made the Offering"
  },
  hi: {
    title: "भेंट",
    fiatTab: "Ko-fi / PayPal",
    cryptoTab: "Crypto",
    fiatDesc: "Ko-fi पर एक धूप जलाकर हमारे मंदिर का समर्थन करें।",
    fiatButton: "धूप जलाएं (Ko-fi)",
    cryptoDesc: "TRC-20 नेटवर्क के माध्यम से USDT या USDC भेजें।",
    cryptoButton: "मैंने भेंट चढ़ा दी है"
  },
  zh: {
    title: "供奉",
    fiatTab: "Ko-fi / PayPal",
    cryptoTab: "加密货币",
    fiatDesc: "在 Ko-fi 上点燃一炷香，支持我们的寺庙。",
    fiatButton: "点燃一炷香 (Ko-fi)",
    cryptoDesc: "请通过 TRC-20 网络发送 USDT 或 USDC。",
    cryptoButton: "我已完成供奉"
  }
};

export default function DonationModal({ isOpen, onClose, language }: DonationModalProps) {
  const [copied, setCopied] = useState(false);
  const [method, setMethod] = useState<'fiat'|'crypto'>('fiat');

  const walletAddress = "TJKjTUCLGqejaQbdT4abAahfTc6nmFfYiT";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayPalClick = () => {
    window.open('https://ko-fi.com/buddhashareslove', '_blank');
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

              {/* Tabs */}
              <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 mb-8 w-full relative z-20">
                <button 
                  onClick={() => setMethod('fiat')}
                  className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 rounded-lg transition-all ${method === 'fiat' ? 'bg-[#cfa670]/20 text-[#cfa670]' : 'text-white/40 hover:text-white/80'}`}
                >
                  <Coffee size={16} />
                  {t.fiatTab}
                </button>
                <button 
                  onClick={() => setMethod('crypto')}
                  className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 rounded-lg transition-all ${method === 'crypto' ? 'bg-[#cfa670]/20 text-[#cfa670]' : 'text-white/40 hover:text-white/80'}`}
                >
                  <Bitcoin size={16} />
                  {t.cryptoTab}
                </button>
              </div>
              
              <div className="flex flex-col items-center w-full">
                {method === 'fiat' ? (
                  <motion.div 
                    key="fiat"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-center w-full"
                  >
                    <p className="text-sm text-center text-white/60 mb-8 font-light font-sans">
                      {t.fiatDesc}
                    </p>
                    
                    <button
                      onClick={handlePayPalClick}
                      className="w-full py-4 rounded-full bg-[#cfa670] text-black font-semibold tracking-[0.1em] uppercase hover:bg-[#e6c88e] transition-all font-sans shadow-[0_0_20px_rgba(207,166,112,0.3)] mb-4"
                    >
                      {t.fiatButton}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="crypto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-center w-full"
                  >
                    <p className="text-sm text-center text-white/60 mb-6 font-light font-sans">
                      {t.cryptoDesc}
                    </p>
                    
                    <div className="bg-white p-3 rounded-2xl mb-6 shadow-[0_0_30px_rgba(207,166,112,0.15)]">
                      <QRCodeSVG 
                        value={walletAddress}
                        size={160}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"L"}
                        marginSize={1}
                      />
                    </div>

                    <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between mb-8">
                      <span className="text-white/80 font-mono text-xs truncate mr-4">
                        {walletAddress}
                      </span>
                      <button 
                        onClick={copyAddress}
                        className="p-2 bg-white/5 hover:bg-white/10 text-[#cfa670] rounded-lg transition-colors flex-shrink-0"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-4 rounded-full border border-[#cfa670]/50 text-[#cfa670] font-medium tracking-[0.1em] uppercase hover:bg-[#cfa670]/10 transition-all font-sans"
                    >
                      {t.cryptoButton}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
