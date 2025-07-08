
import type { Metadata } from 'next';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import React, { Suspense } from 'react';
import { Handshake, Newspaper } from 'lucide-react';
import { JobFilters } from '@/components/job-filters';
import { ThemeToggleButton } from '@/components/theme-toggle';
import { HomeCarousel } from './home-carousel';

export const revalidate = 60; // Revalidate every 60 seconds

function JobFiltersSkeleton() {
    return (
        <div className="flex gap-2 items-center">
            <div className="h-14 bg-muted rounded-xl w-full animate-pulse flex-grow" />
            <div className="h-14 w-14 bg-muted rounded-xl animate-pulse flex-shrink-0" />
        </div>
    );
}

function JobSectionSkeleton() {
    return (
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 md:p-0 md:m-0">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                    <JobCard job={null} />
                </div>
            ))}
        </div>
    );
}


function HomeHeaderMobile() {
  return (
      <div className="md:hidden bg-primary text-primary-foreground p-4 rounded-b-3xl shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Handshake className="h-10 w-10 flex-shrink-0" />
                <div>
                  <h1 className="text-2xl font-bold">توظيفك</h1>
                  <p className="text-xs font-light text-primary-foreground/90 -mt-0.5">بوابتك نحو فرص أفضل</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
              <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Link href="/articles">
                      <Newspaper className="h-5 w-5" />
                  </Link>
              </Button>
              <ThemeToggleButton className="text-white hover:bg-white/20" />
            </div>
          </div>
        </div>
      </div>
  );
}

export default async function HomePage() {
  const jobOffers = await getJobs({ postType: 'seeking_worker', count: 6 });
  const jobSeekers = await getJobs({ postType: 'seeking_job', count: 6 });
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout>
      <HomeHeaderMobile />
      
      {/* Search filters for mobile, outside the header */}
      <div className="md:hidden container mt-4">
        <Suspense fallback={<JobFiltersSkeleton />}>
          <JobFilters categories={categories} countries={countries} showPostTypeSelect={true} />
        </Suspense>
      </div>
      
      <div className="container hidden md:block pt-6">
        <Card className="p-2 rounded-2xl shadow-lg">
          <Suspense fallback={<JobFiltersSkeleton />}>
            <JobFilters categories={categories} countries={countries} showPostTypeSelect={true} />
          </Suspense>
        </Card>
      </div>
      
      <div className="container space-y-8 mt-4 md:mt-6">
          <HomeCarousel />

          <section>
              <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-xl font-bold">عروض العمل</h2>
              <Button variant="link" asChild className="text-primary">
                  <Link href="/jobs">
                  عرض الكل &gt;
                  </Link>
              </Button>
              </div>
              <Suspense fallback={<JobSectionSkeleton />}>
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 md:p-0 md:m-0">
                  {jobOffers.map((job) => (
                  <div key={job.id} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                      <JobCard job={job} />
                  </div>
                  ))}
              </div>
              </Suspense>
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
              <Suspense fallback={<JobSectionSkeleton />}>
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 md:p-0 md:m-0">
                  {jobSeekers.map((job) => (
                  <div key={job.id} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                      <JobCard job={job} />
                  </div>
                  ))}
              </div>
              </Suspense>
          </section>
      </div>
    </AppLayout>
  );
}
