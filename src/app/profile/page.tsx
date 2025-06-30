'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, Moon, Globe, LogOut, ChevronLeft, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { ProfileForm } from './profile-form';
import { getCountries, getCategories } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { ThemeToggleSwitch } from '@/components/theme-toggle';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const countries = getCountries();
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

  const SettingItem = ({ icon: Icon, label, action }: { icon: React.ElementType, label: string, action: React.ReactNode }) => (
    <li className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-primary" />
        <span className="font-medium">{label}</span>
      </div>
      {action}
    </li>
  );
  
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
                   <Avatar className="h-16 w-16">
                      <AvatarImage src={userData.avatarUrl} data-ai-hint="user avatar" alt={userData.name} />
                      <AvatarFallback className="text-2xl">{userData.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                   <div>
                      <h2 className="text-xl font-bold">{userData.name}</h2>
                      <p className="text-sm text-muted-foreground">{categories.find(c => c.id === userData.categoryId)?.name || 'لم تحدد الفئة'}</p>
                   </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y divide-border">
                    <Sheet>
                      <SheetTrigger asChild>
                        <li className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <User className="h-5 w-5 text-primary" />
                            <span className="font-medium">تعديل الملف الشخصي</span>
                          </div>
                          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                        </li>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-3">
                             <User className="h-5 w-5 text-primary" />
                             تعديل الملف الشخصي
                          </SheetTitle>
                        </SheetHeader>
                        <div className="py-4">
                           <ProfileForm countries={countries} categories={categories} user={userData} />
                        </div>
                      </SheetContent>
                    </Sheet>

                    <SettingItem
                      icon={Moon}
                      label="الوضع الليلي"
                      action={<ThemeToggleSwitch id="dark-mode" />}
                    />
                    <SettingItem
                      icon={Globe}
                      label="اللغة"
                      action={<span className="text-muted-foreground">العربية</span>}
                    />
                  </ul>
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
    </AppLayout>
  );
}
