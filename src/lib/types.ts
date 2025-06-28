import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export type WorkType = 'daily' | 'monthly' | 'project';

export interface Job {
  id: string;
  title: string;
  categoryId: string;
  country: string;
  city: string;
  salary: string;
  workType: WorkType;
  description?: string;
  phone: string;
  whatsapp: string;
  rating: number;
  isFavorite: boolean;
}

export interface User {
  name: string;
  country: string;
  city: string;
  phone: string;
  whatsapp: string;
}

export interface Country {
  name: string;
  cities: string[];
}
