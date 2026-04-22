import { describe, it, expect } from 'vitest';
import {
  Provider,
  PlanPeriod,
  PlanStatus,
  Plan,
  UsageEntry,
  PlanWithUsage,
  computePlanWithUsage,
  formatCurrency,
} from './plan';

describe('Provider type', () => {
  it('should accept valid providers', () => {
    const providers: Provider[] = ['cloud_code', 'codex', 'glm', 'minimax'];
    expect(providers).toHaveLength(4);
  });
});

describe('PlanPeriod type', () => {
  it('should accept valid periods', () => {
    const periods: PlanPeriod[] = ['monthly', 'quarterly', 'yearly'];
    expect(periods).toHaveLength(3);
  });
});

describe('PlanStatus type', () => {
  it('should have correct status values', () => {
    type ExpectedStatus = 'active' | 'expired' | 'cancelled';
    const statuses: PlanStatus[] = ['active', 'expired', 'cancelled'];
    expect(statuses).toHaveLength(3);
  });
});

describe('Plan type', () => {
  it('should create a valid Plan object', () => {
    const plan: Plan = {
      id: 'plan_001',
      name: 'Pro Monthly',
      provider: 'minimax',
      period: 'monthly',
      price: 29.99,
      currency: 'USD',
      maxTokens: 1000000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    };

    expect(plan.id).toBe('plan_001');
    expect(plan.name).toBe('Pro Monthly');
    expect(plan.provider).toBe('minimax');
    expect(plan.period).toBe('monthly');
    expect(plan.price).toBe(29.99);
    expect(plan.currency).toBe('USD');
    expect(plan.maxTokens).toBe(1000000);
    expect(plan.status).toBe('active');
  });
});

describe('UsageEntry type', () => {
  it('should create a valid UsageEntry object', () => {
    const entry: UsageEntry = {
      id: 'usage_001',
      planId: 'plan_001',
      date: '2024-01-15',
      tokens: 150000,
      periodStart: '2024-01-01',
      periodEnd: '2024-01-31',
    };

    expect(entry.id).toBe('usage_001');
    expect(entry.planId).toBe('plan_001');
    expect(entry.date).toBe('2024-01-15');
    expect(entry.tokens).toBe(150000);
    expect(entry.periodStart).toBe('2024-01-01');
    expect(entry.periodEnd).toBe('2024-01-31');
  });
});

describe('PlanWithUsage type', () => {
  it('should combine plan with usage summary', () => {
    const plan: Plan = {
      id: 'plan_001',
      name: 'Pro Monthly',
      provider: 'minimax',
      period: 'monthly',
      price: 29.99,
      currency: 'USD',
      maxTokens: 1000000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    };

    const planWithUsage: PlanWithUsage = {
      ...plan,
      totalTokensUsed: 150000,
      remainingTokens: 850000,
      usagePercentage: 15,
      status: 'active',
    };

    expect(planWithUsage.totalTokensUsed).toBe(150000);
    expect(planWithUsage.remainingTokens).toBe(850000);
    expect(planWithUsage.usagePercentage).toBe(15);
  });
});

describe('computePlanWithUsage', () => {
  const plans: Plan[] = [
    {
      id: 'plan_001',
      name: 'Pro Monthly',
      provider: 'minimax',
      period: 'monthly',
      price: 29.99,
      currency: 'USD',
      maxTokens: 1000000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    },
    {
      id: 'plan_002',
      name: 'Enterprise Yearly',
      provider: 'codex',
      period: 'yearly',
      price: 299.99,
      currency: 'USD',
      maxTokens: 10000000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
  ];

  const usageEntries: UsageEntry[] = [
    {
      id: 'usage_001',
      planId: 'plan_001',
      date: '2024-01-15',
      tokens: 150000,
      periodStart: '2024-01-01',
      periodEnd: '2024-01-31',
    },
    {
      id: 'usage_002',
      planId: 'plan_001',
      date: '2024-01-20',
      tokens: 50000,
      periodStart: '2024-01-01',
      periodEnd: '2024-01-31',
    },
    {
      id: 'usage_003',
      planId: 'plan_002',
      date: '2024-06-15',
      tokens: 500000,
      periodStart: '2024-01-01',
      periodEnd: '2024-12-31',
    },
  ];

  it('should compute usage for a specific plan', () => {
    const result = computePlanWithUsage(plans[0], usageEntries);

    expect(result.totalTokensUsed).toBe(200000);
    expect(result.remainingTokens).toBe(800000);
    expect(result.usagePercentage).toBe(20);
    expect(result.status).toBe('active');
  });

  it('should filter entries by planId', () => {
    const result = computePlanWithUsage(plans[1], usageEntries);

    expect(result.totalTokensUsed).toBe(500000);
    expect(result.remainingTokens).toBe(9500000);
    expect(result.usagePercentage).toBe(5);
  });

  it('should handle plan with no usage entries', () => {
    const emptyPlan: Plan = {
      id: 'plan_003',
      name: 'Empty Plan',
      provider: 'glm',
      period: 'monthly',
      price: 9.99,
      currency: 'USD',
      maxTokens: 100000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    };

    const result = computePlanWithUsage(emptyPlan, usageEntries);

    expect(result.totalTokensUsed).toBe(0);
    expect(result.remainingTokens).toBe(100000);
    expect(result.usagePercentage).toBe(0);
  });

  it('should calculate remaining tokens correctly', () => {
    const result = computePlanWithUsage(plans[0], usageEntries);

    expect(result.remainingTokens).toBe(result.maxTokens - result.totalTokensUsed);
  });

  it('should calculate usage percentage correctly', () => {
    const result = computePlanWithUsage(plans[0], usageEntries);

    const expectedPercentage = Math.round((result.totalTokensUsed / result.maxTokens) * 100);
    expect(result.usagePercentage).toBe(expectedPercentage);
  });
});

describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    expect(formatCurrency(29.99, 'USD')).toBe('$29.99');
    expect(formatCurrency(100, 'USD')).toBe('$100.00');
    expect(formatCurrency(0.5, 'USD')).toBe('$0.50');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  it('should handle large amounts', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('should handle different currencies', () => {
    expect(formatCurrency(29.99, 'EUR')).toBe('€29.99');
    expect(formatCurrency(29.99, 'GBP')).toBe('£29.99');
  });

  it('should handle JPY (no decimals)', () => {
    expect(formatCurrency(1000, 'JPY')).toBe('¥1,000');
  });
});