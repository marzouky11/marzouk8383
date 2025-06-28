import type { Job, Category, Country } from './types';

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
  },
  {
    id: '2',
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
  },
  {
    id: '3',
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
  },
  {
    id: '4',
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
  },
  {
    id: '5',
    title: 'مصمم جرافيك لمشروع',
    categoryId: '5',
    country: 'الأردن',
    city: 'عمان',
    salary: '400 دينار',
    workType: 'project',
    description: 'تصميم هوية بصرية كاملة لشركة ناشئة. العمل عن بعد.',
    phone: '+962791234567',
    whatsapp: '+962791234567',
    rating: 4.9,
    likes: 8,
    isFavorite: false,
  },
  {
    id: '6',
    title: 'عامل توصيل طلبات',
    categoryId: '7',
    country: 'المغرب',
    city: 'الدار البيضاء',
    salary: '150 درهم',
    workType: 'daily',
    description: 'توصيل طلبات لمطعم في المعاريف. يشترط توفر دراجة نارية.',
    phone: '+212623456789',
    whatsapp: '+212623456789',
    rating: 4.0,
    likes: 18,
    isFavorite: true,
  },
   {
    id: '7',
    title: 'حلاق محترف',
    categoryId: '10',
    country: 'المغرب',
    city: 'الدار البيضاء',
    salary: '3000 درهم',
    workType: 'monthly',
    description: 'مطلوب حلاق محترف لصالون في وسط المدينة. خبرة لا تقل عن سنتين.',
    phone: '+212611223344',
    whatsapp: '+212611223344',
    rating: 4.6,
    likes: 19,
    isFavorite: false,
  },
];

export function getJobs() {
  return jobs;
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
