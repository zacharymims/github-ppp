import React from 'react';
import { Check } from 'lucide-react';
import { PLAN_FEATURES, PLAN_PRICES } from '../types/auth';

interface PlanCardProps {
  plan: keyof typeof PLAN_FEATURES;
  onSelect: () => void;
  selected: boolean;
}

export default function PlanCard({ plan, onSelect, selected }: PlanCardProps) {
  return (
    <div
      className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer
        ${selected 
          ? 'border-indigo-600 bg-indigo-50' 
          : 'border-gray-200 hover:border-indigo-200'
        }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {plan}
          </h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-900">
              ${PLAN_PRICES[plan]}
            </span>
            <span className="text-gray-500">/month</span>
          </div>
        </div>
        {selected && (
          <div className="h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      <ul className="mt-6 space-y-4">
        {PLAN_FEATURES[plan].map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-indigo-600 flex-shrink-0 mr-2" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}