import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, ChevronDown, Clock, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../ProductContext';
import { Product } from '../types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const { 
    categories, 
    products, 
    setSelectedCategory, 
    setSearchQuery,
    priceRanges,
    setSelectedPriceRange
  } = useProducts();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      if (searchTerm.length === 0 && history.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
  }, [searchTerm, products, history]);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    // For now, search matches product name directly if possible, or just clear
    const match = products.find(p => p.name.toLowerCase() === term.toLowerCase());
    if (match) {
      window.open(match.productUrl, '_blank', 'noopener,noreferrer');
    } else {
      setSearchQuery(term);
      navigate('/');
    }
    
    setSearchTerm('');
    setShowSuggestions(false);
    setIsOpen(false);
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h !== item);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

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
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                placeholder="Tìm sản phẩm, thương hiệu..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none text-sm text-white placeholder:text-slate-500"
              />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (searchTerm || history.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-brand-dark/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2">
                {searchTerm.length === 0 && history.length > 0 && (
                  <div className="px-4 py-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                      <Clock size={12} /> Tìm kiếm gần đây
                    </p>
                    {history.map((item) => (
                      <div 
                        key={item}
                        onClick={() => handleSearch(item)}
                        className="flex items-center justify-between group cursor-pointer py-1.5"
                      >
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item}</span>
                        <button 
                          onClick={(e) => removeHistoryItem(e, item)}
                          className="p-1 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className="px-4 py-2 border-t border-white/5 first:border-t-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                      <TrendingUp size={12} /> Gợi ý sản phẩm
                    </p>
                    {suggestions.map((product) => (
                      <a
                        key={product.id}
                        href={product.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchTerm('');
                        }}
                        className="flex items-center gap-3 py-2 group"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-10 h-10 rounded-lg object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-300 group-hover:text-white transition-colors truncate font-medium">{product.name}</p>
                          <p className="text-xs text-brand-primary font-bold">{product.price}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
                
                {searchTerm && suggestions.length === 0 && (
                  <div className="px-4 py-3 text-center text-slate-500 text-sm">
                    Không tìm thấy kết quả phù hợp
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="group relative py-4">
              <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors h-full">
                Danh mục <ChevronDown size={16} />
              </button>
              <div className="absolute top-full right-0 pt-2 w-48 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <div className="bg-brand-dark/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl p-2">
                  {categories.map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedPriceRange(priceRanges[0]);
                        setSearchQuery("");
                        navigate("/");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/khuyen-mai" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Khuyến mãi</Link>
            <Link to="/cam-nang" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Cẩm nang</Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark/95 backdrop-blur-2xl border-b border-white/10 p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="relative" ref={mobileSearchRef}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              placeholder="Tìm kiếm sản phẩm..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-primary/20"
            />
            {/* Mobile Suggestions Area */}
            {searchTerm && suggestions.length > 0 && (
              <div className="mt-4 bg-white/5 rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                {suggestions.map((product) => (
                  <a
                    key={product.id}
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="flex items-center gap-4 p-3"
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="text-sm text-white font-bold line-clamp-1">{product.name}</p>
                      <p className="text-xs text-brand-primary">{product.price}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-2 mb-4">Danh mục sản phẩm</p>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedPriceRange(priceRanges[0]);
                    setSearchQuery("");
                    setIsOpen(false);
                    navigate("/");
                  }}
                  className="w-full px-4 py-3 text-sm bg-white/5 border border-white/5 rounded-xl text-left text-white font-bold hover:bg-brand-primary/20 transition-all flex items-center justify-between group"
                >
                  {cat}
                  <ChevronDown className="-rotate-90 text-slate-500 group-hover:text-white transition-colors" size={16} />
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-white/5 space-y-1">
             <Link to="/khuyen-mai" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm text-white font-bold hover:text-brand-primary transition-all">Khuyến mãi & Deals hời</Link>
             <Link to="/cam-nang" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-sm text-white font-bold hover:text-brand-primary transition-all">Cẩm nang tiết kiệm</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

