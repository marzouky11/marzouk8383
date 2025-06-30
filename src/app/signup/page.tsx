'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "كلمة المرور ضعيفة",
            description: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
        });
        return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const avatarId = Math.floor(Math.random() * 3) + 1;
      const randomAvatar = `https://i.postimg.cc/SNf0f4j6/avatar-${avatarId}.png`;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        avatarUrl: randomAvatar,
        createdAt: serverTimestamp(),
      });

      toast({ title: 'تم إنشاء الحساب بنجاح!' });
      router.push('/profile');
    } catch (error: any) {
      let errorMessage = "حدث خطأ غير متوقع.";
       if (error.code === 'auth/email-already-in-use') {
           errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل.";
       }
      toast({
        variant: 'destructive',
        title: 'خطأ في إنشاء الحساب',
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
            <p className="text-center text-sm text-muted-foreground mb-6">املأ النموذج أدناه للانضمام إلى المنصة.</p>
            <form onSubmit={handleSignup} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-primary hover:underline">
                سجل الدخول
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
