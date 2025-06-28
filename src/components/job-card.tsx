import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-3">
          {category && <Badge variant="outline">{category.name}</Badge>}
          {category && (
            <div className="flex-shrink-0 bg-accent p-3 rounded-lg">
               <CategoryIcon name={category.iconName} className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-primary mb-3">{job.title}</h3>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
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
      <CardFooter className="p-4 bg-gray-50/50">
        <div className="flex items-center justify-between w-full">
           <Button asChild size="sm">
            <Link href={`/jobs/${job.id}`}>عرض التفاصيل</Link>
          </Button>
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
        </div>
      </CardFooter>
    </Card>
  );
}
