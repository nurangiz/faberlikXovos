import React, { useState } from 'react';
import { Calculator, TrendingUp, Award, Sparkles, CheckCircle2, Gift, DollarSign, HelpCircle } from 'lucide-react';

export default function IncomeCalculator() {
  const [personalPoints, setPersonalPoints] = useState(50);
  const [teamMembers, setTeamMembers] = useState(15);
  const [avgPointsPerMember, setAvgPointsPerMember] = useState(40);

  // Group Points = personalPoints + (teamMembers * avgPointsPerMember)
  const groupPoints = personalPoints + (teamMembers * avgPointsPerMember);

  // Determine stage / percentage
  let percentage = 0;
  let rankTitle = "Boshlang'ich Maslahatchi";
  let rankColor = "text-slate-600";
  let isDirector = false;

  if (groupPoints >= 3000) {
    percentage = 23;
    rankTitle = "DIREKTOR (23%)";
    rankColor = "text-faberlic-700 font-black";
    isDirector = true;
  } else if (groupPoints >= 2000) {
    percentage = 19;
    rankTitle = "Katta Vitse-Direktor (19%)";
    rankColor = "text-rose-700 font-bold";
  } else if (groupPoints >= 1500) {
    percentage = 15;
    rankTitle = "Vitse-Direktor (15%)";
    rankColor = "text-rose-600 font-bold";
  } else if (groupPoints >= 1000) {
    percentage = 12;
    rankTitle = "Katta Yetakchi (12%)";
    rankColor = "text-amber-700 font-bold";
  } else if (groupPoints >= 600) {
    percentage = 9;
    rankTitle = "Yetakchi (9%)";
    rankColor = "text-amber-600 font-bold";
  } else if (groupPoints >= 200) {
    percentage = 6;
    rankTitle = "Katta Maslahatchi (6%)";
    rankColor = "text-emerald-700 font-bold";
  } else if (groupPoints >= 100) {
    percentage = 3;
    rankTitle = "Maslahatchi (3%)";
    rankColor = "text-blue-700 font-bold";
  }

  // Faberlic ball conversion rate in UZB (approx 1 ball for payout = 10,800 - 12,000 UZS)
  const BALL_VALUE_UZS = 11400;
  
  // Calculate catalog cycle payout (21 days)
  const catalogEarnings = Math.round(groupPoints * (percentage / 100) * BALL_VALUE_UZS);
  // Monthly equivalent (since there are 18-19 catalogs in a year, ~1.43 catalogs per month)
  const monthlyEarnings = Math.round(catalogEarnings * 1.43);

  return (
    <section className="py-16 bg-[#FFF9FA] border-t border-rose-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-faberlic-800 text-xs font-extrabold uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-faberlic-700" />
            <span>Rasmiy Marketing Rejasi Kalkulyatori</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
            Faberlicda Qancha Daromad Topa Olasiz?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Jamoangiz hajmini kiriting va 21 kunlik hamda oylik kutilayotgan daromadingiz, bonuslaringizni real vaqtda hisoblang!
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Box (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-8 rounded-3xl border border-rose-100 shadow-xl space-y-6 overflow-hidden w-full max-w-full">
            
            {/* Input 1: Personal volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-800">
                  1. Shaxsiy Buyurtmangiz (LO - Shaxsiy hajm):
                </label>
                <span className="text-sm sm:text-base font-extrabold text-faberlic-700 bg-rose-50 px-2.5 sm:px-3 py-1 rounded-xl shrink-0">
                  {personalPoints} ball
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="200" 
                step="5"
                value={personalPoints}
                onChange={(e) => setPersonalPoints(Number(e.target.value))}
                className="w-full accent-faberlic-600 cursor-pointer h-2 bg-rose-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-medium gap-1">
                <span>0</span>
                <span className="text-faberlic-700 font-bold text-center">50 ball <span className="hidden sm:inline">(26% chegirma)</span></span>
                <span className="text-amber-700 font-bold text-center">100 ball <span className="hidden sm:inline">(VIP)</span></span>
                <span>200</span>
              </div>
            </div>

            {/* Input 2: Team members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-800">
                  2. Jamoangizdagi Faol Qizlar Soni:
                </label>
                <span className="text-sm sm:text-base font-extrabold text-faberlic-700 bg-rose-50 px-2.5 sm:px-3 py-1 rounded-xl shrink-0">
                  {teamMembers} kishi
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1"
                value={teamMembers}
                onChange={(e) => setTeamMembers(Number(e.target.value))}
                className="w-full accent-faberlic-600 cursor-pointer h-2 bg-rose-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-medium gap-1">
                <span>0</span>
                <span>25 ta</span>
                <span>50 ta</span>
                <span>100+ ta</span>
              </div>
            </div>

            {/* Input 3: Avg points per member */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-800">
                  3. Har bir a'zoning o'rtacha xaridi (ball):
                </label>
                <span className="text-sm sm:text-base font-extrabold text-faberlic-700 bg-rose-50 px-2.5 sm:px-3 py-1 rounded-xl shrink-0">
                  {avgPointsPerMember} ball
                </span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={avgPointsPerMember}
                onChange={(e) => setAvgPointsPerMember(Number(e.target.value))}
                className="w-full accent-faberlic-600 cursor-pointer h-2 bg-rose-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-medium gap-1">
                <span>10 <span className="hidden sm:inline">ball (Kichik)</span></span>
                <span className="text-center font-bold text-faberlic-700">50 <span className="hidden sm:inline">ball (Standart)</span></span>
                <span className="text-right font-bold text-amber-700">100+ <span className="hidden sm:inline">ball (VIP)</span></span>
              </div>
            </div>

            {/* Total calculation indicator bar */}
            <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200/80 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-600 block">Jami Guruh Hajmi (GO):</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {groupPoints.toLocaleString()} ball
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-600 block">Erishilgan daraja:</span>
                <div className={`text-sm sm:text-lg ${rankColor}`}>
                  {rankTitle}
                </div>
              </div>
            </div>

            {/* Step Ladder progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-600 gap-1">
                <span>3%</span>
                <span>9%</span>
                <span>15%</span>
                <span className="text-faberlic-700 font-black">23% DIREKTOR</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-faberlic-700 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (groupPoints / 3000) * 100)}%` }}
                ></div>
              </div>
            </div>

          </div>

          {/* Results Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-5 sm:p-8 rounded-3xl shadow-2xl border border-rose-900/50 space-y-6 relative overflow-hidden w-full max-w-full">
            
            {/* Background shimmer */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-faberlic-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-rose-300">
                Hisoblangan Daromad
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-faberlic-600 text-white">
                {percentage}% Pog'ona
              </span>
            </div>

            {/* Monthly Earnings Highlight */}
            <div className="relative z-10 space-y-1">
              <span className="text-xs text-slate-300">Taxminiy oylik daromadingiz:</span>
              <div className="text-3xl sm:text-4xl font-serif font-black text-amber-400 drop-shadow-sm">
                {monthlyEarnings > 0 ? `${monthlyEarnings.toLocaleString()} so'm` : "0 so'm"}
              </div>
              <p className="text-xs text-rose-200">
                (Har 21 kunda: ~{catalogEarnings.toLocaleString()} so'm to'lanadi)
              </p>
            </div>

            {/* Extra Bonuses & Privileges */}
            <div className="relative z-10 space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Sizga Beriladigan Bonuslar:
              </div>

              {isDirector ? (
                <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-400/40 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>19,000,000 so'm Bir Martalik Mukofot!</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Direktorlik unvoni tasdiqlanganda ushbu yirik sovg'a hisobingizga to'liq tushirib beriladi!
                  </p>
                  <div className="flex items-center gap-2 text-xs text-amber-200 pt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Xalqaro sayohat va Onalik bonusi huquqi</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-xs space-y-1.5 text-slate-300">
                  <div className="font-semibold text-white">
                    Direktorlikkacha yana {Math.max(0, 3000 - groupPoints)} ball qoldi!
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Direktor bo'lganingizda 19,000,000 so'm bir martalik mukofot va chet el sayohati vaucheriga ega bo'lasiz.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>20% - 26% mahsulotlarga shaxsiy chegirma</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Start dasturidan 6 ta qimmatbaho hadya to'plamlari</span>
              </div>
            </div>

            {/* Motivational quote */}
            <div className="relative z-10 pt-2 border-t border-white/10 text-center">
              <p className="text-xs italic text-rose-200">
                "O'zbekistonda minglab ayollar ushbu yo'lni bosib o'tishgan. Siz ham albatta erisha olasiz!"
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
