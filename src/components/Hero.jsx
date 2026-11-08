import React from 'react';
import { Sparkles, Play, Award, Calculator, CheckCircle2, TrendingUp, Users, Heart, ArrowRight } from 'lucide-react';

export default function Hero({ onStartLearning, onOpenCalculator, onOpenExam }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-rose-50/50 via-[#FFF9FA] to-white">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-pink-200/30 via-rose-300/20 to-amber-200/30 blur-3xl -z-10 pointer-events-none rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 tracking-tight leading-[1.15]">
              O'z uyingizdan turib <br className="hidden sm:inline"/>
              <span className="bg-gradient-to-r from-faberlic-700 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                Faberlic Biznesini
              </span> <br />
              o'rganing va mustaqil bo'ling!
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Uyda o'tirib farzandlar tarbiyasi bilan birga o'z shaxsiy daromadingizga ega bo'ling. 
              Noldan boshlab professional maslahatchi va Faberlic Direktori bo'lish sirlarini 
              <strong className="text-slate-900"> 100% bepul</strong> videodarslarda o'rganing va rasmiy sertifikat oling.
            </p>

            {/* Checklist highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Boshlang'ich sarmoyasiz biznes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Professional go'zallik va parvarish sirlari</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>O'zbek tilida qulay video darslar</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zamonaviy onlayn biznes metodikasi</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 w-full">
              <button
                onClick={onStartLearning}
                className="w-full sm:w-auto px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-faberlic-700 via-rose-600 to-pink-600 hover:from-faberlic-800 hover:to-pink-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-faberlic-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white shrink-0" />
                <span>Darslarni Boshlash (Bepul)</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-rose-50/70 border border-rose-200 text-faberlic-800 font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 transition"
              >
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-faberlic-700 shrink-0" />
                <span>Daromadni Hisoblash</span>
              </button>
            </div>

            {/* Trust line */}
            <div className="pt-3 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Student" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" alt="Student" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" alt="Student" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" alt="Student" />
              </div>
              <p>
                <strong className="text-slate-800">15,400+ dan ortiq</strong> opa-singillarimiz biz bilan o'rganmoqda
              </p>
            </div>

          </div>

          {/* Right Visual Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100/80">
              
              {/* Badge top */}
              <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-faberlic-700">
                    <Heart className="w-4 h-4 fill-faberlic-600" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-800">Qizlar & Ayollar Klubi</h2>
                    <p className="text-[10px] text-slate-500">O'zbekiston bo'ylab 1-o'rinda</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Onlayn Ochiq
                </span>
              </div>

              {/* Card visual showcase */}
              <div className="mt-4 relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-rose-900 to-faberlic-800 flex items-center justify-center p-6 text-white text-center shadow-inner group">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800" 
                  alt="Faberlic Academy Learning"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="relative z-10 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-black uppercase tracking-wider">
                    Sertifikatli Kurs
                  </span>
                  <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
                    Faberlic Liderlik va Go'zallik Akademiyasi
                  </h3>
                  <p className="text-xs text-rose-100 max-w-xs mx-auto">
                    Video darslar • Testlar • Shaxsiy Mentor • Rasmiy Sertifikat
                  </p>
                  
                  <div className="pt-2">
                    <button 
                      onClick={onStartLearning}
                      className="px-5 py-2.5 rounded-xl bg-white text-faberlic-800 font-bold text-xs shadow-md hover:bg-rose-50 transition flex items-center gap-2 mx-auto"
                    >
                      <Play className="w-3.5 h-3.5 fill-faberlic-700 text-faberlic-700" />
                      1-Darsni ko'rish (18 daqiqa)
                    </button>
                  </div>
                </div>
              </div>

              {/* Mini highlights under visual */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
                  <div className="text-xl font-black text-faberlic-800">100%</div>
                  <div className="text-[11px] font-medium text-slate-600">Bepul ta'lim</div>
                </div>
                <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
                  <div className="text-xl font-black text-faberlic-800">4 ta Modul</div>
                  <div className="text-[11px] font-medium text-slate-600">Amaliy video kurs</div>
                </div>
              </div>

              {/* Quick Certificate shortcut */}
              <div 
                onClick={onOpenExam}
                className="mt-3 cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 p-3 rounded-2xl flex items-center justify-between text-xs font-bold transition shadow-md shadow-amber-500/20"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-slate-950 shrink-0" />
                  <span>Imtihon topshiring va Sertifikat oling</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
