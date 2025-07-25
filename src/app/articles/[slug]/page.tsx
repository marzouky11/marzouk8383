
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArticleBySlug } from '@/lib/articles';
import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent } from '@/components/ui/card';
import { User, Newspaper, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  const baseUrl = 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/YCz0LvMj/Screenshot-20250704-173231.jpg';

  if (!article) {
    return {
      title: 'المقال غير موجود',
      description: 'لم نتمكن من العثور على المقال الذي تبحث عنه.',
      openGraph: { images: [{ url: siteThumbnail }] },
      twitter: { images: [siteThumbnail] }
    };
  }
  
  const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/articles/${article.slug}`,
      },
      headline: article.title,
      description: article.summary,
      image: article.imageUrl,
      author: {
          '@type': 'Person',
          name: article.author,
      },
      publisher: {
          '@type': 'Organization',
          name: 'توظيفك',
          logo: {
              '@type': 'ImageObject',
              url: siteThumbnail,
          },
      },
      datePublished: new Date(article.date).toISOString(),
      dateModified: new Date(article.date).toISOString(),
  };

  return {
    title: article.title,
    description: article.summary,
    alternates: {
        canonical: `${baseUrl}/articles/${article.slug}`,
    },
    openGraph: {
        title: article.title,
        description: article.summary,
        images: [
            {
                url: article.imageUrl,
                width: 1200,
                height: 630,
                alt: article.title,
            },
        ],
        url: `${baseUrl}/articles/${article.slug}`,
        siteName: 'توظيفك',
        type: 'article',
        publishedTime: new Date(article.date).toISOString(),
        authors: [article.author],
    },
    twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary,
        images: [article.imageUrl],
    },
    other: {
        'application/ld+json': JSON.stringify(articleJsonLd, null, 2)
    }
  };
}


export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <AppLayout>
      <MobilePageHeader title="مقالات">
        <Newspaper className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <article>
          <Card>
            <CardContent className="p-4 md:p-8">
              <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight text-primary mb-4">
                  {article.title}
                </h1>
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                  {/*
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                  </div>
                  */}
                </div>
              </header>

              <div className="relative h-64 md:h-80 w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  data-ai-hint={article.imageHint}
                  priority
                />
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-foreground prose-a:text-primary">
                {article.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => {
                    if (paragraph.startsWith('### ')) {
                        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">{paragraph.replace('### ', '')}</h3>
                    }
                     // Handle bold text like **المميزات:**
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return <p key={index} className="mb-4 font-bold">{paragraph.slice(2, -2)}</p>;
                    }
                    return <p key={index} className="mb-4">{paragraph}</p>;
                })}
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </AppLayout>
  );
}

export async function generateStaticParams() {
    const { getArticles } = await import('@/lib/articles');
    const articles = getArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}
