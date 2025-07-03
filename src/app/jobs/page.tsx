import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import { JobFilters } from '@/components/job-filters';
import type { WorkType } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Briefcase } from 'lucide-react';

function JobFiltersSkeleton() {
    return <div className="h-14 bg-muted rounded-lg w-full animate-pulse" />;
}

function JobListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <JobCard key={i} job={null} />
      ))}
    </div>
  );
}

function JobList({ jobs }: { jobs: Awaited<ReturnType<typeof getJobs>> }) {
  if (jobs.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    );
  }
  return <p className="col-span-full text-center text-muted-foreground">لا توجد عروض عمل تطابق بحثك.</p>;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const categories = getCategories();
  const countries = getCountries();

  const jobs = await getJobs({
      postType: 'seeking_worker',
      searchQuery: typeof searchParams?.q === 'string' ? searchParams.q : undefined,
      country: typeof searchParams?.country === 'string' ? searchParams.country : undefined,
      city: typeof searchParams?.city === 'string' ? searchParams.city : undefined,
      categoryId: typeof searchParams?.category === 'string' ? searchParams.category : undefined,
      workType: typeof searchParams?.workType === 'string' ? searchParams.workType as WorkType : undefined,
      sortBy: typeof searchParams?.sortBy === 'string' ? searchParams.sortBy as 'newest' : 'newest',
  });

  return (
    <AppLayout>
      <MobilePageHeader title="الوظائف">
        <Briefcase className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="container py-6">
        <h1 className="sr-only">عروض العمل المتاحة</h1>
        <div className="mb-6">
          <Suspense fallback={<JobFiltersSkeleton />}>
            <JobFilters categories={categories} countries={countries} showSort={true} />
          </Suspense>
        </div>
        
        <Suspense fallback={<JobListSkeleton />}>
          <JobList jobs={jobs} />
        </Suspense>
      </div>
    </AppLayout>
  );
}
