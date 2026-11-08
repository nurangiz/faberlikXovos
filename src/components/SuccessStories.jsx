import React from 'react';
import { SUCCESS_STORIES } from '../data/coursesData';
import { Heart, Quote, Sparkles, MapPin, CheckCircle } from 'lucide-react';

export default function SuccessStories() {
  return (
    <section className="py-16 bg-[#FFF9FA] border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-faberlic-800 text-xs font-extrabold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-faberlic-600 text-faberlic-600" />
            <span>Muvaffaqiyat Tarixlari</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
            Oddiy Uy Bekasidan Faberlic Liderigacha
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Bizning bepul akademiyamizda o'qib, o'z hayotini o'zgartirgan va orzulariga erishgan o'zbek ayollarining samimiy hikoyalari.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUCCESS_STORIES.map((story) => (
            <div 
              key={story.id}
              className="bg-white rounded-3xl border border-rose-100 shadow-xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-rose-200 transition"
            >
              {/* Quote mark watermark */}
              <Quote className="w-20 h-20 text-rose-100/70 absolute -top-2 -right-2 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase">
                  {story.badge}
                </span>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{story.story}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-4 relative z-10 mt-4">
                <img 
                  src={story.image} 
                  alt={story.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-rose-300 shadow-sm"
                />
                <div>
                  <h4 className="font-serif font-black text-slate-900 text-sm sm:text-base">
                    {story.name}
                  </h4>
                  <div className="text-[11px] text-faberlic-700 font-bold">
                    {story.role}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3" /> {story.city}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
