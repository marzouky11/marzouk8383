
'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { Category, Country } from '@/lib/types';

interface JobFiltersProps {
  categories: Category[];
  countries: Country[];
}

export function JobFilters({ categories, countries }: JobFiltersProps) {
  return (
    <div className="relative">
      <Input
        placeholder="ابحث عن وظيفة، عامل، أو خدمة..."
        className="h-14 pl-12 pr-4 text-base rounded-lg shadow-lg border-none"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-primary rounded-md h-9 w-9 flex items-center justify-center">
        <Search className="h-5 w-5 text-primary-foreground" />
      </div>
    </div>
  );
}
