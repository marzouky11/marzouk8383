import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Clock, Wallet, Briefcase, User } from 'lucide-react';
import type { Job } from '@/lib/types';
import { getCategoryById } from '@/lib/data';
import { CategoryIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

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
  const isWorkerAd = job.postType === 'seeking_job';

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm h-full p-3 transition-shadow hover:shadow-lg">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-grow pr-2">
            {category && <Badge variant="secondary" className="mb-1 font-normal text-xs">{category.name}</Badge>}
            <div className="flex items-start gap-2">
              {isWorkerAd ? <User className="h-4 w-4 text-primary flex-shrink-0 mt-1" /> : <Briefcase className="h-4 w-4 text-primary flex-shrink-0 mt-1" />}
              <h3 className="font-bold text-primary leading-tight text-sm">{job.title}</h3>
            </div>
          </div>
          {category && (
            <div className="flex-shrink-0 bg-primary/10 p-2 rounded-lg">
              <CategoryIcon name={category.iconName} className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{job.country}, {job.city}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5" />
            <span>الأجر: {job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>طبيعة العمل: {workTypeTranslations[job.workType]}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 mt-3 border-t">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-red-500">
            <Heart className={`h-4 w-4 ${job.isFavorite ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{job.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-xs font-medium text-muted-foreground">({job.rating})</span>
          </div>
        </div>
        <Button asChild size="sm" className={cn(
            "h-7 text-xs rounded-lg px-3",
            isWorkerAd && "bg-accent text-accent-foreground hover:bg-accent/90"
        )}>
          <Link href={`/jobs/${job.id}`}>التفاصيل</Link>
        </Button>
      </div>
    </Card>
  );
}
