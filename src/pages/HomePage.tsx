import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Loader2 } from 'lucide-react';
import { useProducts } from '../ProductContext';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const { products, categories, loading, error } = useProducts();

  // Find featured product (most reviews/rating) for SEO image
  const featuredProduct = products.length > 0 
    ? [...products].sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))[0]
    : null;

  const filteredProducts = selectedCategory === "Tất cả" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Mua ngay đi | Sản phẩm Trend & Giá Tốt</title>
        <meta name="description" content="Nền tảng mua sắm hiện đại với các ưu đãi tốt nhất, thiết kế tối giản và trải nghiệm mượt mà." />
        <meta name="google-site-verification" content="NTrEYgh3qUCVaJTXYMOIc0uk7A3b48PxayCvFuOoeDQ" />
        {featuredProduct && (
          <>
            <meta property="og:image" content={featuredProduct.image} />
            <meta property="twitter:image" content={featuredProduct.image} />
          </>
        )}
      </Helmet>
      <Hero 
        productImage={featuredProduct?.image} 
        featuredProduct={featuredProduct} 
      />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-4xl font-black mb-2 uppercase tracking-tight">Gợi ý dành cho bạn</h2>
            <p className="text-slate-400">
              {loading ? "Đang cập nhật sản phẩm..." : `Tìm thấy ${filteredProducts.length} sản phẩm tương ứng`}
            </p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-tight transition-all pb-3.5 ${
                  selectedCategory === cat 
                    ? 'bg-white text-black shadow-2xl' 
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang đồng bộ từ Google Sheets...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-32 glass border-white/5 rounded-[40px] border-dashed">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
              <Filter size={32} />
            </div>
            <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Không tìm thấy deal nào</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Chưa có sản phẩm nào trong danh mục "{selectedCategory}". Hãy thử quay lại danh mục "Tất cả" nhé!</p>
            <button 
              onClick={() => setSelectedCategory("Tất cả")}
              className="mt-8 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold transition-all"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
