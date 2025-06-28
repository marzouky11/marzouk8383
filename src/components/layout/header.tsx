'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Users, Settings, Plus, FileText } from 'lucide-react';

const pageConfig: { [key: string]: { title: string; icon: React.ElementType } } = {
  '/jobs': { title: 'الوظائف', icon: Briefcase },
  '/workers': { title: 'العمال', icon: Users },
  '/profile': { title: 'الإعدادات', icon: Settings },
  '/post-job': { title: 'نشر إعلان جديد', icon: Plus },
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/') {
    return null;
  }

  let title = '';
  let Icon: React.ElementType | null = null;
  
  const config = pageConfig[pathname];

  if (config) {
    title = config.title;
    Icon = config.icon;
  } else if (pathname.startsWith('/jobs/')) {
    title = 'تفاصيل الإعلان';
    Icon = FileText;
  }

  if (!title) {
    return null; 
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-center relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4"
          onClick={() => router.back()}
        >
          <ArrowRight className="h-5 w-5" />
          <span className="sr-only">رجوع</span>
        </Button>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </div>
    </header>
  );
}
