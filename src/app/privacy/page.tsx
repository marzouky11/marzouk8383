'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';

export default function PrivacyPolicyPage() {
  return (
    <AppLayout>
      <MobilePageHeader title="سياسة الخصوصية">
        <Shield className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Shield}
        title="سياسة الخصوصية"
        description="نحن نهتم بخصوصيتك ونلتزم بحماية بياناتك الشخصية."
      />
      <div className="container mx-auto max-w-3xl px-4 pb-8">
        <Card>
          <CardHeader className="md:hidden">
            <h1 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              سياسة الخصوصية
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground md:pt-6">
            <h3 className="font-bold text-foreground">1. المعلومات التي نجمعها</h3>
            <p>
              نحن نجمع المعلومات التي تقدمها مباشرة عند إنشاء حساب، مثل الاسم والبريد الإلكتروني. كما نجمع بيانات الإعلانات التي تنشرها، بما في ذلك تفاصيل الوظيفة أو المهارات ومعلومات الاتصال التي تختار مشاركتها.
            </p>
            <h3 className="font-bold text-foreground">2. كيف نستخدم معلوماتك</h3>
            <p>
              تُستخدم معلوماتك لتشغيل وتحسين خدماتنا، وتسهيل التواصل بين المستخدمين، وتخصيص تجربتك على المنصة. لا نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية دون موافقتك الصريحة.
            </p>
            <h3 className="font-bold text-foreground">3. أمان البيانات</h3>
            <p>
              نتخذ تدابير أمنية معقولة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الكشف. ومع ذلك، لا يمكن لأي نظام أمان أن يكون مضمونًا بنسبة 100%.
            </p>
            <h3 className="font-bold text-foreground">4. التغييرات على سياستنا</h3>
            <p>
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإعلامك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على هذه الصفحة.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
