import React from 'react';
import { Star, ArrowUpRight, Heart, Facebook, Twitter, Instagram, AtSign, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  key?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const shareUrl = product.productUrl;
  const shareTitle = product.name;
  const shareText = `Check out this deal: ${product.name}`;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

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
        {product.isHot && (
          <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase rounded-lg shadow-lg flex items-center gap-1">
            🔥 HOT
          </span>
        )}
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

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button 
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/50 hover:text-red-500 hover:scale-110 transition-all border border-white/10 shadow-sm"
          title="Yêu thích"
        >
          <Heart size={18} />
        </button>
        
        {/* Share Button Group */}
        <div className="relative group/share">
          <button 
            onClick={handleShare}
            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/50 hover:text-brand-primary hover:scale-110 transition-all border border-white/10 shadow-sm md:group-hover/share:opacity-0"
            title="Chia sẻ"
          >
            <Share2 size={18} />
          </button>

          {/* Social List - Hidden on small screens if navigator.share exists, shown on hover for desktop */}
          <div className="absolute top-0 right-0 flex flex-col gap-2 opacity-0 pointer-events-none md:group-hover/share:opacity-100 md:group-hover/share:pointer-events-auto transition-all translate-x-4 md:group-hover/share:translate-x-0 duration-300">
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Chia sẻ Facebook"
              className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all border border-white/20 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Facebook size={16} fill="currentColor" />
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Chia sẻ Twitter"
              className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-sky-500 hover:scale-110 transition-all border border-white/20 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Twitter size={16} fill="currentColor" />
            </a>
            <a 
              href={`https://sp.zalo.me/share/base?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Chia sẻ Zalo"
              className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-[#0068ff] hover:scale-110 transition-all border border-white/20 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle size={16} fill="currentColor" />
            </a>
            <a 
              href={`https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Chia sẻ Threads"
              className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-black hover:scale-110 transition-all border border-white/20 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <AtSign size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Image section */}
      <Link to={`/${product.id}`} className="block relative aspect-[4/3] overflow-hidden m-4 rounded-2xl border border-white/5 bg-slate-900">
        <img 
          src={product.image} 
          alt={`${product.name} - Deal hời giá rẻ tại Mua ngay đi`} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
      </Link>

      {/* Content section */}
      <div className="p-4 sm:p-6 pt-2 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            <Star size={12} className="sm:w-[14px] sm:h-[14px]" fill="currentColor" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-300">{product.rating}</span>
          <span className="text-slate-500 text-[9px] sm:text-[10px]">({product.reviews})</span>
        </div>
        
        <Link to={`/${product.id}`} className="font-display font-black text-white group-hover:text-brand-primary transition-colors mb-2 line-clamp-2 leading-tight uppercase tracking-tight text-sm sm:text-lg">
          {product.name}
        </Link>
        
        <p className="text-slate-400 text-[11px] sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl font-black font-display text-white">{product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-slate-500 line-through">{product.originalPrice}</span>
            )}
          </div>

          <a 
            href={product.productUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-white text-black group-hover:bg-brand-primary group-hover:text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl uppercase tracking-tighter text-[11px] sm:text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            SĂN DEAL NGAY <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
