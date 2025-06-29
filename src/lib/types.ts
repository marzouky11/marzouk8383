import type { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export type WorkType = 'daily' | 'monthly' | 'project';
export type PostType = 'seeking_worker' | 'seeking_job';

export interface Job {
  id: string;
  userId: string;
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
  postedAt: string; // This is a derived string like "2 days ago"
  createdAt: Timestamp;
  ownerName: string;
  ownerAvatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  country?: string;
  city?: string;
  phone?: string;
  whatsapp?: string;
  avatarUrl?: string;
  categoryId?: string;
  description?: string;
  createdAt?: Timestamp;
}

export interface Country {
  name: string;
  cities: string[];
}
