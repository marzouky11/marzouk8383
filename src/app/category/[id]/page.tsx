import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { getJobs, getCategoryById } from '@/lib/data';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryIcon } from '@/components/icons';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryById(params.id);

  if (!category) {
    return {
      title: 'الفئة غير موجودة',
    };
  }

  return {
    title: `وظائف وخدمات في فئة: ${category.name}`,
    description: `استعرض جميع عروض العمل والباحثين عن عمل في فئة ${category.name}.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  const jobs = await getJobs({ categoryId: params.id });

  return (
    <AppLayout>
      <MobilePageHeader title={category.name}>
        <CategoryIcon name={category.iconName} className="h-5 w-5" style={{ color: category.color }} />
      </MobilePageHeader>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Card className="mb-8 hidden md:block" style={{ borderColor: category.color, borderTopWidth: '4px' }}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${category.color}1A`}}>
                <CategoryIcon name={category.iconName} className="h-8 w-8" style={{ color: category.color }} />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold" style={{ color: category.color }}>
                  {category.name}
                </CardTitle>
                 <p className="text-muted-foreground mt-1">
                  تصفح أحدث الإعلانات المتعلقة بهذه الفئة
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[40vh] p-8">
              <CategoryIcon name={category.iconName} className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold text-foreground">لا توجد إعلانات في هذه الفئة حاليًا</h2>
              <p>كن أول من ينشر إعلانًا في فئة "{category.name}"!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
