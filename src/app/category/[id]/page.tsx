'use client';

import { notFound, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { getJobs, getCategoryById } from '@/lib/data';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryIcon } from '@/components/icons';
import type { Job } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryPageProps {
  params: { id: string };
}

const CategoryPageContent = ({ params }: CategoryPageProps) => {
  const category = getCategoryById(params.id);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'seeking_worker' | 'seeking_job'>('all');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const jobsData = await getJobs({ categoryId: params.id });
      setJobs(jobsData);
      setLoading(false);
    };
    fetchJobs();
  }, [params.id]);
  
  const filteredJobs = useMemo(() => {
    if (activeTab === 'all') {
      return jobs;
    }
    return jobs.filter(job => job.postType === activeTab);
  }, [jobs, activeTab]);

  if (!category) {
    notFound();
  }

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

        <div className="mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full sm:w-auto sm:mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="seeking_worker">عروض العمل</TabsTrigger>
              <TabsTrigger value="seeking_job">باحثون عن عمل</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[40vh] p-8">
              <CategoryIcon name={category.iconName} className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold text-foreground">لا توجد إعلانات في هذا القسم حاليًا</h2>
              <p>كن أول من ينشر إعلانًا في فئة "{category.name}"!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default CategoryPageContent;
