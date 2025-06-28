import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { getJobs } from '@/lib/data';
import type { Job } from '@/lib/types';

export default function JobsPage() {
  const jobs: Job[] = getJobs();

  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">جميع الوظائف</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
