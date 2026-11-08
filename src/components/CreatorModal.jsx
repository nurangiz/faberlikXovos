import React, { useEffect } from 'react';
import { X, Phone, Send, Sparkles, Heart, Check, Copy } from 'lucide-react';
import creatorSignature from '../assets/creator-signature.jpg';

// Elegant SVG Instagram icon
const InstagramIcon = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function CreatorModal({ isOpen, onClose, onOpenAdmin }) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('+998955682010');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Luxury Red Card */}
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-[#cf102d] to-rose-900 text-white shadow-2xl shadow-rose-950/60 border border-white/20 p-6 sm:p-8 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Yopish"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className="relative z-10 text-center space-y-6">
          
          {/* Creator Signature Emblem */}
          <div className="inline-block relative">
            <div className="p-3 bg-white/95 rounded-2xl shadow-lg shadow-black/20 backdrop-blur-md inline-flex items-center justify-center mx-auto">
              <img 
                src={creatorSignature} 
                alt="Nurangiz Nurullayeva Signature" 
                className="h-14 sm:h-16 w-auto object-contain filter contrast-125"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-full p-1 shadow-md">
              <Sparkles className="w-4 h-4 fill-slate-900" />
            </div>
          </div>

          {/* Badge & Creator Name */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-rose-100 text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sayt Yaratuvchisi</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white drop-shadow-md leading-tight">
              NURULLAYEVA NURANGIZ <br />
              <span className="text-amber-200 font-extrabold">NURBEK QIZI</span>
            </h2>

            <p className="text-xs sm:text-sm text-rose-100/90 font-medium">
              Faberlic Ayollar va Qizlar Akademiyasi Muallifi & Dasturchisi
            </p>
          </div>

          {/* Grateful Warm Message */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5 shadow-inner">
            <div className="flex items-center justify-center gap-1.5 text-amber-200 font-bold text-sm">
              <Heart className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Samimiy Minnatdorchilik</span>
            </div>
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
              Biz bilan ishlaganingizdan juda ham xursandmiz! Har bir ayol va qiz o'z biznesini erkin va muvaffaqiyatli yurita olishi biz uchun eng katta faxrdir.
            </p>
          </div>

          {/* Contact Details (Murojaat uchun) */}
          <div className="space-y-3 text-left">
            <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider text-center">
              Murojaat va hamkorlik uchun:
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Phone */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm transition">
                <a 
                  href="tel:+998955682010" 
                  className="flex items-center gap-3 text-white text-xs sm:text-sm font-semibold hover:text-amber-200 transition flex-1"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-[10px] text-rose-200">Telefon raqam</div>
                    <div className="font-bold">+998 (95) 568-20-10</div>
                  </div>
                </a>
                <button
                  onClick={handleCopyPhone}
                  className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white transition flex items-center gap-1"
                  title="Nusxalash"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Nusxalandi" : "Nusxalash"}</span>
                </button>
              </div>

              {/* Telegram */}
              <a 
                href="https://t.me/nur080910" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm text-white hover:text-amber-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/30 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4 text-sky-200" />
                  </div>
                  <div>
                    <div className="text-[10px] text-rose-200">Telegram</div>
                    <div className="text-xs sm:text-sm font-bold">@nur080910</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-white/15 group-hover:bg-white/25 transition">
                  Bog'lanish ↗
                </span>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com/nurullayeva_nurangiz" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm text-white hover:text-amber-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/30 flex items-center justify-center shrink-0">
                    <InstagramIcon className="w-4 h-4 text-pink-200" />
                  </div>
                  <div>
                    <div className="text-[10px] text-rose-200">Instagram</div>
                    <div className="text-xs sm:text-sm font-bold">@nurullayeva_nurangiz</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-white/15 group-hover:bg-white/25 transition">
                  Kuzatish ↗
                </span>
              </a>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenAdmin?.();
              }}
              className="text-[11px] text-white/60 hover:text-amber-200 transition font-medium flex items-center gap-1"
            >
              <span>🔐 Boshqaruv (Admin)</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-white text-faberlic-800 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-lg shadow-black/20 transition active:scale-98"
            >
              Yopish
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}