import React, { useEffect, useRef, useState } from 'react';
import { User, X, Check, Award, Flame, Phone, MapPin, Sparkles, LogOut, LogIn, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, removeToken, setToken } from '../services/api';

export default function UserModal({ 
  isOpen, 
  onClose, 
  user, 
  completedLessons = [], 
  certificates = [], 
  onProfileUpdated, 
  onLogout,
  onOpenExam,
  onOpenVerifyWithId
}) {
  const dialogRef = useRef(null);

  // Check if currently a real registered user
  const isRealUser = Boolean(user && user.id && user.id !== 0 && user.name && !user.name.includes('Mehmon'));

  // Mode: if real user -> 'view_edit', if not -> 'register' or 'login'
  const [authMode, setAuthMode] = useState(isRealUser ? 'view_edit' : 'register');
  const [name, setName] = useState(user?.name && !user.name.includes('Mehmon') ? user.name : '');
  const [phone, setPhone] = useState(user?.phone && !user.phone.includes('...') ? user.phone : '+998 ');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState(user?.region || 'Toshkent');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (user && user.id && user.id !== 0 && !user.name.includes('Mehmon')) {
      setName(user.name);
      setPhone(user.phone || '');
      setRegion(user.region || 'Toshkent');
      setAuthMode('view_edit');
    } else {
      setName('');
      setPhone('+998 ');
      setPassword('');
      setAuthMode('register');
    }
  }, [user, isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      setStatusMsg(null);
      setErrorMsg(null);
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Modern light-dismiss
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

  // Submit Handler: Works for Registration, Login, and Profile Editing!
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    setErrorMsg(null);

    try {
      if (authMode === 'register') {
        // Validation
        if (!name.trim()) throw new Error("Iltimos, ism va familiyangizni kiriting.");
        if (!phone.trim() || phone.trim() === '+998') throw new Error("Iltimos, telefon raqamingizni kiriting.");
        if (!password.trim() || password.length < 4) throw new Error("Parol kamida 4 ta belgidan iborat bo'lishi kerak.");

        const res = await api.register({
          name: name.trim(),
          phone: phone.trim(),
          password: password.trim(),
          region
        });

        setStatusMsg("Tabriklaymiz! Akkauntingiz muvaffaqiyatli ochildi (+50 ball berildi)!");
        onProfileUpdated(res.user);
        setTimeout(() => {
          onClose();
        }, 1200);

      } else if (authMode === 'login') {
        // Login mode
        if (!phone.trim() || phone.trim() === '+998') throw new Error("Telefon raqamingizni kiriting.");
        if (!password.trim()) throw new Error("Parolingizni kiriting.");

        const res = await api.login({
          phone: phone.trim(),
          password: password.trim()
        });

        setStatusMsg("Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.");
        onProfileUpdated(res.user);
        setTimeout(() => {
          onClose();
        }, 1200);

      } else {
        // View/Edit mode for existing user
        if (!name.trim()) throw new Error("Ism bo'sh bo'lishi mumkin emas.");
        const res = await api.updateProfile({ name: name.trim(), region, phone: phone.trim() });
        setStatusMsg("Ma'lumotlaringiz muvaffaqiyatli yangilandi!");
        onProfileUpdated(res.user);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || "Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogout = () => {
    removeToken();
    onLogout();
    setName('');
    setPhone('+998 ');
    setPassword('');
    setAuthMode('register');
    setStatusMsg("Hisobdan chiqildi. Yangi hisob ochishingiz mumkin.");
  };

  const avatarLetter = isRealUser && name ? name.charAt(0).toUpperCase() : (name ? name.charAt(0).toUpperCase() : 'FL');

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="profile-dialog-title"
      className="p-0 rounded-3xl shadow-2xl w-[calc(100%-1.5rem)] max-w-lg m-auto bg-white border border-rose-100 text-slate-800 backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm overflow-hidden my-auto"
    >
      <div className="p-5 sm:p-7 space-y-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-faberlic-700 to-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-faberlic-600/20">
              {avatarLetter}
            </div>
            <div>
              <h3 id="profile-dialog-title" className="font-serif font-black text-xl text-slate-900">
                {isRealUser ? "Shaxsiy Kabinet" : "Akkaunt Ochish & Kirish"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isRealUser ? `ID: #${user.id} • Faberlic Rasmiy O'quvchisi` : "O'z shaxsiy profilingizni yarating"}
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

        {/* User Stats Preview Badges */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100">
            <div className="text-lg font-black text-faberlic-800">{isRealUser ? (user.points || 0) : 50}</div>
            <div className="text-[11px] text-slate-600 font-semibold">Jami Ball</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <div className="text-lg font-black text-amber-700">{isRealUser ? (user.streak_days || 1) : 1} kun</div>
            <div className="text-[11px] text-slate-600 font-semibold">Streak</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
            <div className="text-lg font-black text-emerald-800">{completedLessons.length} ta</div>
            <div className="text-[11px] text-slate-600 font-semibold">Tugatilgan dars</div>
          </div>
        </div>

        {/* Certificate status bar */}
        {certificates.length > 0 ? (
          <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-300 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">{certificates[0].course_name}</div>
                <div className="text-[10px] text-slate-500 font-mono">ID: {certificates[0].certificate_id}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenVerifyWithId(certificates[0].certificate_id);
              }}
              className="px-3 py-1 bg-white border border-amber-300 rounded-xl text-xs font-bold text-amber-900 hover:bg-amber-100 transition"
            >
              Tekshirish
            </button>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Hozircha rasmiy sertifikat olinmagan</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenExam();
              }}
              className="font-bold text-faberlic-700 hover:underline"
            >
              Imtihon topshirish
            </button>
          </div>
        )}

        {/* Notification Alert Banners */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {statusMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Mode Switcher Tabs (if not real user) */}
        {!isRealUser && (
          <div className="grid grid-cols-2 p-1 bg-rose-50 rounded-2xl">
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                authMode === 'register' ? 'bg-white text-faberlic-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yangi Ro'yxatdan O'tish
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                authMode === 'login' ? 'bg-white text-faberlic-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mavjud Hisobga Kirish
            </button>
          </div>
        )}

        {/* The Unified Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Ism va Familiya (Register and Edit mode) */}
          {authMode !== 'login' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ism va Familiya:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  required
                  placeholder="Masalan: Nilufar Karimova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          {/* Telefon Raqami */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Telefon Raqami:
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Parol (Only for Register or Login mode) */}
          {authMode !== 'view_edit' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Parol:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  required
                  placeholder="Kamida 4 ta belgi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          {/* Yashash Viloyati */}
          {authMode !== 'login' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Yashash Viloyati / Shahri:
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
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

          {/* Bottom Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {isRealUser ? (
              <button
                type="button"
                onClick={handleUserLogout}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Hisobdan Chiqish</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 font-medium text-center sm:text-left">
                🌸 Ro'yxatdan o'tgach +50 ball beriladi!
              </span>
            )}

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition text-center"
              >
                Yopish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-faberlic-700 hover:bg-faberlic-800 text-white text-xs font-bold shadow-md shadow-faberlic-600/25 active:scale-95 transition disabled:opacity-50 text-center"
              >
                {loading 
                  ? "Saqlanmoqda..." 
                  : authMode === 'register' 
                  ? "Ro'yxatdan O'tish" 
                  : authMode === 'login' 
                  ? "Kirish" 
                  : "Saqlash"}
              </button>
            </div>
          </div>

        </form>

      </div>
    </dialog>
  );
}
