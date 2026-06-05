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
    fiatTab: "Card / PayPal",
    cryptoTab: "Crypto",
    fiatDesc: "Select an offering. You will be redirected to complete the payment.",
    offerings: [
      { id: 1, icon: '🕯️', name: 'Light an Incense', price: '~$3' },
      { id: 2, icon: '🪷', name: 'Offer a Lotus', price: '~$5' },
      { id: 3, icon: '🏮', name: 'Hang a Lantern', price: '~$10' }
    ],
    cryptoDesc: "Send USDT or USDC via TRC-20 network.",
    cryptoButton: "I Have Made the Offering"
  },
  hi: {
    title: "भेंट",
    fiatTab: "Card / PayPal",
    cryptoTab: "Crypto",
    fiatDesc: "एक भेंट चुनें। आपको भुगतान पूरा करने के लिए अनुप्रेषित किया जाएगा।",
    offerings: [
      { id: 1, icon: '🕯️', name: 'धूप जलाएं', price: '~$3' },
      { id: 2, icon: '🪷', name: 'कमल चढ़ाएं', price: '~$5' },
      { id: 3, icon: '🏮', name: 'लालटेन टांगें', price: '~$10' }
    ],
    cryptoDesc: "TRC-20 नेटवर्क के माध्यम से USDT या USDC भेजें।",
    cryptoButton: "मैंने भेंट चढ़ा दी है"
  },
  zh: {
    title: "供奉",
    fiatTab: "Card / PayPal",
    cryptoTab: "加密货币",
    fiatDesc: "请选择一项供奉。您将被重定向以完成支付。",
    offerings: [
      { id: 1, icon: '🕯️', name: '点燃一炷香', price: '~$3' },
      { id: 2, icon: '🪷', name: '供奉一朵莲花', price: '~$5' },
      { id: 3, icon: '🏮', name: '挂一盏明灯', price: '~$10' }
    ],
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

  const handleFiatClick = () => {
    // Buy Me a Coffee link
    window.open('https://buymeacoffee.com/buddhashareslove', '_blank');
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
              <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 mb-6 w-full relative z-20">
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
              
              <div className="flex flex-col items-center w-full min-h-[250px]">
                {method === 'fiat' ? (
                  <motion.div 
                    key="fiat"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-center w-full"
                  >
                    <p className="text-sm text-center text-white/60 mb-6 font-light font-sans">
                      {t.fiatDesc}
                    </p>
                    
                    <div className="w-full flex flex-col gap-3">
                      {t.offerings.map((offering) => (
                        <button
                          key={offering.id}
                          onClick={handleFiatClick}
                          className="w-full flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-[#cfa670]/30 hover:border-[#cfa670]/80 hover:bg-[#cfa670]/10 transition-all group shadow-[0_0_15px_rgba(207,166,112,0.05)] hover:shadow-[0_0_20px_rgba(207,166,112,0.2)]"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{offering.icon}</span>
                            <span className="text-[#f3e8dd] font-light tracking-wide">{offering.name}</span>
                          </div>
                          <span className="text-[#cfa670] font-medium tracking-widest">{offering.price}</span>
                        </button>
                      ))}
                    </div>
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
                        size={150}
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
