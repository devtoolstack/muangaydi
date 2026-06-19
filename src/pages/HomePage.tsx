import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import HotDeals from '../components/HotDeals';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import AdZone from '../components/AdZone';
import { CATEGORIES } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, Tag, ChevronLeft, ChevronRight, BookOpen, ArrowRight, Clock, Calendar, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { BLOG_POSTS } from '../data/blogData';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 24;

export default function HomePage() {
  const { 
    products, 
    loading, 
    error,
    selectedCategory,
    setSelectedCategory,
    selectedPriceRange,
    setSelectedPriceRange,
    searchQuery,
    setSearchQuery,
    priceRanges
  } = useProducts();

  const [currentPage, setCurrentPage] = useState(1);

  // Helper to parse price string to number
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    let clean = priceStr.toLowerCase().trim();
    
    // Handle 'tr' notation first (e.g., 2.5tr -> 2500000)
    if (clean.includes('tr')) {
      const value = parseFloat(clean.replace('tr', '').replace(',', '.'));
      return isNaN(value) ? 0 : value * 1000000;
    }

    // Handle 'k' notation (e.g., 50k -> 50000)
    if (clean.endsWith('k')) {
      const value = parseFloat(clean.replace('k', '').replace(',', '.'));
      return isNaN(value) ? 0 : value * 1000;
    }
    
    // Default: remove currency symbol and standard delimiters
    clean = clean.replace(/[₫đ.,]/g, "");
    return parseInt(clean) || 0;
  };

  // Find featured product (most reviews/rating) for SEO image
  const featuredProduct = products.length > 0 
    ? [...products].sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))[0]
    : null;

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "Tất cả" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const priceValue = parsePrice(p.price);
    const matchesPrice = priceValue >= selectedPriceRange.min && priceValue <= selectedPriceRange.max;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Pagination logic
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPriceRange, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 800, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Mua ngay đi | Sản phẩm Trend & Giá Tốt</title>
        <meta name="description" content="Nền tảng mua sắm hiện đại tổng hợp deal hời, sản phẩm xu hướng và mã giảm giá từ Shopee, Lazada, Tiki. Trải nghiệm mua sắm mượt mà nhất." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : ''} />
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
      
      <HotDeals products={products} />
      
      {/* Premium Horizontal Ad Banner Position */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
        <AdZone format="banner" zoneId="homepage-top-banner" />
      </div>
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* Category Header & Search */}
        <div className="flex flex-col gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 uppercase tracking-tight">Khám Phá Deal Hời</h2>
              <p className="text-slate-400 text-base sm:text-lg">
                {loading ? "Đang cập nhật sản phẩm..." : `Tìm thấy ${filteredProducts.length} sản phẩm tương ứng`}
              </p>
            </div>
            
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Tìm deal, thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 sm:py-4 pl-11 pr-4 outline-none focus:ring-2 focus:ring-brand-primary/20 text-white placeholder:text-slate-500 transition-all font-bold text-sm sm:text-base"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-tight transition-all pb-3 sm:pb-3.5 border whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-white text-black border-white shadow-xl shadow-white/10' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex-shrink-0 flex items-center gap-2 mr-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-r border-white/10 pr-4">
                <Tag size={14} /> Khoảng giá:
              </div>
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPriceRange(range)}
                  className={`flex-shrink-0 px-5 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all border whitespace-nowrap ${
                    selectedPriceRange.label === range.label 
                      ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  <ProductCard product={product} />
                  {/* Blended Native Advertisement Card after the 5th product card */}
                  {index === 4 && (
                    <AdZone format="native" zoneId="homepage-native-grid-1" />
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && !loading && (
          <div className="mt-16 flex flex-wrap justify-center items-center gap-2 sm:gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-95"
              title="Trang trước"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                // Only show current, first, last, and pages around current
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-12 h-12 rounded-2xl font-black text-sm uppercase tracking-tight transition-all active:scale-90 border ${
                        currentPage === page
                          ? 'bg-white text-black border-white shadow-xl shadow-white/20'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 || 
                  page === currentPage + 2
                ) {
                  return <span key={page} className="text-slate-600 font-bold">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-95"
              title="Trang sau"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-32 glass border-white/5 rounded-[40px] border-dashed">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
              <Filter size={32} />
            </div>
            <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Không tìm thấy deal nào</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Không có sản phẩm nào khớp với bộ lọc hiện tại. Hãy thử thay đổi danh mục hoặc khoảng giá nhé!</p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button 
                onClick={() => {
                  setSelectedCategory("Tất cả");
                  setSelectedPriceRange(priceRanges[0]);
                  setSearchQuery("");
                }}
                className="bg-white text-black px-8 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Cẩm Nang Mua Sắm Nổi Bật Section to satisfy AdSense crawl bot with extremely rich text content */}
        <div className="mt-24 pt-16 border-t border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                <span className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20">
                  <BookOpen size={20} />
                </span>
                Cẩm nang mua sắm nổi bật
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2">Bí quyết săn voucher, lập kế hoạch chi tiêu thông thái và kinh nghiệm tránh lừa đảo của các tín đồ mua sắm</p>
            </div>
            <Link 
              to="/cam-nang" 
              className="inline-flex items-center gap-2 text-sm text-brand-primary font-bold uppercase tracking-wider hover:underline hover:translate-x-1 transition-all shrink-0"
            >
              Xem tất cả cẩm nang <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <div 
                key={post.id} 
                className="group flex flex-col glass border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-3xl overflow-hidden p-5 transition-all duration-300"
              >
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-5 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[10px] font-black uppercase text-brand-primary px-2.5 py-1 rounded-lg border border-brand-primary/20">
                    {post.category}
                  </span>
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {post.publishedAt}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                    </div>
                    
                    <h3 className="text-base font-bold text-white uppercase tracking-tight group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug mb-2">
                      <Link to={`/cam-nang/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-slate-400 text-xs leading-relaxed mb-5 line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                  
                  <Link 
                    to={`/cam-nang/${post.slug}`} 
                    className="inline-flex items-center gap-1 text-xs text-brand-primary font-bold uppercase tracking-wider self-start group-hover:translate-x-1 transition-transform"
                  >
                    Xem chi tiết <ChevronRightIcon size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section for GEO/SEO */}
        <div className="mt-32 pt-20 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-black mb-12 uppercase tracking-tight text-center">Câu hỏi thường gặp</h2>
            <div className="space-y-6">
              <details className="group glass border-white/10 rounded-2xl overflow-hidden p-6 hover:bg-white/5 transition-all cursor-pointer">
                <summary className="text-white font-bold text-lg list-none flex justify-between items-center outline-none">
                  Mua ngay đi là gì?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  Mua ngay đi là nền tảng tổng hợp các sản phẩm đang có giá hời, trend và các mã giảm giá mới nhất từ các sàn thương mại điện tử lớn như Shopee, Lazada, Tiki. Chúng tôi giúp bạn tiết kiệm thời gian và tiền bạc khi mua sắm online.
                </div>
              </details>

              <details className="group glass border-white/10 rounded-2xl overflow-hidden p-6 hover:bg-white/5 transition-all cursor-pointer">
                <summary className="text-white font-bold text-lg list-none flex justify-between items-center outline-none">
                  Làm thế nào để săn được deal rẻ nhất?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  Để săn được deal hời, bạn nên thường xuyên theo dõi mục "Gợi ý dành cho bạn" trên trang chủ Mua ngay đi và kiểm tra trang "Khuyến mãi" để lấy mã giảm giá trước khi thanh toán tại các sàn.
                </div>
              </details>

              <details className="group glass border-white/10 rounded-2xl overflow-hidden p-6 hover:bg-white/5 transition-all cursor-pointer">
                <summary className="text-white font-bold text-lg list-none flex justify-between items-center outline-none">
                  Các mã giảm giá có thực sự hiệu quả?
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                  Đúng vậy, hệ thống của chúng tôi quét và cập nhật mã giảm giá liên tục. Các mã được gắn nhãn "Đã xác minh" là những mã đang hoạt động tốt nhất tại thời điểm hiện tại.
                </div>
              </details>
            </div>

            {/* BuildPublic Verification Badge */}
            <div className="mt-16 flex flex-col items-center justify-center gap-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Xác minh đối tác</span>
              <a 
                href="https://buildpublic.cc/p/mang-xa-hoi-muangaydi?ref=buildpublic.cc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-all hover:scale-105 active:scale-95 duration-200 block"
              >
                <img 
                  src="https://buildpublic.cc/badge/mang-xa-hoi-muangaydi/light" 
                  alt="Mạng xã hội Muangaydi - buildpublic.cc" 
                  width="170" 
                  height="50" 
                  className="rounded-xl shadow-lg border border-white/5"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
