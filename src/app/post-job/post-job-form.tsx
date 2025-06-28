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
import type { Category, Country } from '@/lib/types';
import { suggestJobCategories } from '@/ai/flows/suggest-job-categories';
import { 
  Sparkles, Loader2, Briefcase, Users, FileText, FileSignature, 
  LayoutGrid, Globe, MapPin, Wallet, Phone, MessageSquare
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  postType: z.enum(['seeking_worker', 'seeking_job'], { required_error: 'الرجاء تحديد نوع الإعلان.' }),
  title: z.string().min(1, { message: 'اسم الإعلان مطلوب.' }),
  categoryId: z.string().min(1, { message: 'الفئة مطلوبة.' }),
  country: z.string().min(1, { message: 'الدولة مطلوبة.' }),
  city: z.string().min(1, { message: 'المدينة مطلوبة.' }),
  salary: z.string().min(1, { message: 'الأجر مطلوب.' }),
  workType: z.enum(['daily', 'monthly', 'project'], { required_error: 'طبيعة العمل مطلوبة.' }),
  description: z.string().optional(),
  phone: z.string().min(1, { message: 'رقم الهاتف مطلوب.' }),
  whatsapp: z.string().min(1, { message: 'رقم واتساب مطلوب.' }),
});

interface PostJobFormProps {
  categories: Category[];
  countries: Country[];
}

export function PostJobForm({ categories, countries }: PostJobFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postType: undefined,
      title: '',
      categoryId: '',
      country: '',
      city: '',
      salary: '',
      description: '',
      phone: '',
      whatsapp: '',
    },
  });

  const [cities, setCities] = useState<string[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const selectedCountry = form.watch('country');
  const jobDescription = form.watch('description');
  const postType = form.watch('postType');
  
  const themeColor = postType === 'seeking_job' ? 'text-accent' : postType === 'seeking_worker' ? 'text-destructive' : 'text-muted-foreground';

  useEffect(() => {
    if (selectedCountry) {
      const countryData = countries.find(c => c.name === selectedCountry);
      setCities(countryData ? countryData.cities : []);
      form.setValue('city', '');
    } else {
      setCities([]);
    }
  }, [selectedCountry, countries, form]);

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "تم النشر بنجاح!",
      description: "تم نشر إعلانك وسيظهر في القسم المناسب.",
    });
    form.reset();
    setSuggestedCategories([]);
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
            <FormItem><FormLabelIcon icon={FileText} label="اسم الإعلان" /><FormControl><Input placeholder={postType === 'seeking_job' ? "مثال: كهربائي محترف..." : "مثال: مطلوب كهربائي..."} {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabelIcon icon={FileSignature} label="وصف الإعلان (اختياري)"/><FormControl><Textarea placeholder="اكتب تفاصيل عن العمل، المتطلبات، إلخ." {...field} /></FormControl><FormMessage /></FormItem>
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

          <FormField control={form.control} name="categoryId" render={({ field }) => (
            <FormItem><FormLabelIcon icon={LayoutGrid} label="الفئة"/><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر فئة العمل" /></SelectTrigger></FormControl><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Globe} label="الدولة" /><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger></FormControl><SelectContent>{countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem><FormLabelIcon icon={MapPin} label="المدينة"/><Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry}><FormControl><SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger></FormControl><SelectContent>{cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="salary" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Wallet} label="الأجر" /><FormControl><Input placeholder="مثال: 200 درهم / يوم" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="workType" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Briefcase} label="طبيعة العمل" /><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر طبيعة العمل" /></SelectTrigger></FormControl><SelectContent><SelectItem value="daily">يومي</SelectItem><SelectItem value="monthly">شهري</SelectItem><SelectItem value="project">مشروع</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Phone} label="رقم الهاتف" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="whatsapp" render={({ field }) => (
              <FormItem><FormLabelIcon icon={MessageSquare} label="رقم واتساب" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <Button
            type="submit"
            size="lg"
            className={cn(
              'w-full',
              postType === 'seeking_job'
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : postType === 'seeking_worker'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            )}
          >
            نشر الإعلان
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
