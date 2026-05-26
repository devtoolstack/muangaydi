import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Database, ExternalLink, RefreshCw, FileSpreadsheet, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function SheetEmbed() {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVGYFkgGz1rMHYcK_dnb_Y-QXEoBsuZX_P3juzTgkm8L_cDPDeQva8q3-CtiuU2Ypy0J-g3jhU5hG2/pubhtml?gid=0&single=true";
  const iframeSrc = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVGYFkgGz1rMHYcK_dnb_Y-QXEoBsuZX_P3juzTgkm8L_cDPDeQva8q3-CtiuU2Ypy0J-g3jhU5hG2/pubhtml?gid=0&single=true&widget=true&headers=false";

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <Helmet>
        <title>Nguồn Dữ Liệu Bảng Tính | Mua ngay đi</title>
        <meta name="description" content="Nguồn dữ liệu Google Sheets đồng bộ trực tiếp với website Mua ngay đi." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <Database size={24} />
              </span>
              <h1 className="text-3xl font-display font-black uppercase tracking-tight text-white">
                BẢNG TÍNH DỮ LIỆU
              </h1>
            </div>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              Nguồn cấp dữ liệu thời gian thực được kết nối trực tiếp với website. Mọi chỉnh sửa trên trang tính sẽ tự động được cập nhật.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl border border-white/10 transition-all text-sm font-medium"
            >
              <RefreshCw size={16} className="animate-hover-spin" /> Làm mới dữ liệu
            </button>
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-sm font-bold uppercase tracking-wider"
            >
              Xem trang tính gốc <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass p-5 border border-white/5 bg-white/[0.02] rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">ĐỒNG BỘ TỰ ĐỘNG</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống nạp trực tiếp file CSV trực tuyến từ tài khoản Google của bạn mỗi khi người dùng truy cập trang, không thông qua bước trung gian.
              </p>
            </div>
          </div>

          <div className="glass p-5 border border-white/5 bg-white/[0.02] rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">CÁC CỘT BẮT BUỘC</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Đảm bảo các tiêu đề cột đúng cấu trúc: <code className="text-brand-primary font-mono select-all font-bold">Tên sản phẩm</code>, <code className="text-brand-primary font-mono font-bold">Mô tả</code>, <code className="text-brand-primary font-mono font-bold">Giá gốc</code>, <code className="text-brand-primary font-mono font-bold">Giá khuyến mãi</code>, <code className="text-brand-primary font-mono font-bold">Ảnh</code>, <code className="text-brand-primary font-mono font-bold">Danh mục</code>, <code className="text-brand-primary font-mono font-bold">Link Affiliate</code>, <code className="text-brand-primary font-mono font-bold">Tình trạng</code>.
              </p>
            </div>
          </div>

          <div className="glass p-5 border border-white/5 bg-white/[0.02] rounded-2xl flex items-start gap-4">
            <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg shrink-0">
              <RefreshCw size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">TỐI ƯU HÓA BỘ NHỚ ĐỆM</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Phía phía máy chủ (SSR) áp dụng bộ nhớ đệm thông minh để giảm số lượng kết nối trực tiếp giúp website siêu tốc và tránh lỗi giới hạn Google Bots.
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Iframe Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass border border-white/10 rounded-3xl overflow-hidden bg-white/[0.03] shadow-2xl relative"
        >
          {/* Top Bar for Sandbox Sheet View */}
          <div className="px-6 py-4 bg-brand-dark/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest ml-2">Chế độ xem bảng tính live</span>
            </div>
            <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ● ĐÃ KẾT NỐI
            </div>
          </div>

          {/* Iframe */}
          <div className="relative w-full overflow-x-auto bg-[#1e1e1e]" style={{ height: '70vh' }}>
            <iframe
              src={iframeSrc}
              className="absolute top-0 left-0 w-full h-full border-0"
              title="Google Sheet Database Editor"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
