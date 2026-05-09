import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RefreshCcw, ArrowLeft, ShoppingBag, Loader2, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../ProductContext';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  const [copied, setCopied] = React.useState(false);
  const product = products.find(p => p.id === id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center py-20 gap-4 min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 text-center py-20">
        <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Không tìm thấy sản phẩm</h2>
        <Link to="/" className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-brand-primary hover:text-white transition-all inline-block">Quay lại trang chủ</Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .sort((a, b) => {
      const aSameCat = a.category === product.category ? 1 : 0;
      const bSameCat = b.category === product.category ? 1 : 0;
      if (aSameCat !== bSameCat) return bSameCat - aSameCat;
      
      const aHot = a.isHot ? 1 : 0;
      const bHot = b.isHot ? 1 : 0;
      if (aHot !== bHot) return bHot - aHot;
      
      return (b.rating * b.reviews) - (a.rating * a.reviews);
    })
    .slice(0, 4);

  return (
    <div className="pt-24 pb-20">
      <Helmet>
        <title>{product.name} | Săn Deal Giá Hời - Mua ngay đi</title>
        <meta name="description" content={`${product.name}. ${product.description.substring(0, 150)}... Săn ngay deal hời tại Mua ngay đi.`} />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={`${product.name} - Mua ngay đi`} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.image} />
        <meta property="twitter:title" content={`${product.name} - Mua ngay đi`} />
        <meta property="twitter:description" content={product.description.substring(0, 160)} />
        <meta property="twitter:image" content={product.image} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 items-center flex gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-brand-primary transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Trang chủ
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-brand-dark font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="rounded-[48px] overflow-hidden glass border-white/20 bg-slate-900 aspect-square shadow-2xl">
              <img 
                src={product.image} 
                alt={`${product.name} - Hình ảnh sản phẩm chi tiết`} 
                loading="lazy"
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 bg-brand-primary/20 border border-brand-primary/30 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest">
                  {product.category}
                </span>
                {product.status && (
                  <span className={`px-4 py-1.5 border rounded-full text-xs font-bold uppercase tracking-widest ${
                    product.status.toLowerCase().includes('hết') 
                      ? 'bg-slate-800 border-slate-700 text-slate-400' 
                      : 'bg-red-500/20 border-red-500/30 text-red-500'
                  }`}>
                    {product.status}
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter uppercase">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "text-amber-400" : "text-white/10"} />
                  ))}
                  <span className="ml-2 font-bold text-white">{product.rating}</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-white/10" />
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">{product.reviews} đánh giá</span>
              </div>
            </div>
 
            <div className="p-6 sm:p-10 glass border-white/20 rounded-[40px] mb-8 shadow-3xl text-center">
              <div className="mb-6">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Giá đang áp dụng ưu đãi</span>
                <div className="flex flex-wrap items-baseline justify-center gap-3 sm:gap-4">
                  <span className="text-4xl sm:text-6xl font-black font-display text-white">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl sm:text-2xl text-slate-500 line-through font-bold">{product.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-2xl mb-10 overflow-hidden relative">
                <p className="text-brand-primary text-sm font-bold animate-pulse relative z-10">
                  🔥 Chốt đơn ngay - Giá có thể tăng lại bất cứ lúc nào!
                </p>
                <div className="absolute inset-0 bg-brand-primary/5 -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>

              <div className="flex gap-4">
                <a 
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-[0.98] shadow-2xl shadow-brand-primary/30 uppercase tracking-tighter"
                >
                  SĂN DEAL NGAY <ShoppingBag size={24} />
                </a>
                <button 
                  onClick={handleShare}
                  className="w-20 bg-white/5 border border-white/10 text-white rounded-3xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 group relative"
                  title="Chia sẻ sản phẩm"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check size={24} className="text-brand-primary" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="share"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Share2 size={24} className="group-hover:rotate-12 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <p className="mt-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                * Click để được dẫn trực tiếp đến cửa hàng chính hãng
              </p>
            </div>
          </motion.div>
        </div>

        {/* DETAILED DESCRIPTION SECTION */}
        <div className="grid lg:grid-cols-3 gap-12 mb-24">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass border-white/10 rounded-[40px] p-8 md:p-12">
              <h3 className="font-display text-2xl font-black mb-8 uppercase tracking-widest text-slate-400 border-b border-white/5 pb-4">
                Mô tả chi tiết
              </h3>
              <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-6"
          >
            <div className="glass border-brand-primary/20 bg-brand-primary/5 rounded-[32px] p-8">
              <h3 className="text-white font-black uppercase tracking-tight mb-6">Tại sao nên chọn?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center shrink-0 text-black font-bold">✓</div>
                  <span>Giá tốt nhất thời điểm hiện tại so với các shop khác.</span>
                </li>
                <li className="flex gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center shrink-0 text-black font-bold">✓</div>
                  <span>Sản phẩm nằm trong TOP TREND được cộng đồng săn đón.</span>
                </li>
                <li className="flex gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center shrink-0 text-black font-bold">✓</div>
                  <span>Đã được kiểm chứng chất lượng qua {product.reviews} đánh giá thực tế.</span>
                </li>
              </ul>
            </div>

            <div className="glass border-white/10 rounded-[32px] p-8">
              <h3 className="text-white font-black uppercase tracking-tight mb-4">Cam kết</h3>
              <div className="space-y-4 text-xs text-slate-400 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-brand-primary" /> 100% Chính hãng
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-brand-primary" /> Giao hàng toàn quốc
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCcw size={16} className="text-brand-primary" /> Đổi trả dễ dàng
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Related Section */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pb-20"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-brand-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Khám phá thêm</span>
                <h3 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter">Sản phẩm tương tự & Trend</h3>
              </div>
              <Link to="/" className="group flex items-center gap-2 text-slate-400 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors">
                Xem tất cả <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
