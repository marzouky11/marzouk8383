import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, addDoc, serverTimestamp, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import type { Job, Category, Country, PostType, User, WorkType } from './types';

const categories: Category[] = [
  { id: '1', name: 'نجارة', iconName: 'Hammer' },
  { id: '2', name: 'كهرباء', iconName: 'Zap' },
  { id: '3', name: 'مطاعم', iconName: 'Utensils' },
  { id: '4', name: 'بناء', iconName: 'HardHat' },
  { id: '5', name: 'تصميم جرافيك', iconName: 'PenTool' },
  { id: '6', name: 'تنظيف', iconName: 'SprayCan' },
  { id: '7', name: 'توصيل', iconName: 'Bike' },
  { id: '8', name: 'ميكانيكي سيارات', iconName: 'Wrench' },
  { id: '9', name: 'سائق', iconName: 'Car' },
  { id: '10', name: 'حلاقة وتجميل', iconName: 'Scissors' },
  { id: '11', name: 'صباغة', iconName: 'Paintbrush' },
  { id: '12', name: 'طبخ', iconName: 'CookingPot' },
  { id: '13', name: 'خياطة', iconName: 'Shirt' },
  { id: '14', name: 'تدريس', iconName: 'BookOpen' },
  { id: '15', name: 'تمريض ورعاية صحية', iconName: 'Stethoscope' },
  { id: '16', name: 'محاسبة', iconName: 'Calculator' },
  { id: '17', name: 'برمجة وتطوير', iconName: 'Code' },
  { id: '18', name: 'تصوير فوتوغرافي', iconName: 'Camera' },
  { id: '19', name: 'أمن وحراسة', iconName: 'Shield' },
  { id: '20', name: 'استقبال وفندقة', iconName: 'ConciergeBell' },
  { id: '21', name: 'زراعة وبستنة', iconName: 'Sprout' },
  { id: '22', name: 'ترجمة', iconName: 'Languages' },
  { id: '23', name: 'تدريب رياضي', iconName: 'Dumbbell' },
  { id: '24', name: 'موسيقى', iconName: 'Music' },
  { id: '25', name: 'فن ورسم', iconName: 'Palette' },
  { id: '26', name: 'إصلاح إلكترونيات', iconName: 'CircuitBoard' },
  { id: '27', name: 'تسويق ومبيعات', iconName: 'Megaphone' },
  { id: '28', name: 'محاماة واستشارات', iconName: 'Gavel' },
  { id: '29', name: 'صيدلة', iconName: 'Pipette' },
  { id: '30', name: 'رعاية حيوانات', iconName: 'Dog' },
  { id: '31', name: 'جبس وديكور', iconName: 'Layers' },
  { id: '32', name: 'سباكة', iconName: 'ShowerHead' },
  { id: '33', name: 'إدارة مشاريع', iconName: 'KanbanSquare' }
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
