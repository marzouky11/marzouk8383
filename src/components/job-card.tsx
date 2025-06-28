import Link from 'next/link';
import { Card } from '@/components/ui/card';
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
    <Card className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm h-full p-4">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-grow">
            {category && <Badge variant="secondary" className="mb-2 font-normal">{category.name}</Badge>}
            <h3 className="text-lg font-bold text-primary">{job.title}</h3>
          </div>
          {category && (
            <div className="flex-shrink-0 bg-primary/10 p-4 rounded-xl">
              <CategoryIcon name={category.iconName} className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>
        
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
      </div>
      
      <div className="flex items-center justify-between pt-4 mt-4 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-red-500">
            <Heart className={`h-5 w-5 ${job.isFavorite ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{job.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-muted-foreground">({job.rating})</span>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href={`/jobs/${job.id}`}>عرض التفاصيل</Link>
        </Button>
      </div>
    </Card>
  );
}
