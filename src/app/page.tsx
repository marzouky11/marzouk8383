
import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/app-layout';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getJobs, getCategories, getCountries } from '@/lib/data';
import React from 'react';
import { Handshake, Newspaper } from 'lucide-react';
import { JobFilters } from '@/components/job-filters';
import { ThemeToggleButton } from '@/components/theme-toggle';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';


function JobSectionSkeleton() {
    return (
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                    <JobCard job={null} />
                </div>
            ))}
        </div>
    );
}


function HomeHeaderMobile({ categories, countries }: {
  categories: ReturnType<typeof getCategories>;
  countries: ReturnType<typeof getCountries>;
}) {
  return (
      <div className="md:hidden">
        <div className="bg-primary text-primary-foreground p-4 pb-10 rounded-b-[2.5rem]">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                  <Handshake className="h-10 w-10 flex-shrink-0" />
                  <div>
                    <h1 className="text-xl font-bold">الخدمة الآن</h1>
                    <p className="text-sm font-light text-primary-foreground/90 -mt-1">فرص عمل بانتظارك</p>
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
        <div className="container mx-auto -mt-10 px-4">
          <JobFilters categories={categories} countries={countries} searchPath="/jobs" />
        </div>
      </div>
  );
}

const carouselImages = [
    {
        src: "https://i.postimg.cc/zBNdnpC6/people-ar-work-company-12112019-1.jpg",
        alt: "عامل في موقع بناء",
        hint: "construction worker",
        title: "عمال محترفون",
        description: "خبراء معتمدون في جميع المجالات"
    },
    {
        src: "https://i.postimg.cc/BbSqbdmv/images-2021-09-02-T035936-467.jpg",
        alt: "فريق عمل يتعاون",
        hint: "team collaboration",
        title: "فرص عمل متنوعة",
        description: "ابحث عن فرصتك في مختلف القطاعات"
    },
    {
        src: "https://i.postimg.cc/4x7XYvQp/image.jpg",
        alt: "مصافحة بين عاملين",
        hint: "professional handshake",
        title: "انضم إلى الأفضل",
        description: "تواصل مع أصحاب العمل مباشرة"
    }
];

export default async function HomePage() {
  const jobOffers = await getJobs({ postType: 'seeking_worker', count: 4 });
  const jobSeekers = await getJobs({ postType: 'seeking_job', count: 4 });
  const categories = getCategories();
  const countries = getCountries();

  return (
    <AppLayout>
      <HomeHeaderMobile categories={categories} countries={countries} />
      
      <div className="container hidden md:block pt-6">
        <Card className="p-2 rounded-2xl shadow-lg">
          <JobFilters categories={categories} countries={countries} searchPath="/jobs" />
        </Card>
      </div>
      
      <div className="container space-y-8 mt-6">
          <Carousel
            className="w-full rounded-2xl overflow-hidden shadow-lg"
            opts={{
              loop: true,
              direction: 'rtl',
            }}
          >
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-44 md:h-64">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      data-ai-hint={image.hint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <h2 className="text-2xl md:text-4xl font-bold text-white">{image.title}</h2>
                      <p className="text-white/90 mt-1 max-w-lg text-sm">{image.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <section>
              <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-xl font-bold">عروض العمل</h2>
              <Button variant="link" asChild className="text-primary">
                  <Link href="/jobs">
                  عرض الكل &gt;
                  </Link>
              </Button>
              </div>
              <React.Suspense fallback={<JobSectionSkeleton />}>
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
                  {jobOffers.map((job) => (
                  <div key={job.id} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                      <JobCard job={job} />
                  </div>
                  ))}
              </div>
              </React.Suspense>
          </section>

          <section>
              <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-xl font-bold">باحثون عن عمل</h2>
              <Button variant="link" asChild className="text-primary">
                  <Link href="/workers">
                  عرض الكل &gt;
                  </Link>
              </Button>
              </div>
              <React.Suspense fallback={<JobSectionSkeleton />}>
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 md:p-0 md:m-0">
                  {jobSeekers.map((job) => (
                  <div key={job.id} className="w-[75vw] sm:w-[45vw] md:w-auto flex-shrink-0">
                      <JobCard job={job} />
                  </div>
                  ))}
              </div>
              </React.Suspense>
          </section>
      </div>
    </AppLayout>
  );
}
