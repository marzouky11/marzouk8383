import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { JobFilters } from '@/components/job-filters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import type { Job } from '@/lib/types';
import { Handshake, Sun } from 'lucide-react';

export default function HomePage() {
  const jobs: Job[] = getJobs();
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout showHeader={false}>
      {/* Custom Header for Home Page */}
      <div className="bg-primary text-primary-foreground pt-4 pb-12 rounded-b-3xl">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            <Button variant="ghost" size="icon">
              <Sun className="h-6 w-6" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Zafay</h1>
              <p className="text-xs opacity-80">منصة الربط بين العمال وأصحاب العمل</p>
            </div>
            <Link href="/profile">
              <div className="p-2 bg-white/20 rounded-lg">
                <Handshake className="h-6 w-6 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      <main className="container -mt-8 space-y-6 pb-28">
        <div>
          <JobFilters categories={categories} countries={countries} />
        </div>
        
        <Card className="overflow-hidden rounded-2xl shadow-md border-none">
            <div className="relative h-48">
              <Image
                src="https://i.postimg.cc/zBNdnpC6/people-ar-work-company-12112019-1.jpg"
                alt="Professional Workers"
                fill
                className="object-cover"
                data-ai-hint="people working"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4">
                <h2 className="text-2xl font-bold">عمال محترفون</h2>
                <p>خبراء معتمدون في جميع المجالات</p>
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
          <div className="flex overflow-x-auto space-x-4 space-x-reverse pb-4 -mx-4 px-4">
            {jobs.slice(0, 4).map((job) => (
              <div key={job.id} className="w-4/5 sm:w-2/5 flex-shrink-0">
                  <JobCard job={job} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
