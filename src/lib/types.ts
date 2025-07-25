import type { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
}

export type WorkType = 'full_time' | 'part_time' | 'freelance' | 'remote';
export type PostType = 'seeking_worker' | 'seeking_job';

export interface Job {
  id: string;
  userId: string;
  postType: PostType;
  title: string;
  categoryId?: string;
  categoryName?: string;
  country: string;
  city: string;
  workType: WorkType;
  description?: string;
  experience?: string;
  salary?: string;
  companyName?: string;
  openPositions?: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  rating: number;
  likes: number;
  postedAt: string; // This is a derived string like "2 days ago"
  createdAt: Timestamp;
  ownerName: string;
  ownerAvatarColor?: string;
  applyUrl?: string;
  qualifications?: string;
  conditions?: string;
  education?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  country?: string;
  city?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  avatarColor?: string;
  categoryId?: string;
  description?: string;
  createdAt?: Timestamp;
  gender?: 'male' | 'female';
}

export interface Testimonial {
    id: string;
    userId: string;
    userName: string;
    userAvatarColor: string;
    content: string;
    createdAt: Timestamp;
    postedAt: string;
}

export interface Country {
  name: string;
  cities: string[];
}
