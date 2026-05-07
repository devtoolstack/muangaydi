import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Papa from 'papaparse';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { slugify } from "./src/lib/utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to fetch products for SSR metadata
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVGYFkgGz1rMHYcK_dnb_Y-QXEoBsuZX_P3juzTgkm8L_cDPDeQva8q3-CtiuU2Ypy0J-g3jhU5hG2/pub?gid=0&single=true&output=csv';

async function fetchProducts() {
  try {
    const response = await fetch(SHEET_URL);
    const csvData = await response.text();
    return new Promise<any[]>((resolve) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
      });
    });
  } catch (e) {
    return [];
  }
}

// Coupon Scraper & Cache System
let couponCache: {
  data: any[];
  lastUpdate: number;
  nextUpdateDelay: number;
} = {
  data: [],
  lastUpdate: 0,
  nextUpdateDelay: 0
};

function getRandomDelay() {
  // Random between 2 hours and 48 hours (in milliseconds)
  const min = 2 * 60 * 60 * 1000;
  const max = 48 * 60 * 60 * 1000;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function scrapeIPricedCoupons() {
  try {
    console.log('Fetching https://iprice.vn/coupons/ ...');
    const { data: html } = await axios.get('https://iprice.vn/coupons/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8'
      },
      timeout: 10000
    });
    const $ = cheerio.load(html);
    const coupons: any[] = [];

    // Improved selectors for iPrice VN
    const couponCards = $('div[class*="coupon"], article[class*="coupon"], section[class*="coupon"]');
    console.log(`Found ${couponCards.length} potential coupon cards`);

    couponCards.each((i, el) => {
      if (coupons.length >= 20) return;

      const title = $(el).find('h3, h2, .title').first().text().trim();
      const description = $(el).find('p, .description, .details').first().text().trim();
      
      if (!title || title.length < 5) return;

      const store = $(el).find('img').first().attr('alt') || 'Cửa hàng';
      const expiryDate = $(el).find('span:contains("hạn"), span:contains("Ngày"), .expiry').first().text().trim() || 'Tháng này';
      const discountValue = $(el).find('span:contains("%"), span:contains("K"), span:contains("đ"), .discount').first().text().trim() || 'Ưu đãi';
      
      let code = 'GIAMGIA' + (i + 1);
      const possibleCode = $(el).find('span:contains("Copy"), .code').text().trim();
      if (possibleCode && possibleCode.length < 15) code = possibleCode;

      coupons.push({
        id: `scraped-${Date.now()}-${i}`,
        store: store.includes('Shopee') ? 'Shopee' : 
               store.includes('Lazada') ? 'Lazada' : 
               store.includes('Tiki') ? 'Tiki' : 
               store.includes('TikTok') ? 'TikTok Shop' : 'Tổng hợp',
        title,
        code,
        description: description || 'Xem khuyến mãi tại iPrice',
        expiryDate,
        copyCount: Math.floor(Math.random() * 2000) + 1000,
        isVerified: true,
        discountValue: discountValue.length < 15 ? discountValue : 'Deal Sốc',
        minSpend: 'Đơn từ 0Đ'
      });
    });

    console.log(`Successfully scraped ${coupons.length} coupons`);
    return coupons;
  } catch (error: any) {
    console.error('Scraping error details:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    return [];
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Coupons API Endpoint with Cache logic
  app.get('/api/coupons', async (req, res) => {
    const now = Date.now();
    const shouldRefresh = now - couponCache.lastUpdate > couponCache.nextUpdateDelay;

    if (shouldRefresh || couponCache.data.length === 0) {
      console.log('Refreshing coupon cache...');
      const scrapedData = await scrapeIPricedCoupons();
      if (scrapedData.length > 0) {
        couponCache.data = scrapedData;
        couponCache.lastUpdate = now;
        couponCache.nextUpdateDelay = getRandomDelay();
      }
    }

    res.json(couponCache.data);
  });

  // Debug endpoint to force refresh
  app.get('/api/debug/refresh-coupons', async (req, res) => {
    const scrapedData = await scrapeIPricedCoupons();
    if (scrapedData.length > 0) {
      couponCache.data = scrapedData;
      couponCache.lastUpdate = Date.now();
      couponCache.nextUpdateDelay = getRandomDelay();
      return res.json({ success: true, count: scrapedData.length, data: scrapedData });
    }
    res.status(500).json({ success: false, message: 'Could not scrape coupons' });
  });

  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
  }

  app.get('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const protocol = req.get('x-forwarded-proto') || 'https';
      const host = req.get('host');
      const fullUrl = `${protocol}://${host}${url}`;

      // Handle robots.txt
      if (url === '/robots.txt') {
        const robots = `User-agent: *\nAllow: /\nSitemap: ${protocol}://${host}/sitemap.xml`;
        return res.status(200).set({ "Content-Type": "text/plain" }).end(robots);
      }

      // Handle sitemap.xml
      if (url === '/sitemap.xml') {
        const rows = await fetchProducts();
        const lastMod = new Date().toISOString().split('T')[0];
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        sitemap += `  <url>\n    <loc>${protocol}://${host}/</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        sitemap += `  <url>\n    <loc>${protocol}://${host}/khuyen-mai</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
        
        rows.forEach(row => {
          if (row['Tên sản phẩm']) {
            const slug = slugify(row['Tên sản phẩm'].toString());
            sitemap += `  <url>\n    <loc>${protocol}://${host}/product/${slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
          }
        });
        
        sitemap += `</urlset>`;
        return res.status(200).set({ "Content-Type": "application/xml" }).end(sitemap);
      }

      let template: string;
      
      if (process.env.NODE_ENV !== "production") {
        template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(path.resolve(__dirname, "dist/index.html"), "utf-8");
      }

      // Default SEO values
      let title = "Mua ngay đi | Săn Deal Giá Hời Mỗi Ngày";
      let description = "Tổng hợp mã giảm giá và deals hời nhất từ Shopee, Lazada, Tiki. Cập nhật liên tục mỗi giờ, chốt đơn ngay không cần lo giá!";
      let image = "https://images.unsplash.com/photo-1542491509-3001e1e1199a?q=80&w=1200&auto=format&fit=crop";
      let jsonLd = "";

      // logic for Product Page SEO
      if (url.startsWith('/product/')) {
        const productId = url.split('/product/')[1];
        const rows = await fetchProducts();
        const product = rows.find(row => 
          row['Tên sản phẩm'] && slugify(row['Tên sản phẩm'].toString()) === productId
        );

        if (product) {
          const pName = product['Tên sản phẩm'].replace(/"/g, '&quot;');
          const pDesc = (product['Mô tả'] || product['Ghi chú'] || '').substring(0, 160).replace(/"/g, '&quot;');
          const pImage = (product['Ảnh'] || image).trim();
          // Extract price as number for schema
          const priceStr = (product['Giá khuyến mãi'] || product['Giá gốc'] || '0').toString().replace(/[^\d]/g, '');
          const pPrice = parseInt(priceStr) || 0;
          
          title = `${pName} | Mua ngay đi`;
          description = pDesc;
          image = pImage;

          // Structured Data for Rich Snippets
          jsonLd = `
            <script type="application/ld+json">
              {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": "${pName}",
                "image": ["${image}"],
                "description": "${pDesc}",
                "brand": {
                  "@type": "Brand",
                  "name": "Muangaydi"
                },
                "offers": {
                  "@type": "Offer",
                  "url": "${fullUrl}",
                  "priceCurrency": "VND",
                  "price": "${pPrice}",
                  "availability": "https://schema.org/InStock"
                }
              }
            </script>
          `;
        }
      } else if (url === '/khuyen-mai') {
        title = "Tổng Hợp Mã Giảm Giá Shopee, Lazada, Tiki | Mua ngay đi";
        description = "Lấy ngay mã giảm giá Shopee 50K, voucher Lazada 400K và freeship Tiki mới nhất hôm nay. Tiết kiệm tối đa khi mua sắm online.";
      } else {
        // Home page or other, pick the best product for image
        const rows = await fetchProducts();
        if (rows.length > 0) {
          image = (rows[0]['Ảnh'] || image).trim();
        }
      }

      // Ensure image URL is properly encoded and absolute
      let encodedImage = image.trim();
      if (!encodedImage.startsWith('http') && !encodedImage.startsWith('//')) {
        if (encodedImage.startsWith('/')) {
          encodedImage = `${protocol}://${host}${encodedImage}`;
        } else {
          encodedImage = `${protocol}://${host}/${encodedImage}`;
        }
      } else if (encodedImage.startsWith('//')) {
        encodedImage = `${protocol}:${encodedImage}`;
      }
      
      if (encodedImage.includes(' ')) {
        encodedImage = encodeURI(encodedImage);
      }

      // Inject meta tags into template
      const metaTags = `
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${encodedImage}" />
        <meta property="og:image:secure_url" content="${encodedImage}" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="${fullUrl}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Mua ngay đi" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${encodedImage}" />
        <link rel="canonical" href="${fullUrl}" />
        ${jsonLd}
      `;

      // Clean up existing tags to avoid conflicts and inject new ones
      let html = template;
      html = html.replace(/<title>.*?<\/title>/gi, '');
      html = html.replace(/<meta name="description".*?>/gi, '');
      html = html.replace(/<meta property="og:.*?".*?>/gi, '');
      html = html.replace(/<meta name="twitter:.*?".*?>/gi, '');
      
      html = html.replace('</head>', `${metaTags}\n</head>`);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
