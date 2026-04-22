/**
 * Computes usage statistics for a given plan based on usage entries.
 * Filters entries by planId, sums tokens, and calculates remaining usage.
 */
export function computePlanWithUsage(plan, usageEntries) {
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
export function formatCurrency(amount, currency) {
    const currencySymbols = {
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
//# sourceMappingURL=plan.js.map