
import type { Metadata } from 'next';
import { getCategories } from '@/lib/data';
import PostJobClientPage from './post-job-client-page';

export const metadata: Metadata = {
  title: 'أنشر إعلانك مجانًا - عروض عمل أو طلب وظيفة',
  description: 'أنشر إعلان توظيف أو ابحث عن عمل في دقائق. منصة سهلة الاستخدام للمعلنين والباحثين عن فرص شغل.',
};

export default function PostJobPage() {
  const categories = getCategories();

  return <PostJobClientPage categories={categories} />;
}
