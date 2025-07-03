'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <AppLayout>
      <MobilePageHeader title="من نحن">
        <Info className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Info className="h-6 w-6 text-primary" />
              من نحن
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              "الخدمة الآن" هي منصة رائدة تهدف إلى تسهيل التواصل بين أصحاب العمل والباحثين عن فرص في مختلف المجالات المهنية والحرفية في العالم العربي.
            </p>
            <p>
              مهمتنا هي بناء جسر من الثقة والفرص، حيث يمكن لأصحاب العمل العثور على الكفاءات التي يحتاجونها بسهولة، ويمكن للباحثين عن عمل استعراض مهاراتهم وخبراتهم للوصول إلى أفضل الفرص المتاحة في السوق.
            </p>
            <p>
              نحن نؤمن بأهمية العمل وقيمته في بناء المجتمعات، ونسعى من خلال منصتنا إلى دعم النمو الاقتصادي وتمكين الأفراد من تحقيق طموحاتهم المهنية.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
