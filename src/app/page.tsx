import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { JobFilters } from '@/components/job-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { getJobs, getCategories, getCountries } from '@/lib/data';
import type { Job } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';

export default function HomePage() {
  const jobs: Job[] = getJobs().slice(0, 4);
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout showHeader={false}>
      <div className="bg-primary/10">
        <div className="container pt-8 pb-14">
          <JobFilters categories={categories} countries={countries} />
        </div>
      </div>
      <div className="container -mt-12">
        <Card className="overflow-hidden mb-8 rounded-2xl shadow-none border-none">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              <CarouselItem>
                <div className="relative h-48">
                  <Image
                    src="https://i.postimg.cc/zBNdnpC6/people-ar-work-company-12112019-1.jpg"
                    alt="Professional Workers"
                    fill
                    className="object-cover rounded-2xl"
                    data-ai-hint="people working"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4 rounded-2xl">
                    <h2 className="text-2xl font-bold">عمال محترفون</h2>
                    <p className="text-sm">خبراء معتمدون في جميع المجالات</p>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                 <div className="relative h-48">
                  <Image
                    src="https://i.postimg.cc/BbSqbdmv/images-2021-09-02-T035936-467.jpg"
                    alt="Daily job opportunities"
                    fill
                    className="object-cover rounded-2xl"
                    data-ai-hint="construction workers"
                  />
                   <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4 rounded-2xl">
                    <h2 className="text-2xl font-bold">فرص عمل يومية</h2>
                    <p className="text-sm">ابحث عن فرص عمل تناسب جدولك</p>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                 <div className="relative h-48">
                  <Image
                    src="https://i.postimg.cc/4x7XYvQp/image.jpg"
                    alt="Various projects"
                    fill
                    className="object-cover rounded-2xl"
                    data-ai-hint="architect drawing"
                  />
                   <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4 rounded-2xl">
                    <h2 className="text-2xl font-bold">مشاريع متنوعة</h2>
                    <p className="text-sm">ابحث عن المشروع الذي يناسب مهاراتك</p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </Card>

        <div className="mb-6">
           <h2 className="text-xl font-bold mb-4">الفئات</h2>
           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
             {categories.slice(0,6).map((category) => (
                <Link href="#" key={category.id} className="flex flex-col items-center justify-center gap-2 p-3 bg-card rounded-xl text-center shadow-sm hover:bg-accent transition-colors">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CategoryIcon name={category.iconName} className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
             ))}
           </div>
        </div>


        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">عروض جديدة</h2>
          <Button variant="link" asChild>
            <Link href="#">
              عرض الكل
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
