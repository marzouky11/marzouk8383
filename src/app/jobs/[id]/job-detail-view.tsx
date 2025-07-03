'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getCategoryById } from '@/lib/data';
import type { Job, WorkType } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { CopyButton } from './copy-button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ShareButton } from './share-button';

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

interface JobDetailViewProps {
    job: Job;
}

export function JobDetailView({ job }: JobDetailViewProps) {
  if (!job) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6 text-center">
        <p>عذرًا, لم نتمكن من تحميل تفاصيل الإعلان.</p>
      </div>
    );
  }

  const category = getCategoryById(job.categoryId);
  const isWorkerAd = job?.postType === 'seeking_job';
  const themeColor = isWorkerAd ? 'text-accent' : 'text-destructive';
  const themeBg = isWorkerAd ? 'bg-accent/10' : 'bg-destructive/10';
  const themeBorder = isWorkerAd ? 'border-accent' : 'border-destructive';
  const buttonTheme = isWorkerAd 
      ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
      : 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
  
  const translatedWorkType = workTypeTranslations[job.workType] || job.workType || 'غير محدد';

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
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <Card className={cn('overflow-hidden shadow-xl border-t-4 relative z-10 rounded-2xl', themeBorder)}>
        <CardContent className="p-4 sm:p-6 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={cn('text-2xl font-bold', themeColor)}>
                {job.title || 'عنوان غير متوفر'}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span className="text-md">{job.country || 'دولة غير محددة'}, {job.city || 'مدينة غير محددة'}</span>
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
            <InfoItem icon={Clock} text={`النوع: ${translatedWorkType}`} />
            <InfoItem icon={Award} text={`الخبرة: ${job.experience || 'غير محدد'}`} />
            {job.companyName && <InfoItem icon={Building2} text={`الشركة: ${job.companyName}`} />}
            {job.openPositions && <InfoItem icon={Users2} text={`شواغر: ${job.openPositions}`} />}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-semibold">{job.rating || 'N/A'}</span>
              <span className="text-xs">(تقييم)</span>
            </div>
            <InfoItem icon={CalendarDays} text={`نشر في: ${job.postedAt || 'غير معروف'}`} />
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
                    <AvatarFallback>{job.ownerName ? job.ownerName.charAt(0) : 'ص'}</AvatarFallback>
                </Avatar>
                <p className="font-semibold">{job.ownerName || 'صاحب الإعلان'}</p>
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
  );
}
