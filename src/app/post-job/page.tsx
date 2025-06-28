import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PostJobForm } from './post-job-form';
import { getCategories, getCountries } from '@/lib/data';


export default function PostJobPage() {
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>نشر إعلان جديد</CardTitle>
            <CardDescription>املأ الحقول التالية لنشر فرصة عمل جديدة في المنصة.</CardDescription>
          </CardHeader>
          <CardContent>
            <PostJobForm categories={categories} countries={countries} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
