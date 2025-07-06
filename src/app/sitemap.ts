import { MetadataRoute } from 'next'
import { getJobs } from '@/lib/data'
import { getArticles } from '@/lib/articles'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Replace with your actual domain
  const baseUrl = 'https://khidmanow.com';

  // Get all jobs and articles for dynamic routes
  const jobs = await getJobs();
  const articles = getArticles();

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: new Date(), // Using current date as lastModified for simplicity
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date), 
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Static routes
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

  return [...staticUrls, ...jobUrls, ...articleUrls];
}
