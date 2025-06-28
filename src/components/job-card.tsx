import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Hammer, DollarSign } from 'lucide-react';
import type { Job } from '@/lib/types';
import { getCategoryById } from '@/lib/data';
import { CategoryIcon } from '@/components/icons';

interface JobCardProps {
  job: Job;
}

const workTypeTranslations: { [key in Job['workType']]: string } = {
  daily: 'يومي',
  monthly: 'شهري',
  project: 'مشروع',
};

export function JobCard({ job }: JobCardProps) {
  const category = getCategoryById(job.categoryId);

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold">{job.title}</CardTitle>
        {category && (
          <p className="text-sm text-muted-foreground">{category.name}</p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{job.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hammer className="h-4 w-4 text-muted-foreground" />
              <span>{workTypeTranslations[job.workType]}</span>
            </div>
          </div>
          {category && (
            <div className="flex-shrink-0">
               <CategoryIcon name={category.iconName} className="w-16 h-16 text-primary/20" />
            </div>
          )}
        </div>
      </CardContent>
      <Separator className="my-0" />
      <CardFooter className="p-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
              <Heart className={`h-5 w-5 ${job.isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm">{job.rating}</span>
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
          </div>
          <Button asChild size="sm">
            <Link href={`/jobs/${job.id}`}>عرض التفاصيل</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
