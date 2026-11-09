import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Check, Apple, Sparkles, Share2, PlusSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState('android'); // 'android' | 'ios'
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect iOS vs Android
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    setPlatform(isIos ? 'ios' : 'android');

    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Listen for Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.fl_deferredInstallPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.fl_deferredInstallPrompt) {
      setDeferredPrompt(window.fl_deferredInstallPrompt);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const promptEvent = deferredPrompt || window.fl_deferredInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        window.fl_deferredInstallPrompt = null;
        setTimeout(() => onClose(), 1500);
      }
    } else {
      // Fallback instruction
      alert("Ilovani o'rnatish uchun: Brauzer menyusidagi (3 nuqta ⋮) tugmani bosing va 'Ilovani o'rnatish' (yoki 'Bosh ekranga qo'shish') ni tanlang.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 text-slate-800 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow decoration */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-faberlic-600 via-rose-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-faberlic-600/30 font-serif font-black text-2xl relative shrink-0">
            <span>FL</span>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 leading-tight">
                Faberlic Mobil Ilovasi
              </h3>
            </div>
            <p className="text-xs text-rose-700 font-semibold mt-0.5">
              Android va iPhone (iOS) uchun rasmiy PWA
            </p>
          </div>
        </div>

        {/* Platform Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setPlatform('android')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
              platform === 'android'
                ? 'bg-white text-faberlic-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => setPlatform('ios')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
              platform === 'ios'
                ? 'bg-white text-faberlic-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-900" />
            <span>iPhone (iOS)</span>
          </button>
        </div>

        {/* Content based on Platform */}
        {platform === 'android' ? (
          <div className="space-y-4">
            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-faberlic-800">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Google Play'siz to'g'ridan-to'g'ri o'rnatish</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ilova telefoningiz xotirasidan atigi <b>2 MB</b> joy oladi, hech qanday to'lov talab qilmaydi va to'g'ridan-to'g'ri bosh ekranga o'rnatiladi.
              </p>
            </div>

            {/* Android Direct Install Button */}
            <button
              onClick={handleNativeInstall}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-faberlic-700 via-rose-600 to-pink-600 hover:from-faberlic-800 hover:to-rose-700 text-white font-bold text-sm shadow-xl shadow-faberlic-600/30 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Android Telefonimga O'rnatish</span>
            </button>

            {/* Manual Android steps fallback */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                💡 <b>Agar tugma bosilmasa:</b> Chrome brauzeringiz tepasidagi <b>3 nuqta (⋮)</b> tugmasini bosing va <b>"Ilovani o'rnatish"</b> yoki <b>"Bosh ekranga qo'shish"</b> bandini tanlang.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Apple className="w-4 h-4 text-slate-900" />
                <span>iPhone Safari brauzerida 2 bosqichda:</span>
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 text-xs text-slate-700">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-faberlic-700 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <span>Safari pastidagi <b>"Ulashish"</b> (Share) tugmasini bosing:</span>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-800">
                    <Share2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ulashish (Share)</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 text-xs text-slate-700">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-faberlic-700 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <span>Ochilgan menyudan <b>"Bosh ekranga qo'shish"</b> bandini tanlang:</span>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-800">
                    <PlusSquare className="w-3.5 h-3.5 text-slate-700" />
                    <span>На экран «Домой» (Add to Home)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tayyor! Ilova iPhone ekraningizda mustaqil App kabi paydo bo'ladi.</span>
            </div>
          </div>
        )}

        {/* Bottom Feature Badges */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block font-semibold">Hajmi</span>
            <span className="text-xs font-bold text-slate-800">~2 MB</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block font-semibold">Tezlik</span>
            <span className="text-xs font-bold text-emerald-600">Juda tez</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 block font-semibold">Narxi</span>
            <span className="text-xs font-bold text-faberlic-700">100% Bepul</span>
          </div>
        </div>

      </div>
    </div>
  );
}
