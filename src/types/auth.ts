export interface User {
  id: string;
  email: string;
  plan: 'basic' | 'plus' | 'pro';
  usageThisMonth: number;
  lastUsageReset: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const PLAN_LIMITS = {
  basic: 100,
  plus: 500,
  pro: Infinity
} as const;

export const PLAN_PRICES = {
  basic: 10,
  plus: 15,
  pro: 20
} as const;

export const PLAN_FEATURES = {
  basic: [
    'Basic keyword analysis',
    'Limited page analysis',
    'Basic topical mapping',
    '100 pages per month',
    'Email support'
  ],
  plus: [
    'Advanced keyword analysis',
    'Full page analysis',
    'Basic topical mapping',
    '500 pages per month',
    'Priority email support'
  ],
  pro: [
    'Enterprise-grade analysis',
    'Unlimited page analysis',
    'Advanced topical mapping',
    'Unlimited pages',
    '24/7 priority support'
  ]
} as const;