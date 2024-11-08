import React, { useState } from 'react';
import { User } from '../types/auth';
import { Lock } from 'lucide-react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import PlanSelector from './PlanSelector';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  initialPlan?: User['plan'];
}

export default function AuthModal({ isOpen, onClose, mode: initialMode, initialPlan = 'basic' }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState<'plan' | 'account'>(mode === 'signup' ? 'plan' : 'account');
  const [selectedPlan, setSelectedPlan] = useState<User['plan']>(initialPlan);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>

        {mode === 'signin' ? (
          <SignInForm onClose={onClose} />
        ) : (
          <>
            {step === 'plan' ? (
              <PlanSelector
                selectedPlan={selectedPlan}
                onPlanSelect={setSelectedPlan}
                onContinue={() => setStep('account')}
              />
            ) : (
              <SignUpForm
                onClose={onClose}
                selectedPlan={selectedPlan}
                onBack={() => setStep('plan')}
              />
            )}
          </>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setStep('plan');
            }}
            className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}