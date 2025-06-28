'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Briefcase,
  Users,
  Settings,
  Plus,
  FileText,
  Handshake,
} from 'lucide-react';

const pageConfig: { [key: string]: { title: string; icon: React.ElementType } } = {
  '/jobs': { title: 'الوظائف', icon: Briefcase },
  '/workers': { title: 'العمال', icon: Users },
  '/profile': { title: 'الإعدادات', icon: Settings },
  '/post-job': { title: 'نشر إعلان جديد', icon: Plus },
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === '/';

  let title = '';
  let Icon: React.ElementType | null = null;
  
  if (!isHomePage) {
    const config = Object.entries(pageConfig).find(([path]) => pathname.startsWith(path))?.[1];
    if (config) {
      title = config.title;
      Icon = config.icon;
    } else if (pathname.startsWith('/jobs/')) {
      title = 'تفاصيل الإعلان';
      Icon = FileText;
    }
  }

  return (
    <header className="bg-primary text-primary-foreground rounded-b-3xl shadow-lg relative z-20">
      <div className="container">
        {isHomePage ? (
          <div className="pt-4 pb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
                <Handshake className="h-7 w-7 text-white" />
                <h1 className="text-2xl font-bold">Zafay</h1>
            </div>
            <p className="text-xs opacity-80">منصة الربط بين العمال وأصحاب العمل</p>
          </div>
        ) : (
          <div className="flex h-20 items-center justify-center relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 text-primary-foreground hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowRight className="h-5 w-5" />
              <span className="sr-only">رجوع</span>
            </Button>
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-6 w-6" />}
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
