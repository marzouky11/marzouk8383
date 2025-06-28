import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { PostJobForm } from './post-job-form';
import { getCategories, getCountries } from '@/lib/data';


export default function PostJobPage() {
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout>
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6 text-center">املأ الحقول التالية لنشر فرصة عمل جديدة في المنصة.</p>
            <PostJobForm categories={categories} countries={countries} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
