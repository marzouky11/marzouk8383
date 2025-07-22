
'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

const commonSlides = [
    {
        key: 'explore-jobs',
        src: "https://i.postimg.cc/przwJ10W/2149300698.jpg",
        alt: "وظائف مميزة",
        hint: "job opportunities",
        title: "وظائف مميزة بانتظارك",
        description: "استكشف الفرص المناسبة لمهاراتك واهتماماتك",
        buttonText: "استكشف الآن",
        buttonLink: "/jobs",
        buttonClass: "bg-green-600 hover:bg-green-700"
    },
    {
        key: 'explore-workers',
        src: "https://i.postimg.cc/XJymnz6f/2150995045.jpg",
        alt: "عامل محترف",
        hint: "professional worker",
        title: "عمّال محترفون في جميع المجالات",
        description: "من البناء إلى التقنية – الجميع هنا",
        buttonText: "استكشف العمال",
        buttonLink: "/workers",
        buttonClass: "bg-destructive hover:bg-destructive/90"
    }
];

const unauthenticatedFirstSlide = {
    key: 'register',
    src: "https://i.postimg.cc/8CvmcQsz/2147923447-1.jpg",
    alt: "شخص يبدأ رحلته المهنية",
    hint: "professional journey start",
    title: "وظائف مميزة بانتظارك",
    description: "استكشف الفرص المناسبة لمهاراتك واهتماماتك",
    buttonText: "سجّل الآن",
    buttonLink: "/signup",
    buttonClass: "bg-blue-600 hover:bg-blue-700"
};

const authenticatedFirstSlide = {
    key: 'post-ad',
    src: "https://i.postimg.cc/8CvmcQsz/2147923447-1.jpg",
    alt: "شخص يبدأ رحلته المهنية",
    hint: "professional journey start",
    title: "ابدأ بنشر إعلانك الآن",
    description: "أنشئ عرض عمل أو اطلب وظيفة في ثوانٍ",
    buttonText: "أنشئ إعلانك الآن",
    buttonLink: "/post-job/select-type",
    buttonClass: "bg-blue-600 hover:bg-blue-700"
};


export function HomeCarousel() {
  const { user, loading } = useAuth();
  
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: true })
  );

  if (loading) {
    return <Skeleton className="w-full h-64 md:h-80 rounded-2xl" />;
  }

  const firstSlide = user ? authenticatedFirstSlide : unauthenticatedFirstSlide;
  const carouselSlides = [firstSlide, ...commonSlides];

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full rounded-2xl overflow-hidden shadow-lg"
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.play()}
      opts={{
        loop: true,
        direction: 'rtl',
      }}
    >
      <CarouselContent>
        {carouselSlides.map((slide, index) => (
          <CarouselItem key={slide.key}>
            <div className="relative h-64 md:h-80">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="object-cover"
                data-ai-hint={slide.hint}
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center p-6 md:p-12">
                <div className="max-w-md md:max-w-lg text-white space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-md">{slide.title}</h2>
                    <p className="text-base md:text-lg text-white/90 drop-shadow-sm">{slide.description}</p>
                    <Button asChild size="lg" className={cn("text-white font-semibold transition-transform hover:scale-105", slide.buttonClass)}>
                        <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                    </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
