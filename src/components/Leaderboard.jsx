import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Sparkles, MapPin, Star, Award, RefreshCw, BookOpen } from 'lucide-react';
import { api } from '../services/api';

export default function Leaderboard({ currentUser }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const data = await api.getLeaderboard();
      if (data && data.leaderboard) {
        setLeaders(data.leaderboard);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, [currentUser?.points]);

  const top1 = leaders[0] || { name: "Yuklanmoqda...", region: "Toshkent", points: 0, avatar: "FL", title: "Oltin Lider" };
  const top2 = leaders[1] || { name: "Yuklanmoqda...", region: "Samarqand", points: 0, avatar: "FL", title: "Kumush Lider" };
  const top3 = leaders[2] || { name: "Yuklanmoqda...", region: "Andijon", points: 0, avatar: "FL", title: "Yulduzli Ustoz" };

  return (
    <section className="py-16 bg-[#FFF9FA] border-t border-rose-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Respublika Jonli Reytingi (Live Database)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
            Haqiqiy Lider Qizlar va O'quvchilar Reytingi
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            O'rinlar darslarni o'zlashtirish, testlarni a'lo yechish va sertifikat olish bo'yicha to'plangan real ballarga qarab beriladi!
          </p>

          <div className="pt-1">
            <button
              onClick={fetchLeaders}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-faberlic-700 hover:text-faberlic-900 bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Reytingni Yangilash</span>
            </button>
          </div>
        </div>

        {/* Podium Top 3 */}
        {leaders.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-end">
            
            {/* 2nd place */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md text-center space-y-3 order-2 md:order-1">
              <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-700 flex items-center justify-center font-bold text-lg mx-auto">
                2
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-700 font-bold text-xl flex items-center justify-center mx-auto shadow-inner">
                {top2.avatar}
              </div>
              <h4 className="font-bold text-slate-900 text-base">{top2.name}</h4>
              <div className="inline-flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5" /> {top2.region}
              </div>
              <div className="bg-slate-50 py-1.5 px-3 rounded-xl text-xs font-black text-slate-800">
                {top2.points} ball
              </div>
              <span className="text-[11px] font-bold text-slate-600 block">{top2.title}</span>
            </div>

            {/* 1st place */}
            <div className="bg-gradient-to-b from-amber-50 to-white p-8 rounded-3xl border-2 border-amber-300 shadow-xl text-center space-y-3 order-1 md:order-2 transform md:-translate-y-4 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-4 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md">
                <Crown className="w-4 h-4 fill-slate-950" /> 1-O'RIN
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 font-black text-2xl flex items-center justify-center mx-auto shadow-md border-4 border-white mt-2">
                {top1.avatar}
              </div>
              <h4 className="font-serif font-black text-slate-900 text-lg sm:text-xl">{top1.name}</h4>
              <div className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> {top1.region}
              </div>
              <div className="bg-amber-100 py-2 px-4 rounded-xl text-sm font-black text-amber-900">
                {top1.points} ball
              </div>
              <span className="text-xs font-extrabold text-amber-700 block">{top1.title}</span>
            </div>

            {/* 3rd place */}
            <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-md text-center space-y-3 order-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-800 flex items-center justify-center font-bold text-lg mx-auto">
                3
              </div>
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 font-bold text-xl flex items-center justify-center mx-auto shadow-inner">
                {top3.avatar}
              </div>
              <h4 className="font-bold text-slate-900 text-base">{top3.name}</h4>
              <div className="inline-flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5" /> {top3.region}
              </div>
              <div className="bg-rose-50 py-1.5 px-3 rounded-xl text-xs font-black text-rose-800">
                {top3.points} ball
              </div>
              <span className="text-[11px] font-bold text-rose-700 block">{top3.title}</span>
            </div>

          </div>
        )}

        {/* Table list of ranks */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-lg overflow-hidden">
          <div className="p-4 sm:p-5 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between text-xs font-extrabold text-slate-600 uppercase tracking-wider">
            <span>O'rin & Ism-Sharif</span>
            <div className="flex items-center gap-6 sm:gap-12">
              <span className="hidden sm:inline">Darslar</span>
              <span className="hidden sm:inline">Hudud</span>
              <span>Ball</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {leaders.slice(3).map((leader) => {
              const isMe = currentUser && currentUser.id === leader.id;

              return (
                <div 
                  key={leader.id} 
                  className={`p-4 sm:p-5 flex items-center justify-between transition ${
                    isMe ? 'bg-rose-100/70 border-l-4 border-l-faberlic-600 font-bold' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                      isMe ? 'bg-faberlic-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {leader.rank}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{leader.name}</span>
                        {isMe && (
                          <span className="px-2 py-0.2 bg-faberlic-700 text-white text-[10px] rounded-full">
                            Siz
                          </span>
                        )}
                        {leader.hasCertificate && (
                          <Award className="w-3.5 h-3.5 text-amber-500" title="Sertifikat sohibasi" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{leader.title}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-12">
                    <span className="hidden sm:inline text-xs text-slate-500 font-medium">
                      {leader.completed_lessons || 0} ta dars
                    </span>
                    <span className="hidden sm:inline text-xs text-slate-600">{leader.region}</span>
                    <span className="text-xs sm:text-sm font-black text-faberlic-700">{leader.points} ball</span>
                  </div>
                </div>
              );
            })}

            {/* If current user is not in the top visible list or newly registered */}
            {currentUser && !leaders.slice(3).some(l => l.id === currentUser.id) && !leaders.slice(0, 3).some(l => l.id === currentUser.id) && (
              <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-100/60 to-pink-50 flex items-center justify-between border-t-2 border-faberlic-600">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-faberlic-700 text-white font-bold text-xs flex items-center justify-center">
                    Siz
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-faberlic-900">{currentUser.name} (Siz)</div>
                    <div className="text-[11px] text-faberlic-700 font-bold">Faol O'quvchi</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-12">
                  <span className="hidden sm:inline text-xs font-bold text-slate-600">{currentUser.region}</span>
                  <span className="text-xs sm:text-sm font-black text-faberlic-700">{currentUser.points || 0} ball</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
