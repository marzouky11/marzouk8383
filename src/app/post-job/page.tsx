'use client';

import type { Metadata } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { PostJobForm } from './post-job-form';
import { getCategories, getCountries } from '@/lib/data';
import { Loader2, PlusCircle } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';

export const metadata: Metadata = {
  title: 'أنشر إعلانك مجانًا - عروض عمل أو طلب وظيفة',
  description: 'أنشر إعلان توظيف أو ابحث عن عمل في دقائق. منصة سهلة الاستخدام للمعلنين والباحثين عن فرص شغل.',
};

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

  return (
    <AppLayout>
      <MobilePageHeader title="نشر إعلان جديد">
        <PlusCircle className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="flex-grow">
        {loading || !user ? (
            <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-6 text-center">املأ الحقول التالية لنشر فرصة عمل جديدة في المنصة.</p>
                    <PostJobForm categories={categories} countries={countries} />
                </CardContent>
                </Card>
            </div>
        )}
      </div>
    </AppLayout>
  );
}
