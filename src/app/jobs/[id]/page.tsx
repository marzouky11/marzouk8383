'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Wallet,
  Star,
  CalendarDays,
  User as UserIcon,
  Briefcase,
  FileText,
  Building2,
  Award,
  Users2,
  Clock
} from 'lucide-react';
import { getJobById, getCategoryById } from '@/lib/data';
import type { Job, WorkType } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { CopyButton } from './copy-button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { ShareButton } from './share-button';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};


export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (params?.id) {
      const fetchJob = async () => {
        setLoading(true);
        const jobData = await getJobById(params.id as string);
        if (jobData) {
            setJob(jobData);
        }
        setLoading(false);
      };
      fetchJob();
    }
  }, [params?.id, user]);

  const JobDetailSkeleton = () => (
    <div className="container mx-auto max-w-4xl px-4 py-6">
        <Card className="overflow-hidden shadow-xl border-t-4 relative z-10 rounded-2xl border-muted">
            <CardContent className="p-6 space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Separator />
                <Skeleton className="h-20 w-full" />
                <Separator />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    </div>
  );

  if (!job && !loading) {
    notFound();
  }
  
  const category = job ? getCategoryById(job.categoryId) : null;
  const isWorkerAd = job?.postType === 'seeking_job';
  const themeColor = isWorkerAd ? 'text-accent' : 'text-destructive';
  const themeBg = isWorkerAd ? 'bg-accent/10' : 'bg-destructive/10';
  const themeBorder = isWorkerAd ? 'border-accent' : 'border-destructive';
  const buttonTheme = isWorkerAd 
      ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
      : 'bg-destructive text-destructive-foreground hover:bg-destructive/90';

  const InfoItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string | number | undefined }) => {
    if (!text) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={cn('h-4 w-4', themeColor)} />
        <span>{text}</span>
      </div>
    );
  }

  return (
    <AppLayout>
      <MobilePageHeader title="تفاصيل الإعلان">
        <FileText className="h-5 w-5 text-primary" />
      </MobilePageHeader>

      {loading || !job ? <JobDetailSkeleton /> : (
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <Card className={cn('overflow-hidden shadow-xl border-t-4 relative z-10 rounded-2xl', themeBorder)}>
            <CardContent className="p-4 sm:p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={cn('text-2xl font-bold', themeColor)}>
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-md">{job.country}, {job.city}</span>
                  </div>
                </div>
                {category && (
                  <div className={cn('p-3 rounded-full', themeBg)}>
                    <CategoryIcon name={category.iconName} className={cn('w-7 h-7', themeColor)} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <InfoItem icon={Wallet} text={job.salary ? `الأجر: ${job.salary}` : 'الأجر: عند الطلب'} />
                <InfoItem icon={Clock} text={`النوع: ${workTypeTranslations[job.workType]}`} />
                <InfoItem icon={Award} text={`الخبرة: ${job.experience || 'غير محدد'}`} />
                {job.companyName && <InfoItem icon={Building2} text={`الشركة: ${job.companyName}`} />}
                {job.openPositions && <InfoItem icon={Users2} text={`شواغر: ${job.openPositions}`} />}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{job.rating}</span>
                  <span className="text-xs">(تقييم)</span>
                </div>
                <InfoItem icon={CalendarDays} text={`نشر في: ${job.postedAt}`} />
              </div>
              
              <div className="flex items-center gap-2">
                <ShareButton title={job.title} text={job.description || 'تحقق من هذا الإعلان الرائع!'} />
              </div>

              <Separator />

              <div>
                <h3 className={cn('text-lg font-bold flex items-center gap-2 mb-2', themeColor)}>
                    {isWorkerAd ? <UserIcon className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                    {isWorkerAd ? 'وصف المهارات والخبرة' : 'وصف الوظيفة'}
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {job.description || 'لا يوجد وصف متاح.'}
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                  <h3 className={cn('text-lg font-bold flex items-center gap-2 mb-3', themeColor)}>
                    <UserIcon className="h-5 w-5" />
                    صاحب الإعلان
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={job.ownerAvatar} data-ai-hint="user avatar" />
                        <AvatarFallback>{job.ownerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{job.ownerName}</p>
                  </div>
              </div>

              <div>
                <h3 className={cn('text-lg font-bold flex items-center gap-2 mb-3', themeColor)}>
                  <Phone className="h-5 w-5" />
                  معلومات التواصل
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  {job.whatsapp && (
                    <Button asChild className={cn('flex-grow', buttonTheme)}>
                      <a href={`https://wa.me/${job.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="ml-2 h-4 w-4" />
                        واتساب
                      </a>
                    </Button>
                  )}
                  {job.phone && (
                    <Button asChild className={cn('flex-grow', buttonTheme)}>
                      <a href={`tel:${job.phone}`}>
                        <Phone className="ml-2 h-4 w-4" />
                        اتصال
                      </a>
                    </Button>
                  )}
                   {job.email && (
                    <Button asChild className={cn('flex-grow', buttonTheme)}>
                      <a href={`mailto:${job.email}`}>
                        <Mail className="ml-2 h-4 w-4" />
                        بريد إلكتروني
                      </a>
                    </Button>
                  )}
                  {job.phone && <CopyButton textToCopy={job.phone} />}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
