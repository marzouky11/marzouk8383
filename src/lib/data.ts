import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, addDoc, serverTimestamp, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import type { Job, Category, Country, PostType, User, WorkType } from './types';

const categories: Category[] = [
  { id: '1', name: 'نجار', iconName: 'Hammer' },
  { id: '2', name: 'حداد', iconName: 'Wrench' },
  { id: '3', name: 'سباك', iconName: 'ShowerHead' },
  { id: '4', name: 'كهربائي منازل', iconName: 'Zap' },
  { id: '5', name: 'كهربائي سيارات', iconName: 'Car' },
  { id: '6', name: 'فني تبريد وتكييف', iconName: 'AirVent' },
  { id: '7', name: 'فني صيانة هواتف', iconName: 'Smartphone' },
  { id: '8', name: 'خياط', iconName: 'Scissors' },
  { id: '9', name: 'مصمم أزياء', iconName: 'Shirt' },
  { id: '10', name: 'صباغ', iconName: 'Paintbrush' },
  { id: '11', name: 'بناء', iconName: 'HardHat' },
  { id: '12', name: 'عامل بلاط', iconName: 'Layers' },
  { id: '13', name: 'عامل زليج', iconName: 'Layers' },
  { id: '14', name: 'ميكانيكي سيارات', iconName: 'Wrench' },
  { id: '15', name: 'سائق شاحنة', iconName: 'Truck' },
  { id: '16', name: 'سائق تاكسي', iconName: 'Car' },
  { id: '17', name: 'سائق توصيل', iconName: 'Bike' },
  { id: '18', name: 'فلاح', iconName: 'Sprout' },
  { id: '19', name: 'راعي غنم', iconName: 'PersonStanding' },
  { id: '20', name: 'جزّار', iconName: 'ChefHat' },
  { id: '21', name: 'خبّاز', iconName: 'CookingPot' },
  { id: '22', name: 'طباخ', iconName: 'ChefHat' },
  { id: '23', name: 'حلواني', iconName: 'Cake' },
  { id: '24', name: 'منظف منازل', iconName: 'SprayCan' },
  { id: '25', name: 'منظف مكاتب', iconName: 'SprayCan' },
  { id: '26', name: 'مربية أطفال', iconName: 'Baby' },
  { id: '27', name: 'عاملة منزلية', iconName: 'Home' },
  { id: '28', name: 'حارس أمن', iconName: 'Shield' },
  { id: '29', name: 'عامل مستودع', iconName: 'Package' },
  { id: '30', name: 'نجار ألمنيوم', iconName: 'Hammer' },
  { id: '31', name: 'عامل حدادة فنية', iconName: 'Wrench' },
  { id: '32', name: 'نجار ديكور', iconName: 'Hammer' },
  { id: '33', name: 'رسام جداريات', iconName: 'Paintbrush' },
  { id: '34', name: 'عامل في مصنع', iconName: 'Factory' },
  { id: '35', name: 'عامل في المخابز', iconName: 'CookingPot' },
  { id: '36', name: 'معلم شاورما', iconName: 'ChefHat' },
  { id: '37', name: 'معلم مشاوي', iconName: 'ChefHat' },
  { id: '38', name: 'عامل مقهى', iconName: 'Coffee' },
  { id: '39', name: 'عامل مطعم', iconName: 'Utensils' },
  { id: '40', name: 'عامل غسيل سيارات', iconName: 'Car' },
  { id: '41', name: 'فني ألواح شمسية', iconName: 'Sun' },
  { id: '42', name: 'معلم سيراميك', iconName: 'Layers' },
  { id: '43', name: 'صانع أحذية', iconName: 'Briefcase' },
  { id: '44', name: 'فني إصلاح أثاث', iconName: 'Wrench' },
  { id: '45', name: 'عامل توصيل طلبات', iconName: 'Bike' },
  { id: '46', name: 'حلاق رجالي', iconName: 'Scissors' },
  { id: '47', name: 'حلاقة نسائية', iconName: 'Scissors' },
  { id: '48', name: 'فني كاميرات مراقبة', iconName: 'Camera' },
  { id: '49', name: 'فني حواسيب', iconName: 'Laptop' },
  { id: '50', name: 'فني طباعة وتصوير', iconName: 'Printer' },
  { id: '51', name: 'بائع متجول', iconName: 'ShoppingCart' },
  { id: '52', name: 'بائع في متجر', iconName: 'Store' },
  { id: '53', name: 'مساعد بائع', iconName: 'Store' },
  { id: '54', name: 'موظف كاشير', iconName: 'Calculator' },
  { id: '55', name: 'عامل تعبئة وتغليف', iconName: 'Package' },
  { id: '56', name: 'معلم حدائق وتشجير', iconName: 'Sprout' },
  { id: '57', name: 'مبلط', iconName: 'Layers' },
  { id: '58', name: 'دهّان', iconName: 'Paintbrush' },
  { id: '59', name: 'نجّار أثاث', iconName: 'Hammer' },
  { id: '60', name: 'مرمم أثاث قديم', iconName: 'Wrench' },
  { id: '61', name: 'تقني إصلاح أجهزة كهربائية', iconName: 'CircuitBoard' },
  { id: '62', name: 'خبير أعشاب طبيعية', iconName: 'Leaf' },
  { id: '63', name: 'صانع مواد تنظيف', iconName: 'SprayCan' },
  { id: '64', name: 'مشغل آلات صناعية', iconName: 'Factory' },
  { id: '65', name: 'عامل نقل أثاث', iconName: 'Truck' },
  { id: '66', name: 'عامل نظافة شوارع', iconName: 'Trash2' },
  { id: '67', name: 'عامل مغسلة ملابس', iconName: 'Shirt' },
  { id: '68', name: 'موزع إعلانات', iconName: 'Megaphone' }
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

function slugify(text: string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\u0600-\u06FF\w\-]+/g, '') // Remove all non-word chars except Arabic
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

function generateSlug(title: string, id: string) {
    const slugBase = slugify(title);
    // use first 8 chars of id to ensure uniqueness
    const uniqueSuffix = id.substring(0, 8);
    return `${slugBase}-${uniqueSuffix}`;
}


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

export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    const adsRef = collection(db, 'ads');
    const q = query(adsRef, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      return { 
          id: docSnap.id, 
          ...data,
          postedAt: formatTimeAgo(data.createdAt),
     } as Job;
    } else {
      console.log("No such document with slug!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching job by slug: ", error);
    return null;
  }
}

// Post a new job to Firestore
export async function postJob(jobData: Omit<Job, 'id' | 'createdAt' | 'likes' | 'rating' | 'postedAt' | 'slug'>): Promise<{ id: string; slug: string }> {
    try {
        const adsCollection = collection(db, 'ads');
        const newDocRef = doc(adsCollection); // Create a new doc reference with a unique ID
        const id = newDocRef.id;
        const slug = generateSlug(jobData.title, id);

        const newJob = {
            ...jobData,
            slug,
            createdAt: serverTimestamp(),
            likes: 0,
            rating: parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)),
        };

        await setDoc(newDocRef, newJob);
        return { id, slug };
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

        if (adData.title) {
            dataToUpdate.slug = generateSlug(adData.title, adId);
        }

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
