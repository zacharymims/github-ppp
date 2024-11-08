import { create } from 'zustand';
import { AuthState, User, PLAN_LIMITS } from '../types/auth';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthStore extends AuthState {
  signUp: (email: string, password: string, plan: User['plan']) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
  canPerformAction: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  signUp: async (email: string, password: string, plan: User['plan']) => {
    try {
      set({ loading: true, error: null });
      
      // Create Firebase auth user
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (!firebaseUser) {
        throw new Error('Failed to create account');
      }

      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        plan,
        usageThisMonth: 0,
        lastUsageReset: new Date()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
      // Update store state
      set({ 
        user: newUser,
        loading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign up',
        loading: false,
        user: null
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data() as User;
      set({ user: userData, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign in',
        loading: false
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, loading: false, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out',
        loading: false
      });
      throw error;
    }
  },

  setError: (error) => set({ error }),

  canPerformAction: () => {
    const { user } = get();
    if (!user) return false;
    return user.usageThisMonth < PLAN_LIMITS[user.plan];
  }
}));