import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Ticket, Copy, CheckCircle2, Calendar, Users, ExternalLink, ShieldCheck } from 'lucide-react';
import { Coupon } from '../types';
import { fetchCoupons } from '../services/sheetService';
import { motion, AnimatePresence } from 'motion/react';

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCoupons();
      setCoupons(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-12 w-64 bg-white/5 animate-pulse rounded-xl mx-auto mb-10"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/10"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4">
      <Helmet>
        <title>Săn Mã Giảm Giá Shopee, Lazada, Tiki | Mua ngay đi</title>
        <meta name="description" content="Tổng hợp mã giảm giá Shopee, Lazada, Tiki mới nhất. Cập nhật liên tục, săn deal hời mỗi ngày cùng MuaNgayDi." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            Mã Giảm Giá & <span className="text-brand-primary">Vouchers</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Tổng hợp những mã khuyến mãi mới nhất từ Shopee, Lazada, Tiki. Tiết kiệm hơn cho mỗi đơn hàng của bạn.
          </motion.p>
        </div>

        <div className="grid gap-6">
          <AnimatePresence>
            {coupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-brand-primary/30 transition-colors"
                id={`coupon-${coupon.id}`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Store Logo/Badge Area */}
                  <div className="md:w-48 bg-white/5 p-8 flex flex-col items-center justify-center border-r border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center mb-3 shadow-xl border border-white/10 group-hover:scale-110 transition-transform">
                      <Ticket className="text-brand-primary" size={32} />
                    </div>
                    <span className="text-white font-bold text-lg">{coupon.store}</span>
                    {coupon.isVerified && (
                      <div className="flex items-center gap-1 mt-2 text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        <ShieldCheck size={10} /> Verified
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white leading-tight">{coupon.title}</h3>
                        <div className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg text-sm font-black">
                          {coupon.discountValue}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{coupon.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md">
                          <Calendar size={14} /> Hết hạn: {coupon.expiryDate}
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md">
                          <Users size={14} /> {coupon.copyCount.toLocaleString()} lượt dùng
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative flex-1 w-full sm:w-auto">
                        <div className="bg-brand-dark/50 border-2 border-dashed border-white/10 rounded-xl px-4 py-3 font-mono text-white text-center font-bold tracking-widest overflow-hidden">
                          {coupon.code}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleCopy(coupon.code, coupon.id)}
                        className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                          copiedId === coupon.id 
                            ? 'bg-green-500 text-white' 
                            : 'bg-brand-primary text-black hover:shadow-lg hover:shadow-brand-primary/20'
                        }`}
                      >
                        {copiedId === coupon.id ? (
                          <>
                            <CheckCircle2 size={18} /> Đã sao chép
                          </>
                        ) : (
                          <>
                            <Copy size={18} /> Sao chép mã
                          </>
                        )}
                      </button>
                      <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white/5 text-slate-300 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all"
                      >
                        <ExternalLink size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Info Section */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-brand-primary/20 to-transparent border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Mẹo lượm mã giảm giá</h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-400 text-sm">
            <div className="space-y-4">
              <p className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold shrink-0 text-xs">1</span>
                <span>Kiểm tra mã vào các khung giờ vàng (0H, 9H, 12H, 21H) để săn được các mã hot nhất từ sàn.</span>
              </p>
              <p className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold shrink-0 text-xs">2</span>
                <span>Luôn ưu tiên các mã "Verified" được hệ thống Mua Ngay Đi xác thực thủ công.</span>
              </p>
            </div>
            <div className="space-y-4">
              <p className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold shrink-0 text-xs">3</span>
                <span>Kết hợp nhiều mã (mã shop, mã sàn, mã vận chuyển) để có mức giá tốt nhất.</span>
              </p>
              <p className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold shrink-0 text-xs">4</span>
                <span>Để ý điều kiện "Giá trị đơn hàng tối thiểu" để áp mã thành công.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
