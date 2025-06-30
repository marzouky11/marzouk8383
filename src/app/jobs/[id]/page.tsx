'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
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
import { getJobById, getCategoryById, hasUserLikedJob } from '@/lib/data';
import type { Job } from '@/lib/types';
import { CategoryIcon } from '@/components/icons';
import { CopyButton } from './copy-button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { ShareButton } from './share-button';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (params?.id) {
      const fetchJob = async () => {
        setLoading(true);
        const jobData = await getJobById(params.id as string);
        if (jobData) {
            setJob(jobData);
            if(user) {
                const liked = await hasUserLikedJob(jobData.id, user.uid);
                setIsLiked(liked);
            }
        }
        setLoading(false);
      };
      fetchJob();
    }
  }, [params?.id, user]);

  const handleLike = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'الرجاء تسجيل الدخول أولاً' });
      router.push('/login');
      return;
    }
    if (job) {
      try {
        await runTransaction(db, async (transaction) => {
            const adRef = doc(db, 'ads', job.id);
            const interestRef = doc(db, 'interests', `${user.uid}_${job.id}`);
            const interestDoc = await transaction.get(interestRef);
            const adDoc = await transaction.get(adRef);

            if (!adDoc.exists()) {
                throw new Error("Document does not exist!");
            }

            const currentLikes = adDoc.data().likes || 0;

            if (interestDoc.exists()) {
                // User is unliking the job
                transaction.delete(interestRef);
                transaction.update(adRef, { likes: currentLikes - 1 });
                setIsLiked(false);
                setJob(prevJob => prevJob ? { ...prevJob, likes: prevJob.likes - 1 } : null);
                toast({ title: 'تم إلغاء الاهتمام' });
            } else {
                // User is liking the job
                transaction.set(interestRef, { userId: user.uid, jobId: job.id, createdAt: serverTimestamp() });
                transaction.update(adRef, { likes: currentLikes + 1 });
                setIsLiked(true);
                setJob(prevJob => prevJob ? { ...prevJob, likes: prevJob.likes + 1 } : null);
                toast({ title: 'شكراً لاهتمامك!' });
            }
        });
      } catch (error) {
        console.error("Like transaction failed: ", error);
        toast({ variant: 'destructive', title: 'حدث خطأ' });
      }
    }
  };


  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto max-w-4xl px-4 py-6">
            <Card className="overflow-hidden shadow-xl border-t-4 relative z-10 rounded-2xl border-muted">
                <CardContent className="p-6 space-y-6">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <Separator />
                    <Skeleton className="h-20 w-full" />
                    <Separator />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  if (!job) {
    notFound();
  }

  const category = getCategoryById(job.categoryId);
  const isWorkerAd = job.postType === 'seeking_job';
  const themeColor = isWorkerAd ? 'text-accent' : 'text-destructive';
  const themeBg = isWorkerAd ? 'bg-accent/10' : 'bg-destructive/10';
  const themeBorder = isWorkerAd ? 'border-accent' : 'border-destructive';

  const InfoItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string | undefined }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className={cn('h-4 w-4', themeColor)} />
      <span>{text || 'غير محدد'}</span>
    </div>
  );

  return (
    <AppLayout>
      <div className="container mx-auto max-w-4xl px-4 py-6">
          <Card className={cn('overflow-hidden shadow-xl border-t-4 relative z-10 rounded-2xl', themeBorder)}>
            <CardContent className="p-4 sm:p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={cn('text-2xl font-bold', themeColor)}>
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-md">{job.country}, {job.city}</span>
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
              
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-fit" onClick={handleLike}>
                  <Heart className={cn("ml-2 h-4 w-4", isLiked && "fill-destructive text-destructive")} />
                  مهتم ({job.likes})
                </Button>
                <ShareButton title={job.title} text={job.description || 'تحقق من هذا الإعلان الرائع!'} />
              </div>

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
                  <Button asChild className={cn('flex-grow', isWorkerAd ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90')}>
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
