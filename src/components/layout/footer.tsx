import Link from 'next/link';
import { Handshake } from 'lucide-react';

const footerLinks = [
    { label: 'من نحن', href: '/about' },
    { label: 'الأسئلة الشائعة', href: '/faq' },
    { label: 'اتصل بنا', href: '/contact' },
    { label: 'سياسة الخصوصية', href: '/privacy' },
    { label: 'شروط الاستخدام', href: '/terms' },
];

export function Footer() {
  return (
    <footer className="hidden md:block bg-card border-t mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-right gap-4">
            <div className="flex items-center gap-2">
                <Handshake className="h-6 w-6 text-primary" />
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} توظيفك. جميع الحقوق محفوظة.
                </p>
            </div>
          <div className="flex gap-x-6 gap-y-2 flex-wrap justify-center">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
