import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, ExternalLink, Sparkles, ShoppingCart, MessageSquare, ArrowRight, ShieldCheck, Gift } from 'lucide-react';

export default function RiokuponBanner() {
  const [copied, setCopied] = useState(false);
  const code = "U1123163";
  const link = "https://u.riokupon.me/1123163";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 relative z-20">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl sm:rounded-[36px] overflow-hidden p-6 sm:p-8 lg:p-10 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 via-slate-900 to-emerald-900/40 backdrop-blur-xl shadow-2xl shadow-emerald-950/50"
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Content */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Top Tag */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs uppercase tracking-wider shadow-inner">
                <Sparkles size={14} className="text-emerald-400 animate-spin-slow" /> Mẹo Tiết Kiệm Tiền Độc Quyền
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold text-xs">
                <Gift size={13} /> Hoàn Tiền Mọi Sàn
              </span>
            </div>

            {/* Catchy Headline */}
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              Ê Khoan! Từ Từ Hẵng Chốt Đơn! 🛒⚡
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Vào Messenger Facebook <strong className="text-emerald-300 font-bold">Riokupon Vietnam</strong>, chọn <strong className="text-emerald-300 font-bold">"Nhắn tin"</strong> rồi nhập mã <strong className="text-amber-300 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/20">{code}</strong> để kích hoạt tính năng hoàn tiền siêu hời cho mọi đơn hàng Shopee, Lazada, TikTok Shop!
            </p>

            {/* Steps List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-1">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">1</div>
                <div className="text-xs text-slate-300">Vào FB <strong className="text-white block">Riokupon VN</strong></div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">2</div>
                <div className="text-xs text-slate-300">Bấm nút <strong className="text-white block">"Nhắn tin"</strong></div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center shrink-0">3</div>
                <div className="text-xs text-slate-300">Gửi mã <strong className="text-amber-300 block font-bold">{code}</strong></div>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-slate-900/90 border border-emerald-500/30 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mã Giới Thiệu Hoàn Tiền:</span>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={13} /> Đã Xác Nhận 100%
              </span>
            </div>

            {/* Code Box & Copy */}
            <div className="flex items-center justify-between gap-3 bg-black/60 border border-emerald-500/40 rounded-xl p-2.5 sm:p-3">
              <div className="font-mono text-2xl sm:text-3xl font-black text-amber-300 tracking-wider pl-2">
                {code}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 active:scale-95 ${
                  copied 
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-400/30'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={16} /> Đã Chép!
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Sao Chép Mã
                  </>
                )}
              </button>
            </div>

            {/* CTA Button */}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-98"
            >
              <MessageSquare size={18} className="fill-current" /> Truy Cập Riokupon Nhận Hoàn Tiền <ExternalLink size={16} />
            </a>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShoppingCart size={13} className="text-emerald-400" /> Mua sắm thông thái - Hoàn tiền tự động mỗi đơn hàng!
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
