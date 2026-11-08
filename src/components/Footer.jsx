import React from 'react';
import { Heart, Send, Sparkles, BookOpen, Award, Phone, Lock } from 'lucide-react';

export default function Footer({ onNavClick, onOpenAdmin }) {
  return (
    <footer className="bg-slate-950 text-white border-t border-rose-950/60 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-faberlic-600 flex items-center justify-center font-serif font-black text-xl text-white">
                FL
              </div>
              <div>
                <span className="font-serif font-black text-lg tracking-tight text-white block">
                  FABERLIC AKADEMIYA
                </span>
                <span className="text-[10px] text-rose-300 font-medium">
                  Ayollar va Qizlar Ta'lim Markazi
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              O'zbekistondagi ayollar va qizlar uchun yaratilgan ilk bepul Faberlic onlayn biznes va go'zallik akademiyasi.
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>100% Bepul va Ommabop Ta'lim</span>
            </div>
          </div>

          {/* Col 2: Yo'nalishlar */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-300">
              O'quv Yo'nalishlari
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavClick('courses')} className="hover:text-white transition">
                  • Faberlic Biznes Boshlash (Noldan)
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('courses')} className="hover:text-white transition">
                  • Kosmetologiya va Teri Parvarishi
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('courses')} className="hover:text-white transition">
                  • Instagramda Sotuv & SMM
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('courses')} className="hover:text-white transition">
                  • Sotuv Psixologiyasi & E'tirozlar
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('courses')} className="hover:text-white transition">
                  • Ayollar Liderligi va Erkinlik
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Foydali bo'limlar */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-300">
              Interaktiv Vositalar
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavClick('calculator')} className="hover:text-white transition">
                  • Marketing Reja & Daromad Kalkulyatori
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('certificate')} className="hover:text-white transition">
                  • Yakuniy Attestatsiya & Sertifikat
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('ranking')} className="hover:text-white transition">
                  • Faol Lider Qizlar Reytingi
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('products')} className="hover:text-white transition">
                  • Top Mahsulotlar Ensiklopediyasi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hamjamiyat */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-rose-300">
              Qizlar Hamjamiyati
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Savollaringiz bormi? Tajribali mentorlar va minglab qizlar bilan birga fikr almashing:
            </p>
            <a 
              href="https://t.me/Faberlicuz_bot" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-faberlic-600 to-rose-600 hover:from-faberlic-700 hover:to-rose-700 text-white font-bold text-xs shadow-md transition"
            >
              <Send className="w-4 h-4" />
              <span>Telegram Bot: @Faberlicuz_bot</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright & Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Faberlic Ayollar & Qizlar Akademiyasi. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-rose-900/40 text-slate-400 hover:text-amber-300 border border-white/5 text-[11px] font-semibold transition"
              title="Faqat sayt ma'murlari uchun"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin Panel</span>
            </button>
            <div className="flex items-center gap-1 text-rose-300 font-medium">
              <span>O'zbekiston ayollarini qo'llab-quvvatlash uchun</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
              <span>bilan yaratildi</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
