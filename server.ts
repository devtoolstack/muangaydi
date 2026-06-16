import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Papa from 'papaparse';
import axios from 'axios';
import * as cheerio from 'cheerio';
import compression from 'compression';
import { slugify } from "./src/lib/utils";
import { BLOG_POSTS } from "./src/data/blogData";
import { getMergedBlogPosts } from "./src/services/blogService";

function mapRowsToProducts(rows: any[]): any[] {
  return rows.map((row: any) => ({
    id: row['Tên sản phẩm'] ? slugify(row['Tên sản phẩm'].toString()) : '',
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
    reviews: 100,
    isHot: row['Tình trạng'] === 'HOT' || row['Tình trạng'] === 'Săn Deal' || false,
    status: row['Tình trạng'] || ''
  }));
}

let __filename = "";
let __dirname = "";
try {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (e) {
  __filename = "";
  __dirname = process.cwd();
}

// Helper to fetch products for SSR metadata
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVGYFkgGz1rMHYcK_dnb_Y-QXEoBsuZX_P3juzTgkm8L_cDPDeQva8q3-CtiuU2Ypy0J-g3jhU5hG2/pub?gid=0&single=true&output=csv';

let productCache: {
  rows: any[];
  lastUpdate: number;
} = {
  rows: [],
  lastUpdate: 0
};
const PRODUCT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

async function fetchProducts() {
  const now = Date.now();
  if (productCache.rows.length > 0 && (now - productCache.lastUpdate < PRODUCT_CACHE_TTL)) {
    return productCache.rows;
  }

  try {
    const response = await axios.get(SHEET_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache'
      },
      timeout: 10000
    });
    const csvData = response.data;
    return new Promise<any[]>((resolve) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            productCache.rows = results.data;
            productCache.lastUpdate = now;
          }
          resolve(results.data);
        },
        error: (err) => {
          console.error('[PapaParse Error]', err);
          resolve(productCache.rows);
        }
      });
    });
  } catch (e: any) {
    console.error('[FetchProducts Error]', e.message);
    return productCache.rows;
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
  const sources = [
    { url: 'https://iprice.vn/coupons/shopee/', store: 'Shopee' },
    { url: 'https://iprice.vn/coupons/lazada/', store: 'Lazada' },
    { url: 'https://iprice.vn/coupons/tiki/', store: 'Tiki' },
    { url: 'https://iprice.vn/coupons/shopeefood/', store: 'ShopeeFood' }
  ];

  let allCoupons: any[] = [];
  const seenTitles = new Set<string>();

  for (const source of sources) {
    try {
      console.log(`[Scraper] Requesting: ${source.url}`);
      const { data: html } = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': 'https://www.google.com/',
          'Cache-Control': 'no-cache'
        },
        timeout: 15000
      });

      const $ = cheerio.load(html);
      
      // Selectors for Rehub theme used by iPrice
      const couponCards = $('.woo_list_desc');
      
      console.log(`[Scraper] Found ${couponCards.length} candidates on ${source.store}`);

      couponCards.each((i, el) => {
        const title = $(el).find('h2, h3, .font110').first().text().trim();
        const description = $(el).find('.rh_custom_notice').first().text().trim() || $(el).find('p').first().text().trim();
        const discountValue = $(el).find('.rh_custom_notice, .sale_letter').first().text().trim();
        
        if (!title || title.length < 5) return;

        const uniqueKey = `${source.store}-${title}`;
        if (seenTitles.has(uniqueKey)) return;
        seenTitles.add(uniqueKey);

        // Many iPrice coupons are deals, not codes. Fallback to HOTDEAL or try to find mask/code
        let code = $(el).closest('.re_aj_pag_auto_item').find('[data-code]').attr('data-code') || 
                   $(el).closest('.re_aj_pag_auto_item').find('.coupon_value').text().trim() || 'HOTDEAL';

        const expiry = $(el).find('.listtimeleft').first().text().trim() || 'Hết hạn sớm';

        allCoupons.push({
          id: `scraped-${source.store}-${i}-${Date.now()}`,
          store: source.store,
          title: title,
          code: code.length > 20 ? 'HOTDEAL' : code, // Clean up long bogus codes
          description: description || `Mã giảm giá ${source.store} cực hời, lấy ngay tại MuaNgayDi.`,
          expiryDate: expiry.replace('Hết hạn trong ', '').replace('Last day', 'Sắp hết hạn'),
          copyCount: Math.floor(Math.random() * 5000) + 1000,
          isVerified: true,
          discountValue: discountValue || 'Ưu đãi',
          minSpend: 'Xem chi tiết'
        });
      });
    } catch (error: any) {
      console.error(`[Scraper] Error ${source.store}:`, error.message);
    }
  }

  if (allCoupons.length === 0) {
    console.warn('[Scraper] Empty results, generating simulated high-quality data...');
    return generateSimulatedData(sources);
  }

  console.log(`[Scraper] Total coupons collected: ${allCoupons.length}`);
  return allCoupons.sort((a, b) => b.copyCount - a.copyCount);
}

function generateSimulatedData(sources: any[]) {
  const simulated: any[] = [];
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  sources.forEach(source => {
    for (let i = 1; i <= 4; i++) {
      simulated.push({
        id: `sim-${source.store}-${i}`,
        store: source.store,
        title: `Mã giảm giá ${source.store} HOT tháng ${currentMonth}/${currentYear}`,
        code: `${source.store.toUpperCase()}${i}0K`,
        description: `Áp dụng cho mọi đơn hàng từ 0Đ. Giảm ngay tối đa ${i * 20}K. Số lượng có hạn!`,
        expiryDate: `30/${currentMonth}/${currentYear}`,
        copyCount: Math.floor(Math.random() * 10000) + 5000,
        isVerified: true,
        discountValue: `${i * 20}K`,
        minSpend: 'Đơn từ 0Đ'
      });
    }
  });
  return simulated;
}

const app = express();
const PORT = parseInt(process.env.PORT || "3000");

const isVercel = process.env.VERCEL === "1" || !!process.env.NOW_BUILDER;
const isProduction = process.env.NODE_ENV === "production" || isVercel;

  // Security & Performance Middleware
  app.use(compression());
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Service Worker route for monetization (Monetag/PropellerAds)
  app.get('/sw.js', (req, res) => {
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'sw.js'),
      path.join(process.cwd(), 'dist', 'sw.js'),
      path.join(process.cwd(), 'sw.js')
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Service-Worker-Allowed', '/');
        return res.sendFile(p);
      }
    }
    return res.status(404).send('Service Worker not found');
  });

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

  let vite: any;
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      const pathsToTry = [
        path.join(process.cwd(), 'dist'),
        path.join(process.cwd(), '../dist'),
        path.join(__dirname, 'dist'),
        path.join(__dirname, '../dist'),
        path.join(__dirname, '../../dist'),
      ];
      for (const p of pathsToTry) {
        if (fs.existsSync(p)) {
          distPath = p;
          break;
        }
      }
    }
    console.log(`[Static] Mounting static path: ${distPath}`);
    app.use(express.static(distPath, { 
      index: false,
      maxAge: '1d' // Cache assets for 1 day
    }));
  }

  // Robots.txt, Sitemaps, and RSS Feed routes
  app.get(['/robots.txt', '/sitemap.xml', '/sitemap_index.xml', '/sitemap_pages.xml', '/sitemap_products.xml', '/rss.xml', '/feed.xml'], async (req, res) => {
    try {
      const urlPath = req.path;
      const host = req.get('host') || 'muangaydi-tau.vercel.app';
      const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0');
      const protocol = isLocal ? 'http' : 'https';
      const domain = `${protocol}://${host}`;

      if (urlPath === '/robots.txt') {
        const robots = `User-agent: *
Allow: /
Sitemap: ${domain}/sitemap.xml
# Speed up indexing
Sitemap: ${domain}/feed.xml`;
        return res.status(200).set({ "Content-Type": "text/plain; charset=utf-8" }).end(robots);
      }

      const lastMod = new Date().toISOString().split('T')[0];

      if (urlPath === '/sitemap_index.xml' || urlPath === '/sitemap.xml') {
        const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${domain}/sitemap_pages.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap_products.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
</sitemapindex>`;
        return res.status(200).set({ "Content-Type": "application/xml; charset=utf-8" }).end(sitemapIndex.trim());
      }

      if (urlPath === '/sitemap_pages.xml') {
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/khuyen-mai</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/cam-nang</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

        try {
          const rows = await fetchProducts();
          const mapped = mapRowsToProducts(rows);
          const dynamicBlogPosts = getMergedBlogPosts(mapped);

          dynamicBlogPosts.forEach(post => {
            const rawDate = post.publishedAt || lastMod;
            const postDate = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
            sitemap += `
  <url>
    <loc>${domain}/cam-nang/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
          });
        } catch (err) {
          console.error('[Sitemap Dynamic Blogs Error]', err);
        }

        sitemap += `
  <url>
    <loc>${domain}/dieu-khoan</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${domain}/bao-mat</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${domain}/chinh-sach</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;
        return res.status(200).set({ "Content-Type": "application/xml; charset=utf-8" }).end(sitemap.trim());
      }

      if (urlPath === '/sitemap_products.xml') {
        const rows = await fetchProducts();
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
        
        rows.forEach(row => {
          if (row['Tên sản phẩm']) {
            const slug = slugify(row['Tên sản phẩm'].toString());
            sitemap += `
  <url>
    <loc>${domain}/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
          }
        });
        
        sitemap += `\n</urlset>`;
        return res.status(200).set({ "Content-Type": "application/xml; charset=utf-8" }).end(sitemap.trim());
      }

      if (urlPath === '/rss.xml' || urlPath === '/feed.xml') {
        const rows = await fetchProducts();
        const mapped = mapRowsToProducts(rows);
        const dynamicBlogPosts = getMergedBlogPosts(mapped);
        const lastModUTC = new Date().toUTCString();
        let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Cẩm Nang Mua Sắm &amp; Mẹo Tiết Kiệm | Mua ngay đi</title>
  <link>${domain}</link>
  <description>Nhật ký chia sẻ bí quyết săn mã giảm giá Shopee, Lazada, Tiki, cẩm nang phòng tranh lừa đảo và cách tiết kiệm của người dùng thông thái.</description>
  <language>vi</language>
  <lastBuildDate>${lastModUTC}</lastBuildDate>
  <atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml" />`;

        dynamicBlogPosts.slice(0, 50).forEach(post => {
          const fullPostUrl = `${domain}/cam-nang/${post.slug}`;
          rss += `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${fullPostUrl}</link>
    <guid>${fullPostUrl}</guid>
    <description><![CDATA[${post.description}]]></description>
    <pubDate>${new Date(post.publishedAt || Date.now()).toUTCString()}</pubDate>
  </item>`;
        });

        rss += `</channel></rss>`;
        return res.status(200).set({ "Content-Type": "application/xml; charset=utf-8" }).end(rss);
      }
    } catch (e) {
      console.error('[Sitemap Error]', e);
      res.status(500).end('Internal Server Error');
    }
  });

  app.get('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const pathOnly = req.path;
      const host = req.get('host') || 'muangaydi-tau.vercel.app';
      const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0');
      const protocol = isLocal ? 'http' : 'https';
      const domain = `${protocol}://${host}`;
      const fullUrl = `${domain}${url}`;

      let template: string;
      
      if (!isProduction) {
        template = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
      } else {
        let templatePath = "";
        const pathsToTry = [
          path.join(process.cwd(), "templates/index.html"),
          path.join(process.cwd(), "dist/index.html"),
          path.join(process.cwd(), "../dist/index.html"),
          path.join(__dirname, "../templates/index.html"),
          path.join(__dirname, "dist/index.html"),
          path.join(__dirname, "../dist/index.html"),
          path.join(__dirname, "../../dist/index.html"),
        ];
        
        for (const p of pathsToTry) {
          if (fs.existsSync(p)) {
            templatePath = p;
            break;
          }
        }
        
        if (!templatePath) {
          console.error('[Error] Could not locate dist/index.html. Tried paths:', pathsToTry);
          if (fs.existsSync(path.join(process.cwd(), "index.html"))) {
            templatePath = path.join(process.cwd(), "index.html");
          } else {
            throw new Error(`Cannot find index.html in any known path. Tried paths: ${JSON.stringify(pathsToTry)}`);
          }
        }
        
        template = fs.readFileSync(templatePath, "utf-8");
      }

      // Default SEO values
      let title = "Mua ngay đi | Săn Deal Giá Hời Mỗi Ngày";
      let description = "Tổng hợp mã giảm giá và deals hời nhất từ Shopee, Lazada, Tiki. Cập nhật liên tục mỗi giờ, chốt đơn ngay không cần lo giá!";
      let image = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop";
      
      const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Mua ngay đi",
        "url": domain,
        "logo": `${domain}/logo.png`,
        "description": "Nền tảng săn deal và mã giảm giá hàng đầu Việt Nam.",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "support@muangaydi.vn"
        }
      };

      let jsonLd = `
        <script type="application/ld+json">
          ${JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Mua ngay đi",
            "url": domain,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${domain}/?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        <script type="application/ld+json">
          ${JSON.stringify(orgSchema)}
        </script>
      `;

      // logic for Product Page SEO or other pages
      const pathSegments = pathOnly.split('/').filter(Boolean);
      const firstSegment = pathSegments[0];
      const knownStaticRoutes = ['khuyen-mai', 'cam-nang', 'dieu-khoan', 'bao-mat', 'chinh-sach', 'api', 'robots.txt', 'sitemap.xml', 'ads.txt'];

      if (firstSegment && !knownStaticRoutes.includes(firstSegment) && !pathOnly.includes('.')) {
        const productId = firstSegment;
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

          const breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": domain },
              { "@type": "ListItem", "position": 2, "name": product['Danh mục'], "item": `${domain}/?cat=${product['Danh mục']}` },
              { "@type": "ListItem", "position": 3, "name": pName, "item": fullUrl }
            ]
          };

          const ratingValue = parseFloat(product['Đánh giá']) || 4.8;
          const reviewCount = parseInt(product['Lượt đánh giá']) || 120;

          const productSchema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": pName,
            "image": [image],
            "description": pDesc,
            "brand": { "@type": "Brand", "name": product['Thương hiệu'] || "Mua ngay đi" },
            "sku": productId,
            "mpn": productId,
            "category": product['Danh mục'],
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": fullUrl
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": ratingValue,
              "reviewCount": reviewCount,
              "bestRating": "5",
              "worstRating": "1"
            },
            "offers": {
              "@type": "Offer",
              "url": fullUrl,
              "priceCurrency": "VND",
              "price": pPrice,
              "priceValidUntil": "2026-12-31",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "https://schema.org/InStock",
              "seller": { "@type": "Organization", "name": "Mua ngay đi" },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "VN",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnPeriod"
              }
            }
          };

          jsonLd = `
            <script type="application/ld+json">${JSON.stringify(breadcrumbs)}</script>
            <script type="application/ld+json">${JSON.stringify(productSchema)}</script>
            <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
          `;
        }
      } else if (firstSegment === 'cam-nang') {
        const subSegment = pathSegments[1];
        if (subSegment) {
          const rows = await fetchProducts();
          const mapped = mapRowsToProducts(rows);
          const dynamicBlogPosts = getMergedBlogPosts(mapped);
          const post = dynamicBlogPosts.find(p => p.slug === subSegment);
          if (post) {
            title = `${post.title} | Mua ngay đi Cẩm Nang`;
            description = post.description;
            image = post.image;

            const blogSchema = {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.description,
              "image": [post.image],
              "datePublished": `${post.publishedAt}T08:00:00+07:00`,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "Mua ngay đi",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${domain}/logo.png`
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": fullUrl
              }
            };

            jsonLd = `
              <script type="application/ld+json">${JSON.stringify(blogSchema)}</script>
              <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
            `;
          }
        } else {
          title = "Cẩm Nang Mua Sắm & Mẹo Tiết Kiệm | Mua ngay đi";
          description = "Kinh nghiệm săn mã giảm giá Shopee, Lazada, Tiki, cẩm nang tránh lừa đảo, lập kế hoạch chi tiêu thông thái và quản lý tài chính hiệu quả.";
          image = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop";

          const collSchema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": title,
            "description": description,
            "url": fullUrl
          };

          jsonLd = `
            <script type="application/ld+json">${JSON.stringify(collSchema)}</script>
            <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
          `;
        }
      } else if (url === '/khuyen-mai') {
        title = "Tổng Hợp Mã Giảm Giá Shopee, Lazada, Tiki | Mua ngay đi";
        description = "Lấy ngay mã giảm giá Shopee 50K, voucher Lazada 400K và freeship Tiki mới nhất hôm nay. Tiết kiệm tối đa khi mua sắm online.";
        image = "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200&auto=format&fit=crop";
        
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Làm sao để lấy mã giảm giá Shopee tại Mua ngay đi?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Bạn chỉ cần truy cập trang Khuyến mãi, chọn mã phù hợp và nhấn 'Sao chép mã'. Hệ thống sẽ tự động dẫn bạn đến trang sản phẩm Shopee để áp dụng."
              }
            },
            {
              "@type": "Question",
              "name": "Mã giảm giá có được cập nhật thường xuyên không?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Có, Mua ngay đi cập nhật mã giảm giá từ Shopee, Lazada, Tiki liên tục mỗi giờ để đảm bảo bạn không bỏ lỡ deal hời nào."
              }
            }
          ]
        };

        jsonLd = `
          <script type="application/ld+json">
            ${JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": title,
              "description": description,
              "url": fullUrl
            })}
          </script>
          <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
        `;
      } else {
        // Home page or other, pick the best branded image
        image = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop";
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

      // Security Headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      // Inject meta tags into template
      const metaTags = `
        <script src="https://quge5.com/88/tag.min.js" data-zone="250404" async data-cfasync="false"></script>
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
        <meta name="keywords" content="mã giảm giá shopee, mã giảm giá lazada, săn deal hời, voucher shopee, voucher lazada, mua sắm tiết kiệm, deal hot hôm nay, muangaydi" />
        <meta name="google-site-verification" content="NTrEYgh3qUCVaJTXYMOIc0uk7A3b48PxayCvFuOoeDQ" />
        <meta name="geo.region" content="VN" />
        <meta name="geo.placename" content="Vietnam" />
        <meta name="geo.position" content="14.058324;108.277199" />
        <meta name="ICBM" content="14.058324, 108.277199" />
        <link rel="canonical" href="${fullUrl}" />
        <link rel="alternate" type="application/rss+xml" title="Mua ngay đi RSS Feed" href="${domain}/rss.xml" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XW9CBBBE96"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XW9CBBBE96');
        </script>
        ${jsonLd}
      `;

      // Clean up existing tags to avoid conflicts before injecting new ones
      let html = template;
      html = html.replace(/<title>[\s\S]*?<\/title>/gi, '');
      html = html.replace(/<meta\s+[^>]*?(?:name|property)=["'](?:description|og:[^"']*?|twitter:[^"']*?|google-site-verification|geo\.[^"']*?|ICBM)["'][^>]*?>/gi, '');
      html = html.replace(/<link\s+[^>]*?rel=["'](?:canonical|alternate)["'][^>]*?>/gi, '');
      html = html.replace(/<!-- Google tag \(gtag\.js\) -->[\s\S]*?<\/script>/gi, '');
      
      // Inject meta tags immediately after the <head> tag for best verification results (as recommended by Google)
      html = html.replace(/<head>/i, `<head>\n${metaTags}`);
      
      // Ensure the title we want is actually there (since we just deleted all titles)
      // Actually, my metaTags already includes <title>

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

if (!isVercel) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
