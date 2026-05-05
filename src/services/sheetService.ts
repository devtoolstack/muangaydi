import Papa from 'papaparse';
import { Product } from '../types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVGYFkgGz1rMHYcK_dnb_Y-QXEoBsuZX_P3juzTgkm8L_cDPDeQva8q3-CtiuU2Ypy0J-g3jhU5hG2/pub?gid=0&single=true&output=csv';

export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    const response = await fetch(SHEET_URL);
    const csvData = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const products: Product[] = results.data.map((row: any) => ({
            id: row['Tên sản phẩm'] ? row['Tên sản phẩm'].toString().toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9),
            name: row['Tên sản phẩm'] || '',
            description: row['Mô tả'] || row['Ghi chú'] || '',
            price: row['Giá khuyến mãi'] ? (row['Giá khuyến mãi'].toString().includes('đ') ? row['Giá khuyến mãi'] : `${row['Giá khuyến mãi']}đ`) : '',
            originalPrice: row['Giá gốc'] ? (row['Giá gốc'].toString().includes('đ') ? row['Giá gốc'] : `${row['Giá gốc']}đ`) : undefined,
            image: row['Ảnh'] || 'https://picsum.photos/400/400',
            category: row['Danh mục'] || 'Chưa phân loại',
            productUrl: row['Link Affiliate'] || '#',
            rating: 5,
            reviews: Math.floor(Math.random() * 500) + 50,
            isHot: row['Tình trạng'] === 'HOT' || row['Tình trạng'] === 'Săn Deal' || false,
            status: row['Tình trạng'] || ''
          }));
          resolve(products);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}
