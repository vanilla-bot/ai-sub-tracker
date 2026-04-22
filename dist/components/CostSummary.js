import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useInput } from 'ink';
import { formatCurrency } from '../models/plan';
/**
 * Calculate the monthly equivalent cost for a plan based on its billing period.
 */
function getMonthlyEquivalent(price, period) {
    switch (period) {
        case 'monthly':
            return price / 1;
        case 'quarterly':
            return price / 3;
        case 'yearly':
            return price / 12;
        default:
            return price;
    }
}
/**
 * Get the divisor for converting period price to monthly equivalent.
 */
function getPeriodDivisor(period) {
    switch (period) {
        case 'monthly':
            return 1;
        case 'quarterly':
            return 3;
        case 'yearly':
            return 12;
        default:
            return 1;
    }
}
/**
 * CostSummary displays a table of all plans with their billing information,
 * monthly equivalents, and total cost projections.
 */
const CostSummary = ({ plans, onBack }) => {
    // Handle Escape key to go back
    useInput((input, key) => {
        if (key.escape) {
            onBack();
        }
    });
    // Calculate totals
    const monthlyTotal = plans.reduce((sum, plan) => {
        return sum + getMonthlyEquivalent(plan.pricePerPeriod, plan.period);
    }, 0);
    const annualProjection = monthlyTotal * 12;
    // Format period name for display
    const formatPeriod = (period) => {
        switch (period) {
            case 'monthly':
                return 'Monthly';
            case 'quarterly':
                return 'Quarterly';
            case 'yearly':
                return 'Yearly';
            default:
                return period;
        }
    };
    // Empty state
    if (plans.length === 0) {
        return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", padding: 1, children: [_jsx(Text, { bold: true, children: "Cost Summary" }), _jsx(Box, { marginTop: 1 }), _jsx(Text, { dimColor: true, children: "No plans to display." }), _jsx(Text, { dimColor: true, children: "Add a plan to see cost projections." }), _jsx(Box, { marginTop: 1 }), _jsx(Text, { dimColor: true, children: "Press [Esc] to go back" })] }));
    }
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", padding: 1, children: [_jsx(Text, { bold: true, children: "Cost Summary" }), _jsx(Box, { marginTop: 1 }), _jsxs(Box, { justifyContent: "space-between", borderStyle: "single", paddingX: 1, children: [_jsx(Text, { bold: true, children: "Plan" }), _jsx(Text, { bold: true, children: "Period" }), _jsx(Text, { bold: true, children: "Price" }), _jsx(Text, { bold: true, children: "Monthly" })] }), plans.map((plan) => {
                const monthlyEquiv = getMonthlyEquivalent(plan.pricePerPeriod, plan.period);
                const divisor = getPeriodDivisor(plan.period);
                return (_jsxs(Box, { justifyContent: "space-between", paddingX: 1, children: [_jsx(Text, { children: plan.planName }), _jsx(Text, { dimColor: true, children: formatPeriod(plan.period) }), _jsx(Text, { children: formatCurrency(plan.pricePerPeriod, plan.currency) }), _jsxs(Text, { children: [formatCurrency(monthlyEquiv, plan.currency), "/mo"] })] }, plan.id));
            }), _jsx(Box, { marginTop: 1 }), _jsxs(Box, { flexDirection: "column", borderStyle: "single", padding: 1, children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsx(Text, { bold: true, children: "Monthly Total:" }), _jsx(Text, { bold: true, children: formatCurrency(monthlyTotal, 'USD') })] }), _jsxs(Box, { justifyContent: "space-between", children: [_jsx(Text, { bold: true, children: "Annual Projection:" }), _jsx(Text, { bold: true, color: "cyan", children: formatCurrency(annualProjection, 'USD') })] })] }), _jsx(Box, { marginTop: 1 }), _jsx(Text, { dimColor: true, children: "Press [Esc] to go back" })] }));
};
export default CostSummary;
//# sourceMappingURL=CostSummary.js.map