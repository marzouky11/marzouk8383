import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export type WorkType = 'daily' | 'monthly' | 'project';
export type PostType = 'seeking_worker' | 'seeking_job';

export interface Job {
  id: string;
  postType: PostType;
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
  likes: number;
  isFavorite: boolean;
  postedAt: string;
  ownerName: string;
  ownerAvatar?: string;
}

export interface User {
  name: string;
  country: string;
  city: string;
  phone: string;
  whatsapp: string;
  avatarUrl?: string;
  categoryId?: string;
  description?: string;
}

export interface Country {
  name: string;
  cities: string[];
}
