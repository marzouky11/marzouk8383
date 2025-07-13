import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Wallet, CalendarDays, GraduationCap, Briefcase, Users, CheckCircle, Award, User, Building } from 'lucide-react';
import type { Job, WorkType } from '@/lib/types';
import { getCategoryById } from '@/lib/data';
import { CategoryIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAvatar } from '@/components/user-avatar';

interface JobCardProps {
  job: Job | null;
}

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

const SeekerInfoItem = ({ icon: Icon, value, className }: { icon: React.ElementType; value: string | undefined, className?: string }) => {
    if (!value) return null;
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Icon className="h-4 w-4 text-primary/80 flex-shrink-0" />
        <p className="text-sm text-muted-foreground truncate font-medium">{value}</p>
      </div>
    );
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

  const category = getCategoryById(job.categoryId || '');
  const isSeekingJob = job.postType === 'seeking_job';

  if (isSeekingJob) {
    const seekerCategoryIcon = category?.iconName || 'User';
    return (
       <Card 
          className="relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm h-full p-4 transition-shadow hover:shadow-lg w-full border-l-4"
          style={{ borderColor: 'hsl(var(--destructive))' }}
        >
        <Link href={`/jobs/${job.id}`} className="focus:outline-none absolute inset-0 z-10">
          <span className="sr-only">عرض الملف الشخصي</span>
        </Link>
        <div className="flex flex-col items-center text-center flex-grow">
            <UserAvatar name={job.ownerName} color={job.ownerAvatarColor} className="h-20 w-20 text-3xl mb-3 border-4 border-background shadow-md" />
            <h3 className="font-bold text-lg text-foreground">{job.ownerName}</h3>
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm mb-3">
                <CategoryIcon name={seekerCategoryIcon} className="h-4 w-4" />
                <p>{job.title}</p>
            </div>
            
            <div className="flex flex-col items-start text-right gap-2.5 w-full mt-4 pt-4 border-t">
                <SeekerInfoItem icon={MapPin} value={`${job.country}, ${job.city}`} />
                <SeekerInfoItem icon={Award} value={job.experience} />
                <SeekerInfoItem icon={GraduationCap} value={job.qualifications} />
                <SeekerInfoItem icon={Clock} value={workTypeTranslations[job.workType]} />
            </div>
        </div>
        <div className="flex items-center justify-between pt-4 mt-auto">
            <div className="flex items-center gap-1 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span className="text-xs font-medium">{job.postedAt}</span>
            </div>
            <Button asChild size="sm" variant="destructive" className="h-9 text-sm rounded-lg px-4 z-20 relative">
              <Link href={`/jobs/${job.id}`}>عرض الملف</Link>
            </Button>
        </div>
      </Card>
    )
  }

  // Original Design for Job Offers
  const defaultColor = 'hsl(var(--primary))';
  const defaultIconName = 'Briefcase';
  const finalColor = category?.color || defaultColor;
  const finalIconName = category?.iconName || defaultIconName;

  const InfoItem = ({ icon: Icon, value }: { icon: React.ElementType, value: string | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{value}</span>
      </div>
    );
  };
  
  return (
    <Card 
        className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg h-full border-l-4"
        style={{ borderColor: finalColor }}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <Badge variant="outline" style={{ borderColor: finalColor, color: finalColor }} className="text-xs font-medium mb-2">
              <CategoryIcon name={finalIconName} className="ml-1 h-3 w-3" />
              {category?.name || job.categoryName || 'متفرقات'}
            </Badge>
            <CardTitle className="leading-snug text-lg">
              <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors line-clamp-2">
                {job.title}
              </Link>
            </CardTitle>
          </div>
          <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${finalColor}1A`}}>
             <CategoryIcon name={finalIconName} className="h-6 w-6" style={{ color: finalColor }} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2.5 text-sm">
        <InfoItem icon={MapPin} value={`${job.country}, ${job.city}`} />
        <InfoItem icon={Clock} value={workTypeTranslations[job.workType]} />
        <InfoItem icon={Wallet} value={job.salary ? job.salary : 'عند الطلب'} />
      </CardContent>
      <Separator />
      <div className="p-4 flex justify-between items-center text-xs text-muted-foreground">
         <div className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <time dateTime={job.createdAt.toString()}>{job.postedAt}</time>
        </div>
        <Button asChild size="sm" className="z-10 relative">
          <Link href={`/jobs/${job.id}`}>
            عرض التفاصيل
          </Link>
        </Button>
      </div>
    </Card>
  );
}
