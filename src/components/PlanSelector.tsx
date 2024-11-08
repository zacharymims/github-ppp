import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { PLAN_FEATURES, PLAN_PRICES, User } from '../types/auth';

interface PlanSelectorProps {
  selectedPlan: User['plan'] | null;
  onPlanSelect: (plan: User['plan']) => void;
  onContinue: () => void;
}

export default function PlanSelector({ selectedPlan, onPlanSelect, onContinue }: PlanSelectorProps) {
  const plans = [
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
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-2 text-gray-600">Select the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl shadow-md bg-white overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedPlan === plan.id 
                ? 'ring-2 ring-indigo-600 shadow-lg' 
                : 'hover:shadow-lg'
            } ${plan.popular ? 'border-2 border-indigo-600' : ''}`}
            onClick={() => onPlanSelect(plan.id)}
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
              {selectedPlan === plan.id && (
                <div className="absolute top-4 right-4">
                  <div className="h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          disabled={!selectedPlan}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Continue to Account Creation
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
}