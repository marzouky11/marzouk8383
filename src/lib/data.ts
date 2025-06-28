import type { Job, Category, Country, PostType } from './types';

const categories: Category[] = [
  { id: '1', name: 'نجارة', iconName: 'Hammer' },
  { id: '2', name: 'كهرباء', iconName: 'Zap' },
  { id: '3', name: 'مطاعم', iconName: 'Utensils' },
  { id: '4', name: 'بناء', iconName: 'HardHat' },
  { id: '5', name: 'تصميم', iconName: 'PenTool' },
  { id: '6', name: 'تنظيف', iconName: 'SprayCan' },
  { id: '7', name: 'توصيل', iconName: 'Bike' },
  { id: '8', name: 'ميكانيكي', iconName: 'Wrench' },
  { id: '9', name: 'سائق', iconName: 'Car' },
  { id: '10', name: 'حلاقة', iconName: 'Scissors' },
];

const countries: Country[] = [
    { name: 'المغرب', cities: ['الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'طنجة'] },
    { name: 'مصر', cities: ['القاهرة', 'الإسكندرية', 'الجيزة', 'الأقصر'] },
    { name: 'السعودية', cities: ['الرياض', 'جدة', 'مكة', 'المدينة المنورة', 'الدمام'] },
    { name: 'الإمارات', cities: ['دبي', 'أبوظبي', 'الشارقة', 'عجمان'] },
    { name: 'الأردن', cities: ['عمان', 'الزرقاء', 'إربد', 'العقبة'] },
];

const jobs: Job[] = [
  {
    id: '1',
    postType: 'seeking_worker',
    title: 'مطلوب نجار محترف',
    categoryId: '1',
    country: 'المغرب',
    city: 'طنجة',
    salary: '200 درهم',
    workType: 'daily',
    description: 'مطلوب نجار محترف للعمل على مشروع أثاث فندقي. خبرة لا تقل عن 5 سنوات.',
    phone: '+212612345678',
    whatsapp: '+212612345678',
    rating: 4.5,
    likes: 23,
    isFavorite: true,
    postedAt: 'نشر قبل يومين',
    ownerName: 'شركة الأثاث العصري',
    ownerAvatar: 'https://placehold.co/100x100.png'
  },
  {
    id: '2',
    postType: 'seeking_worker',
    title: 'كهربائي للعمل الشهري',
    categoryId: '2',
    country: 'السعودية',
    city: 'الرياض',
    salary: '5000 ريال',
    workType: 'monthly',
    description: 'شركة مقاولات كبرى تبحث عن كهربائيين للعمل بنظام الراتب الشهري. توفر الشركة السكن والمواصلات.',
    phone: '+966512345678',
    whatsapp: '+966512345678',
    rating: 5,
    likes: 50,
    isFavorite: false,
    postedAt: 'نشر قبل أسبوع',
    ownerName: 'مقاولات المملكة',
    ownerAvatar: 'https://placehold.co/100x100.png'
  },
  {
    id: '3',
    postType: 'seeking_worker',
    title: 'طباخ في مطعم فاخر',
    categoryId: '3',
    country: 'الإمارات',
    city: 'دبي',
    salary: '7000 درهم إماراتي',
    workType: 'monthly',
    description: 'مطعم إيطالي في دبي مارينا يبحث عن شيف متخصص في المطبخ الإيطالي.',
    phone: '+971501234567',
    whatsapp: '+971501234567',
    rating: 4.8,
    likes: 12,
    isFavorite: true,
    postedAt: 'نشر قبل 5 أيام',
    ownerName: 'مطعم بيلا إيطاليا',
    ownerAvatar: 'https://placehold.co/100x100.png'
  },
  {
    id: '4',
    postType: 'seeking_worker',
    title: 'بناء محترف',
    categoryId: '4',
    country: 'مصر',
    city: 'القاهرة',
    salary: '300 جنيه',
    workType: 'daily',
    phone: '+201012345678',
    whatsapp: 'غير محدد',
    description: 'مطلوب عامل بناء محترف لمشروع بناء فيلا.',
    rating: 4.2,
    likes: 5,
    isFavorite: false,
    postedAt: 'نشر قبل 10 أيام',
    ownerName: 'أحمد المصري',
    ownerAvatar: 'https://placehold.co/100x100.png'
  },
  {
    id: '5',
    postType: 'seeking_job',
    title: 'مصمم جرافيك يبحث عن عمل',
    categoryId: '5',
    country: 'الأردن',
    city: 'عمان',
    salary: '400 دينار',
    workType: 'project',
    description: 'مصمم جرافيك بخبرة 3 سنوات في تصميم الهويات البصرية والمواد التسويقية، أبحث عن فرصة عمل لمشروع أو دوام كامل.',
    phone: '+962791234567',
    whatsapp: '+962791234567',
    rating: 4.9,
    likes: 8,
    isFavorite: false,
    postedAt: 'نشر اليوم',
    ownerName: 'سارة أحمد',
    ownerAvatar: 'https://placehold.co/100x100.png'
  },
  {
    id: '6',
    postType: 'seeking_job',
    title: 'سائق خاص يبحث عن وظيفة',
    categoryId: '9',
    country: 'المغرب',
    city: 'الدار البيضاء',
    salary: '4000 درهم',
    workType: 'monthly',
    description: 'سائق خاص بخبرة في شوارع الدار البيضاء، أمتلك رخصة سياقة وألتزم بالمواعيد.',
    phone: '+212623456789',
    whatsapp: '+212623456789',
    rating: 4.0,
    likes: 18,
    isFavorite: true,
    postedAt: 'نشر قبل 3 ساعات',
    ownerName: 'يوسف العلمي',
    ownerAvatar: 'https://placehold.co/100x100.png'
  },
   {
    id: '7',
    postType: 'seeking_job',
    title: 'حلاق محترف جاهز للعمل',
    categoryId: '10',
    country: 'المغرب',
    city: 'الدار البيضاء',
    salary: 'حسب الاتفاق',
    workType: 'monthly',
    description: 'حلاق محترف بخبرة في أحدث القصات والتسريحات، أبحث عن فرصة عمل في صالون راقٍ.',
    phone: '+212611223344',
    whatsapp: '+212611223344',
    rating: 4.6,
    likes: 19,
    isFavorite: false,
    postedAt: 'نشر قبل 4 أيام',
    ownerName: 'كريم التازي',
    ownerAvatar: 'https://placehold.co/100x100.png'
  },
];

export function getJobs(postType?: PostType) {
  if (!postType) return jobs;
  return jobs.filter((job) => job.postType === postType);
}

export function getJobById(id: string) {
  return jobs.find((job) => job.id === id);
}

export function getCategories() {
  return categories;
}

export function getCategoryById(id: string) {
    return categories.find((cat) => cat.id === id);
}

export function getCountries() {
    return countries;
}
