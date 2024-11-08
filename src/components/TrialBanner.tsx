import React from 'react';
import { useTrialStore } from '../store/trialStore';
import { AlertCircle } from 'lucide-react';

interface TrialBannerProps {
  onSignInClick: () => void;
}

export default function TrialBanner({ onSignInClick }: TrialBannerProps) {
  const { getTrialsLeft } = useTrialStore();
  const trialsLeft = getTrialsLeft();

  if (trialsLeft === 3) return null;

  return (
    <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-indigo-600 mr-3" />
        <div className="flex-1">
          <p className="text-sm text-indigo-700">
            {trialsLeft > 0 ? (
              <>
                You have <span className="font-semibold">{trialsLeft} free {trialsLeft === 1 ? 'trial' : 'trials'}</span> left.
                Sign in to unlock unlimited access!
              </>
            ) : (
              <>
                You've used all your free trials. Sign in now to continue using our tools!
              </>
            )}
          </p>
        </div>
        <button
          onClick={onSignInClick}
          className="ml-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}