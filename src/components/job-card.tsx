


import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Wallet, CalendarDays, User as UserIcon, Briefcase, LayoutGrid } from 'lucide-react';
import type { Job, WorkType } from '@/lib/types';
import { getCategoryById } from '@/lib/data';
import { CategoryIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface JobCardProps {
  job: Job | null;
}

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

export function JobCard({ job }: JobCardProps) {
  if (!job) {
    return (
      <Card className="p-3 space-y-2 h-full">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-grow space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
        <Separator />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </Card>
    );
  }

  const category = getCategoryById(job.categoryId || '');
  const isSeekingJob = job.postType === 'seeking_job';
  const detailUrl = isSeekingJob ? `/workers/${job.id}` : `/jobs/${job.id}`;
  const categoryName = category?.name || job.categoryName;

  const finalColor = isSeekingJob 
    ? (category?.color || 'hsl(var(--destructive))') 
    : (category?.color || 'hsl(var(--primary))');
    
  const finalIconName = isSeekingJob
    ? (category?.iconName || 'User')
    : (category?.iconName || 'Briefcase');

  return (
    <Card 
        className={cn(
            "relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm h-full p-3 transition-shadow hover:shadow-lg w-full",
            !isSeekingJob && "border-t-4"
        )}
        style={{ borderColor: !isSeekingJob ? finalColor : 'hsl(var(--border))' }}
    >
      <Link href={detailUrl} className="focus:outline-none absolute inset-0 z-10">
         <span className="sr-only">View Details</span>
      </Link>

       <div className="flex-grow flex flex-col space-y-2">
        <div className="flex items-start gap-3">
            <div 
                className="flex-shrink-0 p-3 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${finalColor}1A` }}
            >
                <CategoryIcon name={finalIconName} className="w-7 h-7" style={{ color: finalColor }} />
            </div>
            <div className="flex-grow overflow-hidden">
                 <h3 
                  className="font-bold text-lg leading-tight truncate"
                  style={{ color: finalColor }}
                >
                    {job.title}
                </h3>
                <p className="text-base text-muted-foreground mt-1 truncate">{categoryName || (isSeekingJob ? 'باحث عن عمل' : 'عرض عمل')}</p>
            </div>
        </div>
        
        <Separator />

        <div className="flex flex-col gap-2 text-base text-muted-foreground min-h-[5rem]">
          <div className="flex items-center gap-2"><MapPin className="h-5 w-5 flex-shrink-0" /><span>{job.country}, {job.city}</span></div>
          {!isSeekingJob && <div className="flex items-center gap-2"><Clock className="h-5 w-5 flex-shrink-0" /><span>{workTypeTranslations[job.workType]}</span></div>}
          {isSeekingJob && <div className="flex items-center gap-2"><UserIcon className="h-5 w-5 flex-shrink-0" /><span>{job.ownerName}</span></div>}
          {!isSeekingJob && <div className="flex items-center gap-2"><Wallet className="h-5 w-5 flex-shrink-0" /><span>{job.salary ? job.salary : 'عند الطلب'}</span></div>}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 mt-auto">
        <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {job.createdAt && <time dateTime={new Date(job.createdAt.seconds * 1000).toISOString()} className="text-sm font-medium">{job.postedAt}</time>}
        </div>
        <Button asChild size="sm" className="h-9 text-sm rounded-lg px-4 z-20 relative text-primary-foreground" style={{ backgroundColor: finalColor }}>
          <Link href={detailUrl}>{isSeekingJob ? 'عرض الملف' : 'عرض التفاصيل'}</Link>
        </Button>
      </div>
    </Card>
  );
}
