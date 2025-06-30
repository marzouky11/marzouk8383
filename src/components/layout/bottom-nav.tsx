'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Plus, Users, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/jobs', label: 'الوظائف', icon: Briefcase },
    { href: '/post-job', label: 'إضافة', icon: Plus, isCentral: true },
    { href: '/workers', label: 'العمال', icon: Users },
    { href: '/profile', label: 'الإشعارات', icon: Bell, hasNotification: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t shadow-[0_-1px_10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="container h-full">
        <div className="relative flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);
            if (item.isCentral) {
              return (
                <Link href={item.href} key={item.href} className="absolute left-1/2 -translate-x-1/2 -top-6 z-10">
                  <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center shadow-lg border-4 border-background">
                    <item.icon className="h-8 w-8" />
                  </div>
                </Link>
              );
            }
            return (
              <Link href={item.href} key={item.href} className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 relative h-full pt-2",
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                <div className="relative">
                  <item.icon className="h-6 w-6" />
                  {item.hasNotification && (
                     <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
                        <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-600 text-white text-[10px] font-bold">N</span>
                     </span>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
                 {isActive && (
                    <div className="absolute bottom-2 h-1 w-8 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
