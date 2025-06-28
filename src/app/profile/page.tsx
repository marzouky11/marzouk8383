'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, Moon, Globe, LogIn, LogOut, ChevronLeft } from 'lucide-react';
import { ProfileForm } from './profile-form';
import { getCountries } from '@/lib/data';

export default function SettingsPage() {
  const countries = getCountries();
  const user = {
    name: 'مستخدم جديد',
    country: 'المغرب',
    city: 'الدار البيضاء',
    phone: '+212600000000',
    whatsapp: '+212600000000',
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
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                <Sheet>
                  <SheetTrigger asChild>
                    <li className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-medium">الملف الشخصي</span>
                      </div>
                      <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                    </li>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>تعديل الملف الشخصي</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                       <ProfileForm countries={countries} user={user} />
                    </div>
                  </SheetContent>
                </Sheet>

                <SettingItem
                  icon={Moon}
                  label="الوضع الليلي"
                  action={<Switch id="dark-mode" />}
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
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <LogIn className="ml-2 h-4 w-4" />
                  تسجيل الدخول أو إنشاء حساب
                </Button>
                <Button variant="destructive" className="w-full">
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>
             </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}
