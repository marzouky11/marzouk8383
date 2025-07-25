'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/app/profile/profile-form';
import { getCategories } from '@/lib/data';
import { Loader2, User } from 'lucide-react';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';

export default function EditProfilePage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const categories = getCategories();

  return (
    <AppLayout>
      <MobilePageHeader title="تعديل الملف الشخصي">
        <User className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={User}
        title="تعديل الملف الشخصي"
        description="حافظ على تحديث معلومات ملفك الشخصي لزيادة فرصك."
      />
      <div className="flex-grow">
        {loading || !user || !userData ? (
            <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <div className="container mx-auto max-w-3xl px-4 pb-8">
                <Card>
                    <CardContent className="pt-6">
                        <ProfileForm categories={categories} user={userData} />
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </AppLayout>
  );
}
