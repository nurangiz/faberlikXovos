import React, { useState } from 'react';
import { Sparkles, BookOpen, Award, Calculator, Trophy, ShoppingBag, User, Menu, X, Flame, Send, LogIn, ShieldCheck, Lock } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenProfile, 
  onOpenAuth,
  onOpenVerify,
  onOpenAdmin
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRealUser = user && user.id && user.id !== 0 && user.name && !user.name.includes('Mehmon');

  const navItems = [
    { id: 'courses', label: 'Kurslar', icon: BookOpen },
    { id: 'feed', label: 'Lenta & Ovoz', icon: Sparkles, badge: 'Yangi' },
    { id: 'certificate', label: 'Sertifikat', icon: Award, highlight: true },
    { id: 'ranking', label: 'Reyting', icon: Trophy },
    { id: 'products', label: 'Katalog', icon: ShoppingBag },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
      {/* Top micro announcement */}
      <div className="bg-gradient-to-r from-faberlic-700 via-rose-600 to-pink-600 text-white text-xs py-1.5 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">100% BEPUL</span>
            <span>🌸 Qizlar va Ayollar uchun Faberlic Biznes va Go'zallik Maktabi</span>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <button 
              onClick={onOpenVerify}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-200 hover:text-white transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Sertifikatni Tekshirish
            </button>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-200 hover:text-white transition"
              title="Admin Panel"
            >
              <Lock className="w-3 h-3 text-amber-300" /> Admin
            </button>
            <a 
              href="https://t.me/Faberlicuz_bot" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] hover:text-amber-200 transition font-bold"
            >
              <Send className="w-3 h-3 text-cyan-300" /> Savol berish (@Faberlicuz_bot)
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-faberlic-600 via-faberlic-700 to-rose-900 flex items-center justify-center text-white shadow-md shadow-faberlic-500/20 group-hover:scale-105 transition-transform duration-300 relative">
              <span className="font-serif font-black text-xl sm:text-2xl tracking-tighter">FL</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-amber-500 border border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-lg sm:text-2xl text-slate-900 tracking-tight">
                  FABERLIC
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase px-1.5 sm:px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm">
                  Akademiya
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-rose-700 tracking-wide">
                Ayollar va Qizlar Ta'lim Markazi
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 lg:gap-1.5 flex-1 justify-center max-w-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? 'bg-rose-50 text-faberlic-700 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-faberlic-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-faberlic-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-rose-100 text-faberlic-700 text-[10px] px-1.5 py-0.2 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                      Yangi
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isRealUser ? (
              <>
                {/* Real Streak & points badge */}
                <div className="hidden sm:flex items-center gap-2 bg-rose-50/70 border border-rose-100/80 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 shrink-0">
                  <span className="flex items-center text-amber-600 gap-0.5">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    {user.streak_days || 1} kun
                  </span>
                  <span className="w-1 h-3 bg-rose-200 rounded-full"></span>
                  <span className="text-faberlic-700">
                    {user.points || 0} ball
                  </span>
                </div>

                {/* Profile modal trigger */}
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-faberlic-600 to-rose-600 hover:from-faberlic-700 hover:to-rose-700 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-faberlic-600/20 active:scale-95 transition shrink-0 max-w-[120px] sm:max-w-[160px]"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">{user.name.split(' ')[0]}</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-faberlic-700 to-rose-600 hover:from-faberlic-800 hover:to-rose-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-faberlic-600/20 active:scale-95 transition shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="sm:hidden">Kirish</span>
                <span className="hidden sm:inline">Ro'yxatdan O'tish</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-faberlic-700 transition"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-rose-100 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {isRealUser ? (
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-600 px-2">
              <span className="flex items-center gap-1 text-amber-600">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" /> Streak: {user.streak_days} kun
              </span>
              <span className="text-faberlic-700">Jami ball: {user.points}</span>
            </div>
          ) : (
            <div className="pb-3 border-b border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 bg-gradient-to-r from-faberlic-700 to-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Ro'yxatdan O'tish / Kirish</span>
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-rose-50 text-faberlic-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-faberlic-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-rose-100 text-faberlic-700 text-xs px-2 py-0.5 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a 
              href="https://t.me/Faberlicuz_bot"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-sky-800 bg-sky-50 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-600" />
                <span>Savol Berish (Telegram Bot)</span>
              </div>
              <span className="text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded font-mono font-bold">@Faberlicuz_bot</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVerify();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 rounded-xl"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Sertifikatni Tekshirish</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-rose-50 rounded-xl transition"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Admin Panel</span>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">Himoyalangan</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
