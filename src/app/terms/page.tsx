'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';

export default function TermsOfServicePage() {
  return (
    <AppLayout>
      <MobilePageHeader title="شروط الاستخدام">
        <FileText className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={FileText}
        title="شروط الاستخدام"
        description="يرجى قراءة شروط وأحكام استخدام منصتنا بعناية."
      />
      <div className="container mx-auto max-w-3xl px-4 pb-8">
        <Card>
          <CardHeader className="md:hidden">
            <h1 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              شروط الاستخدام
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground md:pt-6">
            <h3 className="font-bold text-foreground">1. قبول الشروط</h3>
            <p>
              باستخدامك لمنصة "توظيفك"، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على هذه الشروط، فيجب عليك عدم استخدام المنصة.
            </p>
            <h3 className="font-bold text-foreground">2. مسؤولية المستخدم</h3>
            <p>
              أنت مسؤول مسؤولية كاملة عن دقة وصحة المعلومات التي تنشرها على حسابك وفي إعلاناتك. يُمنع نشر أي محتوى غير قانوني أو مضلل أو ينتهك حقوق الآخرين.
            </p>
            <h3 className="font-bold text-foreground">3. إخلاء المسؤولية</h3>
            <p>
              "توظيفك" هي منصة وسيطة لتسهيل التواصل بين المستخدمين. نحن لا نضمن صحة الإعلانات أو جودة الخدمات المقدمة، ولسنا طرفًا في أي اتفاقيات تتم بين المستخدمين.
            </p>
             <h3 className="font-bold text-foreground">4. إنهاء الحساب</h3>
            <p>
              نحتفظ بالحق في تعليق أو إنهاء حسابك في أي وقت ولأي سبب، خاصة في حالة انتهاك شروط الاستخدام هذه، دون إشعار مسبق.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
