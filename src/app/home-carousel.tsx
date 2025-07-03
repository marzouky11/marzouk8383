'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

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

export function HomeCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full rounded-2xl overflow-hidden shadow-lg"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
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
  );
}
