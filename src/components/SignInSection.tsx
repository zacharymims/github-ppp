import React from 'react';
import { Lock } from 'lucide-react';

interface SignInSectionProps {
  onSignInClick: () => void;
}

export default function SignInSection({ onSignInClick }: SignInSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-12 sm:px-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sign in to access all features
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant access to powerful SEO tools including keyword analysis, page insights, and topical authority mapping.
          </p>
          <button
            onClick={onSignInClick}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    </div>
  );
}