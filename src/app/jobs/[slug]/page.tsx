import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getJobBySlug, getJobById } from '@/lib/data';
import { AppLayout } from '@/components/layout/app-layout';
import type { Metadata } from 'next';
import { JobDetailView } from './job-detail-view';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface JobDetailPageProps {
  params: { slug: string };
}

// Helper function to fetch a job by trying slug first, then falling back to ID.
async function getJob(param: string) {
    // Try fetching by slug first, as this is the most common case.
    const jobBySlug = await getJobBySlug(param);
    if (jobBySlug) {
      return jobBySlug;
    }
  
    // If not found, and the param does NOT look like a slug (i.e., no hyphens),
    // it might be a legacy ID. Let's try fetching by ID.
    if (!param.includes('-')) {
      const jobById = await getJobById(param);
      return jobById;
    }
  
    // If it looks like a slug but wasn't found, or it's not a valid ID, return null.
    return null;
}


export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = await getJob(params.slug);

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

  const canonicalUrl = `${baseUrl}/jobs/${job.slug || job.id}`;

  return {
    title: job.title,
    description: job.description?.substring(0, 160) || `إعلان عن ${job.title} في ${job.city}, ${job.country}.`,
    alternates: {
        canonical: canonicalUrl,
    },
    openGraph: {
        title: job.title,
        description: job.description?.substring(0, 160) || `إعلان عن ${job.title} في ${job.city}, ${job.country}.`,
        url: canonicalUrl,
        siteName: 'توظيفك',
        type: 'article',
    },
    other: {
        'application/ld+json': JSON.stringify(jobPostingJsonLd, null, 2)
    }
  };
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

async function JobDataComponent({ slug }: { slug: string }) {
    const job = await getJob(slug);

    if (!job) {
        notFound();
    }
    
    // If a job was found BUT the current URL slug doesn't match the job's actual slug
    // (e.g., we found it via a legacy ID), we redirect to the correct, canonical URL.
    if (job.slug && slug !== job.slug) {
        redirect(`/jobs/${job.slug}`);
    }
    
    return <JobDetailView job={job} />;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    return (
        <AppLayout>
            <MobilePageHeader title="تفاصيل الإعلان">
                <FileText className="h-5 w-5 text-primary" />
            </MobilePageHeader>
            <Suspense fallback={<JobDetailSkeleton />}>
                <JobDataComponent slug={params.slug} />
            </Suspense>
        </AppLayout>
    );
}
