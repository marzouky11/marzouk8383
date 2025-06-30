import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, addDoc, serverTimestamp, updateDoc, increment, setDoc, deleteDoc, runTransaction } from 'firebase/firestore';
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
    const queryConstraints: any[] = [];

    if (postType) {
      queryConstraints.push(where('postType', '==', postType));
    }
    if (country) {
      queryConstraints.push(where('country', '==', country));
    }
    if (city) {
      queryConstraints.push(where('city', '==', city));
    }
    if (categoryId) {
      queryConstraints.push(where('categoryId', '==', categoryId));
    }
    if (workType) {
      queryConstraints.push(where('workType', '==', workType));
    }
    
    if (sortBy === 'newest') {
      queryConstraints.push(orderBy('createdAt', 'desc'));
    }

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

    if (searchQuery) {
        jobs = jobs.filter(job => 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    // Note: If you see Firestore errors about indexes, you may need to create them in the Firebase console.
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
export async function postJob(jobData: Omit<Job, 'id' | 'createdAt' | 'likes' | 'rating' | 'isFavorite' | 'postedAt'>) {
    try {
        const adsCollection = collection(db, 'ads');
        const newJob = {
            ...jobData,
            createdAt: serverTimestamp(),
            likes: 0,
            rating: 0,
        };
        const docRef = await addDoc(adsCollection, newJob);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to post job");
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

export async function toggleLikeJob(jobId: string, userId: string): Promise<'liked' | 'unliked'> {
    const adRef = doc(db, 'ads', jobId);
    const interestRef = doc(db, 'interests', `${userId}_${jobId}`);

    try {
        const result = await runTransaction(db, async (transaction) => {
            const interestDoc = await transaction.get(interestRef);
            const adDoc = await transaction.get(adRef);

            if (!adDoc.exists()) {
                throw new Error("Document does not exist!");
            }
            
            const currentLikes = adDoc.data().likes || 0;

            if (interestDoc.exists()) {
                // User is unliking the job
                transaction.delete(interestRef);
                transaction.update(adRef, { likes: currentLikes - 1 });
                return 'unliked';
            } else {
                // User is liking the job
                transaction.set(interestRef, { userId, jobId, createdAt: serverTimestamp() });
                transaction.update(adRef, { likes: currentLikes + 1 });
                return 'liked';
            }
        });
        return result;
    } catch (e) {
        console.error("Like/Unlike Transaction failed: ", e);
        throw new Error("Failed to update like status due to a database error.");
    }
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
