
import { getJobs } from '@/lib/data';
import { getArticles } from '@/lib/articles';

const baseUrl = 'https://www.tawzifak.com';

function generateSiteMap(allUrls: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${allUrls
       .map(({ url, lastModified, changeFrequency, priority }) => {
         return `
       <url>
           <loc>${url}</loc>
           <lastmod>${lastModified.toISOString().split('T')[0]}</lastmod>
           <changefreq>${changeFrequency}</changefreq>
           <priority>${priority}</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function GET() {
  const jobs = await getJobs();
  const articles = getArticles();

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/workers`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ];
  
  const allUrls = [...staticUrls, ...jobUrls, ...articleUrls];
  const sitemap = generateSiteMap(allUrls);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
