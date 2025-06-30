import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import { JobFilters } from '@/components/job-filters';


export default async function WorkersPage() {
  const jobs = await getJobs('seeking_job');
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="mb-6">
          <JobFilters categories={categories} countries={countries} showSort={true} />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <p className="col-span-full text-center text-muted-foreground">لا توجد باحثون عن عمل حالياً.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
