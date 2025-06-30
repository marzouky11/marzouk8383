import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import { JobFilters } from '@/components/job-filters';
import type { WorkType } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

function JobFiltersSkeleton() {
    return <div className="h-14 bg-muted rounded-lg w-full animate-pulse" />;
}

function WorkerListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
         <Card key={i} className="p-4 space-y-3 h-full">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-6 w-3/4" />
            <div className="pt-2 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
        </Card>
      ))}
    </div>
  );
}

function WorkerList({ jobs }: { jobs: Awaited<ReturnType<typeof getJobs>> }) {
  if (jobs.length > 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    );
  }
  return <p className="col-span-full text-center text-muted-foreground">لا يوجد باحثون عن عمل يطابقون بحثك.</p>;
}

export default async function WorkersPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const categories = getCategories();
  const countries = getCountries();

  const jobs = await getJobs({
      postType: 'seeking_job',
      searchQuery: typeof searchParams?.q === 'string' ? searchParams.q : undefined,
      country: typeof searchParams?.country === 'string' ? searchParams.country : undefined,
      city: typeof searchParams?.city === 'string' ? searchParams.city : undefined,
      categoryId: typeof searchParams?.category === 'string' ? searchParams.category : undefined,
      workType: typeof searchParams?.workType === 'string' ? searchParams.workType as WorkType : undefined,
      sortBy: typeof searchParams?.sortBy === 'string' ? searchParams.sortBy as 'newest' : 'newest',
  });

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="mb-6">
           <Suspense fallback={<JobFiltersSkeleton />}>
            <JobFilters categories={categories} countries={countries} showSort={true} />
          </Suspense>
        </div>
        
        <Suspense fallback={<WorkerListSkeleton />}>
          <WorkerList jobs={jobs} />
        </Suspense>
      </div>
    </AppLayout>
  );
}
