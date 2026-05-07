import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Papa from 'papaparse';
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

async function startServer() {
  const app = express();
  const PORT = 3000;

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
      let template: string;
      
      if (process.env.NODE_ENV !== "production") {
        template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(path.resolve(__dirname, "dist/index.html"), "utf-8");
      }

      // Default SEO values
      let title = "Mua ngay đi - Nền tảng mua sắm hiện đại";
      let description = "Khám phá những sản phẩm trend nhất với giá ưu đãi cực sốc.";
      let image = "https://images.unsplash.com/photo-1542491509-3001e1e1199a?q=80&w=1200&auto=format&fit=crop";

      const protocol = req.get('x-forwarded-proto') || 'https';
      const host = req.get('host');
      const fullUrl = `${protocol}://${host}${url}`;

      // logic for Product Page SEO
      if (url.startsWith('/product/')) {
        const productId = url.split('/product/')[1];
        const rows = await fetchProducts();
        const product = rows.find(row => 
          row['Tên sản phẩm'] && slugify(row['Tên sản phẩm'].toString()) === productId
        );

        if (product) {
          title = `${product['Tên sản phẩm']} | Mua ngay đi`;
          description = (product['Mô tả'] || product['Ghi chú'] || '').substring(0, 160).replace(/"/g, '&quot;');
          image = (product['Ảnh'] || image).trim();
        }
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
