import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { JobFilters } from '@/components/job-filters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { Handshake } from 'lucide-react';

function JobSectionSkeleton() {
    return (
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[55vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                     <Card className="p-3 space-y-2 h-full">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                    </Card>
                </div>
            ))}
        </div>
    );
}


export default async function HomePage() {
  const jobOffers = await getJobs('seeking_worker', 4);
  const jobSeekers = await getJobs('seeking_job', 4);
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout>
      <div className="container relative z-10 pt-6">
        <JobFilters categories={categories} countries={countries} />
      </div>
      
      <div className="container pt-6 space-y-8 md:space-y-12">
        <Card className="overflow-hidden rounded-2xl shadow-lg border-none">
          <div className="relative h-40">
            <Image
              src="https://i.postimg.cc/4x7XYvQp/image.jpg"
              alt="Professional Workers"
              fill
              className="object-cover"
              data-ai-hint="professional workers handshake"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-4">
              <h2 className="text-2xl font-bold text-white">عمال محترفون</h2>
              <p className="text-white/90 mt-1">خبراء معتمدون في جميع المجالات</p>
            </div>
          </div>
        </Card>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">عروض العمل</h2>
            <Button variant="link" asChild>
              <Link href="/jobs">
                عرض الكل
              </Link>
            </Button>
          </div>
          <React.Suspense fallback={<JobSectionSkeleton />}>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
              {jobOffers.map((job) => (
                <div key={job.id} className="w-[55vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                    <JobCard job={job} />
                </div>
              ))}
            </div>
          </React.Suspense>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">باحثون عن عمل</h2>
            <Button variant="link" asChild>
              <Link href="/workers">
                عرض الكل
              </Link>
            </Button>
          </div>
           <React.Suspense fallback={<JobSectionSkeleton />}>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
              {jobSeekers.map((job) => (
                <div key={job.id} className="w-[55vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                    <JobCard job={job} />
                </div>
              ))}
            </div>
          </React.Suspense>
        </section>
      </div>
    </AppLayout>
  );
}
