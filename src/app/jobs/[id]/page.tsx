'use client';

import { notFound, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Phone,
  MessageSquare,
  MapPin,
  Wallet,
  Star,
  CalendarDays,
  FileText,
  Heart,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';
import { getJobById, getCategoryById } from '@/lib/data';
import type { Job } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { CopyButton } from './copy-button';
import { Separator } from '@/components/ui/separator';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = getJobById(params.id);
  const router = useRouter();

  if (!job) {
    notFound();
  }

  const category = getCategoryById(job.categoryId);

  const InfoItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string | undefined }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4 text-primary" />
      <span>{text || 'غير محدد'}</span>
    </div>
  );

  return (
    <AppLayout showHeader={false}>
      <div className="bg-muted/30 min-h-full">
        <header className="bg-primary text-primary-foreground p-4 rounded-b-3xl shadow-lg sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between relative h-12">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 text-primary-foreground hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold flex items-center gap-2 mx-auto">
              <FileText className="h-5 w-5" />
              تفاصيل الإعلان
            </h1>
          </div>
        </header>

        <main className="container mx-auto max-w-2xl px-4 py-6 -mt-12">
          <Card className="overflow-hidden shadow-xl border-none relative z-10 rounded-2xl">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{job.title}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-md">{job.city}</span>
                  </div>
                </div>
                {category && (
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CategoryIcon name={category.iconName} className="w-7 h-7 text-primary" />
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
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  وصف الوظيفة
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {job.description || 'لا يوجد وصف متاح.'}
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                    <UserIcon className="h-5 w-5 text-primary" />
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
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                  <Phone className="h-5 w-5 text-primary" />
                  معلومات التواصل
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button asChild className="flex-grow bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href={`https://wa.me/${job.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="ml-2 h-4 w-4" />
                      واتساب
                    </a>
                  </Button>
                  <Button asChild className="flex-grow">
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
        </main>
      </div>
    </AppLayout>
  );
}
