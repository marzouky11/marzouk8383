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

  const onSubmit = (data: z.infer<typeof reportSchema>) => {
    setIsSubmitting(true);
    try {
      const adUrl = window.location.href; // The current page URL is the ad URL
      const subject = `بلاغ بخصوص إعلان مخالف (${adId})`;
      const body = `
مرحبًا فريق توظيفك،

أود الإبلاغ عن المحتوى التالي:
- رابط الإعلان: ${adUrl}
- سبب الإبلاغ: ${data.reason}
- تفاصيل إضافية: ${data.details || 'لا يوجد'}

شكرًا لكم لمراجعة هذا البلاغ.
      `.trim().replace(/^\s+/gm, '');

      const mailtoLink = `mailto:tawzifakweb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoLink;

      toast({
        title: 'تم تحويلك إلى برنامج البريد',
        description: 'يرجى إرسال البريد الإلكتروني الذي تم تجهيزه لإتمام عملية الإبلاغ.',
      });

      // Close the dialog after a short delay to allow the mail client to open
      setTimeout(() => {
        setIsOpen(false);
        reset();
      }, 500);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'فشل فتح برنامج البريد',
        description: 'حدث خطأ ما. يمكنك نسخ بريدنا الإلكتروني يدويًا: tawzifakweb@gmail.com',
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
              سيتم فتح برنامج البريد الإلكتروني لديك لإرسال تفاصيل البلاغ إلى فريقنا. لن تتم مشاركة معلوماتك مع المعلن.
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
