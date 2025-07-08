'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Flag, Loader2 } from 'lucide-react';
import { reportAd } from '@/lib/data';

const reportSchema = z.object({
  reason: z.string({ required_error: 'الرجاء اختيار سبب الإبلاغ.' }),
  details: z.string().optional(),
});

interface ReportAdDialogProps {
  adId: string;
}

export function ReportAdDialog({ adId }: ReportAdDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
  });

  const reportReasons = [
    'إعلان احتيالي أو مضلل',
    'محتوى غير لائق',
    'إعلان مكرر',
    'معلومات اتصال خاطئة',
    'سبب آخر',
  ];

  const onSubmit = async (data: z.infer<typeof reportSchema>) => {
    setIsSubmitting(true);
    try {
      await reportAd(adId, data.reason, data.details);
      toast({
        title: 'تم إرسال البلاغ بنجاح',
        description: 'شكرًا لك، سنقوم بمراجعة الإعلان.',
      });
      setIsOpen(false);
      reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'فشل إرسال البلاغ',
        description: 'حدث خطأ ما، يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive w-full">
          <Flag className="ml-2 h-4 w-4" />
          إبلاغ عن الإعلان
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>الإبلاغ عن إعلان</AlertDialogTitle>
            <AlertDialogDescription>
              ساعدنا في الحفاظ على جودة المنصة. لن تتم مشاركة معلوماتك مع المعلن.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <RadioGroup {...register('reason')}>
              {reportReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="font-normal">{reason}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors.reason && <p className="text-sm font-medium text-destructive">{errors.reason.message}</p>}
            <Textarea
              {...register('details')}
              placeholder="تفاصيل إضافية (اختياري)"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={() => { setIsOpen(false); reset(); }}>إلغاء</AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              إرسال البلاغ
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
