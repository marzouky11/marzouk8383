import { getJobs } from '@/lib/data';

const baseUrl = 'https://www.tawzifak.com';

function generateSitemap(workers: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${workers
       .map(({ id, createdAt }) => {
         const lastModified = createdAt?.toDate ? createdAt.toDate() : new Date();
         return `
       <url>
           <loc>${`${baseUrl}/workers/${id}`}</loc>
           <lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const workers = await getJobs({ postType: 'seeking_job' });
  const sitemap = generateSitemap(workers);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
