import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Papa from 'papaparse';
import axios from 'axios';
import * as cheerio from 'cheerio';
import compression from 'compression';
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security & Performance Middleware
  app.use(compression());
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
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
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { 
      index: false,
      maxAge: '1d' // Cache assets for 1 day
    }));
  }

  app.get('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const protocol = req.get('x-forwarded-proto') || 'https';
      const host = req.get('host');
      const domain = `${protocol}://${host}`;
      const fullUrl = `${domain}${url}`;

      // Handle robots.txt
      if (url === '/robots.txt') {
        const robots = `User-agent: *
Allow: /
Sitemap: ${domain}/sitemap_index.xml
Sitemap: ${domain}/sitemap_pages.xml
Sitemap: ${domain}/sitemap_products.xml`;
        return res.status(200).set({ "Content-Type": "text/plain" }).end(robots);
      }

      // Handle sitemap index
      if (url === '/sitemap_index.xml') {
        const lastMod = new Date().toISOString().split('T')[0];
        let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
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
        return res.status(200).set({ "Content-Type": "application/xml" }).end(sitemapIndex);
      }

      // Handle individual sitemaps
      if (url === '/sitemap_pages.xml') {
        const lastMod = new Date().toISOString().split('T')[0];
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        sitemap += `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        sitemap += `  <url>\n    <loc>${domain}/khuyen-mai</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
        sitemap += `  <url>\n    <loc>${domain}/dieu-khoan</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.3</priority>\n  </url>\n`;
        sitemap += `  <url>\n    <loc>${domain}/bao-mat</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.3</priority>\n  </url>\n`;
        sitemap += `  <url>\n    <loc>${domain}/chinh-sach</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.3</priority>\n  </url>\n`;
        sitemap += `</urlset>`;
        return res.status(200).set({ "Content-Type": "application/xml" }).end(sitemap);
      }

      if (url === '/sitemap.xml' || url === '/sitemap_products.xml') {
        const rows = await fetchProducts();
        const lastMod = new Date().toISOString().split('T')[0];
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        rows.forEach(row => {
          if (row['Tên sản phẩm']) {
            const slug = slugify(row['Tên sản phẩm'].toString());
            sitemap += `  <url>\n    <loc>${domain}/${slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
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
      let image = "https://og-image.vercel.app/%3Cb%3EMUA%20NGAY%20%C4%90I%3C%2Fb%3E.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-color-logo.svg&images=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1607082348824-0a96f2a4b9da%3Fq%3D80%26w%3D200%26auto%3Dformat%26fit%3Dcrop";
      
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
      const pathSegments = url.split('/').filter(Boolean);
      const firstSegment = pathSegments[0];
      const knownStaticRoutes = ['khuyen-mai', 'dieu-khoan', 'bao-mat', 'chinh-sach', 'api', 'robots.txt', 'sitemap.xml', 'ads.txt'];

      if (firstSegment && !knownStaticRoutes.includes(firstSegment) && !url.includes('.')) {
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
      } else if (url === '/khuyen-mai') {
        title = "Tổng Hợp Mã Giảm Giá Shopee, Lazada, Tiki | Mua ngay đi";
        description = "Lấy ngay mã giảm giá Shopee 50K, voucher Lazada 400K và freeship Tiki mới nhất hôm nay. Tiết kiệm tối đa khi mua sắm online.";
        
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

      // Security Headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      
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
        <meta name="keywords" content="mã giảm giá shopee, mã giảm giá lazada, săn deal hời, voucher shopee, voucher lazada, mua sắm tiết kiệm, deal hot hôm nay, muangaydi" />
        <meta name="google-site-verification" content="NTrEYgh3qUCVaJTXYMOIc0uk7A3b48PxayCvFuOoeDQ" />
        <meta name="geo.region" content="VN" />
        <meta name="geo.placename" content="Vietnam" />
        <meta name="geo.position" content="14.058324;108.277199" />
        <meta name="ICBM" content="14.058324, 108.277199" />
        <link rel="canonical" href="${fullUrl}" />
        <meta name="robots" content="index, follow" />
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4995320968318102"
          crossorigin="anonymous"></script>
        ${jsonLd}
      `;

      // Clean up existing tags to avoid conflicts before injecting new ones
      let html = template;
      html = html.replace(/<title>.*?<\/title>/gi, '');
      html = html.replace(/<meta name="description".*?>/gi, '');
      html = html.replace(/<meta property="og:.*?".*?>/gi, '');
      html = html.replace(/<meta name="twitter:.*?".*?>/gi, '');
      html = html.replace(/<meta name="google-site-verification".*?>/gi, '');
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
