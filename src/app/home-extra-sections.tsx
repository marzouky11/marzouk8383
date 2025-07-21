

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getJobs, getTestimonials } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Briefcase, Star, Users, MessageSquare } from 'lucide-react';
import { UserAvatar } from '@/components/user-avatar';
import { motion, useInView } from "framer-motion";
import type { Testimonial } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// CountUp component for animating numbers
const CountUp = ({ end, duration = 2 }: { end: number, duration?: number }) => {  
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration * 1000 / frameDuration);
    const increment = (end - start) / totalFrames;

    let currentFrame = 0;
    const timer = setInterval(() => {
        currentFrame++;
        start += increment;
        setCount(Math.floor(start));
        if (currentFrame === totalFrames) {
            setCount(end); // Ensure it ends on the exact number
            clearInterval(timer);
        }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString('ar-EG')}</span>;
};


// Stats Section Component
function StatsSection({ stats }: { stats: { jobs: number, seekers: number } }) {
  return (
    <section className="py-12 bg-muted/50 rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">منصتنا بالأرقام</h2>
          <p className="text-muted-foreground mt-2">نحن ننمو كل يوم بفضل ثقتكم</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 text-center flex flex-col items-center gap-4 transition-transform hover:scale-105 hover:shadow-xl">
              <div className="p-4 bg-accent/10 rounded-full">
                <Briefcase className="h-10 w-10 text-accent" />
              </div>
              <div className="text-5xl font-bold text-accent">
                <CountUp end={stats.jobs} />
              </div>
              <p className="text-lg font-semibold text-muted-foreground">عرض عمل منشور</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 text-center flex flex-col items-center gap-4 transition-transform hover:scale-105 hover:shadow-xl">
               <div className="p-4 bg-destructive/10 rounded-full">
                <Users className="h-10 w-10 text-destructive" />
              </div>
              <div className="text-5xl font-bold text-destructive">
                <CountUp end={stats.seekers} />
              </div>
              <p className="text-lg font-semibold text-muted-foreground">باحث عن عمل</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


// Testimonials Section Component
const INITIAL_DISPLAY_COUNT_MOBILE = 2;
const INITIAL_DISPLAY_COUNT_DESKTOP = 2;

function TestimonialsSection({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initialCount = isMobile ? INITIAL_DISPLAY_COUNT_MOBILE : INITIAL_DISPLAY_COUNT_DESKTOP;
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, initialCount);
  const hasMoreTestimonials = testimonials.length > initialCount;

  return (
    <section ref={ref} className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">ماذا يقول مستخدمونا؟</h2>
          <p className="text-muted-foreground mt-2">آراؤكم هي مصدر إلهامنا ووقودنا للتطور</p>
        </div>
        
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="p-6 h-full flex flex-col shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <UserAvatar name={testimonial.userName} color={testimonial.userAvatarColor} className="h-12 w-12 text-xl" />
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.userName}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.postedAt}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mt-2 flex-grow">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
           <div className="text-center text-muted-foreground p-8 flex flex-col items-center gap-4 border rounded-lg">
                <MessageSquare className="w-16 h-16 text-muted-foreground/30" />
                <p>كن أول من يشاركنا رأيه في المنصة!</p>
            </div>
        )}

        <div className="mt-8 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
          {hasMoreTestimonials && !showAll && (
            <Button onClick={() => setShowAll(true)} variant="outline">عرض كل الآراء</Button>
          )}
          <Button asChild>
            <Link href="/add-testimonial">أضف رأيك</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Main component to export
export function HomeExtraSections() {
    const [stats, setStats] = useState<{ jobs: number, seekers: number }>({ jobs: 0, seekers: 0 });
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobOffers, jobSeekers, fetchedTestimonials] = await Promise.all([
                    getJobs({ postType: 'seeking_worker' }),
                    getJobs({ postType: 'seeking_job' }),
                    getTestimonials(),
                ]);
                setStats({ jobs: jobOffers.length, seekers: jobSeekers.length });
                setTestimonials(fetchedTestimonials);
            } catch (error) {
                console.error("Failed to fetch extra sections data:", error);
                // Fallback to static numbers if fetching fails
                setStats({ jobs: 1250, seekers: 2800 });
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <StatsSection stats={stats} />
            <TestimonialsSection initialTestimonials={testimonials} />
        </div>
    );
}
