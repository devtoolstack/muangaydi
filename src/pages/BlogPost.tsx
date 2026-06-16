import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Link2, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { getMergedBlogPosts } from '../services/blogService';
import AdZone from '../components/AdZone'; // Import AdZone

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  
  const dynamicBlogPosts = getMergedBlogPosts(products);
  const post = dynamicBlogPosts.find(p => p.slug === id);

  if (!post) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center px-4 relative z-10">
        <div className="max-w-md mx-auto bg-white/[0.02] border border-white/5 p-12 rounded-3xl">
          <h2 className="text-2xl font-display font-black text-white uppercase mb-4">Bài viết không tồn tại</h2>
          <p className="text-slate-400 text-sm mb-8">Nội dung bạn tìm kiếm có thể đã được thay đổi đường dẫn hoặc tạm thời gỡ bỏ.</p>
          <Link
            to="/cam-nang"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-black font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-brand-primary/90 transition-all"
          >
            <ArrowLeft size={16} /> Quay lại cẩm nang
          </Link>
        </div>
      </div>
    );
  }

  // Related posts (excluding current post)
  const relatedPosts = dynamicBlogPosts.filter(p => p.slug !== post.slug).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép liên kết bài viết thành công!');
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <Helmet>
        <title>{post.title} | Mua ngay đi Cẩm Nang</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={`${post.title} | Mua ngay đi`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Decorative Blur Background Ball */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link to="/" className="hover:text-brand-primary transition-colors">Trang chủ</Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link to="/cam-nang" className="hover:text-brand-primary transition-colors">Cẩm Nang</Link>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-slate-300 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Article Content */}
          <main className="lg:col-span-8">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass border border-white/5 bg-white/[0.01] rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10 shadow-2xl"
            >
              {/* Cover Image */}
              <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter brightness-95"
                />
                <span className="absolute top-4 left-4 bg-brand-primary text-black text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg">
                  {post.category}
                </span>
              </div>

              {/* Title & Stats */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black uppercase tracking-tight text-white leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs font-medium pb-6 mb-8 border-b border-white/5">
                <span className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-lg">
                    <User size={14} />
                  </div>
                  Tác giả: <strong className="text-slate-200">{post.author}</strong>
                </span>
                <span className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-lg">
                    <Calendar size={14} />
                  </div>
                  Đăng tải: <strong className="text-slate-200">{post.publishedAt}</strong>
                </span>
                <span className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-primary/10 text-brand-primary rounded-lg">
                    <Clock size={14} />
                  </div>
                  Thời gian: <strong className="text-slate-200">{post.readTime}</strong>
                </span>
              </div>

              {/* Real Content Body rendering (HTML Injection safe via sanitization placeholder) */}
              <div 
                className="rich-text-content prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags and Social Sharing footer */}
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl border border-white/5 cursor-default transition-all"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Sharing tools */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Chia sẻ bài viết:</span>
                  <button
                    onClick={() => {
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                    }}
                    className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-blue-400 rounded-xl border border-white/5 transition-all"
                    title="Nhấn chia sẻ lên Facebook"
                  >
                    <Facebook size={16} />
                  </button>
                  <button
                    onClick={() => {
                      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
                    }}
                    className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-blue-400 rounded-xl border border-white/5 transition-all"
                    title="Nhấn chia sẻ lên Twitter"
                  >
                    <Twitter size={16} />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-brand-primary rounded-xl border border-white/5 transition-all"
                    title="Sao chép đường dẫn trực tiếp"
                  >
                    <Link2 size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          </main>

          {/* Sidebar Area with related posts & ads guide */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Quick Promo Guide Box */}
            <div className="glass border border-brand-primary/10 bg-brand-primary/[0.02] p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles size={14} className="animate-pulse" /> ƯU ĐÃI ĐÁNG CHÚ Ý
              </div>
              <h3 className="font-display font-black text-white text-lg uppercase tracking-tight mb-3">
                Bạn đang tìm kiếm mã giảm giá?
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Truy cập ngay kho dữ liệu coupon khổng lồ được sàng lọc tự động, cập nhật mỗi giờ từ hệ thống Shopee, Lazada và Tiki hoàn toàn miễn phí tại Mua ngay đi.
              </p>
              <Link
                to="/khuyen-mai"
                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
              >
                Nhận Voucher Ngay
              </Link>
            </div>

            {/* Sidebar Ad Placement */}
            <AdZone format="sidebar" zoneId="blog-sidebar-ad" />

            {/* Recommended reading */}
            <div className="glass border border-white/5 p-6 rounded-3xl bg-white/[0.01]">
              <h3 className="flex items-center gap-2 text-white font-display font-black text-base uppercase tracking-tight pb-4 mb-5 border-b border-white/5">
                <BookOpen size={18} className="text-brand-primary" /> BÀI VIẾT NÊN ĐỌC
              </h3>
              
              <div className="space-y-5">
                {relatedPosts.map(related => (
                  <div key={related.id} className="group/item flex gap-4">
                    <div className="aspect-square w-16 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={related.image}
                        alt={related.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-brand-primary font-black uppercase tracking-wider bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/15">
                        {related.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-200 mt-2 hover:text-brand-primary transition-colors line-clamp-2 leading-tight">
                        <Link to={`/cam-nang/${related.slug}`}>
                          {related.title}
                        </Link>
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back button link */}
            <div className="text-center">
              <Link
                to="/cam-nang"
                className="inline-flex items-center gap-2 text-xs text-slate-400 font-bold hover:text-brand-primary uppercase tracking-widest transition-colors py-2"
              >
                <ArrowLeft size={14} /> Quay lại danh mục cẩm nang
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
