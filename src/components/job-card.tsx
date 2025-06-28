import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Clock, Wallet } from 'lucide-react';
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
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg rounded-2xl border-none h-full">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-3">
            <div className="flex-grow">
                {category && <Badge variant="outline" className="mb-1 font-normal border-primary/50 text-primary">{category.name}</Badge>}
                <h3 className="text-lg font-bold text-card-foreground">{job.title}</h3>
            </div>
            {category && (
                <div className="flex-shrink-0 bg-primary/10 p-4 rounded-xl">
                   <CategoryIcon name={category.iconName} className="w-6 h-6 text-primary" />
                </div>
            )}
        </div>
        
        <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>المدينة: {job.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span>الأجر: {job.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>طبيعة العمل: {workTypeTranslations[job.workType]}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-red-500">
               <Heart className={`h-5 w-5 ${job.isFavorite ? 'fill-current' : ''}`} />
               <span className="text-sm font-bold">{job.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-bold">({job.rating})</span>
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
