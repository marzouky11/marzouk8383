'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { User, LogOut, ChevronLeft, Loader2, Settings as SettingsIcon, Edit, Trash2, Newspaper } from 'lucide-react';
import { getCountries, getCategories, getJobsByUserId, deleteAd } from '@/lib/data';
import type { Job } from '@/lib/types';
import { JobCard } from '@/components/job-card';
import { UserAvatar } from '@/components/user-avatar';
import { useToast } from '@/hooks/use-toast';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { ThemeToggleSwitch } from '@/components/theme-toggle';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData, loading } = useAuth();
  const [myAds, setMyAds] = useState<Job[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
        const fetchAds = async () => {
            setAdsLoading(true);
            const ads = await getJobsByUserId(user.uid);
            setMyAds(ads);
            setAdsLoading(false);
        };
        fetchAds();
    }
  }, [user]);

  const categories = getCategories();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'تم تسجيل الخروج بنجاح.' });
      router.push('/');
    } catch (error) {
      toast({ variant: 'destructive', title: 'حدث خطأ أثناء تسجيل الخروج.' });
    }
  };

  const handleDeleteAd = async () => {
    if (!adToDelete) return;
    try {
        await deleteAd(adToDelete);
        setMyAds(prevAds => prevAds.filter(ad => ad.id !== adToDelete));
        toast({ title: "تم حذف الإعلان بنجاح" });
    } catch (error) {
        toast({ variant: 'destructive', title: 'فشل حذف الإعلان' });
    } finally {
        setAdToDelete(null);
    }
  };

  const SettingItem = ({ icon: Icon, label, action, href }: { icon: React.ElementType, label: string, action?: React.ReactNode, href?: string }) => {
    const content = (
        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors w-full">
            <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{label}</span>
            </div>
            {action ? action : (href ? <ChevronLeft className="h-5 w-5 text-muted-foreground" /> : null)}
        </div>
    );
    return (
        <li className="flex items-center w-full">
            {href ? <Link href={href} className="w-full">{content}</Link> : content}
        </li>
    )
  };
  
  return (
    <AppLayout>
      <MobilePageHeader title="الإعدادات">
        <SettingsIcon className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="flex-grow">
        {loading || !user || !userData ? (
          <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="container mx-auto max-w-3xl px-4 py-8">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                   <UserAvatar name={userData.name} color={userData.avatarColor} className="h-16 w-16 text-2xl" />
                   <div>
                      <h2 className="text-xl font-bold">{userData.name || 'مستخدم'}</h2>
                      <p className="text-sm text-muted-foreground">{categories.find(c => c.id === userData.categoryId)?.name || 'لم تحدد الفئة'}</p>
                   </div>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5" />
                        الإعدادات العامة
                    </CardTitle>
                 </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-border">
                    <SettingItem
                        icon={User}
                        label="تعديل الملف الشخصي"
                        href="/profile/edit"
                    />
                    <SettingItem
                        icon={Newspaper}
                        label="مقالات"
                        href="/articles"
                    />
                    <li className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <SettingsIcon className="h-5 w-5 text-primary" />
                          <span className="font-medium">الوضع الليلي</span>
                        </div>
                        <ThemeToggleSwitch id="dark-mode" />
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        إعلاناتي
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {adsLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : myAds.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {myAds.map(ad => (
                                <div key={ad.id} className="flex flex-col gap-2">
                                    <JobCard job={ad} />
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" className="flex-1">
                                            <Link href={`/edit-job/${ad.id}`}>
                                                <Edit className="ml-2 h-4 w-4" />
                                                تعديل
                                            </Link>
                                        </Button>
                                        <Button variant="destructive" className="flex-1" onClick={() => setAdToDelete(ad.id)}>
                                            <Trash2 className="ml-2 h-4 w-4" />
                                            حذف
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground p-8">لم تقم بنشر أي إعلانات بعد.</p>
                    )}
                </CardContent>
              </Card>
              
               <Card>
                 <CardContent className="p-4 space-y-4">
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                      <LogOut className="ml-2 h-4 w-4" />
                      تسجيل الخروج
                    </Button>
                 </CardContent>
              </Card>

            </div>
          </div>
        )}
      </div>
      <AlertDialog open={!!adToDelete} onOpenChange={(open) => !open && setAdToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
                هذا الإجراء سيقوم بحذف إعلانك بشكل نهائي. لا يمكن التراجع عن هذا القرار.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAdToDelete(null)}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAd}>تأكيد الحذف</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
