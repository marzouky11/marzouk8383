'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  LogOut,
  User as UserIcon,
  Handshake,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/jobs', label: 'الوظائف' },
    { href: '/workers', label: 'العمال' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData } = useAuth();
  const { toast } = useToast();


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'تم تسجيل الخروج بنجاح.' });
      router.push('/');
    } catch (error) {
      toast({ variant: 'destructive', title: 'حدث خطأ أثناء تسجيل الخروج.' });
    }
  };

  return (
      <header className="hidden md:block bg-card border-b sticky top-0 z-50">
          <nav className="container relative flex items-center justify-between h-20">
              <div className="flex items-center gap-8">
                  <Link href="/" className="flex items-center gap-2">
                      <Handshake className="h-7 w-7 text-primary" />
                      <span className="text-xl font-bold text-foreground">Zafay</span>
                  </Link>
                  <div className="flex items-center gap-6">
                      {navLinks.map((link) => {
                           const isActive = link.href === '/' ? pathname === link.href : pathname.startsWith(link.href);
                           return (
                             <Link
                              key={link.href}
                              href={link.href}
                              className={cn(
                                  'text-sm font-medium transition-colors hover:text-primary',
                                  isActive ? 'text-primary' : 'text-muted-foreground'
                              )}
                              >
                                  {link.label}
                              </Link>
                           );
                      })}
                  </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                  <Button asChild>
                      <Link href="/post-job">
                          <Plus className="ml-2 h-4 w-4" />
                          <span className="hidden sm:inline">نشر إعلان</span>
                      </Link>
                  </Button>
                  {user && userData ? (
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                                        <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    <p>{userData.name}</p>
                                    <p className="text-xs font-normal text-muted-foreground">{userData.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>الملف الشخصي</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>تسجيل الخروج</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                  ) : (
                      <div className="flex items-center gap-2">
                           <Button variant="outline" asChild>
                                <Link href="/login">تسجيل الدخول</Link>
                            </Button>
                            <Button asChild className="hidden sm:inline-flex">
                                <Link href="/signup">إنشاء حساب</Link>
                            </Button>
                      </div>
                  )}
              </div>
          </nav>
      </header>
  );
}
