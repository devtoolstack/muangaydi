import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, MOCK_PRODUCTS } from './types';
import { fetchProductsFromSheet } from './services/sheetService';

interface ProductContextType {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(['Tất cả']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <ProductContext.Provider value={{ products, categories, loading, error, refreshProducts }}>
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
