import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import type { Job } from '@/lib/types';
import { JobFilters } from '@/components/job-filters';

export default function JobsPage() {
  const jobs: Job[] = getJobs('seeking_worker');
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="mb-6">
          <JobFilters categories={categories} countries={countries} showSort={true} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
