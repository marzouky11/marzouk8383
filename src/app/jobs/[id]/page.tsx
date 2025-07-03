'use client';

// This page is deprecated to avoid routing conflicts. 
// The logic has been moved to /jobs/[slug]/page.tsx
import { AppLayout } from '@/components/layout/app-layout';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedJobIdPage() {
    const router = useRouter();
    
    useEffect(() => {
        // A simple redirect to the jobs page is a safe fallback.
        router.replace('/jobs');
    }, [router]);

    return <AppLayout><div className="container p-8 text-center">Loading...</div></AppLayout>;
}
