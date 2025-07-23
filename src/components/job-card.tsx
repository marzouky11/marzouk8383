import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Wallet, User as UserIcon } from 'lucide-react';
import type { Job, WorkType } from '@/lib/types';
import { getCategoryById } from '@/lib/data';
import { CategoryIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
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

const InfoBadge = ({ icon: Icon, text, variant, iconColor }: { icon: React.ElementType, text: string, variant: "destructive" | "secondary" | "accent", iconColor: string }) => {
  return (
    <Badge variant={variant} className="flex-shrink-0">
      <Icon className={cn("h-4 w-4 ml-1", iconColor)} />
      <span className="text-foreground">{text}</span>
    </Badge>
  );
};


export function JobCard({ job }: JobCardProps) {
  if (!job) {
    return (
      <Card className="p-3 space-y-2 h-full">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>
        <div className="flex items-center justify-end pt-2">
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

  const finalIconName = category?.iconName || (isSeekingJob ? 'User' : 'Briefcase');
  const salaryText = !isSeekingJob ? (job.salary ? job.salary : 'عند الطلب') : '';
  const workTypeText = job.workType ? workTypeTranslations[job.workType] : '';
  
  return (
    <Card 
        className={cn(
            "relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm h-full p-4 transition-shadow hover:shadow-lg w-full"
        )}
    >
      <Link href={detailUrl} className="focus:outline-none absolute inset-0 z-10">
         <span className="sr-only">View Details</span>
      </Link>

       <div className="flex-grow flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow">
            <h3 className="font-bold text-lg leading-tight text-black line-clamp-2">
                {job.title}
            </h3>
            <p className="text-sm font-medium mt-1" style={{ color: finalColor }}>
              {categoryName}
            </p>
          </div>
          <div 
            className="flex-shrink-0 p-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${finalColor}1A` }}
          >
            <CategoryIcon name={finalIconName} className="w-6 h-6" style={{ color: finalColor }} />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <InfoBadge icon={MapPin} text={`${job.city}, ${job.country}`} variant="destructive" iconColor="text-red-500" />
          {workTypeText && <InfoBadge icon={Clock} text={workTypeText} variant="secondary" iconColor="text-blue-500" />}
          {isSeekingJob && job.ownerName && <InfoBadge icon={UserIcon} text={job.ownerName} variant="secondary" iconColor="text-blue-500" />}
          {salaryText && <InfoBadge icon={Wallet} text={salaryText} variant="accent" iconColor="text-green-600" />}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 mt-auto">
        <div className="flex items-center gap-1.5 text-muted-foreground">
            {job.createdAt && <time dateTime={new Date(job.createdAt.seconds * 1000).toISOString()} className="text-xs font-medium">{job.postedAt}</time>}
        </div>
        <Button asChild size="sm" className="h-9 text-sm rounded-lg px-4 z-20 relative text-primary-foreground" style={{ backgroundColor: finalColor }}>
          <Link href={detailUrl}>{isSeekingJob ? 'عرض الملف' : 'عرض التفاصيل'}</Link>
        </Button>
      </div>
    </Card>
  );
}
