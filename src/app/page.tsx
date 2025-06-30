import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Sun, Handshake } from 'lucide-react';
import { JobFilters } from '@/components/job-filters';
import { ThemeToggleButton } from '@/components/theme-toggle';


function JobSectionSkeleton() {
    return (
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                    <JobCard job={null} />
                </div>
            ))}
        </div>
    );
}


function HomeHeaderMobile() {
  return (
      <div className="md:hidden">
        <div className="bg-primary text-primary-foreground p-4 pb-16 rounded-b-[2.5rem]">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-2">
              <ThemeToggleButton className="text-white hover:bg-white/20" />
              <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">الخدمة الآن</h1>
                  <Handshake className="h-7 w-7" />
              </div>
              <div className="w-10"></div> {/* Spacer */}
            </div>
            <p className="text-center text-sm font-light text-primary-foreground/90">فرص عمل بانتظارك</p>
          </div>
        </div>
        <div className="container mx-auto -mt-10 px-4">
          <form action="/jobs" className="relative">
            <Input
              name="q"
              placeholder="ابحث عن وظيفة، عامل، أو خدمة..."
              className="h-14 text-base rounded-2xl pl-14 pr-4 border-0 bg-card shadow-lg text-right"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Button type="submit" size="icon" className="bg-primary text-primary-foreground rounded-xl h-10 w-10 hover:bg-primary/90">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
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
      <HomeHeaderMobile />
      
      <div className="container hidden md:block pt-6">
        <Card className="p-2 rounded-2xl shadow-lg">
          <JobFilters categories={categories} countries={countries} searchPath="/jobs" />
        </Card>
      </div>
      
      <div className="container space-y-8 mt-6">
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
                  <div key={job.id} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0">
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
                  <div key={job.id} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0">
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
