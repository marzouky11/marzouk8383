'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import type { Category, Job, PostType } from '@/lib/types';
import { postJob, updateAd } from '@/lib/data';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { 
  Loader2, Briefcase, Users, FileText, FileSignature, 
  LayoutGrid, Globe, MapPin, Wallet, Phone, MessageSquare, Mail,
  Building2, Award, Users2, Info, Instagram, GraduationCap, Link as LinkIcon,
  ClipboardList
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  postType: z.enum(['seeking_worker', 'seeking_job'], { required_error: 'الرجاء تحديد نوع الإعلان.' }),
  title: z.string().min(1, { message: 'اسم الإعلان مطلوب.' }),
  categoryId: z.string().optional(),
  customCategory: z.string().optional(),
  workType: z.enum(['full_time', 'part_time', 'freelance', 'remote'], { required_error: 'نوع العمل مطلوب.' }),
  companyName: z.string().optional(),
  country: z.string().min(1, { message: 'الدولة مطلوبة.' }),
  city: z.string().min(1, { message: 'المدينة مطلوبة.' }),
  salary: z.string().optional(),
  experience: z.string().optional(),
  qualifications: z.string().optional(),
  openPositions: z.coerce.number().int().positive().optional(),
  description: z.string().optional(),
  conditions: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صحيح." }).optional().or(z.literal('')),
  instagram: z.string().optional(),
  applyUrl: z.string().url({ message: 'الرجاء إدخال رابط صحيح' }).optional().or(z.literal('')),
}).refine(data => 
    (!!data.phone || !!data.whatsapp || !!data.email || !!data.instagram) || 
    (!!data.applyUrl && data.postType === 'seeking_worker'), {
  message: 'يجب توفير وسيلة تواصل واحدة على الأقل أو رابط للتقديم.',
  path: ['phone'],
});

interface PostJobFormProps {
  categories: Category[];
  job?: Job | null;
  preselectedType?: PostType;
}

export function PostJobForm({ categories, job, preselectedType }: PostJobFormProps) {
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const router = useRouter();
  const isEditing = !!job;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postType: job?.postType || preselectedType,
      title: job?.title || '',
      categoryId: job?.categoryId || '',
      customCategory: !job?.categoryId && job?.categoryName ? job.categoryName : '',
      country: job?.country || '',
      city: job?.city || '',
      workType: job?.workType || undefined,
      salary: job?.salary || '',
      experience: job?.experience || '',
      qualifications: job?.qualifications || '',
      companyName: job?.companyName || '',
      openPositions: job?.openPositions || undefined,
      description: job?.description || '',
      conditions: job?.conditions || '',
      phone: job?.phone || '',
      whatsapp: job?.whatsapp || '',
      email: job?.email || '',
      instagram: job?.instagram || '',
      applyUrl: job?.applyUrl || '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedType) {
      form.setValue('postType', preselectedType);
    }
  }, [preselectedType, form]);


  const postType = form.watch('postType');
  const categoryId = form.watch('categoryId');
  const customCategory = form.watch('customCategory');

  const selectedCategoryData = React.useMemo(() => {
    return categories.find(c => c.id === categoryId);
  }, [categoryId, categories]);
  
  const categoryThemeColor = selectedCategoryData?.color;


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !userData) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يجب عليك تسجيل الدخول أولاً.",
      });
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const { customCategory, ...restOfValues } = values;

      const dataToSave: { [key: string]: any } = { ...restOfValues };

      if (customCategory) {
          dataToSave.categoryName = customCategory;
          dataToSave.categoryId = undefined;
      } else if (values.categoryId) {
          const selectedCat = categories.find(c => c.id === values.categoryId);
          dataToSave.categoryName = selectedCat?.name;
      } else {
          dataToSave.categoryName = undefined;
          dataToSave.categoryId = undefined;
      }

      if (isEditing && job) {
        await updateAd(job.id, dataToSave);
        toast({
          title: "تم تحديث الإعلان بنجاح!",
          description: "تم حفظ التغييرات على إعلانك.",
        });
        router.push(`/profile`);
      } else {
        const newJobData = {
          userId: user.uid,
          ownerName: userData.name,
          ownerAvatarColor: userData.avatarColor,
          postType: values.postType,
          title: values.title,
          country: values.country,
          city: values.city,
          workType: values.workType,
          categoryId: dataToSave.categoryId,
          categoryName: dataToSave.categoryName,
          companyName: values.companyName,
          salary: values.salary,
          experience: values.experience,
          qualifications: values.qualifications,
          conditions: values.conditions,
          openPositions: values.openPositions,
          description: values.description,
          phone: values.phone,
          whatsapp: values.whatsapp,
          email: values.email,
          instagram: values.instagram,
          applyUrl: values.applyUrl,
        };

        const { id } = await postJob(newJobData);
        toast({
          title: "تم النشر بنجاح!",
          description: "تم نشر إعلانك وسيظهر في القسم المناسب.",
        });
        form.reset();
        router.push(`/jobs/${id}`);
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "خطأ",
        description: isEditing ? "فشل تحديث الإعلان." : "حدث خطأ أثناء نشر الإعلان.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const getThemeColor = () => {
    if (categoryThemeColor) return categoryThemeColor;
    if (postType === 'seeking_job') return 'hsl(var(--destructive))';
    if (postType === 'seeking_worker') return 'hsl(var(--accent))';
    return 'hsl(var(--primary))';
  }

  const FormLabelIcon = ({icon: Icon, label}: {icon: React.ElementType, label: string}) => (
    <FormLabel className="flex items-center gap-2">
      <Icon 
        className='h-4 w-4'
        style={{ color: getThemeColor() }}
      />
      {label}
    </FormLabel>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="postType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                 <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="hidden" // Visually hide the radio group
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="seeking_worker" />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem value="seeking_job" />
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <fieldset disabled={!postType} className="space-y-6 disabled:opacity-50">
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem><FormLabelIcon icon={FileText} label="عنوان الإعلان" /><FormControl><Input placeholder={postType === 'seeking_job' ? "مثال: مصمم جرافيك يبحث عن فرصة..." : "مثال: مطلوب مهندس مدني..."} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          
          <div className="space-y-4 border p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <FormLabelIcon icon={LayoutGrid} label="الفئة (اختياري)"/>
                {(categoryId || customCategory) && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        className="h-auto p-1 text-xs"
                        onClick={() => {
                            form.setValue('categoryId', '');
                            form.setValue('customCategory', '');
                        }}
                    >
                        مسح الاختيار
                    </Button>
                )}
            </div>
             <p className="text-sm text-muted-foreground -mt-2">
                اختر من القائمة أو أدخل فئة مخصصة. لا يمكن اختيار الاثنين معاً.
            </p>
            
            <FormField control={form.control} name="categoryId" render={({ field }) => (
              <FormItem>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value) {
                      form.setValue('customCategory', '');
                    }
                  }} 
                  value={field.value}
                  disabled={!!customCategory}
                >
                  <FormControl><SelectTrigger><SelectValue placeholder="اختر فئة العمل من القائمة" /></SelectTrigger></FormControl>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="relative flex items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-xs text-muted-foreground">أو</span>
                <div className="flex-grow border-t border-border"></div>
            </div>

            <FormField control={form.control} name="customCategory" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="أدخل فئة مخصصة إذا لم تجدها في القائمة" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value) {
                        form.setValue('categoryId', '');
                      }
                    }}
                    disabled={!!categoryId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>


          <FormField control={form.control} name="workType" render={({ field }) => (
            <FormItem><FormLabelIcon icon={Briefcase} label="نوع العمل" /><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع العمل" /></SelectTrigger></FormControl><SelectContent><SelectItem value="full_time">دوام كامل</SelectItem><SelectItem value="part_time">دوام جزئي</SelectItem><SelectItem value="freelance">عمل حر</SelectItem><SelectItem value="remote">عن بعد</SelectItem></SelectContent></Select><FormMessage /></FormItem>
          )} />

          {postType === 'seeking_worker' && (
            <FormField control={form.control} name="companyName" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Building2} label="اسم الشركة (اختياري)" /><FormControl><Input placeholder="اسم الشركة أو الجهة" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
          )}

          {postType === 'seeking_worker' && (
            <FormField control={form.control} name="applyUrl" render={({ field }) => (
              <FormItem><FormLabelIcon icon={LinkIcon} label="رابط التقديم (اختياري)" /><FormControl><Input type="url" placeholder="https://example.com/apply" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
          )}


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem><FormLabelIcon icon={Globe} label="الدولة" /><FormControl><Input placeholder="مثال: المغرب" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabelIcon icon={MapPin} label="المدينة"/><FormControl><Input placeholder="مثال: الدار البيضاء" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

           <FormField control={form.control} name="experience" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Award} label={postType === 'seeking_job' ? 'الخبرة' : 'الخبرة المطلوبة'} /><FormControl><Input placeholder="مثال: 5 سنوات، بدون خبرة..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
           )} />
           
           <FormField control={form.control} name="qualifications" render={({ field }) => (
              <FormItem><FormLabelIcon icon={GraduationCap} label={postType === 'seeking_job' ? 'الشهادات والمؤهلات' : 'المؤهلات المطلوبة (اختياري)'} /><FormControl><Input placeholder="مثال: بكالوريوس هندسة، دبلوم تقني..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="salary" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Wallet} label="الأجر (اختياري)" /><FormControl><Input placeholder="مثال: 5000 درهم / شهري" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            {postType === 'seeking_worker' && (
                <FormField control={form.control} name="openPositions" render={({ field }) => (
                    <FormItem><FormLabelIcon icon={Users2} label="الوظائف المتاحة (اختياري)" /><FormControl><Input
                      type="number"
                      placeholder="مثال: 3"
                      {...field}
                      value={field.value ?? ''}
                      onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl><FormMessage /></FormItem>
                )} />
            )}
          </div>
          
          {postType === 'seeking_worker' && (
            <FormField control={form.control} name="conditions" render={({ field }) => (
              <FormItem><FormLabelIcon icon={ClipboardList} label="الشروط (اختياري)" /><FormControl><Textarea placeholder="اكتب الشروط الإضافية هنا، مثل: العمر، توفر وسيلة نقل، أوقات العمل..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
          )}
          
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabelIcon icon={FileSignature} label={postType === 'seeking_job' ? "وصف المهارات والخبرة" : "وصف الوظيفة (اختياري)"}/><FormControl><Textarea placeholder={postType === 'seeking_job' ? "اكتب تفاصيل عن مهاراتك وخبراتك..." : "اكتب تفاصيل إضافية عن الوظيفة، المتطلبات، إلخ."} {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
          )} />

          <div className="border p-4 rounded-lg space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Info className="h-5 w-5" style={{color: getThemeColor()}} />طرق التواصل</h3>
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Phone} label="رقم الهاتف (اختياري)" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="whatsapp" render={({ field }) => (
              <FormItem><FormLabelIcon icon={MessageSquare} label="رقم واتساب (اختياري)" /><FormControl><Input placeholder="+xxxxxxxxxx" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Mail} label="البريد الإلكتروني (اختياري)" /><FormControl><Input type="email" placeholder="example@mail.com" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="instagram" render={({ field }) => (
              <FormItem><FormLabelIcon icon={Instagram} label="حساب إنستغرام (اختياري)" /><FormControl><Input placeholder="username" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full text-primary-foreground"
            style={{ backgroundColor: getThemeColor() }}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditing ? 'تحديث الإعلان' : 'نشر الإعلان'}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
