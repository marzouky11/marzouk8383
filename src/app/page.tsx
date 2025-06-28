import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { JobFilters } from '@/components/job-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import type { Job } from '@/lib/types';

export default function HomePage() {
  const jobs: Job[] = getJobs();
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout showHeader={false}>
      <div className="bg-primary pb-20">
        <div className="container pt-8">
          <JobFilters categories={categories} countries={countries} />
        </div>
      </div>
      <div className="container -mt-20">
        <Card className="overflow-hidden mb-8">
          <CardContent className="p-0 relative">
            <Image
              src="https://placehold.co/600x250.png"
              alt="Professional Workers"
              width={600}
              height={250}
              className="w-full h-auto object-cover"
              data-ai-hint="handshake meeting"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4">
              <h2 className="text-2xl font-bold">عمال محترفون</h2>
              <p className="text-sm">خبراء معتمدون في جميع المجالات</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">عروض العمل</h2>
          <Link href="#" className="text-sm font-semibold text-primary">
            عرض الكل &gt;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
