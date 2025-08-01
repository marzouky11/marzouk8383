'use client';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const slidesData = [
  {
    key: 'main',
    src: "/slide1.webp",
    alt: "شخص يبدأ رحلته المهنية",
    hint: "professional journey start",
    title: "ابدأ بنشر إعلانك الآن",
    description: "أنشئ عرض عمل أو اطلب وظيفة في ثوانٍ",
    buttonText: "ابدأ الآن",
    buttonLink: "/signup",
    buttonClass: "bg-blue-600 hover:bg-blue-700"
  },
  {
    key: 'explore-jobs',
    src: "/slide2.webp",
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
    src: "/slide3.webp",
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
  const plugin = useRef(Autoplay({ delay: 6000 }));

  return (
    <Carousel
      opts={{ loop: true, direction: 'rtl' }}
      plugins={[plugin.current]}
      className="w-full overflow-hidden rounded-xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slidesData.map((slide) => (
          <CarouselItem key={slide.key}>
            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-4">
                <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow">{slide.title}</h3>
                <p className="text-base md:text-lg text-white/90 drop-shadow-sm">{slide.description}</p>

                {slide.buttonLink && (
                  <Button asChild size="lg" className={cn("text-white font-semibold transition-transform hover:scale-105", slide.buttonClass)}>
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
