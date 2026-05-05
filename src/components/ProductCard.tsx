import React from 'react';
import { Star, ArrowUpRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  key?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card group relative flex flex-col overflow-hidden"
    >
      {/* Badge items */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.status && (
          <span className={`px-3 py-1 text-white text-[10px] font-black uppercase rounded-lg shadow-lg ${
            product.status.toLowerCase().includes('hết') ? 'bg-slate-600' : 'bg-red-500'
          }`}>
            {product.status}
          </span>
        )}
        <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-lg border border-white/10">
          {product.category}
        </span>
      </div>

      <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/50 hover:text-red-500 hover:scale-110 transition-all border border-white/10 shadow-sm">
        <Heart size={18} />
      </button>

      {/* Image section */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden m-4 rounded-2xl border border-white/5 bg-slate-900">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
      </Link>

      {/* Content section */}
      <div className="p-6 pt-2 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            <Star size={14} fill="currentColor" />
          </div>
          <span className="text-xs font-bold text-slate-300">{product.rating}</span>
          <span className="text-slate-500 text-[10px]">({product.reviews})</span>
        </div>
        
        <Link to={`/product/${product.id}`} className="font-display font-black text-white group-hover:text-brand-primary transition-colors mb-2 line-clamp-2 leading-tight uppercase tracking-tight text-base sm:text-lg">
          {product.name}
        </Link>
        
        <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black font-display text-white">{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-500 line-through">{product.originalPrice}</span>
            )}
          </div>

          <a 
            href={product.productUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-white text-black group-hover:bg-brand-primary group-hover:text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl uppercase tracking-tighter text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            SĂN DEAL NGAY <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
