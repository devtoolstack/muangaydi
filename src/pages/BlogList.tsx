import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Clock, Search, ArrowRight, BookMarked, Sparkles } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const categories = ['Tất cả', ...Array.from(new Set(BLOG_POSTS.map(post => post.category)))];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <Helmet>
        <title>Cẩm Nang Mua Sắm & Mẹo Tiết Kiệm | Mua ngay đi</title>
        <meta name="description" content="Nhật ký chia sẻ bí quyết săn mã giảm giá Shopee, Lazada, Tiki, cẩm nang phòng tránh lừa đảo và cách lập kế hoạch chi tiêu gia đình thông minh, tối ưu ngân sách." />
        <meta name="keywords" content="mẹo săn voucher, bí quyết tiết kiệm, tránh lừa đảo, kinh nghiệm mua sắm, quản lý tài chính gia đình" />
      </Helmet>

      {/* Decorative Blur Background Ball */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-xs font-bold text-brand-primary uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} className="animate-pulse" /> Kiến thức mua sắm thông thái
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white mb-6">
            MẸO SĂN DEAL <span className="bg-gradient-to-r from-brand-primary to-orange-400 bg-clip-text text-transparent">&</span> TIẾT KIỆM
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            Nơi tổng hợp các bài viết phân tích chuyên sâu, hướng dẫn mua sắm thông minh và cẩm nang hữu ích từ các chuyên gia để giúp bạn tiết kiệm tối đa chi phí mua sắm mỗi ngày.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass border border-white/5 bg-white/[0.02] p-5 rounded-3xl mb-12 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap uppercase tracking-wider transition-all duration-300 shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-brand-primary text-black border-brand-primary shadow-lg shadow-brand-primary/25 font-black'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5 hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, thẻ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all shadow-inner"
            />
            <Search size={18} className="absolute left-3.5 top-3 text-slate-500" />
          </div>
        </div>

        {/* Blog Post List Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-col glass border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative"
              >
                {/* Image Wrap */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  {/* Category Badge overlay */}
                  <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-brand-primary px-3 py-1.5 rounded-lg border border-brand-primary/30">
                    {post.category}
                  </span>
                </div>

                {/* Info Container */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Date/Time Indicator */}
                    <div className="flex items-center gap-4 text-slate-500 text-xs font-medium mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {post.publishedAt}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Blog Title */}
                    <h2 className="text-xl font-display font-black text-white leading-tight uppercase tracking-tight mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                      <Link to={`/cam-nang/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  {/* Read More link */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                      Tác giả: {post.author}
                    </span>
                    <Link
                      to={`/cam-nang/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs text-brand-primary font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                    >
                      Đọc tiếp <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
            <div className="p-4 bg-white/5 text-slate-400 inline-block rounded-2xl mb-4">
              <BookMarked size={32} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Không tìm thấy bài viết nào</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục tổng quan khác nhé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
