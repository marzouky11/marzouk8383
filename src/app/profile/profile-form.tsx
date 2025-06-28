'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast"
import type { Country, User } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, { message: 'الاسم مطلوب.' }),
  country: z.string().min(1, { message: 'الدولة مطلوبة.' }),
  city: z.string().min(1, { message: 'المدينة مطلوبة.' }),
  phone: z.string().min(1, { message: 'رقم الهاتف مطلوب.' }),
  whatsapp: z.string().min(1, { message: 'رقم واتساب مطلوب.' }),
});

interface ProfileFormProps {
  countries: Country[];
  user: User;
}

export function ProfileForm({ countries, user }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: user,
  });

  const [cities, setCities] = useState<string[]>([]);
  const selectedCountry = form.watch('country');
  const userName = form.watch('name');

  useEffect(() => {
    if (selectedCountry) {
      const countryData = countries.find(c => c.name === selectedCountry);
      setCities(countryData ? countryData.cities : []);
    }
  }, [selectedCountry, countries]);
  
  useEffect(() => {
    // Set initial cities based on default user country
    const initialCountry = countries.find(c => c.name === user.country);
    if(initialCountry) {
        setCities(initialCountry.cities);
    }
  }, [countries, user.country]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "تم تحديث الملف الشخصي",
      description: "تم حفظ معلوماتك بنجاح.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="user avatar" alt={userName} />
                <AvatarFallback className="text-3xl">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
            </Avatar>
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="flex-grow">
                    <FormLabel>الاسم</FormLabel>
                    <FormControl><Input placeholder="اسمك الكامل" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="country" render={({ field }) => (
            <FormItem><FormLabel>الدولة</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر دولتك" /></SelectTrigger></FormControl><SelectContent>{countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem><FormLabel>المدينة</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry}><FormControl><SelectTrigger><SelectValue placeholder="اختر مدينتك" /></SelectTrigger></FormControl><SelectContent>{cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>رقم الهاتف</FormLabel><FormControl><Input placeholder="+xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="whatsapp" render={({ field }) => (
            <FormItem><FormLabel>رقم واتساب</FormLabel><FormControl><Input placeholder="+xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <Button type="submit" size="lg" className="w-full">حفظ التغييرات</Button>
      </form>
    </Form>
  );
}
