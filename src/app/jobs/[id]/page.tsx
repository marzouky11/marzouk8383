'use client';

import { useParams, notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Phone,
  MessageSquare,
  MapPin,
  Wallet,
  Star,
  CalendarDays,
  Heart,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { getJobById, getCategoryById } from '@/lib/data';
import type { Job } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { CopyButton } from './copy-button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const job = getJobById(params.id);

  if (!job) {
    notFound();
  }

  const category = getCategoryById(job.categoryId);
  const isWorkerAd = job.postType === 'seeking_job';
  const themeColor = isWorkerAd ? 'text-accent' : 'text-primary';
  const themeBg = isWorkerAd ? 'bg-accent/10' : 'bg-primary/10';
  const themeBorder = isWorkerAd ? 'border-accent' : 'border-primary';
  const themeButton = isWorkerAd ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary text-primary-foreground hover:bg-primary/90';

  const InfoItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string | undefined }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className={cn('h-4 w-4', themeColor)} />
      <span>{text || 'غير محدد'}</span>
    </div>
  );

  return (
    <AppLayout>
      <div className="container mx-auto max-w-2xl px-4 py-6">
          <Card className={cn('overflow-hidden shadow-xl border-t-4 relative z-10 rounded-2xl', themeBorder)}>
            <CardContent className="p-4 sm:p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={cn('text-2xl font-bold', themeColor)}>
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-md">{job.city}</span>
                  </div>
                </div>
                {category && (
                  <div className={cn('p-3 rounded-full', themeBg)}>
                    <CategoryIcon name={category.iconName} className={cn('w-7 h-7', themeColor)} />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <InfoItem icon={Wallet} text={job.salary} />
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{job.rating}</span>
                  <span className="text-xs">(تقييم)</span>
                </div>
                <InfoItem icon={CalendarDays} text={job.postedAt} />
              </div>
              
              <Button variant="outline" className="w-fit">
                <Heart className="ml-2 h-4 w-4" />
                مهتم ({job.likes})
              </Button>

              <Separator />

              <div>
                <h3 className={cn('text-lg font-bold flex items-center gap-2 mb-2', themeColor)}>
                    {isWorkerAd ? <UserIcon className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                    {isWorkerAd ? 'معلومات الباحث عن عمل' : 'وصف الوظيفة'}
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {job.description || 'لا يوجد وصف متاح.'}
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                  <h3 className={cn('text-lg font-bold flex items-center gap-2 mb-3', themeColor)}>
                    <UserIcon className="h-5 w-5" />
                    صاحب الإعلان
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={job.ownerAvatar} data-ai-hint="user avatar" />
                        <AvatarFallback>{job.ownerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{job.ownerName}</p>
                  </div>
              </div>

              <div>
                <h3 className={cn('text-lg font-bold flex items-center gap-2 mb-3', themeColor)}>
                  <Phone className="h-5 w-5" />
                  معلومات التواصل
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild className="flex-grow bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href={`https://wa.me/${job.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="ml-2 h-4 w-4" />
                      واتساب
                    </a>
                  </Button>
                  <Button asChild className={cn('flex-grow', themeButton)}>
                    <a href={`tel:${job.phone}`}>
                      <Phone className="ml-2 h-4 w-4" />
                      اتصال
                    </a>
                  </Button>
                  <CopyButton textToCopy={job.phone} />
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </AppLayout>
  );
}
