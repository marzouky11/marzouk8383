import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase, User } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Foras | فرص</span>
        </Link>
        <nav className="mr-auto flex items-center gap-4">
          <Button asChild>
            <Link href="/post-job">انشر إعلان</Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">الملف الشخصي</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
