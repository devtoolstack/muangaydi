import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, MOCK_PRODUCTS } from './types';
import { fetchProductsFromSheet } from './services/sheetService';

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES = [
  { label: "Tất cả giá", min: 0, max: Infinity },
  { label: "Dưới 100k", min: 0, max: 100000 },
  { label: "100k - 500k", min: 100000, max: 500000 },
  { label: "500k - 2Tr", min: 500000, max: 2000000 },
  { label: "Trên 2Tr", min: 2000000, max: Infinity },
];

interface ProductContextType {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPriceRange: PriceRange;
  setSelectedPriceRange: (range: PriceRange) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRanges: PriceRange[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(['Tất cả']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProductsFromSheet();
      if (data && data.length > 0) {
        setProducts(data);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map(p => p.category)));
        setCategories(['Tất cả', ...uniqueCategories]);
      }
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu từ Google Sheets. Đang sử dụng dữ liệu mẫu.');
      console.error(err);
      // Still set categories from mock products if fetch fails
      const uniqueCategories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)));
      setCategories(['Tất cả', ...uniqueCategories]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ 
      products, 
      categories, 
      loading, 
      error, 
      refreshProducts,
      selectedCategory,
      setSelectedCategory,
      selectedPriceRange,
      setSelectedPriceRange,
      searchQuery,
      setSearchQuery,
      priceRanges: PRICE_RANGES
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
