import { db, COLLECTIONS } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { UsageRecord, USAGE_LIMITS } from '../types/usage';

export async function getUserUsage(userId: string): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const usageRef = collection(db, COLLECTIONS.USAGE);
  const usageQuery = query(
    usageRef,
    where('userId', '==', userId),
    where('timestamp', '>=', startOfMonth),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(usageQuery);
  return snapshot.size;
}

export async function canPerformAction(userId: string, plan: keyof typeof USAGE_LIMITS): Promise<boolean> {
  const currentUsage = await getUserUsage(userId);
  const limit = USAGE_LIMITS[plan];
  
  return currentUsage < limit;
}

export async function getRecentActions(userId: string, maxResults: number = 10): Promise<UsageRecord[]> {
  const usageRef = collection(db, COLLECTIONS.USAGE);
  const recentQuery = query(
    usageRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(recentQuery);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate()
  })) as UsageRecord[];
}