import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { JobCard } from '@/components/job-card';
import { getJobs } from '@/lib/data';
import type { Job } from '@/lib/types';


export default function WorkersPage() {
  const jobs: Job[] = getJobs();
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">قائمة العمال</h1>
         <div className="text-center py-12 text-muted-foreground">
              <p>سيتم عرض قائمة العمال هنا قريباً.</p>
        </div>
        {/* Placeholder Content */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
