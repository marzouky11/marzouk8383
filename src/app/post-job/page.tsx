import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'أنشر إعلانك مجانًا - عروض عمل أو طلب وظيفة',
  description: 'أنشر إعلان توظيف أو ابحث عن عمل في دقائق. منصة سهلة الاستخدام للمعلنين والباحثين عن فرص شغل.',
};

export default function PostJobPage() {
  redirect('/post-job/select-type');
}
