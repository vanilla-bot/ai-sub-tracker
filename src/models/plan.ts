// Provider type: supported AI service providers
export type Provider = 'cloud_code' | 'codex' | 'glm' | 'minimax';

// PlanPeriod type: billing cycle options
export type PlanPeriod = 'monthly' | 'quarterly' | 'yearly';

// PlanStatus type: subscription status
export type PlanStatus = 'active' | 'expired' | 'cancelled';

// Plan type: subscription plan definition
export interface Plan {
  id: string;
  name: string;
  provider: Provider;
  period: PlanPeriod;
  price: number;
  currency: string;
  maxTokens: number;
  status: PlanStatus;
  startDate: string;
  endDate: string;
}

// UsageEntry type: individual usage record
export interface UsageEntry {
  id: string;
  planId: string;
  date: string;
  tokens: number;
  periodStart: string;
  periodEnd: string;
}

// PlanWithUsage type: plan enriched with computed usage data
export interface PlanWithUsage extends Plan {
  totalTokensUsed: number;
  remainingTokens: number;
  usagePercentage: number;
}

/**
 * Computes usage statistics for a given plan based on usage entries.
 * Filters entries by planId, sums tokens, and calculates remaining usage.
 */
export function computePlanWithUsage(plan: Plan, usageEntries: UsageEntry[]): PlanWithUsage {
  // Filter entries for this plan
  const planEntries = usageEntries.filter((entry) => entry.planId === plan.id);

  // Sum all tokens used in the period
  const totalTokensUsed = planEntries.reduce((sum, entry) => sum + entry.tokens, 0);

  // Calculate remaining tokens and percentage
  const remainingTokens = Math.max(0, plan.maxTokens - totalTokensUsed);
  const usagePercentage = Math.round((totalTokensUsed / plan.maxTokens) * 100);

  return {
    ...plan,
    totalTokensUsed,
    remainingTokens,
    usagePercentage,
  };
}

/**
 * Formats a number as currency with locale-aware thousand separators.
 * Supports USD ($), EUR (€), GBP (£), and JPY (¥).
 */
export function formatCurrency(amount: number, currency: string): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };

  const symbol = currencySymbols[currency] || currency + ' ';

  // JPY uses no decimal places
  if (currency === 'JPY') {
    return `${symbol}${amount.toLocaleString('en-US')}`;
  }

  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}