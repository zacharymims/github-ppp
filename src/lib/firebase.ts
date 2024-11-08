import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  USAGE: 'usage',
  SUBSCRIPTIONS: 'subscriptions'
} as const;

// Usage tracking function
export async function trackUsage(userId: string, action: string) {
  const usageRef = collection(db, COLLECTIONS.USAGE);
  
  await addDoc(usageRef, {
    userId,
    action,
    timestamp: serverTimestamp()
  });
}