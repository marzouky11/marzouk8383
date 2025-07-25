
import type { Metadata } from 'next';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getJobs, getCategories, getTestimonials } from '@/lib/data';
import React, { Suspense } from 'react';
import { Handshake, Newspaper, Briefcase, Users, ArrowLeft } from 'lucide-react';
import { JobFilters } from '@/components/job-filters';
import { ThemeToggleButton } from '@/components/theme-toggle';
import { HomeCarousel } from './home-carousel';
import { CategorySection } from './category-section';
import { HomeExtraSections } from './home-extra-sections';
import { Separator } from '@/components/ui/separator';

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  alternates: {
      canonical: '/',
  },
};

function JobFiltersSkeleton() {
    return (
        <div className="flex gap-2 items-center">
            <div className="h-14 bg-muted rounded-xl w-full animate-pulse flex-grow" />
            <div className="h-14 w-14 bg-muted rounded-xl animate-pulse flex-shrink-0" />
        </div>
    );
}

function JobSectionSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <JobCard key={i} job={null} />
            ))}
        </div>
    );
}

function HomeHeaderMobile() {
  return (
      <div className="md:hidden bg-primary text-primary-foreground p-4 rounded-b-3xl shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Handshake className="h-10 w-10 flex-shrink-0" />
                <div>
                  <h1 className="text-2xl font-bold">توظيفك</h1>
                  <p className="text-xs font-light text-primary-foreground/90 -mt-0.5">بوابتك نحو فرص أفضل</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
              <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Link href="/articles">
                      <Newspaper className="h-5 w-5" />
                  </Link>
              </Button>
              <ThemeToggleButton className="text-white hover:bg-white/20" />
            </div>
          </div>
        </div>
      </div>
  );
}

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

function SectionHeader({ icon: Icon, title, description, href }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button asChild variant="outline" className="shrink-0">
        <Link href={href}>
          عرض الكل
          <ArrowLeft className="mr-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export default async function HomePage() {
  const jobOffers = await getJobs({ postType: 'seeking_worker', count: 6 });
  const jobSeekers = await getJobs({ postType: 'seeking_job', count: 6 });
  const categories = getCategories();
  const testimonials = await getTestimonials();
  const allJobOffers = await getJobs({ postType: 'seeking_worker' });
  const allJobSeekers = await getJobs({ postType: 'seeking_job' });

  return (
    <AppLayout>
      <HomeHeaderMobile />
      
      <div className="md:hidden container mt-4">
        <Suspense fallback={<JobFiltersSkeleton />}>
          <JobFilters categories={categories} showPostTypeSelect={true} />
        </Suspense>
      </div>
      
      <div className="container hidden md:block pt-6">
        <Card className="p-2 rounded-2xl shadow-lg">
          <Suspense fallback={<JobFiltersSkeleton />}>
            <JobFilters categories={categories} showPostTypeSelect={true} />
          </Suspense>
        </Card>
      </div>
      
      <div className="container space-y-12 mt-6 md:mt-8">
          <HomeCarousel />

          <section>
            <SectionHeader 
              icon={Briefcase}
              title="أحدث عروض العمل"
              description="اكتشف آخر فرص الشغل التي أضافها أصحاب العمل في مختلف المجالات."
              href="/jobs"
            />
            <Suspense fallback={<JobSectionSkeleton />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobOffers.map(job => (
                      <JobCard key={job.id} job={job} />
                  ))}
              </div>
            </Suspense>
          </section>

          <Separator />

          <section>
            <SectionHeader
              icon={Users}
              title="باحثون عن عمل"
              description="تصفح ملفات المرشحين والمهنيين المستعدين للانضمام إلى فريقك."
              href="/workers"
            />
            <Suspense fallback={<JobSectionSkeleton />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobSeekers.map(job => (
                      <JobCard key={job.id} job={job} />
                  ))}
              </div>
            </Suspense>
          </section>

          <Separator />

          <CategorySection categories={categories} />
          
          <Separator />

          <Suspense>
            <HomeExtraSections 
              testimonials={testimonials} 
              jobOffersCount={allJobOffers.length}
              jobSeekersCount={allJobSeekers.length}
            />
          </Suspense>
      </div>
    </AppLayout>
  );
}
