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
  ArrowRight,
  Briefcase,
  Users,
  Settings,
  Plus,
  FileText,
  Handshake,
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  Home,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const pageConfig: { [key: string]: { title: string; icon: React.ElementType } } = {
  '/': { title: 'الرئيسية', icon: Home },
  '/login': { title: 'تسجيل الدخول', icon: LogIn },
  '/signup': { title: 'إنشاء حساب', icon: UserPlus },
  '/jobs': { title: 'الوظائف', icon: Briefcase },
  '/workers': { title: 'العمال', icon: Users },
  '/profile': { title: 'الإعدادات', icon: Settings },
  '/post-job': { title: 'نشر إعلان جديد', icon: Plus },
};

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

  const isHomePage = pathname === '/';

  let title = '';
  let Icon: React.ElementType | null = null;
  
  // Find the most specific path configuration that matches the current pathname
  const pageInfo = Object.entries(pageConfig)
    .filter(([path]) => pathname.startsWith(path))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1];

  if (pageInfo) {
    title = pageInfo.title;
    Icon = pageInfo.icon;
  } else if (pathname.startsWith('/jobs/')) {
    title = 'تفاصيل الإعلان';
    Icon = FileText;
  }

  return (
    <>
      {/* Mobile Header (Unified) */}
      <header className="bg-primary text-primary-foreground rounded-b-3xl shadow-lg relative z-20 md:hidden">
        <div className="container">
           <div className="flex h-20 items-center justify-center relative">
              {!isHomePage && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 text-primary-foreground hover:bg-white/20"
                  onClick={() => router.back()}
                >
                  <ArrowRight className="h-5 w-5" />
                  <span className="sr-only">رجوع</span>
                </Button>
              )}
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-6 w-6" />}
                <h1 className="text-xl font-bold">{title}</h1>
              </div>
            </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block bg-card border-b sticky top-0 z-50">
          <nav className="container flex items-center justify-between h-20">
              <div className="flex items-center gap-8">
                  <Link href="/" className="flex items-center gap-2">
                      <Handshake className="h-7 w-7 text-primary" />
                      <span className="text-xl font-bold text-foreground">الخدمة الآن</span>
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

              <div className="flex items-center gap-4">
                  <Button asChild>
                      <Link href="/post-job">
                          <Plus className="ml-2 h-4 w-4" />
                          نشر إعلان
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
                            <Button asChild>
                                <Link href="/signup">إنشاء حساب</Link>
                            </Button>
                      </div>
                  )}
              </div>
          </nav>
      </header>
    </>
  );
}
