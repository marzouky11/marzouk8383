import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { getArticles } from '@/lib/articles';
import { Newspaper } from 'lucide-react';
import { ArticleCard } from './article-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <AppLayout>
      <MobilePageHeader title="مقالات">
        <Newspaper className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Card className="hidden md:block mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-6 w-6 text-primary" />
                    مقالات لنموك المهني
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    نقدم لك مجموعة من المقالات المختارة بعناية لمساعدتك على تطوير مهاراتك، والنجاح في مسيرتك المهنية، ومواكبة آخر تطورات سوق العمل.
                </p>
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
