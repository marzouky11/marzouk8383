import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Wallet } from 'lucide-react';
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
      <Card className="p-4 space-y-3 h-full">
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
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
      </Card>
    );
  }

  const category = getCategoryById(job.categoryId);

  const InfoItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string | undefined }) => (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{text || 'غير محدد'}</span>
    </div>
  );

  return (
    <Card 
      className="relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm h-full p-4 transition-shadow hover:shadow-lg w-full border-t-4"
      style={{ borderColor: category?.color }}
    >
       <Link href={`/jobs/${job.id}`} className="focus:outline-none absolute inset-0 z-10">
         <span className="sr-only">View Job</span>
      </Link>
      <div className="flex-grow space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-grow">
            {category && <Badge variant={'secondary'} className="mb-1 font-normal text-xs">{category.name}</Badge>}
            <h3 
              className="font-bold leading-tight"
              style={{ color: category?.color }}
            >
                {job.title}
            </h3>
          </div>
          {category && (
            <div 
              className="flex-shrink-0 p-3 rounded-xl z-0"
              style={{ backgroundColor: `${category.color}1A` }}
            >
              <CategoryIcon 
                name={category.iconName} 
                className="w-6 h-6"
                style={{ color: category.color }}
              />
            </div>
          )}
        </div>
        
        <Separator />

        <div className="flex flex-col gap-2.5">
          <InfoItem icon={MapPin} text={`${job.country}, ${job.city}`} />
          <InfoItem icon={Wallet} text={`الأجر: ${job.salary || 'عند الطلب'}`} />
          <InfoItem icon={Clock} text={`طبيعة العمل: ${workTypeTranslations[job.workType]}`} />
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 mt-auto">
        <div className="flex items-center gap-3 z-20">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-xs font-medium">({job.rating})</span>
          </div>
        </div>
        <Button asChild size="sm" className="h-9 text-sm rounded-lg px-4 z-20 relative text-primary-foreground" style={{ backgroundColor: category?.color }}>
          <Link href={`/jobs/${job.id}`}>عرض التفاصيل</Link>
        </Button>
      </div>
    </Card>
  );
}
