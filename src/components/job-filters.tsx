'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Category, Country } from '@/lib/types';

interface JobFiltersProps {
  categories: Category[];
  countries: Country[];
}

export function JobFilters({ categories, countries }: JobFiltersProps) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    if (selectedCountry) {
      const countryData = countries.find(c => c.name === selectedCountry);
      setCities(countryData ? countryData.cities : []);
      setSelectedCity('');
    } else {
      setCities([]);
    }
  }, [selectedCountry, countries]);

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="ابحث عن فرصة عمل..." className="pr-10" />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <SlidersHorizontal className="ml-2 h-4 w-4" />
              فرز
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">خيارات الفرز</h4>
                <p className="text-sm text-muted-foreground">
                  حدد الدولة والمدينة والفئة.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-1 items-center gap-2">
                  <Label htmlFor="country">الدولة</Label>
                  <Select onValueChange={setSelectedCountry}>
                    <SelectTrigger id="country" className="w-full">
                      <SelectValue placeholder="اختر الدولة" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>{country.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 items-center gap-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Select disabled={!selectedCountry} onValueChange={setSelectedCity}>
                    <SelectTrigger id="city" className="w-full">
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 items-center gap-2">
                  <Label htmlFor="category">الفئة</Label>
                  <Select>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>تطبيق الفرز</Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button className="shrink-0 bg-accent hover:bg-accent/90">بحث</Button>
      </div>
    </div>
  );
}
