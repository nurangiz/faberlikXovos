import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminCodeModal({ isOpen, onClose, onAuthenticated }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError(null);
      setSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const clean = code.trim();
    if (clean === '080910') {
      setSuccess(true);
      setTimeout(() => {
        onAuthenticated();
        onClose();
      }, 500);
    } else {
      setError("Admin kodi noto'g'ri. Iltimos, qayta urinib ko'ring.");
      setCode('');
      inputRef.current?.focus();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-sm rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-rose-100 text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-faberlic-700 flex items-center justify-center text-slate-500 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-faberlic-700 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-faberlic-600/30">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-serif font-black text-xl text-slate-900">
              Admin Panelga Kirish
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Saytni boshqarish uchun maxsus xavfsizlik kodini kiriting
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Kod tasdiqlandi! Admin panel ochilmoqda...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  ref={inputRef}
                  type="password"
                  maxLength={10}
                  placeholder="Admin kodi (6 xonali)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center tracking-widest text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-faberlic-700 to-rose-600 hover:from-faberlic-800 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-faberlic-600/25 active:scale-95 transition"
            >
              Tasdiqlash & Kirish
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Faqat vakolatli sayt ma'murlari uchun
          </p>
        </div>
      </div>
    </div>
  );
}
