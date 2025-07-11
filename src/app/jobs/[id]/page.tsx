import { notFound } from 'next/navigation';
import { getJobById, getCategoryById } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
import type { Metadata } from 'next';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import {
  Phone,
  MessageSquare,
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
  Clock,
  Instagram,
  Link as LinkIcon,
  GraduationCap,
  Mail
} from 'lucide-react';
import type { WorkType } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { ShareButton } from './share-button';
import { Separator } from '@/components/ui/separator';
import { ReportAdDialog } from './report-ad-dialog';
import { cn } from '@/lib/utils';

interface JobDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJobById(params.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tawzifak.com';
  const siteThumbnail = 'https://i.postimg.cc/YCz0LvMj/Screenshot-20250704-173231.jpg';
  
  if (!job) {
    return {
      title: 'الإعلان غير موجود',
      description: 'لم نتمكن من العثور على الإعلان الذي تبحث عنه.',
      openGraph: { images: [{ url: siteThumbnail }] },
      twitter: { images: [siteThumbnail] }
    };
  }
  
  const employmentTypeMapping: {[key: string]: string} = {
    'full_time': 'FULL_TIME',
    'part_time': 'PART_TIME',
    'freelance': 'CONTRACTOR',
    'remote': 'OTHER',
  };

  const jobTitle = job.title || 'إعلان وظيفة';
  const jobCity = job.city || 'مدينة غير محددة';
  const jobCountry = job.country || 'دولة غير محددة';

  const metaDescription = (job.description || `إعلان عن ${jobTitle} في ${jobCity}, ${jobCountry}.`).substring(0, 160);
  const jsonLdDescription = job.description || `إعلان عن ${jobTitle} في ${jobCity}, ${jobCountry}.`;

  const createdAtDate = (job.createdAt && typeof job.createdAt.toDate === 'function') 
    ? job.createdAt.toDate() 
    : new Date();

  const jobPostingJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: jobTitle,
      description: jsonLdDescription,
      datePosted: createdAtDate.toISOString(),
      employmentType: employmentTypeMapping[job.workType] || 'OTHER',
      hiringOrganization: {
        '@type': 'Organization',
        name: job.companyName || 'توظيفك',
        sameAs: baseUrl,
        logo: siteThumbnail,
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
      ...(job.qualifications && { qualifications: job.qualifications }),
  };

  const canonicalUrl = `${baseUrl}/jobs/${job.id}`;

  return {
    title: jobTitle,
    description: metaDescription,
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title: jobTitle,
        description: metaDescription,
        url: canonicalUrl,
        siteName: 'توظيفك',
        type: 'article',
        images: [
            {
                url: siteThumbnail,
                width: 1200,
                height: 630,
                alt: jobTitle,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: jobTitle,
        description: metaDescription,
        images: [siteThumbnail],
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


export default async function JobDetailPage({ params }: JobDetailPageProps) {
    const job = await getJobById(params.id);

    if (!job) {
        notFound();
    }

    const category = getCategoryById(job.categoryId || '');
    const isSeekingJob = job?.postType === 'seeking_job';
    
    const translatedWorkType = workTypeTranslations[job.workType] || job.workType || 'غير محدد';
    
    const defaultColor = isSeekingJob ? 'hsl(var(--destructive))' : 'hsl(var(--primary))';
    const finalColor = category?.color || defaultColor;
    const finalIconName = category?.iconName || (isSeekingJob ? 'Users' : 'Briefcase');
    const iconContainerStyle = {
      backgroundColor: category ? `${category.color}1A` : (isSeekingJob ? 'hsl(var(--destructive) / 0.1)' : 'hsl(var(--primary) / 0.1)')
    };

    const InfoItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string | number | undefined; }) => {
        if (!text) return null;
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" style={{ color: finalColor }}/>
            <span>{text}</span>
          </div>
        );
    }
    
    return (
        <AppLayout>
            <MobilePageHeader title="تفاصيل الإعلان">
                <FileText className="h-5 w-5" style={{ color: finalColor }} />
            </MobilePageHeader>
            <div className="container mx-auto max-w-4xl px-4 py-6">
              <Card 
                className="overflow-hidden shadow-xl border-t-4 relative z-10 rounded-2xl"
                style={{ borderColor: finalColor }}
              >
                <CardContent className="p-4 sm:p-6 space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold" style={{ color: finalColor }}>
                        {job.title || 'عنوان غير متوفر'}
                      </h1>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-md">{job.country || 'دولة غير محددة'}, {job.city || 'مدينة غير محددة'}</span>
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded-full"
                      style={iconContainerStyle}
                    >
                      <CategoryIcon name={finalIconName} className="w-7 h-7" style={{ color: finalColor }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <InfoItem icon={Wallet} text={job.salary ? `الأجر: ${job.salary}` : 'الأجر: عند الطلب'} />
                    <InfoItem icon={Clock} text={`النوع: ${translatedWorkType}`} />
                    <InfoItem icon={Award} text={`الخبرة: ${job.experience || 'غير محدد'}`} />
                    {job.qualifications && <InfoItem icon={GraduationCap} text={`المؤهلات: ${job.qualifications}`} />}
                    {job.companyName && <InfoItem icon={Building2} text={`الشركة: ${job.companyName}`} />}
                    {job.openPositions && <InfoItem icon={Users2} text={`شواغر: ${job.openPositions}`} />}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{job.rating || 'N/A'}</span>
                      <span className="text-xs">(تقييم)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ShareButton title={job.title || 'إعلان وظيفة'} text={job.description || 'تحقق من هذا الإعلان الرائع!'} />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2" style={{ color: finalColor }}>
                        {isSeekingJob ? <UserIcon className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                        {isSeekingJob ? 'وصف المهارات والخبرة' : 'وصف الوظيفة'}
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {job.description || 'لا يوجد وصف متاح.'}
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4">
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-3" style={{ color: finalColor }}>
                        <UserIcon className="h-5 w-5" />
                        صاحب الإعلان
                      </h3>
                      <div className="flex items-center gap-3">
                        <UserAvatar name={job.ownerName} color={job.ownerAvatarColor} />
                        <p className="font-semibold">{job.ownerName || 'صاحب الإعلان'}</p>
                      </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-3" style={{ color: finalColor }}>
                      <Phone className="h-5 w-5" />
                      معلومات التواصل
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                          {job.phone && (
                            <Button asChild className="flex-grow text-primary-foreground" style={{ backgroundColor: finalColor }}>
                              <a href={`tel:${job.phone}`}>
                                <Phone className="ml-2 h-4 w-4" />
                                اتصال
                              </a>
                            </Button>
                          )}
                          {job.whatsapp && (
                            <Button asChild className="flex-grow bg-green-600 hover:bg-green-700 text-primary-foreground">
                              <a href={`https://wa.me/${job.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="ml-2 h-4 w-4" />
                                واتساب
                              </a>
                            </Button>
                          )}
                           {job.email && (
                              <Button asChild className="flex-grow bg-gray-600 hover:bg-gray-700 text-primary-foreground">
                                <a href={`mailto:${job.email}`}>
                                  <Mail className="ml-2 h-4 w-4" />
                                  البريد الإلكتروني
                                </a>
                              </Button>
                            )}
                          {job.instagram && (
                            <Button asChild className="flex-grow text-primary-foreground bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90">
                              <a href={`https://instagram.com/${job.instagram.replace(/@/g, '')}`} target="_blank" rel="noopener noreferrer">
                                <Instagram className="ml-2 h-4 w-4" />
                                إنستغرام
                              </a>
                            </Button>
                          )}
                          {job.applyUrl && job.postType === 'seeking_worker' && (
                            <Button asChild className="flex-grow bg-blue-600 hover:bg-blue-700 text-primary-foreground">
                              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="ml-2 h-4 w-4" />
                                تسجيل عبر الموقع
                              </a>
                            </Button>
                          )}
                      </div>
                       <ReportAdDialog adId={job.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        </AppLayout>
    );
}
