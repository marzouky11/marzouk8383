'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { PostJobForm } from './post-job-form';
import { getCategories, getCountries } from '@/lib/data';
import { Loader2 } from 'lucide-react';


export default function PostJobPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const categories = getCategories();
  const countries = getCountries();

  if (loading || !user) {
    return (
        <AppLayout>
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6 text-center">املأ الحقول التالية لنشر فرصة عمل جديدة في المنصة.</p>
            <PostJobForm categories={categories} countries={countries} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
