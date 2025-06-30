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
import type { Category, Country } from '@/lib/types';
import { cn } from '@/lib/utils';

interface JobFiltersProps {
  categories: Category[];
  countries: Country[];
  showSort?: boolean;
  className?: string;
  searchPath?: string;
  showFilterButton?: boolean;
}

export function JobFilters({ categories, countries, showSort = false, className, searchPath, showFilterButton = true }: JobFiltersProps) {
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
      <form onSubmit={handleSearch} className="flex gap-2 items-center flex-grow">
        <div className="relative flex-grow">
          <Input
            placeholder="ابحث عن وظيفة، عامل، أو خدمة..."
            className={cn(
              "h-12 text-base rounded-lg",
              showFilterButton 
                ? "pl-10 pr-4 shadow-sm"
                : "pr-4 pl-14 border-0 bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2",
            showFilterButton ? "left-3" : "right-3"
            )}>
            <Button type="submit" size="icon" className={cn(
              "rounded-full",
              showFilterButton ? "w-auto h-auto bg-transparent" : "h-9 w-9 bg-primary text-primary-foreground"
            )}>
                <Search className={cn("h-5 w-5", showFilterButton ? "text-muted-foreground" : "")} />
            </Button>
          </div>
        </div>
      </form>

      {showFilterButton && <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="h-12 w-12 flex-shrink-0 shadow-sm rounded-lg border bg-card p-0">
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
                   <Select value={selectedCountry} onValueChange={handleCountryChange}>
                     <SelectTrigger id="country"><SelectValue placeholder="اختر الدولة" /></SelectTrigger>
                     <SelectContent>{countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
                 <div>
                   <Label htmlFor="city" className="mb-2 block">المدينة</Label>
                   <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedCountry}>
                     <SelectTrigger id="city"><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                     <SelectContent>{cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
              </div>
               <div>
                 <Label htmlFor="category" className="mb-2 block">الفئة</Label>
                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                   <SelectTrigger id="category"><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
                   <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                 </Select>
               </div>
               <div>
                  <Label className="mb-2 block">طبيعة العمل</Label>
                  <Select value={selectedWorkType} onValueChange={setSelectedWorkType}>
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
      </Sheet>}
    </div>
  );
}
