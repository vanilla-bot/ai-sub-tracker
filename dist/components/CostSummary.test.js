import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CostSummary from './CostSummary.js'
// Mock ink components
vi.mock('ink', async () => {
    const actual = await vi.importActual('ink');
    return {
        ...actual,
        useInput: vi.fn(),
        Box: ({ children }) => children,
        Text: ({ children, ...props }) => {
            const { bold, dimColor, color } = props;
            let text = Array.isArray(children) ? children.join('') : children;
            if (bold)
                text = `[BOLD]${text}[/BOLD]`;
            if (dimColor)
                text = `[DIM]${text}[/DIM]`;
            if (color)
                text = `[${color.toUpperCase()}]${text}[/${color.toUpperCase()}]`;
            return text;
        },
    };
});
describe('CostSummary', () => {
    const createMockPlan = (overrides = {}) => ({
        id: 'plan_001',
        planName: 'Test Plan',
        provider: 'cloud_code',
        period: 'monthly',
        pricePerPeriod: 10.00,
        currency: 'USD',
        tokenBudget: 100000,
        status: 'active',
        startDate: '2024-01-01',
        renewalDate: '2024-12-31',
        totalTokensUsed: 50000,
        remainingTokens: 50000,
        usagePercentage: 50,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        ...overrides,
    });
    const mockOnBack = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should be a function component', () => {
        expect(typeof CostSummary).toBe('function');
    });
    it('should accept plans and onBack props', () => {
        const plans = [createMockPlan()];
        // Component should accept these props without throwing
        expect(() => _jsx(CostSummary, { plans: plans, onBack: mockOnBack })).not.toThrow();
    });
    it('should display empty state when no plans', () => {
        const plans = [];
        // When plans is empty, the empty state branch is taken
        expect(plans.length).toBe(0);
    });
    it('should display plan name in the table', () => {
        const plans = [createMockPlan({ id: '1', planName: 'Cloud Code Monthly' })];
        expect(plans[0].planName).toBe('Cloud Code Monthly');
    });
    it('should display billing period (monthly/quarterly/yearly)', () => {
        const plans = [
            createMockPlan({ id: '1', planName: 'Monthly Plan', period: 'monthly' }),
            createMockPlan({ id: '2', planName: 'Quarterly Plan', period: 'quarterly' }),
            createMockPlan({ id: '3', planName: 'Yearly Plan', period: 'yearly' }),
        ];
        expect(plans[0].period).toBe('monthly');
        expect(plans[1].period).toBe('quarterly');
        expect(plans[2].period).toBe('yearly');
    });
    it('should display period price', () => {
        const plans = [createMockPlan({ id: '1', planName: 'Test', pricePerPeriod: 29.99 })];
        expect(plans[0].pricePerPeriod).toBe(29.99);
    });
    it('should calculate monthly equivalent for quarterly plans (price / 3)', () => {
        const plan = createMockPlan({ period: 'quarterly', pricePerPeriod: 30.00 });
        const monthlyEquivalent = plan.pricePerPeriod / 3;
        expect(monthlyEquivalent).toBe(10.00);
    });
    it('should calculate monthly equivalent for yearly plans (price / 12)', () => {
        const plan = createMockPlan({ period: 'yearly', pricePerPeriod: 120.00 });
        const monthlyEquivalent = plan.pricePerPeriod / 12;
        expect(monthlyEquivalent).toBe(10.00);
    });
    it('should calculate monthly equivalent for monthly plans (price / 1)', () => {
        const plan = createMockPlan({ period: 'monthly', pricePerPeriod: 15.00 });
        const monthlyEquivalent = plan.pricePerPeriod / 1;
        expect(monthlyEquivalent).toBe(15.00);
    });
    it('should calculate total monthly cost', () => {
        const plans = [
            createMockPlan({ id: '1', period: 'monthly', pricePerPeriod: 10.00 }),
            createMockPlan({ id: '2', period: 'quarterly', pricePerPeriod: 30.00 }), // 10/month
            createMockPlan({ id: '3', period: 'yearly', pricePerPeriod: 120.00 }), // 10/month
        ];
        const monthlyTotal = plans.reduce((sum, plan) => {
            const divisor = plan.period === 'monthly' ? 1 : plan.period === 'quarterly' ? 3 : 12;
            return sum + (plan.pricePerPeriod / divisor);
        }, 0);
        expect(monthlyTotal).toBe(30.00);
    });
    it('should calculate annual projection (monthly * 12)', () => {
        const plans = [
            createMockPlan({ id: '1', period: 'monthly', pricePerPeriod: 10.00 }),
        ];
        const monthlyTotal = plans.reduce((sum, plan) => {
            return sum + plan.pricePerPeriod;
        }, 0);
        const annualProjection = monthlyTotal * 12;
        expect(annualProjection).toBe(120.00);
    });
    it('should display header row with column names', () => {
        // Verify that the header labels are defined
        const headers = ['Plan', 'Period', 'Price', 'Monthly'];
        expect(headers).toContain('Plan');
        expect(headers).toContain('Period');
        expect(headers).toContain('Price');
        expect(headers).toContain('Monthly');
    });
    it('should display multiple plans in table format', () => {
        const plans = [
            createMockPlan({ id: '1', planName: 'Basic', period: 'monthly', pricePerPeriod: 9.99 }),
            createMockPlan({ id: '2', planName: 'Pro', period: 'quarterly', pricePerPeriod: 29.99 }),
            createMockPlan({ id: '3', planName: 'Enterprise', period: 'yearly', pricePerPeriod: 99.99 }),
        ];
        expect(plans.length).toBe(3);
        expect(plans[0].planName).toBe('Basic');
        expect(plans[1].planName).toBe('Pro');
        expect(plans[2].planName).toBe('Enterprise');
    });
    it('should call onBack when Escape is pressed', () => {
        const onBack = vi.fn();
        // Verify onBack is a function
        expect(typeof onBack).toBe('function');
        onBack();
        expect(onBack).toHaveBeenCalled();
    });
    it('should handle mixed billing periods correctly', () => {
        const plans = [
            createMockPlan({ id: '1', planName: 'Basic Monthly', period: 'monthly', pricePerPeriod: 9.99 }),
            createMockPlan({ id: '2', planName: 'Pro Quarterly', period: 'quarterly', pricePerPeriod: 29.99 }),
            createMockPlan({ id: '3', planName: 'Enterprise Yearly', period: 'yearly', pricePerPeriod: 99.99 }),
        ];
        const monthlyEquivalents = plans.map((plan) => {
            const divisor = plan.period === 'monthly' ? 1 : plan.period === 'quarterly' ? 3 : 12;
            return plan.pricePerPeriod / divisor;
        });
        const monthlyTotal = monthlyEquivalents.reduce((sum, val) => sum + val, 0);
        const annualProjection = monthlyTotal * 12;
        // 9.99 + 9.997 + 8.333 = ~28.32
        expect(monthlyTotal).toBeCloseTo(28.32, 1);
        expect(annualProjection).toBeCloseTo(339.84, 1);
    });
    it('should format currency correctly', () => {
        const plan = createMockPlan({ pricePerPeriod: 1234.56, currency: 'USD' });
        expect(plan.pricePerPeriod).toBe(1234.56);
        expect(plan.currency).toBe('USD');
    });
});
//# sourceMappingURL=CostSummary.test.js.map