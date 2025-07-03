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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Plus,
  LogOut,
  User as UserIcon,
  Handshake,
  Newspaper,
  Settings,
  Info,
  Shield,
  FileText,
  Phone,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ThemeToggleButton } from '../theme-toggle';
import { ProfileForm } from '../../app/profile/profile-form';
import { getCountries, getCategories } from '@/lib/data';

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

  const countries = getCountries();
  const categories = getCategories();

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
      <Sheet>
        <header className="hidden md:block bg-card border-b sticky top-0 z-50">
            <nav className="container relative flex items-center justify-between h-20">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Handshake className="h-7 w-7 text-primary" />
                        <span className="text-xl font-bold text-foreground">توظيفك</span>
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
                    <Button variant="ghost" asChild>
                        <Link href="/articles" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                            <Newspaper className="h-5 w-5" />
                            <span className="hidden sm:inline">مقالات</span>
                        </Link>
                    </Button>
                    <ThemeToggleButton />
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
                                        <AvatarImage src={userData.avatarUrl} alt={userData.name || 'User'} />
                                        <AvatarFallback>{userData.name ? userData.name.charAt(0) : 'U'}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    <p>{userData.name}</p>
                                    <p className="text-xs font-normal text-muted-foreground">{userData.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <SheetTrigger asChild>
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>تعديل الملف الشخصي</span>
                                    </DropdownMenuItem>
                                </SheetTrigger>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>إعدادات الحساب</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                      <Link href="/articles">
                                          <Newspaper className="mr-2 h-4 w-4" />
                                          <span>مقالات</span>
                                      </Link>
                                </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                      <Link href="/about">
                                          <Info className="mr-2 h-4 w-4" />
                                          <span>من نحن</span>
                                      </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                      <Link href="/privacy">
                                          <Shield className="mr-2 h-4 w-4" />
                                          <span>سياسة الخصوصية</span>
                                      </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                      <Link href="/terms">
                                          <FileText className="mr-2 h-4 w-4" />
                                          <span>شروط الاستخدام</span>
                                      </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                      <Link href="/contact">
                                          <Phone className="mr-2 h-4 w-4" />
                                          <span>اتصل بنا</span>
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
        {userData && (
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                 <Settings className="h-5 w-5 text-primary" />
                 تعديل الملف الشخصي
              </SheetTitle>
            </SheetHeader>
            <div className="py-4">
               <ProfileForm countries={countries} categories={categories} user={userData} />
            </div>
          </SheetContent>
        )}
      </Sheet>
  );
}
