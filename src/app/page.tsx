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
import { Handshake, Sun } from 'lucide-react';

function JobSectionSkeleton() {
    return (
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[70vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                     <Card className="p-4 space-y-3 h-full">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-6 w-3/4" />
                        <div className="pt-2 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
}

export default async function HomePage() {
  const jobOffers = await getJobs({ postType: 'seeking_worker', count: 4 });
  const jobSeekers = await getJobs({ postType: 'seeking_job', count: 4 });
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout>
      <div className="md:hidden">
        <div className="bg-primary text-primary-foreground pt-6 pb-20 rounded-b-[2.5rem]">
          <div className="container space-y-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Handshake className="h-8 w-8" />
                    <span className="text-xl font-bold">الخدمة الآن</span>
                </div>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                    <Sun className="h-6 w-6" />
                </Button>
            </div>
            <p>منصة الربط بين العمال وأصحاب العمل</p>
          </div>
        </div>
      </div>
        
      <div className="space-y-8">
        <div className="container">
          <div className="md:pt-6 -mt-16 md:mt-0 relative z-10">
            <Card className="p-2 rounded-2xl shadow-lg">
              <JobFilters categories={categories} countries={countries} searchPath="/jobs" />
            </Card>
          </div>
        </div>

        <div className="container space-y-12">
            <Card className="overflow-hidden rounded-2xl shadow-lg border-none">
                <div className="relative h-44 md:h-64">
                <Image
                    src="https://i.postimg.cc/4x7XYvQp/image.jpg"
                    alt="عمال محترفون"
                    fill
                    priority
                    className="object-cover"
                    data-ai-hint="professional workers handshake"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-white">عمال محترفون</h2>
                    <p className="text-white/90 mt-1 max-w-lg text-sm">خبراء معتمدون في جميع المجالات</p>
                </div>
                </div>
            </Card>

            <section>
                <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-xl font-bold">عروض العمل</h2>
                <Button variant="link" asChild className="text-primary">
                    <Link href="/jobs">
                    عرض الكل &gt;
                    </Link>
                </Button>
                </div>
                <React.Suspense fallback={<JobSectionSkeleton />}>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
                    {jobOffers.map((job) => (
                    <div key={job.id} className="w-[70vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                        <JobCard job={job} />
                    </div>
                    ))}
                </div>
                </React.Suspense>
            </section>

            <section>
                <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-xl font-bold">باحثون عن عمل</h2>
                <Button variant="link" asChild className="text-primary">
                    <Link href="/workers">
                    عرض الكل &gt;
                    </Link>
                </Button>
                </div>
                <React.Suspense fallback={<JobSectionSkeleton />}>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
                    {jobSeekers.map((job) => (
                    <div key={job.id} className="w-[70vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                        <JobCard job={job} />
                    </div>
                    ))}
                </div>
                </React.Suspense>
            </section>
        </div>
      </div>
    </AppLayout>
  );
}
