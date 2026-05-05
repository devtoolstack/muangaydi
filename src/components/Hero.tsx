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
  const heroLink = featuredProduct ? `/product/${featuredProduct.id}` : '#';

  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/20 border border-brand-primary/30 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={14} fill="currentColor" />
              Săn Deal Giá Hời - Mỗi Ngày
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-black leading-[1.1] mb-6 tracking-tighter uppercase text-white">
              Mua Sắm Thông Minh <br />
              <span className="text-gradient">Tiết Kiệm Tối Đa</span>
            </h1>
            <p className="text-slate-400 text-xl md:text-2xl max-w-lg mb-10 leading-relaxed font-medium">
              Tổng hợp mã giảm giá và deals hời nhất từ Shopee, Lazada, Tiki. Cập nhật liên tục mỗi giờ, chốt đơn ngay không cần lo giá!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to={heroLink}
                className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-2 hover:opacity-90 transition-all group active:scale-95 shadow-2xl shadow-brand-primary/20 uppercase tracking-tight cursor-pointer"
              >
                Xem Deal HOT nhất <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to={heroLink}
                className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all active:scale-95 uppercase tracking-tight cursor-pointer flex items-center justify-center"
              >
                Voucher hôm nay
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-3xl font-black font-display tracking-tight text-white">150k+</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Người dùng tin dùng</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-3xl font-black font-display tracking-tight text-white">1.2k+</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Deal cập nhật mỗi ngày</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-3xl font-black font-display tracking-tight text-white">24/7</div>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Hỗ trợ săn voucher</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Link 
              to={heroLink}
              className="relative z-10 block rounded-5xl overflow-hidden glass shadow-2xl shadow-brand-primary/10 rotate-3 transition-transform hover:rotate-0 duration-500 border border-white/20 group"
            >
              <img 
                src={productImage || "https://images.unsplash.com/photo-1542491509-3001e1e1199a?q=80&w=1000&auto=format&fit=crop"} 
                alt="Shopping Trend" 
                className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <p className="text-white font-bold uppercase tracking-widest text-sm">Xem chi tiết sản phẩm</p>
              </div>
            </Link>
            
            <div className="absolute -bottom-6 -left-6 z-20 bg-white/10 backdrop-blur-3xl p-5 rounded-3xl shadow-2xl rotate-6 flex items-center gap-4 border border-white/20">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-primary">
                <ShoppingCart size={20} />
              </div>
              <div>
                <div className="font-black text-lg text-white">2k+ Lượt mua</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Trong 24h qua</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
