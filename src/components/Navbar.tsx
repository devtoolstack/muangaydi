import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../ProductContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useProducts();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-brand-primary/20">
              M
            </div>
            <span className="font-display font-black text-2xl tracking-tighter uppercase">Mua ngay đi</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm sản phẩm, thương hiệu..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none text-sm text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Danh mục <ChevronDown size={16} />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-brand-dark/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 p-2">
                {categories.map((cat) => (
                  <button key={cat} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Khuyến mãi</Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 outline-none text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button key={cat} className="px-4 py-2 text-sm bg-white/5 border border-white/5 rounded-lg text-left text-slate-300">
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
