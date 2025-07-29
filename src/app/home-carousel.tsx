
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

const slidesData = [
  {
    key: 'main',
    src: "https://i.postimg.cc/WpDTYW7x/2147923447-2-2-1.webp",
    alt: "شخص يبدأ رحلته المهنية",
    hint: "professional journey start",
    authTitle: "ابدأ بنشر إعلانك الآن",
    authDescription: "أنشئ عرض عمل أو اطلب وظيفة في ثوانٍ",
    authButtonText: "أنشئ إعلانك الآن",
    authButtonLink: "/post-job/select-type",
    guestTitle: "وظائف مميزة بانتظارك",
    guestDescription: "استكشف الفرص المناسبة لمهاراتك واهتماماتك",
    guestButtonText: "سجّل الآن",
    guestButtonLink: "/signup",
    buttonClass: "bg-blue-600 hover:bg-blue-700"
  },
  {
    key: 'explore-jobs',
    src: "https://i.postimg.cc/VkgxknRj/2150995045-1-1.webp",
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
    src: "https://i.postimg.cc/NMKqVFRR/2149300698-1-1-2.webp",
    alt: "عامل محترف",
    hint: "professional worker",
    title: "عمّال محترفون في جميع المجالات",
    description: "من البناء إلى التقنية – الجميع هنا",
    buttonText: "استكشف الآن",
    buttonLink: "/workers",
    buttonClass: "bg-destructive hover:bg-destructive/90"
  }
];

export function HomeCarousel() {
  const { user, loading: authLoading } = useAuth();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: true })
  );

  if (authLoading) {
    return <Skeleton className="w-full h-64 md:h-80 rounded-2xl" />;
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full rounded-2xl overflow-hidden shadow-lg"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play(true)}
      opts={{
        loop: true,
        direction: 'rtl',
      }}
    >
      <CarouselContent>
        {slidesData.map((slide, index) => {
          const isFirstSlide = index === 0;
          const title = isFirstSlide ? (user ? slide.authTitle : slide.guestTitle) : slide.title;
          const description = isFirstSlide ? (user ? slide.authDescription : slide.guestDescription) : slide.description;
          const buttonText = isFirstSlide ? (user ? slide.authButtonText : slide.guestButtonText) : slide.buttonText;
          const buttonLink = isFirstSlide ? (user ? slide.authButtonLink : slide.guestButtonLink) : slide.buttonLink;

          return (
            <CarouselItem key={slide.key}>
              <div className="relative h-64 md:h-80">
                <Image
                  src={slide.src}
                  alt={slide.alt!}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="object-cover w-full h-full"
                  data-ai-hint={slide.hint}
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center p-6 md:p-12">
                  <div className="max-w-md md:max-w-lg text-white space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-md">{title}</h2>
                    <p className="text-base md:text-lg text-white/90 drop-shadow-sm">{description}</p>
                    <Button asChild size="lg" className={cn("text-white font-semibold transition-transform hover:scale-105", slide.buttonClass)}>
                      <Link href={buttonLink!}>{buttonText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
