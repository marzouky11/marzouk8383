'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/app/profile/profile-form';
import { getCategories, getCountries } from '@/lib/data';
import { Loader2, User } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';

export default function EditProfilePage() {
  const { user, userData, loading } = useAuth();
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
      <MobilePageHeader title="تعديل الملف الشخصي">
        <User className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="flex-grow">
        {loading || !user || !userData ? (
            <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <Card>
                    <CardHeader className="hidden md:block">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <User className="h-6 w-6 text-primary" />
                            تعديل الملف الشخصي
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground mb-6 text-center">
                            قم بتحديث معلومات ملفك الشخصي.
                        </p>
                        <ProfileForm countries={countries} categories={categories} user={userData} />
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </AppLayout>
  );
}
