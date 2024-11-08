import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

// User plan limits
const PLAN_LIMITS = {
  free: 3,
  basic: 100,
  pro: 500,
  enterprise: 2000
};

// Check user's remaining searches
export async function checkUserLimit(userId: string): Promise<boolean> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    return false;
  }
  
  const userData = userDoc.data();
  const plan = userData.plan || 'free';
  const searches = userData.searches || 0;
  
  return searches < PLAN_LIMITS[plan];
}

// Increment user's search count
export async function incrementSearchCount(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    searches: increment(1)
  });
}

// Initialize new user
export async function initializeUser(userId: string, email: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    email,
    plan: 'free',
    searches: 0,
    createdAt: new Date().toISOString()
  });
}

// Update user's plan
export async function updateUserPlan(userId: string, plan: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    plan,
    searches: 0 // Reset search count when plan changes
  });
}