'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Handshake, Sun, ArrowRight } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const mainHeaderPaths = ['/jobs', '/workers', '/post-job', '/profile'];
  const isMainPage = mainHeaderPaths.includes(pathname);
  
  // This is a sub-page if it's not a main page and not the homepage
  const isSubPage = !mainHeaderPaths.includes(pathname) && pathname !== '/';

  if (isSubPage) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center">
          <div className="flex-1 flex justify-start">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowRight className="h-5 w-5" />
              <span className="sr-only">رجوع</span>
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Zafay</h1>
            </Link>
          </div>
          <div className="flex-1" /> {/* Spacer */}
        </div>
      </header>
    );
  }

  // This is the main header for pages like /jobs, /profile etc.
  // The homepage ('/') uses showHeader={false} so this won't render there.
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container flex h-20 items-center justify-between">
        <Button variant="ghost" size="icon">
          <Sun className="h-6 w-6" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Zafay</h1>
          <p className="text-xs opacity-80">منصة الربط بين العمال وأصحاب العمل</p>
        </div>
        <Link href="/profile">
          <div className="p-2 bg-white/20 rounded-lg">
            <Handshake className="h-6 w-6 text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}