import { getJobs } from '@/lib/data';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tawzifak.com';

function generateSitemap(jobs: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${jobs
       .map(({ id, createdAt }) => {
         // createdAt could be a Firestore Timestamp
         const lastModified = createdAt?.toDate ? createdAt.toDate() : new Date();
         return `
       <url>
           <loc>${`${baseUrl}/jobs/${id}`}</loc>
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

export async function GET() {
  const jobs = await getJobs({ postType: 'seeking_worker' });
  const sitemap = generateSitemap(jobs);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
