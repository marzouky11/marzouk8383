import { redirect } from 'next/navigation';
import { getJobById } from '@/lib/data';

// This page handles legacy /jobs/[id] routes and redirects them to the new /jobs/[slug] structure.
// This is important for SEO and for any old links that might exist.

interface DeprecatedJobIdPageProps {
  params: { id: string };
}

export default async function DeprecatedJobIdPage({ params }: DeprecatedJobIdPageProps) {
    const job = await getJobById(params.id);

    if (job && job.slug) {
        // Permanent redirect (308) to the new slug-based URL
        redirect(`/jobs/${job.slug}`);
    } else {
        // If job not found, redirect to the main jobs list
        redirect('/jobs');
    }
}
