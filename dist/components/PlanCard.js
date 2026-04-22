import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
// Provider display names and icons
const providerInfo = {
    cloud_code: { name: 'Cloud Code', icon: '☁' },
    codex: { name: 'Codex', icon: '⚡' },
    glm: { name: 'GLM', icon: '🔮' },
    minimax: { name: 'MiniMax', icon: '🤖' },
};
// Status colors
const statusColors = {
    active: 'green',
    expired: 'red',
    cancelled: 'yellow',
};
// Period labels
const periodLabels = {
    monthly: '/mo',
    quarterly: '/qtr',
    yearly: '/yr',
};
const PlanCard = ({ plan, isSelected = false }) => {
    const provider = providerInfo[plan.provider];
    const statusColor = statusColors[plan.status] || 'white';
    const periodLabel = periodLabels[plan.period] || '';
    // Format price
    const formatPrice = (price, currency) => {
        const symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            JPY: '¥',
        };
        const symbol = symbols[currency] || currency + ' ';
        return `${symbol}${price.toFixed(2)}`;
    };
    // Visual budget bar (using block characters)
    const renderBudgetBar = (percentage) => {
        const totalBlocks = 20;
        const filledBlocks = Math.round((percentage / 100) * totalBlocks);
        const emptyBlocks = totalBlocks - filledBlocks;
        return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    };
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "single", borderColor: isSelected ? 'blue' : 'white', padding: 1, width: 40, children: [_jsxs(Box, { justifyContent: "space-between", children: [_jsxs(Text, { bold: true, children: [provider.icon, " ", provider.name] }), _jsx(Text, { bold: true, color: statusColor, children: plan.status.toUpperCase() })] }), _jsx(Text, { children: plan.name }), _jsx(Box, { marginY: 1, children: _jsxs(Text, { children: ["Usage: ", renderBudgetBar(plan.usagePercentage), " ", plan.usagePercentage, "%"] }) }), _jsxs(Box, { justifyContent: "space-between", children: [_jsxs(Text, { children: [formatPrice(plan.price, plan.currency), _jsx(Text, { dimColor: true, children: periodLabel })] }), _jsxs(Text, { dimColor: true, children: ["Renews: ", plan.endDate] })] }), _jsxs(Box, { justifyContent: "space-between", marginTop: 1, children: [_jsxs(Text, { dimColor: true, children: [plan.totalTokensUsed.toLocaleString(), " used"] }), _jsxs(Text, { dimColor: true, children: [plan.remainingTokens.toLocaleString(), " left"] })] })] }));
};
export default PlanCard;
//# sourceMappingURL=PlanCard.js.map