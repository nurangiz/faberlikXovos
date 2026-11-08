import React, { useState } from 'react';
import { TOP_PRODUCTS } from '../data/coursesData';
import { ShoppingBag, Search, Sparkles, Tag, Check, ArrowUpRight } from 'lucide-react';
import creatorSignature from '../assets/creator-signature.jpg';

export default function ProductsGuide({ onOpenCreatorModal }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = TOP_PRODUCTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.code.includes(search) || 
                          p.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section className="py-16 bg-white border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-faberlic-700 text-xs font-extrabold uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4 text-faberlic-600" />
            <span>Mahsulotlar Ensiklopediyasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
            Faberlicning Top Mahsulotlari va Tavsiya Sirlari
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Mijozlarga to'g'ri tavsiya qilish, artikul kodlarini bilish va shaxsiy 100 ballni oson yig'ish uchun qo'llanma.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Mahsulot nomi yoki artikul kodi bo'yicha qidiring (masalan: 5792)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-faberlic-600 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            {['all', 'Teri Parvarishi', 'Kosmetologiya', 'Parfyumeriya', 'Uy-Ro\'zg\'or'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                  selectedCategory === cat 
                    ? 'bg-faberlic-700 text-white shadow-sm'
                    : 'bg-rose-50 text-slate-600 hover:bg-rose-100'
                }`}
              >
                {cat === 'all' ? 'Barcha Kategoriyalar' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((prod) => (
            <div 
              key={prod.id}
              className="bg-white rounded-3xl border border-rose-100/90 shadow-md hover:shadow-xl hover:border-rose-300 transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Tag & Category */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-rose-100 text-faberlic-800">
                    {prod.tag}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 font-mono">
                    Artikul: #{prod.code}
                  </span>
                </div>

                {/* Product Title */}
                <h4 className="font-serif font-black text-slate-900 text-lg group-hover:text-faberlic-700 transition">
                  {prod.title}
                </h4>

                <div className="text-xs text-slate-500 font-medium">
                  {prod.category}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {prod.desc}
                </p>
              </div>

              {/* Price & Points */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Katalog narxi:</span>
                    <span className="text-sm font-black text-slate-900">{prod.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Beradigan balli:</span>
                    <span className="text-xs font-black text-faberlic-700 bg-rose-50 px-2 py-0.5 rounded-lg">
                      +{prod.points}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Artikul: ${prod.code} nusxalandi!`)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-faberlic-50 text-slate-700 hover:text-faberlic-700 text-xs font-bold border border-slate-200 hover:border-rose-200 transition flex items-center justify-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" />
                  Kodni Nusxalash
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle Watermark Symbol in bottom-right corner */}
        <div className="flex justify-end pt-6 pb-2 pr-1">
          <button 
            type="button"
            onClick={onOpenCreatorModal}
            className="group cursor-pointer select-none bg-transparent border-none p-0 outline-none transition-all duration-300 transform active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Mualliflik belgisi"
          >
            <img 
              src={creatorSignature} 
              alt="" 
              className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply opacity-25 group-hover:opacity-85 transition-opacity duration-300 pointer-events-auto"
            />
          </button>
        </div>

      </div>
    </section>
  );
}
