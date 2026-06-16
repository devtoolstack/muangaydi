import React from 'react';
import { motion } from 'motion/react';
import { Flame, ArrowRight, Zap, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface HotDealsProps {
  products: Product[];
}

export default function HotDeals({ products }: HotDealsProps) {
  const hotProducts = products.filter(p => p.isHot).slice(0, 6);

  if (hotProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 animate-pulse">
            <Flame className="text-white fill-current" size={32} />
          </div>
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">Sản Phẩm HOT</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] sm:text-xs tracking-widest mt-1">Đang được săn đón nhất trong 24h qua</p>
          </div>
        </div>
        
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
          className="group flex items-center gap-3 text-slate-400 hover:text-brand-primary font-bold uppercase text-xs tracking-widest transition-colors"
        >
          Xem tất cả deal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x snap-mandatory">
        {hotProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[380px] group snap-center"
          >
            <div className="relative glass border-white/10 rounded-[40px] overflow-hidden p-3 h-full flex flex-col hover:border-brand-primary/30 transition-all bg-gradient-to-br from-white/5 to-transparent shadow-2xl">
              {/* Badge */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                <div className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-red-500/40">
                  <Zap size={12} fill="currentColor" /> HOT DEAL
                </div>
                {product.status && (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-center shadow-xl">
                    {product.status}
                  </div>
                )}
              </div>

              {/* Rating on Top Right */}
              <div className="absolute top-6 right-6 z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/10">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-white font-black text-xs">{product.rating}</span>
              </div>

              {/* Image Area */}
              <a 
                href={product.productUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block relative aspect-[4/3] rounded-[32px] overflow-hidden mb-6 bg-slate-900 group-hover:scale-[1.02] transition-transform duration-500"
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                  <div className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">
                    SĂN DEAL NGAY
                  </div>
                </div>
              </a>

              {/* Content Area */}
              <div className="px-4 pb-4 flex-1 flex flex-col">
                <a 
                  href={product.productUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-display font-black text-white group-hover:text-brand-primary transition-colors mb-3 line-clamp-1 leading-tight uppercase tracking-tight text-lg sm:text-xl md:text-2xl"
                >
                  {product.name}
                </a>
                
                <p className="text-slate-400 text-xs sm:text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                  {product.description}
                </p>

                <div className="mt-auto flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Giá Ưu Đãi</div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl sm:text-3xl font-black font-display text-white">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-slate-500 line-through font-bold opacity-50">{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <a 
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-white text-black group-hover:bg-brand-primary group-hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-brand-primary/0 group-hover:shadow-brand-primary/20 hover:scale-110 active:scale-90"
                  >
                    <ShoppingBag size={24} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
