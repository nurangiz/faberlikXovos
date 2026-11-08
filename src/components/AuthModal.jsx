import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Lock, MapPin, X, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const dialogRef = useRef(null);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('Toshkent');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      setError(null);
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Modern light-dismiss handling
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    let pressedOutside = false;
    const isOutside = (e) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    const handlePointerDown = (e) => {
      pressedOutside = isOutside(e);
    };

    const handlePointerUp = (e) => {
      if (pressedOutside && isOutside(e)) {
        onClose();
      }
    };

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);
    dialog.addEventListener('close', handleClose);

    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
      dialog.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        const res = await api.login({ phone, password });
        onAuthSuccess(res);
        onClose();
      } else {
        const res = await api.register({ name, phone, password, region });
        onAuthSuccess(res);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="auth-dialog-title"
      className="p-0 rounded-3xl shadow-2xl max-w-md w-full bg-white border border-rose-100 text-slate-800 backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-faberlic-700 to-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-faberlic-600/20">
              FL
            </div>
            <div>
              <h3 id="auth-dialog-title" className="font-serif font-black text-xl text-slate-900">
                {isLoginMode ? "Hisobga Kirish" : "Ro'yxatdan O'tish"}
              </h3>
              <p className="text-xs text-rose-700 font-semibold">
                Faberlic Ayollar Akademiyasi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-faberlic-700 flex items-center justify-center text-slate-500 transition"
            aria-label="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-rose-50 rounded-2xl">
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              !isLoginMode ? 'bg-white text-faberlic-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Yangi Ro'yxatdan O'tish
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              isLoginMode ? 'bg-white text-faberlic-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mavjud Hisobga Kirish
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ism va Familiyangiz:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  required
                  placeholder="Masalan: Nilufar Karimova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Telefon raqamingiz:
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Parol:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required
                placeholder="Kamida 6 ta belgi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Viloyatingiz / Shahringiz:
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
                >
                  <option value="Toshkent">Toshkent</option>
                  <option value="Samarqand">Samarqand</option>
                  <option value="Farg'ona">Farg'ona</option>
                  <option value="Andijon">Andijon</option>
                  <option value="Namangan">Namangan</option>
                  <option value="Buxoro">Buxoro</option>
                  <option value="Qashqadaryo">Qashqadaryo</option>
                  <option value="Surxondaryo">Surxondaryo</option>
                  <option value="Xorazm">Xorazm</option>
                  <option value="Navoiy">Navoiy</option>
                  <option value="Jizzax">Jizzax</option>
                  <option value="Sirdaryo">Sirdaryo</option>
                  <option value="Qoraqalpog'iston">Qoraqalpog'iston</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-faberlic-700 via-rose-600 to-pink-600 hover:from-faberlic-800 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-faberlic-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{loading ? "Kutilmoqda..." : isLoginMode ? "Tizimga Kirish" : "Akademiya A'zosi Bo'lish (Bepul)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {!isLoginMode && (
            <p className="text-[11px] text-center text-slate-500 pt-1">
              🌸 Ro'yxatdan o'tishingiz bilan hisobingizga <strong>+50 boshlang'ich ball</strong> hadya qilinadi!
            </p>
          )}

        </form>

      </div>
    </dialog>
  );
}
