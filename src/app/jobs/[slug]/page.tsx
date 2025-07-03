'use client';

// This page is deprecated to avoid routing conflicts with /jobs/[id]/page.tsx
// The logic has been merged into that file, which now handles fetching by slug.
import { AppLayout } from '@/components/layout/app-layout';

export default function DeprecatedJobSlugPage() {
    return <AppLayout><div className="container p-8 text-center">Loading...</div></AppLayout>;
}
