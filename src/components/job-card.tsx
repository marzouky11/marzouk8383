import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, Clock, Wallet } from 'lucide-react';
import type { Job } from '@/lib/types';
import { getCategoryById } from '@/lib/data';
import { CategoryIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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
  const themeColor = isWorkerAd ? 'text-accent' : 'text-primary';
  const themeBg = isWorkerAd ? 'bg-accent/10' : 'bg-primary/10';
  const buttonClass = isWorkerAd 
    ? "bg-accent text-accent-foreground hover:bg-accent/90" 
    : "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm h-full p-3 transition-shadow hover:shadow-lg w-full">
      <div className="flex-grow space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-grow">
            {category && <Badge variant={isWorkerAd ? 'accent' : 'secondary'} className="mb-1 font-normal text-xs">{category.name}</Badge>}
            <h3 className={cn("font-bold leading-tight", themeColor)}>
              <Link href={`/jobs/${job.id}`} className="focus:outline-none">
                <span className="absolute inset-0 z-0"></span>
                {job.title}
              </Link>
            </h3>
          </div>
          {category && (
            <div className={cn(
              "flex-shrink-0 p-2.5 rounded-lg z-10", 
              themeBg
            )}>
              <CategoryIcon 
                name={category.iconName} 
                className={cn("w-6 h-6", themeColor)} 
              />
            </div>
          )}
        </div>
        
        <Separator />

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
      
      <div className="flex items-center justify-between pt-3 mt-3">
        <div className="flex items-center gap-3 z-10">
          <div className="flex items-center gap-1 text-red-500">
            <Heart className={`h-4 w-4`} />
            <span className="text-xs font-medium">{job.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-xs font-medium text-muted-foreground">({job.rating})</span>
          </div>
        </div>
        <Button asChild size="sm" className={cn("h-8 text-xs rounded-lg px-4 z-10 relative", buttonClass)}>
          <Link href={`/jobs/${job.id}`}>عرض التفاصيل</Link>
        </Button>
      </div>
    </Card>
  );
}
