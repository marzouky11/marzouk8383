import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArticleBySlug } from '@/lib/articles';
import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Newspaper } from 'lucide-react';
import type { Metadata } from 'next';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'المقال غير موجود',
      description: 'لم نتمكن من العثور على المقال الذي تبحث عنه.',
    };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}


export default function ArticlePage({ params }: ArticlePageProps) {
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
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                  </div>
                </div>
              </header>

              <div className="relative h-64 md:h-80 w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  data-ai-hint={article.imageHint}
                  priority
                />
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-foreground prose-a:text-primary">
                {article.content.split('\\n').map((paragraph, index) => {
                    if (paragraph.startsWith('### ')) {
                        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">{paragraph.replace('### ', '')}</h3>
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
