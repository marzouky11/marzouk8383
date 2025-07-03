'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function ContactUsPage() {
  const email = 'tawzifakweb@gmail.com';

  return (
    <AppLayout>
      <MobilePageHeader title="اتصل بنا">
        <Mail className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              اتصل بنا
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              إذا كانت لديك أي استفسارات أو اقتراحات، أو كنت بحاجة إلى مساعدة، فلا تتردد في التواصل معنا عبر البريد الإلكتروني. فريقنا مستعد دائمًا لخدمتك.
            </p>
            <div className="text-center">
              <Button asChild>
                <a href={`mailto:${email}`}>
                  <Mail className="ml-2 h-4 w-4" />
                  {email}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
