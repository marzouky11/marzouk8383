import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageSquare, MapPin, DollarSign, Hammer, Globe } from 'lucide-react';
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
    <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
      <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
      <div className="flex-grow">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-card-foreground">{value || 'غير محدد'}</p>
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="overflow-hidden border-2 border-border">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-2xl md:text-3xl font-bold">{job.title}</CardTitle>
            {category && <Badge variant="secondary" className="w-fit mt-2">{category.name}</Badge>}
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={Globe} label="الدولة" value={job.country} />
              <InfoRow icon={MapPin} label="المدينة" value={job.city} />
              <InfoRow icon={DollarSign} label="الأجر" value={job.salary} />
              <InfoRow icon={Hammer} label="طبيعة العمل" value={workTypeTranslations[job.workType]} />
            </div>

            {job.description && (
              <div className="space-y-3 pt-6 border-t">
                <h3 className="font-bold text-xl text-primary">وصف العمل</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{job.description}</p>
              </div>
            )}
            
            <div className="space-y-3 pt-6 border-t">
                <h3 className="font-bold text-xl text-primary">معلومات التواصل</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow icon={Phone} label="رقم الهاتف" value={job.phone} />
                    <InfoRow icon={MessageSquare} label="رقم واتساب" value={job.whatsapp} />
                 </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button asChild className="flex-grow bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={`https://wa.me/${job.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="ml-2 h-4 w-4" />
                  واتساب
                </a>
              </Button>
              <Button asChild className="flex-grow">
                <a href={`tel:${job.phone}`}>
                  <Phone className="ml-2 h-4 w-4" />
                  اتصال
                </a>
              </Button>
              <CopyButton textToCopy={job.phone} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
