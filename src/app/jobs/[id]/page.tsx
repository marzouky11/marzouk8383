import { redirect } from 'next/navigation';
import { getJobById } from '@/lib/data';

// This page handles legacy /jobs/[id] routes and redirects them permanently 
// to the new /jobs/[slug] structure for SEO purposes.

interface DeprecatedJobIdPageProps {
  params: { id: string };
}

export default async function DeprecatedJobIdPage({ params }: DeprecatedJobIdPageProps) {
    // If the parameter looks like a slug, it might have been caught here by mistake.
    // Redirecting to it will let the correct [slug] route handle it.
    if (params.id.includes('-')) {
        redirect(`/jobs/${params.id}`);
    }

    // If it's likely an ID, fetch the job to find its slug.
    const job = await getJobById(params.id);

    if (job && job.slug) {
        // Permanent redirect (308) to the new slug-based URL
        redirect(`/jobs/${job.slug}`);
    } else {
        // If job not found, redirect to the main jobs list as a fallback.
        redirect('/jobs');
    }
}
