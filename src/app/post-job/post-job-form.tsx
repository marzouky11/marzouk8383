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
import type { Category, Country, WorkType } from '@/lib/types';
import { suggestJobCategories } from '@/ai/flows/suggest-job-categories';
import { Sparkles, Loader2 } from 'lucide-react';

const formSchema = z.object({
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
      description: "تم نشر إعلانك وسيظهر للباحثين عن عمل.",
    });
    form.reset();
    setSuggestedCategories([]);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>📝 اسم الإعلان</FormLabel><FormControl><Input placeholder="مثال: مطلوب كهربائي..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>🧾 وصف الإعلان (اختياري)</FormLabel><FormControl><Textarea placeholder="اكتب تفاصيل عن العمل، المتطلبات، إلخ." {...field} /></FormControl><FormMessage /></FormItem>
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
                <Badge key={categoryObj.id} variant="default" className="cursor-pointer" onClick={() => form.setValue('categoryId', categoryObj.id)}>{categoryObj.name}</Badge>
              ) : null;
            })}
          </div>
        )}

        <FormField control={form.control} name="categoryId" render={({ field }) => (
          <FormItem><FormLabel>🧰 الفئة</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر فئة العمل" /></SelectTrigger></FormControl><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="country" render={({ field }) => (
            <FormItem><FormLabel>🌍 الدولة</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الدولة" /></SelectTrigger></FormControl><SelectContent>{countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem><FormLabel>🏙️ المدينة</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry}><FormControl><SelectTrigger><SelectValue placeholder="اختر المدينة" /></SelectTrigger></FormControl><SelectContent>{cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="salary" render={({ field }) => (
            <FormItem><FormLabel>💰 الأجر</FormLabel><FormControl><Input placeholder="مثال: 200 درهم / يوم" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="workType" render={({ field }) => (
            <FormItem><FormLabel>⚒️ طبيعة العمل</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر طبيعة العمل" /></SelectTrigger></FormControl><SelectContent><SelectItem value="daily">يومي</SelectItem><SelectItem value="monthly">شهري</SelectItem><SelectItem value="project">مشروع</SelectItem></SelectContent></Select><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>📞 رقم الهاتف</FormLabel><FormControl><Input placeholder="+xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="whatsapp" render={({ field }) => (
            <FormItem><FormLabel>💬 رقم واتساب</FormLabel><FormControl><Input placeholder="+xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <Button type="submit" size="lg" className="w-full">نشر الإعلان</Button>
      </form>
    </Form>
  );
}
