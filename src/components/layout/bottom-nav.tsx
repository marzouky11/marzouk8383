
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Briefcase, Plus, Users, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/jobs', label: 'الوظائف', icon: Briefcase },
    { href: '/post-job', label: 'إضافة', icon: Plus, isCentral: true },
    { href: '/workers', label: 'العمال', icon: Users },
    { href: '/notifications', label: 'الإشعارات', icon: Bell, hasBadge: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t shadow-[0_-1px_10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="container h-full">
        <div className="relative flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
                "flex flex-col items-center justify-center gap-1 flex-1 relative",
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
                {item.hasBadge && (
                    <div className="absolute top-0 right-1/2 mr-[-18px] w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-card">N</div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
