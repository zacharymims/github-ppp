import React from 'react';
import { useAuthStore } from '../store/authStore';
import { PLAN_LIMITS } from '../types/auth';
import { LogOut, User } from 'lucide-react';

export default function UserMenu() {
  const { user, signOut } = useAuthStore();
  
  if (!user) return null;

  const limit = PLAN_LIMITS[user.plan];
  const usagePercent = (user.usageThisMonth / limit) * 100;

  return (
    <div className="absolute top-4 right-4 flex items-center gap-4">
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">
          {user.email}
        </div>
        <div className="text-xs text-gray-600">
          {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
        </div>
        <div className="text-xs text-gray-600">
          {user.usageThisMonth} / {limit === Infinity ? '∞' : limit} searches
        </div>
        {limit !== Infinity && (
          <div className="w-32 h-1 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        )}
      </div>
      <button
        onClick={() => signOut()}
        className="p-2 text-gray-600 hover:text-gray-900"
        title="Sign Out"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}