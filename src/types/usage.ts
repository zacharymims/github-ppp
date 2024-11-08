export interface UsageRecord {
  userId: string;
  action: string;
  timestamp: Date;
}

export interface UsageLimits {
  basic: number;
  plus: number;
  pro: number;
}

export const USAGE_LIMITS: UsageLimits = {
  basic: 100,
  plus: 500,
  pro: Infinity
};