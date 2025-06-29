'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'تم تسجيل الدخول بنجاح!' });
      router.push('/profile');
    } catch (error: any) {
       let errorMessage = "الرجاء التحقق من البريد الإلكتروني أو كلمة المرور.";
       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
           errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
       }
      toast({
        variant: 'destructive',
        title: 'خطأ في تسجيل الدخول',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-md py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground mb-6">أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              ليس لديك حساب؟{' '}
              <Link href="/signup" className="text-primary hover:underline">
                أنشئ حسابًا جديدًا
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
