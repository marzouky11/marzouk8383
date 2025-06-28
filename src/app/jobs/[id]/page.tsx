import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, Clipboard, MapPin, DollarSign, Hammer, Globe, Building } from 'lucide-react';
import { getJobById, getCategoryById } from '@/lib/data';
import type { Job } from '@/lib/types';
import { CopyButton } from './copy-button';

const workTypeTranslations: { [key in Job['workType']]: string } = {
  daily: 'يومي',
  monthly: 'شهري',
  project: 'مشروع',
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = getJobById(params.id);

  if (!job) {
    notFound();
  }

  const category = getCategoryById(job.categoryId);

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div className="flex-grow">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value || 'غير محدد'}</p>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">{job.title}</CardTitle>
            {category && <Badge variant="secondary" className="w-fit mt-2">{category.name}</Badge>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow icon={Globe} label="الدولة" value={job.country} />
              <InfoRow icon={MapPin} label="المدينة" value={job.city} />
              <InfoRow icon={DollarSign} label="الأجر" value={job.salary} />
              <InfoRow icon={Hammer} label="طبيعة العمل" value={workTypeTranslations[job.workType]} />
              <InfoRow icon={Phone} label="رقم الهاتف" value={job.phone} />
              <InfoRow icon={MessageSquare} label="رقم واتساب" value={job.whatsapp} />
            </div>

            {job.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">وصف العمل</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 pt-4">
              <Button asChild className="bg-accent hover:bg-accent/90">
                <a href={`tel:${job.phone}`}>
                  <Phone className="ml-2 h-4 w-4" />
                  اتصال
                </a>
              </Button>
              <CopyButton textToCopy={job.phone} />
              <Button asChild variant="outline">
                <a href={`https://wa.me/${job.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="ml-2 h-4 w-4" />
                  واتساب
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
