
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { DesktopPageHeader } from '@/components/layout/desktop-page-header';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <AppLayout>
      <MobilePageHeader title="سياسة الخصوصية">
        <Shield className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <DesktopPageHeader
        icon={Shield}
        title="سياسة الخصوصية"
        description="خصوصيتك هي أولويتنا. تعرف على كيفية جمعنا واستخدامنا وحمايتنا لبياناتك."
      />
      <div className="container mx-auto max-w-3xl px-4 pb-8">
        <Card>
          <CardHeader className="md:hidden">
            <h1 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              سياسة الخصوصية
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground md:pt-6 prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-primary prose-a:text-primary">
            
            <p>
              أهلاً بك في منصة "توظيفك". نحن ندرك أهمية الخصوصية وأمن المعلومات الشخصية لمستخدمينا. تهدف سياسة الخصوصية هذه إلى توضيح أنواع المعلومات التي نجمعها، وكيفية استخدامها وحمايتها، والخيارات المتاحة لك فيما يتعلق ببياناتك. باستخدامك لخدمات "توظيفك"، فإنك توافق على الممارسات الموضحة في هذه السياسة.
            </p>
            
            <h3>1. المعلومات التي نجمعها</h3>
            <p>
              لتقديم خدماتنا بفعالية، نقوم بجمع نوعين من المعلومات:
            </p>
            <p>
              <strong>أ. المعلومات التي تقدمها لنا مباشرة:</strong>
            </p>
            <ul>
              <li>
                <strong>معلومات إنشاء الحساب:</strong> عند تسجيل حساب جديد، نطلب منك تقديم معلومات أساسية مثل الاسم الكامل، البريد الإلكتروني، وكلمة المرور. قد نطلب أيضًا معلومات إضافية مثل الدولة، المدينة، والجنس.
              </li>
              <li>
                <strong>محتوى الملف الشخصي:</strong> يمكنك اختيار إضافة المزيد من المعلومات إلى ملفك الشخصي، مثل نبذة تعريفية، فئة العمل، ومعلومات الاتصال (رقم الهاتف، واتساب، إنستغرام).
              </li>
              <li>
                <strong>محتوى الإعلانات:</strong> عند نشر إعلان (سواء كباحث عن عمل أو صاحب عمل)، نقوم بجمع كافة التفاصيل التي تقدمها، مثل عنوان الإعلان، الوصف، الخبرة المطلوبة، المؤهلات، وغيرها من المعلومات ذات الصلة.
              </li>
              <li>
                <strong>التواصل معنا:</strong> إذا قمت بالاتصال بفريق الدعم لدينا، فسنحتفظ بسجل لمراسلاتك لمساعدتك بشكل أفضل في المستقبل.
              </li>
            </ul>
            <p>
              <strong>ب. المعلومات التي نجمعها تلقائيًا:</strong>
            </p>
            <ul>
              <li>
                <strong>بيانات الاستخدام:</strong> نقوم بجمع معلومات حول كيفية تفاعلك مع منصتنا، مثل الصفحات التي تزورها، الإعلانات التي تتصفحها، عمليات البحث التي تجريها، والمدة الزمنية التي تقضيها على الموقع.
              </li>
              <li>
                <strong>معلومات الجهاز والمتصفح:</strong> نجمع بيانات فنية حول جهازك، مثل عنوان IP، نوع المتصفح، نظام التشغيل، وإعدادات اللغة.
              </li>
              <li>
                <strong>ملفات تعريف الارتباط (Cookies):</strong> نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتخصيص تجربتك، تذكر تفضيلاتك، وتحليل أداء الموقع. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك.
              </li>
            </ul>

            <h3>2. كيف نستخدم معلوماتك</h3>
            <p>
              نستخدم المعلومات التي نجمعها للأغراض التالية:
            </p>
            <ul>
              <li>
                <strong>تقديم وتحسين خدماتنا:</strong> لتشغيل المنصة، إدارة حسابك، عرض الإعلانات ذات الصلة، وتحسين وظائف الموقع وتجربة المستخدم.
              </li>
              <li>
                <strong>التواصل بين المستخدمين:</strong> لتسهيل التواصل بين أصحاب العمل والباحثين عن عمل عبر معلومات الاتصال التي يختارون مشاركتها في إعلاناتهم.
              </li>
              <li>
                <strong>التخصيص:</strong> لعرض محتوى وإعلانات قد تهمك بناءً على اهتماماتك ونشاطك على المنصة.
              </li>
              <li>
                <strong>التواصل معك:</strong> لإرسال إشعارات هامة تتعلق بحسابك، تحديثات الخدمة، أو الرد على استفساراتك.
              </li>
              <li>
                <strong>الأمان ومنع الاحتيال:</strong> لمراقبة الأنشطة المشبوهة، التحقق من هوية المستخدمين، وحماية المنصة من الاستخدام غير المصرح به.
              </li>
            </ul>

            <h3>3. مشاركة وكشف المعلومات</h3>
            <p>
              نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. ومع ذلك، قد نشارك معلوماتك في الحالات التالية:
            </p>
            <ul>
              <li>
                <strong>مع المستخدمين الآخرين:</strong> المعلومات التي تدرجها في ملفك الشخصي العام أو في إعلاناتك ستكون متاحة للزوار والمستخدمين الآخرين للمنصة.
              </li>
              <li>
                <strong>مع مزودي الخدمات:</strong> قد نستعين بشركات أخرى لتقديم خدمات نيابة عنا (مثل استضافة الموقع، تحليل البيانات). يتم تزويد هذه الشركات بالمعلومات التي تحتاجها فقط لأداء مهامها، وتكون ملزمة تعاقديًا بحماية بياناتك.
              </li>
              <li>
                <strong>لأسباب قانونية:</strong> قد نكشف عن معلوماتك إذا طُلب منا ذلك بموجب القانون، أو استجابة لأمر قضائي، أو لحماية حقوقنا وممتلكاتنا وسلامة مستخدمينا.
              </li>
            </ul>

            <h3>4. أمان البيانات</h3>
            <p>
              نتخذ تدابير أمنية تقنية وتنظيمية معقولة لحماية معلوماتك الشخصية من الفقدان، أو السرقة، أو الوصول غير المصرح به. نستخدم التشفير لحماية البيانات الحساسة (مثل كلمات المرور) ونجري مراجعات أمنية دورية. ومع ذلك، لا يمكن لأي نظام أمان أن يكون مضمونًا بنسبة 100%، لذا نشجعك على استخدام كلمة مرور قوية والحفاظ على سريتها.
            </p>

            <h3>5. حقوقك وخياراتك</h3>
            <p>
              لديك الحق في الوصول إلى معلوماتك الشخصية وتحديثها أو حذفها. يمكنك القيام بذلك من خلال صفحة ملفك الشخصي وإدارة إعلاناتك. إذا كنت ترغب في حذف حسابك بشكل دائم، يرجى التواصل معنا عبر البريد الإلكتروني الموضح في صفحة <Link href="/contact">اتصل بنا</Link>.
            </p>

            <h3>6. خصوصية الأطفال</h3>
            <p>
              منصة "توظيفك" غير موجهة للأطفال دون سن 18 عامًا. نحن لا نجمع عمدًا أي معلومات شخصية من الأطفال. إذا اكتشفنا أننا قمنا بجمع معلومات من طفل دون موافقة والديه، سنتخذ الخطوات اللازمة لإزالة هذه المعلومات في أسرع وقت ممكن.
            </p>

            <h3>7. التغييرات على سياسة الخصوصية</h3>
            <p>
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب تشغيلية أو قانونية. سنقوم بإعلامك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث". نشجعك على مراجعة هذه الصفحة بشكل دوري لتكون على اطلاع دائم.
            </p>

            <h3>8. الاتصال بنا</h3>
            <p>
              إذا كانت لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه، فلا تتردد في التواصل معنا عبر البريد الإلكتروني المتاح على صفحة <Link href="/contact">اتصل بنا</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
