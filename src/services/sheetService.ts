import Papa from 'papaparse';
import { Product, Coupon } from '../types';
import { slugify } from '../lib/utils';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVGYFkgGz1rMHYcK_dnb_Y-QXEoBsuZX_P3juzTgkm8L_cDPDeQva8q3-CtiuU2Ypy0J-g3jhU5hG2/pub?gid=0&single=true&output=csv';

export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const response = await fetch('/api/coupons');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Fetch coupons error:', error);
    // Fallback data if API fails
    return [
      {
        id: 'fallback-1',
        store: 'Shopee',
        title: 'Giảm 50K cho đơn từ 0Đ',
        code: 'SHOPEE50K',
        description: 'Áp dụng cho khách hàng mới lần đầu mua sắm tại Shopee Mall.',
        expiryDate: '31/05/2026',
        copyCount: 1250,
        isVerified: true,
        discountValue: '50K',
        minSpend: '0Đ'
      }
    ];
  }
}

let cachedProducts: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache

export async function fetchProductsFromSheet(forceRefresh = false): Promise<Product[]> {
  const now = Date.now();
  if (!forceRefresh && cachedProducts && (now - lastFetchTime < CACHE_DURATION_MS)) {
    return cachedProducts;
  }

  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error('Sheet fetch failed');
    const csvData = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const products: Product[] = results.data.map((row: any) => ({
            id: row['Tên sản phẩm'] ? slugify(row['Tên sản phẩm'].toString()) : Math.random().toString(36).substr(2, 9),
            name: row['Tên sản phẩm'] || '',
            description: row['Mô tả'] || row['Ghi chú'] || '',
            price: row['Giá khuyến mãi'] 
              ? (row['Giá khuyến mãi'].toString().includes('đ') ? row['Giá khuyến mãi'] : `${row['Giá khuyến mãi']}đ`) 
              : (row['Giá gốc'] ? (row['Giá gốc'].toString().includes('đ') ? row['Giá gốc'] : `${row['Giá gốc']}đ`) : ''),
            originalPrice: row['Giá khuyến mãi'] && row['Giá gốc']
              ? (row['Giá gốc'].toString().includes('đ') ? row['Giá gốc'] : `${row['Giá gốc']}đ`) 
              : undefined,
            image: row['Ảnh'] || 'https://picsum.photos/400/400',
            category: row['Danh mục'] || 'Chưa phân loại',
            productUrl: row['Link Affiliate'] || '#',
            rating: 5,
            reviews: Math.floor(Math.random() * 500) + 50,
            isHot: row['Tình trạng'] === 'HOT' || row['Tình trạng'] === 'Săn Deal' || false,
            status: row['Tình trạng'] || ''
          }));
          
          cachedProducts = products;
          lastFetchTime = Date.now();
          resolve(products);
        },
        error: (error: any) => {
          console.error('Papa parse error:', error);
          resolve(cachedProducts || []);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return cachedProducts || [];
  }
}
