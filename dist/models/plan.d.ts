export type Provider = 'cloud_code' | 'codex' | 'glm' | 'minimax';
export type PlanPeriod = 'monthly' | 'quarterly' | 'yearly';
export type PlanStatus = 'active' | 'expired' | 'cancelled';
export interface Plan {
    id: string;
    planName: string;
    provider: Provider;
    period: PlanPeriod;
    pricePerPeriod: number;
    currency: string;
    tokenBudget: number;
    status: PlanStatus;
    startDate: string;
    renewalDate: string;
    createdAt: string;
    updatedAt: string;
}
export interface UsageEntry {
    id: string;
    planId: string;
    tokens: number;
    date: string;
    note: string;
    createdAt: string;
    periodStart: string;
    periodEnd: string;
}
export interface PlanWithUsage extends Plan {
    totalTokensUsed: number;
    remainingTokens: number;
    usagePercentage: number;
}
/**
 * Computes usage statistics for a given plan based on usage entries.
 * Filters entries by planId, sums tokens, and calculates remaining usage.
 */
export declare function computePlanWithUsage(plan: Plan, usageEntries: UsageEntry[]): PlanWithUsage;
/**
 * Formats a number as currency with locale-aware thousand separators.
 * Supports USD ($), EUR (€), GBP (£), and JPY (¥).
 */
export declare function formatCurrency(amount: number, currency: string): string;
//# sourceMappingURL=plan.d.ts.map