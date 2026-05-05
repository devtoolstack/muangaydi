import React from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 pt-16 pb-8 bg-white/5 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden font-bold">
                M
              </div>
              <span className="font-display font-black text-2xl tracking-tighter uppercase">Mua ngay đi</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Cổng thông tin mua sắm affiliate tin cậy, giúp bạn sở hữu những món đồ yêu thích với mức giá tối ưu nhất.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 glass border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 glass border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 glass border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black mb-6 uppercase tracking-widest text-xs text-slate-500">Mua sắm</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Đồ điện tử</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Thiết kế gia dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Thời trang nam/nữ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Làm đẹp & Sức khỏe</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-6 uppercase tracking-widest text-xs text-slate-500">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ quảng cáo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-6 uppercase tracking-widest text-xs text-slate-500">Bản tin</h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">Nhận thông báo về các ưu đãi hot nhất trực tiếp vào hộp thư của bạn.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full glass border-white/10 rounded-2xl py-4 px-4 outline-none text-sm pr-12 focus:ring-2 focus:ring-brand-primary/20 text-white placeholder:text-slate-500"
              />
              <button className="absolute right-2 top-2 h-10 w-10 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20">
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium">
            © 2024 Mua ngay đi. Tất cả quyền được bảo lưu. Thiết kế bởi AI.
          </p>
          <div className="flex gap-8 text-xs text-slate-500 font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { ArrowUpRight } from 'lucide-react';
