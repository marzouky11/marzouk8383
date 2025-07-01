'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast"
import type { Category, Country, Job } from '@/lib/types';
import { suggestJobCategories } from '@/ai/flows/suggest-job-categories';
import { postJob, updateAd } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Loader2, Briefcase, Users, FileText, FileSignature, 
  LayoutGrid, Globe, MapPin, Wallet, Phone, MessageSquare, Mail,
  Building2, Award, Users2, Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  postType: z.enum(['seeking_worker', 'seeking_job'], { required_error: 'الرجاء تحديد نوع الإعلان.' }),
  title: z.string().min(1, { message: 'اسم الإعلان مطلوب.' }),
  categoryId: z.string().min(1, { message: 'الفئة مطلوبة.' }),
  workType: z.enum(['full_time', 'part_time', 'freelance', 'remote'], { required_error: 'نوع العمل مطلوب.' }),
  companyName: z.string().optional(),
  country: z.string().min(1, { message: 'الدولة مطلوبة.' }),
  city: z.string().min(1, { message: 'المدينة مطلوبة.' }),
  salary: z.string().optional(),
  experience: z.string().optional(),
  openPositions: z.coerce.number().int().positive().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }).optional(),
}).refine(data => !!data.phone || !!data.whatsapp || !!data.email, {
  message: 'يجب توفير وسيلة تواصل واحدة على الأقل (هاتف، واتساب، أو بريد إلكتروني).',
  path: ['phone'], // Show error under the first contact field
});

interface PostJobFormProps {
  categories: Category[];
  countries: Country[];
  job?: Job | null;
}

export function PostJobForm({ categories, countries, job }: PostJobFormProps) {
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const router = useRouter();
  const isEditing = !!job;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postType: job?.postType || undefined,
      title: job?.title || '',
      categoryId: job?.categoryId || '',
      country: job?.country || '',
      city: job?.city || '',
      workType: job?.workType || undefined,
      salary: job?.salary || '',
      experience: job?.experience || '',
      companyName: job?.companyName || '',
      openPositions: job?.openPositions || undefined,
      description: job?.description || '',
      phone: job?.phone || '',
      whatsapp: job?.whatsapp || '',
      email: job?.email || '',
    },
  });

  const [cities, setCities] = useState<string[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCountry = form.watch('country');
  const jobDescription = form.watch('description');
  const postType = form.watch('postType');
  
  const themeColor = postType === 'seeking_job' ? 'text-accent' : postType === 'seeking_worker' ? 'text-destructive' : 'text-muted-foreground';

  useEffect(() => {
    const countryData = countries.find(c => c.name === selectedCountry);
    setCities(countryData ? countryData.cities : []);
    if (form.getValues('country') === selectedCountry) {
        // country hasn't changed, don't reset city
    } else {
        form.setValue('city', '');
    }
  }, [selectedCountry, countries, form]);

  useEffect(() => {
    if (job?.country) {
        const countryData = countries.find(c => c.name === job.country);
        if(countryData) setCities(countryData.cities);
    }
  }, [job, countries]);

  const handleSuggestCategories = async () => {
    if (!jobDescription) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "الرجاء إدخال وصف للعمل أولاً.",
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestJobCategories({ jobDescription });
      setSuggestedCategories(result.categories);
      toast({
        title: "اقتراحات جاهزة!",
        description: "تم إنشاء اقتراحات للفئات. اختر واحدة منها.",
      });
    } catch (error) {
      console.error("Failed to suggest categories:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء اقتراح الفئات.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !userData) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب عليك تسجيل الدخول أولاً.",
      });
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && job) {
        await updateAd(job.id, values);
        toast({
          title: "تم تحديث الإعلان بنجاح!",
          description: "تم حفظ التغييرات على إعلانك.",
        });
        router.push(`/jobs/${job.id}`);
      } else {
        const newJobData = {
          ...values,
          userId: user.uid,
          ownerName: userData.name,
          ownerAvatar: userData.avatarUrl || '',
        };
        const newJobId = await postJob(newJobData);
        toast({
          title: "تم النشر بنجاح!",
          description: "تم نشر إعلانك وسيظهر في القسم المناسب.",
        });
        form.reset();
        setSuggestedCategories([]);
        router.push(`/jobs/${newJobId}`);
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "خطأ",
        description: isEditing ? "فشل تحديث الإعلان." : "حدث خطأ أثناء نشر الإعلان.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const FormLabelIcon = ({icon: Icon, label}: {icon: React.ElementType, label: string}) => (
    <FormLabel className="flex items-center gap-2">
      <Icon className={cn('h-4 w-4', themeColor)} />
      {label}
    </FormLabel>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="postType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>ماذا تريد أن تنشر؟</FormLabel>
              <FormControl>
                 <div className="grid grid-cols-2 gap-4">
                    <Card
                      onClick={() => field.onChange('seeking_worker')}
                      className={cn(
                        'p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all border-2',
                        field.value === 'seeking_worker'
                          ? 'border-destructive bg-destructive/10 text-destructive'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Briefcase className="h-8 w-8" />
                      <span className="font-semibold text-center">أبحث عن عامل</span>
                    </Card>
                     <Card
                      onClick={() => field.onChange('seeking_job')}
                      className={cn(
                        'p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all border-2',
                        field.value === 'seeking_job'
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Users className="h-8 w-8" />
                      <span className="font-semibold text-center">أبحث عن عمل</span>
                    </Card>
                 </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <fieldset disabled={!postType} className="space-y-6 disabled:opacity-50">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabelIcon icon={FileText} label="عنوان الإعلان" /><FormControl><Input placeholder={postType === 'seeking_job' ? "مثال: مصمم جرافيك يبحث عن فرصة..." : "مثال: مطلوب مهندس مدني..."} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          
          <FormField control={form.control} name="categoryId" render={({ field }) => (
            <FormItem><FormLabelIcon icon={LayoutGrid} label="الفئة"/><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر فئة العمل" /></SelectTrigger></FormControl><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="workType" render={({ field }) => (
            <FormItem><FormLabelIcon icon={Briefcase} label="نوع العمل" /><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع العمل" /></SelectTrigger></FormControl><SelectContent><SelectItem value="full_time">دوام كامل</SelectItem><SelectItem value="part_time">دوام جزئي</SelectItem><SelectItem value="freelance">عمل حر</SelectItem><SelectItem value="remote">عن بعد</SelectItem></SelectContent></Select><FormMessage /></FormItem>
          )} />

          {postType === 'seeking_worker' && (
            <FormField control={form.control} name="companyName" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Building2} label="اسم الشركة (اختياري)" /><FormControl><Input placeholder="اسم الشركة أو الجهة" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Globe} label="الدولة" /><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger></FormControl><SelectContent>{countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem><FormLabelIcon icon={MapPin} label="المدينة"/><Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry}><FormControl><SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger></FormControl><SelectContent>{cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
          </div>

           <FormField control={form.control} name="experience" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Award} label={postType === 'seeking_job' ? 'الخبرة' : 'الخبرة المطلوبة'} /><FormControl><Input placeholder="مثال: 5 سنوات، بدون خبرة..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
           )} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="salary" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Wallet} label="الأجر (اختياري)" /><FormControl><Input placeholder="مثال: 5000 درهم / شهري" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            {postType === 'seeking_worker' && (
                <FormField control={form.control} name="openPositions" render={({ field }) => (
                    <FormItem><FormLabelIcon icon={Users2} label="الوظائف المتاحة (اختياري)" /><FormControl><Input
                      type="number"
                      placeholder="مثال: 3"
                      {...field}
                      value={field.value ?? ''}
                      onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl><FormMessage /></FormItem>
                )} />
            )}
          </div>
          
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabelIcon icon={FileSignature} label={postType === 'seeking_job' ? "وصف المهارات والخبرة" : "معلومات إضافية (اختياري)"}/><FormControl><Textarea placeholder={postType === 'seeking_job' ? "اكتب تفاصيل عن مهاراتك وخبراتك..." : "اكتب تفاصيل إضافية عن الوظيفة، المتطلبات، إلخ."} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
          )} />
          
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={handleSuggestCategories} disabled={isSuggesting || !jobDescription}>
              {isSuggesting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Sparkles className="ml-2 h-4 w-4" />}
              اقترح لي فئات
            </Button>
          </div>
          {suggestedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestedCategories.map((catName) => {
                const categoryObj = categories.find(c => c.name === catName);
                return categoryObj ? (
                  <Badge key={categoryObj.id} variant={postType === 'seeking_job' ? 'accent' : 'destructive'} className="cursor-pointer" onClick={() => form.setValue('categoryId', categoryObj.id)}>{categoryObj.name}</Badge>
                ) : null;
              })}
            </div>
          )}

          <div className="border p-4 rounded-lg space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>طرق التواصل</h3>
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Phone} label="رقم الهاتف (اختياري)" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="whatsapp" render={({ field }) => (
              <FormItem><FormLabelIcon icon={MessageSquare} label="رقم واتساب (اختياري)" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Mail} label="البريد الإلكتروني (اختياري)" /><FormControl><Input type="email" placeholder="example@mail.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className={cn(
              'w-full',
              postType === 'seeking_job'
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : postType === 'seeking_worker'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            )}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditing ? 'تحديث الإعلان' : 'نشر الإعلان'}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
