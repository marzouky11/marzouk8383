'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
import type { Category, Country, WorkType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface JobFiltersProps {
  categories: Category[];
  countries: Country[];
  showSort?: boolean;
  className?: string;
  searchPath?: string;
}

const workTypeTranslations: { [key in WorkType]: string } = {
  full_time: 'دوام كامل',
  part_time: 'دوام جزئي',
  freelance: 'عمل حر',
  remote: 'عن بعد',
};

export function JobFilters({ categories, countries, showSort = false, className, searchPath }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedWorkType, setSelectedWorkType] = useState(searchParams.get('workType') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  
  const [cities, setCities] = useState<string[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const countryData = countries.find(c => c.name === selectedCountry);
    setCities(countryData ? countryData.cities : []);
  }, [selectedCountry, countries]);
  
  useEffect(() => {
    const initialCountry = searchParams.get('country');
    if (initialCountry) {
        const countryData = countries.find(c => c.name === initialCountry);
        if (countryData) {
            setCities(countryData.cities);
        }
    }
  }, [countries, searchParams]);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery) params.set('q', searchQuery); else params.delete('q');
    if (selectedCategory) params.set('category', selectedCategory); else params.delete('category');
    if (selectedCountry) params.set('country', selectedCountry); else params.delete('country');
    if (selectedCity) params.set('city', selectedCity); else params.delete('city');
    if (selectedWorkType) params.set('workType', selectedWorkType); else params.delete('workType');
    if (sortBy) params.set('sortBy', sortBy); else params.delete('sortBy');
    
    const targetPath = searchPath || pathname;
    router.push(`${targetPath}?${params.toString()}`);
    setIsSheetOpen(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      handleFilter();
  }

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedCity('');
  }
  
  return (
    <div className={cn(`flex gap-2 items-center`, className)}>
      <form onSubmit={handleSearch} className="flex-grow">
        <div className="relative w-full">
          <Input
            placeholder="ابحث عن وظيفة، عامل، أو خدمة..."
            className="h-14 text-base rounded-xl pl-4 pr-14 border bg-background shadow-lg focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
           <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button type="submit" size="icon" variant="ghost" className="rounded-full h-10 w-10">
                  <Search className="h-5 w-5 text-primary" />
              </Button>
          </div>
        </div>
      </form>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="h-14 w-14 flex-shrink-0 shadow-lg rounded-xl border bg-background p-0">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
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
                   <Select value={selectedCountry} onValueChange={handleCountryChange}>
                     <SelectTrigger id="country"><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
                     <SelectContent position="item-aligned">{countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
                 <div>
                   <Label htmlFor="city" className="mb-2 block">المدينة</Label>
                   <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedCountry}>
                     <SelectTrigger id="city"><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                     <SelectContent position="item-aligned">{cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
              </div>
               <div>
                 <Label htmlFor="category" className="mb-2 block">الفئة</Label>
                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                   <SelectTrigger id="category"><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                   <SelectContent position="item-aligned">{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                 </Select>
               </div>
               <div>
                  <Label className="mb-2 block">طبيعة العمل</Label>
                  <Select value={selectedWorkType} onValueChange={(value) => setSelectedWorkType(value as WorkType)}>
                    <SelectTrigger><SelectValue placeholder="اختر طبيعة العمل" /></SelectTrigger>
                    <SelectContent position="item-aligned">
                      {Object.entries(workTypeTranslations).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
              {showSort && (
                <div>
                  <Label className="mb-2 block">ترتيب حسب</Label>
                  <RadioGroup value={sortBy} onValueChange={setSortBy} dir="rtl" className="flex gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="newest" id="r1" />
                      <Label htmlFor="r1">الأحدث</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          </div>
          <SheetFooter className="mt-4 pt-4 border-t">
            <SheetClose asChild>
              <Button type="button" onClick={handleFilter} size="lg" className="w-full">عرض النتائج</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
