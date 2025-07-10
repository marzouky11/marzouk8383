'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CategoryIcon } from '@/components/icons';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const cardStyle = {
    backgroundColor: `${category.color}20`, // 20 for ~12% opacity
    borderColor: category.color,
  };

  const iconStyle = {
    color: category.color,
  };

  return (
    <Link href={`/category/${category.id}`} className="group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl">
      <Card
        className="flex flex-col items-center justify-center text-center p-4 aspect-square transition-all duration-300 ease-in-out border-2 group-hover:scale-105 group-hover:shadow-lg"
        style={cardStyle}
      >
        <CategoryIcon name={category.iconName} className="w-8 h-8 sm:w-8 sm:h-8 transition-transform group-hover:-translate-y-1" style={iconStyle} />
        <p
          className="mt-2 font-semibold text-xs sm:text-sm leading-tight"
          style={{ color: category.color }}
        >
          {category.name}
        </p>
      </Card>
    </Link>
  );
}
