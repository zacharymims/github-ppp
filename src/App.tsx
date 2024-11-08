import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import KeywordAnalyzer from './components/KeywordAnalyzer';
import TopPagesAnalyzer from './components/TopPagesAnalyzer';
import TopicalMapAnalyzer from './components/TopicalMapAnalyzer';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import TrialBanner from './components/TrialBanner';
import { useAuthStore } from './store/authStore';
import { useTrialStore } from './store/trialStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  });

  const { user, loading } = useAuthStore();
  const { hasTrialsLeft } = useTrialStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        useAuthStore.setState({ user: null, loading: false });
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          useAuthStore.setState({
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              plan: userData.plan || 'basic',
              usageThisMonth: userData.usageThisMonth || 0,
              lastUsageReset: userData.lastUsageReset?.toDate() || new Date()
            },
            loading: false
          });
        } else {
          useAuthStore.setState({ user: null, loading: false });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        useAuthStore.setState({ user: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const canAccessTools = user || hasTrialsLeft();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserMenu />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="keywords" disabled={!canAccessTools}>Keywords</TabsTrigger>
            <TabsTrigger value="pages" disabled={!canAccessTools}>Pages</TabsTrigger>
            <TabsTrigger value="topical" disabled={!canAccessTools}>Topics</TabsTrigger>
          </TabsList>

          {!user && activeTab !== 'home' && (
            <TrialBanner 
              onSignInClick={() => setAuthModal({ isOpen: true, mode: 'signin' })} 
            />
          )}

          <TabsContent value="home">
            <LandingPage 
              onToolSelect={(tab) => {
                if (!canAccessTools) {
                  setAuthModal({ isOpen: true, mode: 'signup' });
                } else {
                  setActiveTab(tab);
                }
              }}
              onSignInClick={() => setAuthModal({ isOpen: true, mode: 'signin' })}
            />
          </TabsContent>

          {canAccessTools && (
            <>
              <TabsContent value="keywords">
                <KeywordAnalyzer />
              </TabsContent>

              <TabsContent value="pages">
                <TopPagesAnalyzer />
              </TabsContent>

              <TabsContent value="topical">
                <TopicalMapAnalyzer />
              </TabsContent>
            </>
          )}
        </Tabs>

        <AuthModal 
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        />
      </div>
    </div>
  );
}