'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Plus, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/jobs', label: 'الوظائف', icon: Briefcase },
  { href: '/post-job/select-type', label: 'إضافة', icon: Plus, isFab: true },
  { href: '/workers', label: 'العمال', icon: Users },
  { href: '/profile', label: 'الإعدادات', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState(pathname);
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    
    // If navigating to a job detail page, preserve the previous section's active state
    if (pathname.startsWith('/jobs/') && (previousPathname.startsWith('/jobs') || previousPathname.startsWith('/workers'))) {
        setActiveHref(previousPathname.startsWith('/workers') ? '/workers' : '/jobs');
    } else {
        // For all other navigation, update the active href based on the current path
        let currentActive = '/'; // Default to home
        for (const item of navItems) {
            if (item.href !== '/' && pathname.startsWith(item.href)) {
                currentActive = item.href;
                break;
            }
        }
        setActiveHref(currentActive);
    }

    previousPathnameRef.current = pathname;
  }, [pathname]);

  return (
    <footer className="fixed bottom-0 left-0 z-40 w-full h-20 bg-transparent md:hidden">
      <div className="relative flex items-center justify-around h-16 mx-4 bg-card border rounded-2xl shadow-lg">
        {navItems.map((item, index) => {
          const isActive = item.href === activeHref;
          
          if (item.isFab) {
            return (
              <div key={item.href} className="relative -top-8 z-50">
                 <Link href={item.href} className="block">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg border-4 border-background">
                        <Plus className="w-8 h-8 text-primary-foreground" />
                    </div>
                </Link>
              </div>
            );
          }
          
          const isPlaceholder = index === 2;
          if (isPlaceholder) {
              return <div key="placeholder" className="w-16 h-16" />;
          }

          return (
            <Link href={item.href} key={item.href} className="flex-1">
              <div className="flex flex-col items-center justify-center gap-1 relative">
                <item.icon
                  className={cn(
                    'h-6 w-6 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
