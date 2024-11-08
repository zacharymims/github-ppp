import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Sparkles, Infinity, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { User, PLAN_FEATURES, PLAN_PRICES } from '../types/auth';
import SignInSection from './SignInSection';
import AuthModal from './AuthModal';
import { redirectToPaymentLink, verifyPaymentSuccess, getStoredSignupData } from '../lib/stripe';

interface LandingPageProps {
  onToolSelect: (tab: string) => void;
  onSignInClick: () => void;
}

export default function LandingPage({ onToolSelect, onSignInClick }: LandingPageProps) {
  const { user, signUp } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<User['plan'] | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check for successful payment return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    
    if (success === 'true' && !isProcessing) {
      setIsProcessing(true);
      const signupData = getStoredSignupData();
      
      if (signupData) {
        // Create the account after successful payment
        signUp(signupData.email, signupData.password, signupData.plan as User['plan'])
          .then(() => {
            // Clear the URL parameters after successful signup
            window.history.replaceState({}, '', window.location.pathname);
          })
          .catch((error) => {
            console.error('Error creating account:', error);
          })
          .finally(() => {
            setIsProcessing(false);
          });
      } else {
        setIsProcessing(false);
      }
    }
  }, [signUp, isProcessing]);

  const handlePlanSelect = async (plan: User['plan']) => {
    if (user) {
      // If user is already logged in, redirect directly to payment link
      try {
        await redirectToPaymentLink(plan);
      } catch (error) {
        console.error('Payment redirect error:', error);
      }
    } else {
      // If not logged in, show signup modal with selected plan
      setSelectedPlan(plan);
      setShowAuthModal(true);
    }
  };

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Optimize Your Content
          <span className="text-indigo-600"> Like a Pro</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Comprehensive SEO analysis tools to help you create better content, rank higher, and build topical authority.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            {user ? (
              <button
                onClick={() => onToolSelect('keywords')}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onSignInClick}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Sign In to Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Powerful SEO Tools
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Keyword Analysis',
              description: 'Analyze keyword density, prominence, and distribution across your content.',
              action: () => onToolSelect('keywords')
            },
            {
              title: 'Page Analysis',
              description: 'Get detailed insights into your page structure, meta tags, and SEO elements.',
              action: () => onToolSelect('pages')
            },
            {
              title: 'Topical Authority',
              description: 'Generate comprehensive topic maps to build content authority.',
              action: () => onToolSelect('topical')
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <button
                  onClick={user ? feature.action : onSignInClick}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {user ? 'Try Now' : 'Sign In to Try'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign In Section (shown when not logged in) */}
      {!user && <SignInSection onSignInClick={onSignInClick} />}

      {/* Monthly Plans Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Monthly Plans
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              id: 'basic' as const,
              name: 'Basic',
              price: PLAN_PRICES.basic,
              description: 'Perfect for bloggers and small websites',
              features: PLAN_FEATURES.basic
            },
            {
              id: 'plus' as const,
              name: 'Plus',
              price: PLAN_PRICES.plus,
              description: 'Ideal for growing businesses',
              features: PLAN_FEATURES.plus,
              popular: true
            },
            {
              id: 'pro' as const,
              name: 'Pro',
              price: PLAN_PRICES.pro,
              description: 'For large websites and agencies',
              features: PLAN_FEATURES.pro
            }
          ].map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl shadow-md bg-white overflow-hidden ${
                plan.popular ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium">
                  Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="ml-2 text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode="signup"
          initialPlan={selectedPlan || 'basic'}
        />
      )}
    </div>
  );
}