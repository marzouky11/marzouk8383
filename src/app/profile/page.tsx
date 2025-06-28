import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProfileForm } from './profile-form';
import { getCountries } from '@/lib/data';

export default function ProfilePage() {
  const countries = getCountries();
  const user = {
    name: 'مستخدم جديد',
    country: 'المغرب',
    city: 'الدار البيضاء',
    phone: '+212600000000',
    whatsapp: '+212600000000',
  }

  return (
    <AppLayout>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>الملف الشخصي</CardTitle>
            <CardDescription>قم بتحديث معلومات ملفك الشخصي هنا.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm countries={countries} user={user} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
