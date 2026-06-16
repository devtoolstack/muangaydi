import React, { useEffect, useRef } from 'react';
import { Tag, Sparkles, TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface AdZoneProps {
  zoneId?: string;
  format?: 'banner' | 'native' | 'sidebar' | 'inline';
}

export default function AdZone({ zoneId, format = 'inline' }: AdZoneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If a custom global monetization/script zoneId exists, we can inject/setup it safely
    if (zoneId && containerRef.current) {
      const isConfigured = window.hasOwnProperty(`__ad_zone_${zoneId}`);
      if (!isConfigured) {
        // In the future, if a user wants to paste their specific Monetag/Google/AdSense inline script,
        // it can be automatically attached or bound to this ref container.
        console.log(`[AdZone] Mounted zone: ${zoneId} of format: ${format}`);
      }
    }
  }, [zoneId, format]);

  // Premium, beautiful native promotional fallback cards that make the site look premium and generate revenue!
  if (format === 'native') {
    return (
      <div 
        ref={containerRef}
        id={`ad-zone-native-${zoneId || 'default'}`}
        className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-brand-primary/20 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-brand-primary/5 min-h-[380px]"
      >
        {/* Ad Tag top header */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-yellow-500">
          <Sparkles size={10} /> ĐƯỢC TÀI TRỢ
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900 border border-white/5 relative">
            <img 
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" 
              alt="Sponsored Brand Promotion" 
              className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>

          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-brand-primary">
              Cơ hội nhận ưu đãi đặc biệt
            </span>
            <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-brand-primary transition-colors mt-1 mb-2 line-clamp-2">
              Săn ngay quà tặng trị giá tới 1.500.000Đ khi mở tài khoản số đẹp hôm nay!
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm line-clamp-2">
              Chương trình khuyến mãi độc quyền liên kết giữa các sàn thương mại điện tử lớn nhất. Số lượng mã quà tặng có hạn.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ưu đãi hôm nay</span>
            <span className="text-white font-bold text-sm">Miễn phí 100%</span>
          </div>

          <a 
            href="https://shope.ee/8A9iYVPh8y" 
            target="_blank" 
            rel="noopener noreferrer nofollow"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black uppercase tracking-tight text-black transition-all hover:scale-105 active:scale-95 group-hover:bg-brand-primary group-hover:text-white"
          >
            Nhận mã <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  if (format === 'banner') {
    return (
      <div 
        ref={containerRef}
        id={`ad-zone-banner-${zoneId || 'default'}`}
        className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-primary/10 transition-all"
      >
        <div className="absolute top-3 left-3 flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-600 border border-white/5 px-2 py-0.5 rounded-md">
          QC
        </div>

        <div className="flex-1 flex gap-4 sm:gap-6 items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-primary/10 border border-brand-primary/25 rounded-2xl flex items-center justify-center shrink-0 text-brand-primary">
            <TrendingUp size={30} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-white text-base sm:text-lg font-black uppercase tracking-tight mb-1">
              🎉 Săn Voucher Hoàn Xu 100% - Shopee Live & Video
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Cơ hội tiết kiệm thêm tới 500k cho mỗi đơn hàng của bạn. Áp dụng đồng thời với mã freeship toàn quốc. Lịch phát sóng live cập nhật liên tục hôm nay.
            </p>
          </div>
        </div>

        <a 
          href="https://shope.ee/8A9iYVPh8y"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="shrink-0 flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-brand-primary hover:text-white border border-white/10 hover:border-brand-primary px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-200 transition-all duration-300 hover:scale-105"
        >
          Săn Ngay Bây Giờ <ArrowUpRight size={14} />
        </a>
      </div>
    );
  }

  if (format === 'sidebar') {
    return (
      <div 
        ref={containerRef}
        id={`ad-zone-sidebar-${zoneId || 'default'}`}
        className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-5 hover:border-brand-primary/10 transition-all flex flex-col gap-4"
      >
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Đề xuất tài trợ</span>
          <span className="text-[9px] font-black uppercase border border-white/10 px-1.5 py-0.5 rounded text-slate-500">QC</span>
        </div>

        <div className="flex gap-3">
          <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/5 overflow-hidden shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=200&auto=format&fit=crop" 
              alt="Discount Sneakers Offer" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-pink-500">Siêu Thể Thao</span>
            <h5 className="text-white font-bold text-xs line-clamp-2 mt-0.5">Xả kho giày hiệu Nike, Adidas giá hủy diệt, áp thêm mã 100K</h5>
          </div>
        </div>

        <a 
          href="https://shope.ee/8A9iYVPh8y"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="w-full text-center rounded-xl bg-white/5 hover:bg-brand-primary hover:text-white text-[10px] font-black uppercase tracking-wider text-slate-300 py-3 transition-colors border border-white/10 hover:border-brand-primary"
        >
          Xem Ngay Chi Tiết
        </a>
      </div>
    );
  }

  // default / inline format
  return (
    <div 
      ref={containerRef}
      id={`ad-zone-inline-${zoneId || 'default'}`}
      className="group relative overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.01] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-brand-primary/20 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/25 rounded-xl shrink-0">
          <Tag size={18} />
        </div>
        <div>
          <h5 className="text-white text-xs sm:text-sm font-bold uppercase tracking-tight flex items-center gap-2">
            Ưu Thích Nhất Tuần <span className="text-[9px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">QC</span>
          </h5>
          <p className="text-slate-400 text-[11px] sm:text-xs">
            Trình duyệt mã giảm giá tự động: Miễn phí vận chuyển & Hoàn tiền tối đa tới 15% khi thanh toán bằng ví điện tử.
          </p>
        </div>
      </div>

      <a 
        href="https://shope.ee/8A9iYVPh8y"
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-brand-primary hover:text-white border border-white/10 hover:border-brand-primary px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-300 transition-colors"
      >
        Nhận Ưu Đãi <ArrowUpRight size={12} />
      </a>
    </div>
  );
}
