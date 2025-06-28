'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Category, Country } from '@/lib/types';

interface JobFiltersProps {
  categories: Category[];
  countries: Country[];
  showSort?: boolean;
  className?: string;
}

export function JobFilters({ categories, countries, showSort = false, className }: JobFiltersProps) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCountry) {
      const countryData = countries.find(c => c.name === selectedCountry);
      setCities(countryData ? countryData.cities : []);
    } else {
      setCities([]);
    }
  }, [selectedCountry, countries]);
  
  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <div className="relative flex-grow">
        <Input
          placeholder="ابحث عن وظيفة، عامل، أو خدمة..."
          className="h-14 pl-12 pr-4 text-base rounded-lg shadow-lg border-none"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="h-14 w-14 flex-shrink-0 shadow-lg rounded-lg border-none bg-card">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80svh] flex flex-col">
          <SheetHeader>
            <SheetTitle>فلترة النتائج</SheetTitle>
            <SheetDescription>
              قم بتحديد خيارات البحث للعثور على ما يناسبك.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto pr-6 space-y-6">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="country" className="mb-2 block">الدولة</Label>
                   <Select onValueChange={setSelectedCountry}>
                     <SelectTrigger id="country"><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
                     <SelectContent>{countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
                 <div>
                   <Label htmlFor="city" className="mb-2 block">المدينة</Label>
                   <Select disabled={!selectedCountry}>
                     <SelectTrigger id="city"><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                     <SelectContent>{cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
              </div>
               <div>
                 <Label htmlFor="category" className="mb-2 block">الفئة</Label>
                 <Select>
                   <SelectTrigger id="category"><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                   <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                 </Select>
               </div>
               <div>
                  <Label className="mb-2 block">طبيعة العمل</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="اختر طبيعة العمل" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">يومي</SelectItem>
                        <SelectItem value="monthly">شهري</SelectItem>
                        <SelectItem value="project">مشروع</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
              {showSort && (
                <div>
                  <Label className="mb-2 block">ترتيب حسب</Label>
                  <RadioGroup defaultValue="newest" dir="rtl" className="flex gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="newest" id="r1" />
                      <Label htmlFor="r1">الأحدث</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="highest_paying" id="r2" />
                      <Label htmlFor="r2">الأعلى أجراً</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
          <SheetFooter className="mt-4 pt-4 border-t">
            <SheetClose asChild>
              <Button type="submit" size="lg" className="w-full">عرض النتائج</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}