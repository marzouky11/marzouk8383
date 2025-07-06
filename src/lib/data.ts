import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, addDoc, serverTimestamp, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import type { Job, Category, Country, PostType, User, WorkType } from './types';

const colorThemes = {
  stone: { text: 'text-stone-600 dark:text-stone-400', bg: 'bg-stone-100 dark:bg-stone-900/50', button: 'bg-stone-600 text-primary-foreground hover:bg-stone-700', border: 'border-stone-600' },
  sky: { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/50', button: 'bg-sky-600 text-primary-foreground hover:bg-sky-700', border: 'border-sky-600' },
  teal: { text: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/50', button: 'bg-teal-600 text-primary-foreground hover:bg-teal-700', border: 'border-teal-600' },
  rose: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/50', button: 'bg-rose-600 text-primary-foreground hover:bg-rose-700', border: 'border-rose-600' },
  orange: { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/50', button: 'bg-orange-600 text-primary-foreground hover:bg-orange-700', border: 'border-orange-600' },
  emerald: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/50', button: 'bg-emerald-600 text-primary-foreground hover:bg-emerald-700', border: 'border-emerald-600' },
  violet: { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/50', button: 'bg-violet-600 text-primary-foreground hover:bg-violet-700', border: 'border-violet-600' },
  lime: { text: 'text-lime-600 dark:text-lime-400', bg: 'bg-lime-100 dark:bg-lime-900/50', button: 'bg-lime-600 text-primary-foreground hover:bg-lime-700', border: 'border-lime-600' },
  fuchsia: { text: 'text-fuchsia-600 dark:text-fuchsia-400', bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/50', button: 'bg-fuchsia-600 text-primary-foreground hover:bg-fuchsia-700', border: 'border-fuchsia-600' },
  indigo: { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/50', button: 'bg-indigo-600 text-primary-foreground hover:bg-indigo-700', border: 'border-indigo-600' },
  amber: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/50', button: 'bg-amber-600 text-primary-foreground hover:bg-amber-700', border: 'border-amber-600' },
};


const categories: Category[] = [
  { id: '1', name: 'نجار', iconName: 'Hammer', colorClasses: colorThemes.stone },
  { id: '2', name: 'حداد', iconName: 'Wrench', colorClasses: colorThemes.stone },
  { id: '3', name: 'سباك', iconName: 'ShowerHead', colorClasses: colorThemes.sky },
  { id: '4', name: 'كهربائي منازل', iconName: 'Zap', colorClasses: colorThemes.sky },
  { id: '5', name: 'كهربائي سيارات', iconName: 'Car', colorClasses: colorThemes.sky },
  { id: '6', name: 'فني تبريد وتكييف', iconName: 'AirVent', colorClasses: colorThemes.sky },
  { id: '7', name: 'فني صيانة هواتف', iconName: 'Smartphone', colorClasses: colorThemes.indigo },
  { id: '8', name: 'خياط', iconName: 'Scissors', colorClasses: colorThemes.rose },
  { id: '9', name: 'مصمم أزياء', iconName: 'Shirt', colorClasses: colorThemes.rose },
  { id: '10', name: 'صباغ', iconName: 'Paintbrush', colorClasses: colorThemes.violet },
  { id: '11', name: 'بناء', iconName: 'HardHat', colorClasses: colorThemes.stone },
  { id: '12', name: 'عامل بلاط', iconName: 'Layers', colorClasses: colorThemes.stone },
  { id: '13', name: 'عامل زليج', iconName: 'Layers', colorClasses: colorThemes.stone },
  { id: '14', name: 'ميكانيكي سيارات', iconName: 'Wrench', colorClasses: colorThemes.stone },
  { id: '15', name: 'سائق شاحنة', iconName: 'Truck', colorClasses: colorThemes.emerald },
  { id: '16', name: 'سائق تاكسي', iconName: 'Car', colorClasses: colorThemes.emerald },
  { id: '17', name: 'سائق توصيل', iconName: 'Bike', colorClasses: colorThemes.emerald },
  { id: '18', name: 'فلاح', iconName: 'Sprout', colorClasses: colorThemes.lime },
  { id: '19', name: 'راعي غنم', iconName: 'PersonStanding', colorClasses: colorThemes.lime },
  { id: '20', name: 'جزّار', iconName: 'ChefHat', colorClasses: colorThemes.orange },
  { id: '21', name: 'خبّاز', iconName: 'CookingPot', colorClasses: colorThemes.orange },
  { id: '22', name: 'طباخ', iconName: 'ChefHat', colorClasses: colorThemes.orange },
  { id: '23', name: 'حلواني', iconName: 'Cake', colorClasses: colorThemes.orange },
  { id: '24', name: 'منظف منازل', iconName: 'SprayCan', colorClasses: colorThemes.teal },
  { id: '25', name: 'منظف مكاتب', iconName: 'SprayCan', colorClasses: colorThemes.teal },
  { id: '26', name: 'مربية أطفال', iconName: 'Baby', colorClasses: colorThemes.rose },
  { id: '27', name: 'عاملة منزلية', iconName: 'Home', colorClasses: colorThemes.teal },
  { id: '28', name: 'حارس أمن', iconName: 'Shield', colorClasses: colorThemes.indigo },
  { id: '29', name: 'عامل مستودع', iconName: 'Package', colorClasses: colorThemes.amber },
  { id: '30', name: 'نجار ألمنيوم', iconName: 'Hammer', colorClasses: colorThemes.stone },
  { id: '31', name: 'عامل حدادة فنية', iconName: 'Wrench', colorClasses: colorThemes.stone },
  { id: '32', name: 'نجار ديكور', iconName: 'Hammer', colorClasses: colorThemes.stone },
  { id: '33', name: 'رسام جداريات', iconName: 'Paintbrush', colorClasses: colorThemes.violet },
  { id: '34', name: 'عامل في مصنع', iconName: 'Factory', colorClasses: colorThemes.amber },
  { id: '35', name: 'عامل في المخابز', iconName: 'CookingPot', colorClasses: colorThemes.orange },
  { id: '36', name: 'معلم شاورما', iconName: 'ChefHat', colorClasses: colorThemes.orange },
  { id: '37', name: 'معلم مشاوي', iconName: 'ChefHat', colorClasses: colorThemes.orange },
  { id: '38', name: 'عامل مقهى', iconName: 'Coffee', colorClasses: colorThemes.orange },
  { id: '39', name: 'عامل مطعم', iconName: 'Utensils', colorClasses: colorThemes.orange },
  { id: '40', name: 'عامل غسيل سيارات', iconName: 'Car', colorClasses: colorThemes.sky },
  { id: '41', name: 'فني ألواح شمسية', iconName: 'Sun', colorClasses: colorThemes.sky },
  { id: '42', name: 'معلم سيراميك', iconName: 'Layers', colorClasses: colorThemes.stone },
  { id: '43', name: 'صانع أحذية', iconName: 'Briefcase', colorClasses: colorThemes.rose },
  { id: '44', name: 'فني إصلاح أثاث', iconName: 'Wrench', colorClasses: colorThemes.stone },
  { id: '45', name: 'عامل توصيل طلبات', iconName: 'Bike', colorClasses: colorThemes.emerald },
  { id: '46', name: 'حلاق رجالي', iconName: 'Scissors', colorClasses: colorThemes.rose },
  { id: '47', name: 'حلاقة نسائية', iconName: 'Scissors', colorClasses: colorThemes.rose },
  { id: '48', name: 'فني كاميرات مراقبة', iconName: 'Camera', colorClasses: colorThemes.indigo },
  { id: '49', name: 'فني حواسيب', iconName: 'Laptop', colorClasses: colorThemes.indigo },
  { id: '50', name: 'فني طباعة وتصوير', iconName: 'Printer', colorClasses: colorThemes.indigo },
  { id: '51', name: 'بائع متجول', iconName: 'ShoppingCart', colorClasses: colorThemes.fuchsia },
  { id: '52', name: 'بائع في متجر', iconName: 'Store', colorClasses: colorThemes.fuchsia },
  { id: '53', name: 'مساعد بائع', iconName: 'Store', colorClasses: colorThemes.fuchsia },
  { id: '54', name: 'موظف كاشير', iconName: 'Calculator', colorClasses: colorThemes.fuchsia },
  { id: '55', name: 'عامل تعبئة وتغليف', iconName: 'Package', colorClasses: colorThemes.amber },
  { id: '56', name: 'معلم حدائق وتشجير', iconName: 'Sprout', colorClasses: colorThemes.lime },
  { id: '57', name: 'مبلط', iconName: 'Layers', colorClasses: colorThemes.stone },
  { id: '58', name: 'دهّان', iconName: 'Paintbrush', colorClasses: colorThemes.violet },
  { id: '59', name: 'نجّار أثاث', iconName: 'Hammer', colorClasses: colorThemes.stone },
  { id: '60', name: 'مرمم أثاث قديم', iconName: 'Wrench', colorClasses: colorThemes.stone },
  { id: '61', name: 'تقني إصلاح أجهزة كهربائية', iconName: 'CircuitBoard', colorClasses: colorThemes.sky },
  { id: '62', name: 'خبير أعشاب طبيعية', iconName: 'Leaf', colorClasses: colorThemes.lime },
  { id: '63', name: 'صانع مواد تنظيف', iconName: 'SprayCan', colorClasses: colorThemes.teal },
  { id: '64', name: 'مشغل آلات صناعية', iconName: 'Factory', colorClasses: colorThemes.amber },
  { id: '65', name: 'عامل نقل أثاث', iconName: 'Truck', colorClasses: colorThemes.emerald },
  { id: '66', name: 'عامل نظافة شوارع', iconName: 'Trash2', colorClasses: colorThemes.teal },
  { id: '67', name: 'عامل مغسلة ملابس', iconName: 'Shirt', colorClasses: colorThemes.teal },
  { id: '68', name: 'موزع إعلانات', iconName: 'Megaphone', colorClasses: colorThemes.indigo }
];

const countries: Country[] = [
    { name: 'المغرب', cities: ['الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'طنجة', 'أكادير', 'مكناس', 'وجدة', 'القنيطرة', 'تطوان', 'العيون', 'المحمدية', 'الجديدة', 'آسفي', 'خريبكة', 'بني ملال', 'الناظور', 'تازة', 'سطات', 'برشيد'] },
    { name: 'الجزائر', cities: ['الجزائر العاصمة', 'وهران', 'قسنطينة', 'عنابة', 'سطيف', 'باتنة', 'البليدة', 'تلمسان', 'بجاية', 'سكيكدة', 'تيزي وزو', 'الأغواط', 'بسكرة', 'ورقلة', 'تبسة', 'مستغانم', 'معسكر', 'برج بوعريريج', 'الشلف', 'الجلفة'] },
    { name: 'تونس', cities: ['تونس العاصمة', 'صفاقس', 'سوسة', 'القيروان', 'بنزرت', 'قابس', 'أريانة', 'قفصة', 'المنستير', 'نابل', 'مدنين', 'بن عروس', 'القصرين', 'سيدي بوزيد', 'جندوبة', 'تطاوين', 'المهدية', 'الكاف', 'سليانة', 'زغوان'] },
    { name: 'مصر', cities: ['القاهرة', 'الإسكندرية', 'الجيزة', 'الأقصر', 'أسوان', 'شرم الشيخ', 'الغردقة', 'المنصورة', 'طنطا', 'الزقازيق', 'الإسماعيلية', 'السويس', 'بورسعيد', 'دمياط', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا'] },
    { name: 'السعودية', cities: ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران', 'الطائف', 'تبوك', 'بريدة', 'حائل', 'أبها', 'خميس مشيط', 'جازان', 'نجران', 'ينبع', 'الجبيل', 'الهفوف', 'الباحة', 'سكاكا'] },
    { name: 'الإمارات', cities: ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين', 'العين', 'خورفكان', 'دبا الحصن'] },
    { name: 'الأردن', cities: ['عمان', 'الزرقاء', 'إربد', 'العقبة', 'السلط', 'الكرك', 'مأدبا', 'الرمثا', 'جرش', 'معان', 'الطفيلة', 'المفرق'] },
    { name: 'لبنان', cities: ['بيروت', 'طرابلس', 'صيدا', 'صور', 'جونيه', 'زحلة', 'بعلبك', 'النبطية', 'جبيل'] },
    { name: 'سوريا', cities: ['دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس', 'دير الزور', 'الرقة', 'إدلب', 'السويداء'] },
    { name: 'العراق', cities: ['بغداد', 'البصرة', 'الموصل', 'أربيل', 'السليمانية', 'كركوك', 'النجف', 'كربلاء', 'دهوك', 'الرمادي', 'الفلوجة', 'سامراء', 'الحلة'] },
    { name: 'الكويت', cities: ['مدينة الكويت', 'الأحمدي', 'حولي', 'السالمية', 'الفروانية', 'الجهراء'] },
    { name: 'قطر', cities: ['الدوحة', 'الريان', 'الوكرة', 'الخور', 'أم صلال محمد', 'مدينة الشمال'] },
    { name: 'البحرين', cities: ['المنامة', 'المحرق', 'الرفاع', 'مدينة حمد', 'مدينة عيسى', 'سترة'] },
    { name: 'عمان', cities: ['مسقط', 'صلالة', 'صحار', 'نزوى', 'صور', 'البريمي', 'عبري'] },
    { name: 'اليمن', cities: ['صنعاء', 'عدن', 'تعز', 'الحديدة', 'المكلا', 'إب', 'ذمار'] },
    { name: 'السودان', cities: ['الخرطوم', 'أم درمان', 'بورتسودان', 'كسلا', 'الأبيض', 'كوستي', 'ود مدني', 'القضارف'] },
    { name: 'ليبيا', cities: ['طرابلس', 'بنغازي', 'مصراتة', 'البيضاء', 'سبها', 'طبرق', 'سرت'] },
];

function formatTimeAgo(timestamp: any) {
  if (!timestamp || !timestamp.toDate) {
    return 'غير معروف';
  }
  const date = timestamp.toDate();
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return `قبل ${Math.floor(interval)} سنوات`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `قبل ${Math.floor(interval)} أشهر`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `قبل ${Math.floor(interval)} أيام`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `قبل ${Math.floor(interval)} ساعات`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `قبل ${Math.floor(interval)} دقائق`;
  }
  return 'الآن';
}


export async function getJobs(
  options: {
    postType?: PostType;
    count?: number;
    searchQuery?: string;
    country?: string;
    city?: string;
    categoryId?: string;
    workType?: WorkType;
    sortBy?: 'newest';
  } = {}
): Promise<Job[]> {
  try {
    const {
      postType,
      count,
      searchQuery,
      country,
      city,
      categoryId,
      workType,
      sortBy = 'newest',
    } = options;

    const adsRef = collection(db, 'ads');
    // We construct a simpler query for Firestore to avoid needing complex composite indexes
    // that must be created manually in the Firebase Console.
    const queryConstraints: any[] = [];

    if (postType) {
      queryConstraints.push(where('postType', '==', postType));
    }
    
    // Sorting by date is a primary requirement.
    if (sortBy === 'newest') {
      queryConstraints.push(orderBy('createdAt', 'desc'));
    }

    // The limit is only used on the homepage, which doesn't have other filters.
    if (count) {
      queryConstraints.push(limit(count));
    }

    const q = query(adsRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    let jobs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            postedAt: formatTimeAgo(data.createdAt),
        } as Job;
    });

    // We apply the more specific filters here in the code.
    // This is a common pattern to work around database index limitations during development.
    if (country) {
        jobs = jobs.filter(job => job.country === country);
    }
    if (city) {
        jobs = jobs.filter(job => job.city === city);
    }
    if (categoryId) {
        jobs = jobs.filter(job => job.categoryId === categoryId);
    }
    if (workType) {
        jobs = jobs.filter(job => job.workType === workType);
    }
    if (searchQuery) {
        jobs = jobs.filter(job => 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    // If you see Firestore errors about indexes, you may need to create them in the Firebase console.
    // This is a common issue when adding complex queries.
    return [];
  }
}

export async function getJobsByUserId(userId: string): Promise<Job[]> {
    try {
        const adsRef = collection(db, 'ads');
        const q = query(adsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            postedAt: formatTimeAgo(doc.data().createdAt),
        } as Job));
    } catch (error) {
        console.error("Error fetching jobs by user ID: ", error);
        return [];
    }
}


export async function getJobById(id: string): Promise<Job | null> {
  try {
    const docRef = doc(db, 'ads', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
          id: docSnap.id, 
          ...data,
          postedAt: formatTimeAgo(data.createdAt),
     } as Job;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching job by ID: ", error);
    return null;
  }
}

// Post a new job to Firestore
export async function postJob(jobData: Omit<Job, 'id' | 'createdAt' | 'likes' | 'rating' | 'postedAt'>): Promise<{ id: string }> {
    try {
        const adsCollection = collection(db, 'ads');
        const newDocRef = doc(adsCollection); // Create a new doc reference with a unique ID
        const id = newDocRef.id;

        const newJob = {
            ...jobData,
            createdAt: serverTimestamp(),
            likes: 0,
            rating: parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)),
        };

        await setDoc(newDocRef, newJob);
        return { id };
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to post job");
    }
}

export async function updateAd(adId: string, adData: Partial<Job>) {
    try {
        const adRef = doc(db, 'ads', adId);
        
        const dataToUpdate: any = {
            ...adData,
            updatedAt: serverTimestamp()
        };

        await updateDoc(adRef, dataToUpdate);
    } catch (e) {
        console.error("Error updating ad: ", e);
        throw new Error("Failed to update ad");
    }
}

export async function deleteAd(adId: string) {
    try {
        const adRef = doc(db, 'ads', adId);
        await deleteDoc(adRef);
    } catch (e) {
        console.error("Error deleting ad: ", e);
        throw new Error("Failed to delete ad");
    }
}


export async function updateUserProfile(uid: string, profileData: Partial<User>) {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error updating user profile: ", e);
        throw new Error("Failed to update profile");
    }
}

export async function hasUserLikedJob(jobId: string, userId: string): Promise<boolean> {
    const interestRef = doc(db, 'interests', `${userId}_${jobId}`);
    const interestDoc = await getDoc(interestRef);
    return interestDoc.exists();
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
