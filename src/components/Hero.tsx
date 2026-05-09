import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface HeroProps {
  productImage?: string;
  featuredProduct?: Product | null;
}

export default function Hero({ productImage, featuredProduct }: HeroProps) {
  const heroLink = featuredProduct ? `/${featuredProduct.id}` : '#';

  return (
    <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/20 border border-brand-primary/30 text-brand-primary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={14} fill="currentColor" />
              Săn Deal Giá Hời - Mỗi Ngày
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-6 tracking-tighter uppercase text-white">
              Mua Sắm Thông Minh <br />
              <span className="text-gradient">Tiết Kiệm Tối Đa</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-xl md:text-2xl max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed font-medium">
              Tổng hợp mã giảm giá và deals hời nhất từ Shopee, Lazada, Tiki. Cập nhật liên tục mỗi giờ, chốt đơn ngay không cần lo giá!
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4">
              <Link 
                to={heroLink}
                className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-6 sm:px-10 py-4 rounded-2xl font-black text-sm sm:text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all group active:scale-95 shadow-2xl shadow-brand-primary/20 uppercase tracking-tight cursor-pointer"
              >
                Xem Deal HOT nhất <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to={heroLink}
                className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 sm:px-10 py-4 rounded-2xl font-black text-sm sm:text-lg hover:bg-white/20 transition-all active:scale-95 uppercase tracking-tight cursor-pointer flex items-center justify-center"
              >
                Voucher hôm nay
              </Link>
            </div>

            <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-8 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-3xl font-black font-display tracking-tight text-white line-clamp-1">150k+</div>
                <div className="text-slate-500 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest leading-tight">Người dùng tin dùng</div>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 sm:h-10 bg-white/10" />
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-black font-display tracking-tight text-white line-clamp-1">1.2k+</div>
                <div className="text-slate-500 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest leading-tight">Deal mỗi ngày</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden sm:block lg:block"
          >
            <Link 
              to={heroLink}
              className="relative z-10 block rounded-[40px] sm:rounded-5xl overflow-hidden glass shadow-2xl shadow-brand-primary/10 rotate-3 transition-transform hover:rotate-0 duration-500 border border-white/20 group"
            >
              <img 
                src={productImage || "https://images.unsplash.com/photo-1542491509-3001e1e1199a?q=80&w=1000&auto=format&fit=crop"} 
                alt="Shopping Trend" 
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 sm:p-8">
                <p className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm">Xem chi tiết sản phẩm</p>
              </div>
            </Link>
            
            <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 z-20 bg-white/10 backdrop-blur-3xl p-4 sm:p-5 rounded-[24px] sm:rounded-3xl shadow-2xl rotate-6 flex items-center gap-3 sm:gap-4 border border-white/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-brand-primary">
                <ShoppingCart size={18} />
              </div>
              <div>
                <div className="font-black text-base sm:text-lg text-white">2k+ Lượt mua</div>
                <div className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase">Trong 24h qua</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
