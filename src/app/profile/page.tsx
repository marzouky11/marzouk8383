'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, ChevronLeft, Loader2, Settings as SettingsIcon, Newspaper, HelpCircle, Info, Mail, Shield, FileText } from 'lucide-react';
import { getCategories } from '@/lib/data';
import { UserAvatar } from '@/components/user-avatar';
import { useToast } from '@/hooks/use-toast';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
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
      <DesktopPageHeader
        icon={SettingsIcon}
        title="الإعدادات والملف الشخصي"
        description="تحكم في حسابك، عدّل معلوماتك، واستكشف روابط ومعلومات مهمة."
      />
      <div className="flex-grow">
        {loading || !user || !userData ? (
          <div className="flex h-full items-center justify-center p-8 min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="container mx-auto max-w-3xl px-4 pb-8">
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
                        إعدادات الحساب
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
                        icon={FileText}
                        label="إعلاناتي"
                        href="/profile/my-ads"
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
                        <Info className="h-5 w-5" />
                        روابط ومعلومات
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-border">
                     <SettingItem
                        icon={Newspaper}
                        label="مقالات"
                        href="/articles"
                    />
                    <SettingItem
                        icon={HelpCircle}
                        label="الأسئلة الشائعة"
                        href="/faq"
                    />
                    <SettingItem
                        icon={Info}
                        label="من نحن"
                        href="/about"
                    />
                    <SettingItem
                        icon={Mail}
                        label="اتصل بنا"
                        href="/contact"
                    />
                    <SettingItem
                        icon={Shield}
                        label="سياسة الخصوصية"
                        href="/privacy"
                    />
                    <SettingItem
                        icon={FileText}
                        label="شروط الاستخدام"
                        href="/terms"
                    />
                  </ul>
                </CardContent>
              </Card>
              
               <Card>
                 <CardContent className="p-4">
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
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
