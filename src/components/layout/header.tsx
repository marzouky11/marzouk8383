import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Handshake, Sun } from 'lucide-react';

export function Header() {
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
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Handshake className="h-6 w-6 text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}
