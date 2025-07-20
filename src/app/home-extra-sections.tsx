
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getJobs } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Briefcase, Star, Users } from 'lucide-react';
import { UserAvatar } from '@/components/user-avatar';
import { motion, useInView } from "framer-motion";

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
              <div className="p-4 bg-primary/10 rounded-full">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <div className="text-5xl font-bold text-primary">
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
               <div className="p-4 bg-accent/10 rounded-full">
                <Users className="h-10 w-10 text-accent" />
              </div>
              <div className="text-5xl font-bold text-accent">
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
const testimonials = [
  {
    name: 'أحمد المصري',
    avatarColor: '#3b82f6',
    rating: 5,
    comment: 'منصة ممتازة! وجدت وظيفة كفني تبريد وتكييف في غضون أسبوع واحد فقط. واجهة سهلة والتواصل مع أصحاب العمل كان مباشرًا. شكرًا لكم!',
  },
  {
    name: 'فاطمة الزهراء',
    avatarColor: '#ec4899',
    rating: 5,
    comment: 'كمصممة أزياء، كنت أبحث عن منصة لعرض أعمالي. توظيفك ساعدني في الوصول لعملاء جدد وتوسيع مشروعي الصغير. أنصح بها بشدة.',
  },
  {
    name: 'خالد السعودي',
    avatarColor: '#10b981',
    rating: 4,
    comment: 'بصفتي صاحب شركة مقاولات، كنت أجد صعوبة في العثور على عمال ماهرين. الآن أجد كل ما أحتاجه من نجارين وسباكين بسهولة.',
  },
];

function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });

  return (
    <section ref={ref} className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">ماذا يقول مستخدمونا؟</h2>
          <p className="text-muted-foreground mt-2">آراؤكم هي مصدر إلهامنا ووقودنا للتطور</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="p-6 h-full flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition-shadow">
                <UserAvatar name={testimonial.name} color={testimonial.avatarColor} className="h-20 w-20 text-3xl mb-4" />
                <h4 className="font-bold text-lg">{testimonial.name}</h4>
                <div className="flex my-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                     <Star key={i} className="h-5 w-5 text-muted-foreground/30 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2 flex-grow">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main component to export
export function HomeExtraSections() {
    const [stats, setStats] = useState<{ jobs: number, seekers: number }>({ jobs: 0, seekers: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const jobOffers = await getJobs({ postType: 'seeking_worker' });
                const jobSeekers = await getJobs({ postType: 'seeking_job' });
                setStats({ jobs: jobOffers.length, seekers: jobSeekers.length });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if(loading) {
      return (
        <div className="py-12 bg-muted/50 rounded-2xl">
          <div className="container mx-auto px-4">
             <div className="h-40 w-full bg-muted animate-pulse rounded-lg"></div>
          </div>
        </div>
      )
    }

    return (
        <div className="space-y-8">
            <StatsSection stats={stats} />
            <TestimonialsSection />
        </div>
    );
}
