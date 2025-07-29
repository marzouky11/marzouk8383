'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

const slides = [
  {
    image: '/slide1.webp',
    title: 'منصة توظيفك',
    description: 'احصل على وظيفة أحلامك بسهولة وسرعة',
    buttonText: 'تصفح الوظائف',
    buttonLink: '/jobs',
    buttonClass: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    image: '/slide2.webp',
    title: 'فرص عمل حقيقية',
    description: 'نحن نوفر لك فرصًا من شركات موثوقة في العالم العربي والخليج',
    buttonText: 'ابدأ الآن',
    buttonLink: '/register',
    buttonClass: 'bg-green-500 hover:bg-green-600',
  },
  {
    image: '/slide3.webp',
    title: 'سجّل سيرتك الذاتية',
    description: 'اجعل أصحاب العمل يعثرون عليك بسهولة',
    buttonText: 'سجّل مجاناً',
    buttonLink: '/cv',
    buttonClass: 'bg-yellow-500 hover:bg-yellow-600 text-black',
  },
]

export default function HomeCarousel() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Carousel className="w-full overflow-hidden rounded-xl">
      <CarouselContent>
        {slides.map((slide, index) => {
          const { image, title, description, buttonText, buttonLink, buttonClass } = slide

          return (
            <CarouselItem key={index}>
              <div className="relative h-[600px] w-full overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                  <h2 className="text-3xl font-bold text-white drop-shadow-md md:text-5xl">
                    {title}
                  </h2>
                  <p className="mt-4 text-base text-white/90 md:text-lg drop-shadow-sm">
                    {description}
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      'mt-6 text-white font-semibold transition-transform hover:scale-105',
                      buttonClass
                    )}
                  >
                    <Link href={buttonLink}>{buttonText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  )
                }
