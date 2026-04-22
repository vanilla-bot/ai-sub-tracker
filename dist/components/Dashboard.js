import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import PlanCard from './PlanCard.js'
const Dashboard = ({ plans, onAddPlan, onEditPlan, onDeletePlan, onLogUsage, onCostSummary, onQuit, }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    // Get terminal width for column calculation
    const columns = Math.max(1, Math.floor((process.stdout.columns || 80) / 41));
    // Keyboard navigation using Ink's useInput
    useInput((input, key) => {
        const totalCards = plans.length;
        if (totalCards === 0)
            return;
        if (key.upArrow || input === 'k') {
            setSelectedIndex((prev) => (prev - columns + totalCards) % totalCards);
        }
        else if (key.downArrow || input === 'j') {
            setSelectedIndex((prev) => (prev + columns) % totalCards);
        }
        else if (key.leftArrow || input === 'h') {
            setSelectedIndex((prev) => (prev - 1 + totalCards) % totalCards);
        }
        else if (key.rightArrow || input === 'l') {
            setSelectedIndex((prev) => (prev + 1) % totalCards);
        }
        else if (input === 'a' || input === 'A') {
            onAddPlan?.();
        }
        else if (input === 'e' || input === 'E') {
            if (plans[selectedIndex])
                onEditPlan?.(plans[selectedIndex].id);
        }
        else if (input === 'd' || input === 'D') {
            if (plans[selectedIndex])
                onDeletePlan?.(plans[selectedIndex].id);
        }
        else if (input === 'u' || input === 'U') {
            if (plans[selectedIndex])
                onLogUsage?.(plans[selectedIndex].id);
        }
        else if (input === 'c' || input === 'C') {
            onCostSummary?.();
        }
        else if (input === 'q' || input === 'Q') {
            onQuit?.();
        }
    });
    // Update selected index when plans change
    if (selectedIndex >= plans.length && plans.length > 0) {
        setSelectedIndex(0);
    }
    // Empty state
    if (plans.length === 0) {
        return (_jsxs(Box, { flexDirection: "column", alignItems: "center", padding: 2, children: [_jsx(Text, { bold: true, children: "No plans yet" }), _jsx(Text, { dimColor: true, children: "Press [a] to add your first subscription plan" })] }));
    }
    // Build grid of PlanCards
    const rows = [];
    for (let i = 0; i < plans.length; i += columns) {
        rows.push(plans.slice(i, i + columns));
    }
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { justifyContent: "space-around", marginBottom: 1, children: [_jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "a" }), "]dd"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "e" }), "]dit"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "d" }), "]elete"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "u" }), "]sage"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "c" }), "]ost"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "q" }), "]uit"] })] }), _jsxs(Box, { justifyContent: "space-between", marginBottom: 1, children: [_jsx(Text, { dimColor: true, children: "Navigate: Arrow keys or h,j,k,l" }), _jsxs(Text, { dimColor: true, children: [plans.length, " plan(s) | Selected: ", selectedIndex + 1] })] }), rows.map((row, rowIndex) => (_jsxs(Box, { justifyContent: "flex-start", gap: 1, children: [row.map((plan, colIndex) => {
                        const planIndex = rowIndex * columns + colIndex;
                        const isSelected = planIndex === selectedIndex;
                        return (_jsx(PlanCard, { plan: plan, isSelected: isSelected }, plan.id));
                    }), row.length < columns &&
                        Array.from({ length: columns - row.length }).map((_, i) => (_jsx(Box, { width: 40 }, `empty-${i}`)))] }, rowIndex))), plans[selectedIndex] && (_jsxs(Box, { marginTop: 1, padding: 1, borderStyle: "single", children: [_jsx(Text, { bold: true, children: "Selected: " }), _jsx(Text, { children: plans[selectedIndex].planName }), _jsxs(Text, { dimColor: true, children: [" (", plans[selectedIndex].provider, ")"] }), _jsx(Text, { children: " | " }), _jsxs(Text, { children: [plans[selectedIndex].totalTokensUsed.toLocaleString(), " /", ' ', plans[selectedIndex].tokenBudget.toLocaleString(), " tokens used"] })] }))] }));
};
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map