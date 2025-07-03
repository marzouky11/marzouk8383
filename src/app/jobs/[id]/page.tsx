import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getJobBySlug } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
import type { Metadata } from 'next';
import { JobDetailView } from './job-detail-view';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface JobDetailPageProps {
  params: { id: string }; // This `id` is actually the `slug`
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJobBySlug(params.id); // The param is 'id' but it's a slug

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

  const jobPostingJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      description: job.description || job.title,
      datePosted: job.createdAt ? job.createdAt.toDate().toISOString() : new Date().toISOString(),
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
          addressLocality: job.city,
          addressCountry: job.country,
        },
      },
      ...(job.workType === 'remote' && { jobLocationType: 'TELECOMMUTE' }),
  };

  const metadata: Metadata = {
    title: job.title,
    description: job.description?.substring(0, 160) || `إعلان عن ${job.title} في ${job.city}, ${job.country}.`,
    alternates: {
        canonical: `${baseUrl}/jobs/${job.slug}`,
    },
    openGraph: {
        title: job.title,
        description: job.description?.substring(0, 160) || `إعلان عن ${job.title} في ${job.city}, ${job.country}.`,
        url: `${baseUrl}/jobs/${job.slug}`,
        siteName: 'توظيفك',
        type: 'article',
    },
    other: {
        'application/ld+json': JSON.stringify(jobPostingJsonLd, null, 2)
    }
  };

  return metadata;
}

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

async function JobData({ slug }: { slug: string }) {
    const job = await getJobBySlug(slug);

    if (!job) {
        notFound();
    }
    
    return <JobDetailView job={job} />;
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
    return (
        <AppLayout>
            <MobilePageHeader title="تفاصيل الإعلان">
                <FileText className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <Suspense fallback={<JobDetailSkeleton />}>
                <JobData slug={params.id} />
            </Suspense>
        </AppLayout>
    );
}
