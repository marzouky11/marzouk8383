
'use client';

import React, { useState, useEffect } from 'react';
import { CategoryCard } from './category-card';
import type { Category } from '@/lib/types';
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CategorySectionProps {
  categories: Category[];
}

const INITIAL_MOBILE_COUNT = 6;

export function CategorySection({ categories }: CategorySectionProps) {
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    return null;
  }
  
  const handleShowAll = () => {
    setShowAll(true);
  };
  
  const displayedCategories = isMobile && !showAll
    ? categories.slice(0, INITIAL_MOBILE_COUNT)
    : categories;

  const showMoreButtonVisible = isMobile && !showAll && categories.length > INITIAL_MOBILE_COUNT;

  return (
    <section>
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          تصفح حسب الفئة
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {displayedCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      {showMoreButtonVisible && (
        <div className="mt-6 text-center">
          <Button onClick={handleShowAll} variant="outline">
            عرض كل الفئات
          </Button>
        </div>
      )}
    </section>
  );
}
