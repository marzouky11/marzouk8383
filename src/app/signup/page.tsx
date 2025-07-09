'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2, UserPlus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MobilePageHeader } from '@/components/layout/mobile-page-header';


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
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
    if (!gender) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'الرجاء تحديد الجنس.' });
      return;
    }
    if (!country) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'الرجاء تحديد الدولة.' });
      return;
    }
    if (!city) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'الرجاء تحديد المدينة.' });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const colors = [
        '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', 
        '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        gender,
        country,
        city,
        avatarColor: randomColor,
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
      <MobilePageHeader title="إنشاء حساب جديد">
        <UserPlus className="h-5 w-5 text-primary" />
      </MobilePageHeader>
      <div className="container mx-auto max-w-md py-8">
        <Card>
          <CardHeader className="hidden md:block">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserPlus className="h-6 w-6 text-primary" />
              إنشاء حساب جديد
            </CardTitle>
          </CardHeader>
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

              <div className="space-y-3">
                <Label>الجنس</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value: 'male' | 'female') => setGender(value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal">ذكر</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal">أنثى</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">الدولة</Label>
                <Input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  placeholder="الدولة التي تقيم بها"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="المدينة التي تقيم بها"
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
