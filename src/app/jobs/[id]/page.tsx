import { notFound } from 'next/navigation';
import { getJobById, getCategoryById } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
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
import type { WorkType } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { CopyButton } from './copy-button';
import { ShareButton } from './share-button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface JobDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJobById(params.id);

  if (!job) {
    return {
      title: 'الإعلان غير موجود',
      description: 'لم نتمكن من العثور على الإعلان الذي تبحث عنه.',
    };
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://khidmanow.com';
  
  const employmentTypeMapping: {[key: string]: string} = {
    'full_time': 'FULL_TIME',
    'part_time': 'PART_TIME',
    'freelance': 'CONTRACTOR',
    'remote': 'OTHER',
  };

  const jobTitle = job.title || 'إعلان وظيفة';
  const jobDescription = job.description || jobTitle;
  const jobCity = job.city || 'مدينة غير محددة';
  const jobCountry = job.country || 'دولة غير محددة';
  const createdAtDate = (job.createdAt && typeof job.createdAt.toDate === 'function') 
    ? job.createdAt.toDate() 
    : new Date();

  const jobPostingJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: jobTitle,
      description: jobDescription,
      datePosted: createdAtDate.toISOString(),
      employmentType: employmentTypeMapping[job.workType] || 'OTHER',
      hiringOrganization: {
        '@type': 'Organization',
        name: job.companyName || 'توظيفك',
        sameAs: baseUrl,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: jobCity,
          addressCountry: jobCountry,
        },
      },
      ...(job.workType === 'remote' && { jobLocationType: 'TELECOMMUTE' }),
  };

  const canonicalUrl = `${baseUrl}/jobs/${job.id}`;

  return {
    title: jobTitle,
    description: jobDescription.substring(0, 160) || `إعلان عن ${jobTitle} في ${jobCity}, ${jobCountry}.`,
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title: jobTitle,
        description: jobDescription.substring(0, 160) || `إعلان عن ${jobTitle} في ${jobCity}, ${jobCountry}.`,
        url: canonicalUrl,
        siteName: 'توظيفك',
        type: 'article',
    },
    other: {
        'application/ld+json': JSON.stringify(jobPostingJsonLd, null, 2)
    }
  };
}

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

const InfoItem = ({ icon: Icon, text, themeColor }: { icon: React.ElementType; text: string | number | undefined; themeColor: string }) => {
    if (!text) return null;
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={cn('h-4 w-4', themeColor)} />
        <span>{text}</span>
      </div>
    );
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const job = await getJobById(params.id);

    if (!job) {
        notFound();
    }

    const category = getCategoryById(job.categoryId || '');
    // Job Seeker (seeking_job) is Red (destructive). Job Offer (seeking_worker) is Green (accent).
    const isSeekingJob = job?.postType === 'seeking_job';
    const themeColor = isSeekingJob ? 'text-destructive' : 'text-accent';
    const themeBg = isSeekingJob ? 'bg-destructive/10' : 'bg-accent/10';
    const themeBorder = isSeekingJob ? 'border-destructive' : 'border-accent';
    
    const translatedWorkType = workTypeTranslations[job.workType] || job.workType || 'غير محدد';
    
    return (
        <AppLayout>
            <MobilePageHeader title="تفاصيل الإعلان">
                <FileText className="h-5 w-5 text-primary" />
            </MobilePageHeader>
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
                    <InfoItem icon={Wallet} text={job.salary ? `الأجر: ${job.salary}` : 'الأجر: عند الطلب'} themeColor={themeColor} />
                    <InfoItem icon={Clock} text={`النوع: ${translatedWorkType}`} themeColor={themeColor} />
                    <InfoItem icon={Award} text={`الخبرة: ${job.experience || 'غير محدد'}`} themeColor={themeColor} />
                    {job.companyName && <InfoItem icon={Building2} text={`الشركة: ${job.companyName}`} themeColor={themeColor} />}
                    {job.openPositions && <InfoItem icon={Users2} text={`شواغر: ${job.openPositions}`} themeColor={themeColor} />}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{job.rating || 'N/A'}</span>
                      <span className="text-xs">(تقييم)</span>
                    </div>
                    <InfoItem icon={CalendarDays} text={`نشر في: ${job.postedAt || 'غير معروف'}`} themeColor={themeColor} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ShareButton title={job.title || 'إعلان وظيفة'} text={job.description || 'تحقق من هذا الإعلان الرائع!'} />
                  </div>

                  <Separator />

                  <div>
                    <h3 className={cn('text-lg font-bold flex items-center gap-2 mb-2', themeColor)}>
                        {isSeekingJob ? <UserIcon className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                        {isSeekingJob ? 'وصف المهارات والخبرة' : 'وصف الوظيفة'}
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
                        <Button asChild className="flex-grow">
                          <a href={`https://wa.me/${job.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer">
                            <MessageSquare className="ml-2 h-4 w-4" />
                            واتساب
                          </a>
                        </Button>
                      )}
                      {job.phone && (
                        <Button asChild className="flex-grow">
                          <a href={`tel:${job.phone}`}>
                            <Phone className="ml-2 h-4 w-4" />
                            اتصال
                          </a>
                        </Button>
                      )}
                      {job.email && (
                        <Button asChild className="flex-grow">
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
        </AppLayout>
    );
}
