import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://khidmanow.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile/', '/edit-job/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
