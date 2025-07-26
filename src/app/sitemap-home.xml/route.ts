
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tawzifak.com';

function generateHomepageSitemap() {
  const lastmod = '2025-07-26'; // A recent, specific date
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
         <loc>${baseUrl}/</loc>
         <lastmod>${lastmod}</lastmod>
         <changefreq>daily</changefreq>
         <priority>1.0</priority>
     </url>
   </urlset>
 `;
}

export async function GET() {
  const sitemap = generateHomepageSitemap();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
