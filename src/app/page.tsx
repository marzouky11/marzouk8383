import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { JobFilters } from '@/components/job-filters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import type { Job } from '@/lib/types';

export default function HomePage() {
  const jobs: Job[] = getJobs();
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout showHeader={false}>
      <header className="bg-primary text-primary-foreground pt-4 pb-28 rounded-b-3xl">
        <div className="container">
          <div className="flex h-16 items-center justify-center text-center relative">
            <div className="w-full">
              <h1 className="text-3xl font-bold">Zafay</h1>
              <p className="text-sm opacity-80">منصة الربط بين العمال وأصحاب العمل</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container -mt-24 space-y-6 pb-28">
        <div>
          <JobFilters categories={categories} countries={countries} />
        </div>
        
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jobs.slice(4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
