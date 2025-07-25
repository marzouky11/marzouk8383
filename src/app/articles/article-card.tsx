import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/articles';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg h-full">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={article.imageHint}
          />
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="leading-snug">
          <Link href={`/articles/${article.slug}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {article.summary}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end items-center text-xs text-muted-foreground pt-4 border-t mt-auto">
        {/*
        <div className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>
        */}
        <Button asChild variant="link" size="sm" className="p-0 h-auto">
            <Link href={`/articles/${article.slug}`}>
                اقرأ المزيد &gt;
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
