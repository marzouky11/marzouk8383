'use client';

import { useState, useEffect } from 'react';
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
import { getCountries } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Country } from '@/lib/types';


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const countries = getCountries();

  useEffect(() => {
    const countryData = countries.find((c: Country) => c.name === country);
    setCities(countryData ? countryData.cities : []);
    setCity(''); // Reset city when country changes
  }, [country, countries]);

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

      const maleAvatars = [
        'https://i.postimg.cc/T1G5NfVw/male-avatar-1.png',
        'https://i.postimg.cc/3JvB4AdB/male-avatar-2.png',
        'https://i.postimg.cc/7hM5xZ7f/male-avatar-3.png',
      ];
      const femaleAvatars = [
        'https://i.postimg.cc/qR8fW9dG/female-avatar-1.png',
        'https://i.postimg.cc/zX8ZgG6b/female-avatar-2.png',
        'https://i.postimg.cc/1zY12B4P/female-avatar-3.png',
      ];
      const avatars = gender === 'male' ? maleAvatars : femaleAvatars;
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];


      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        gender,
        country,
        city,
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
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="اختر الدولة" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Select value={city} onValueChange={setCity} disabled={!country}>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                  </SelectContent>
                </Select>
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
