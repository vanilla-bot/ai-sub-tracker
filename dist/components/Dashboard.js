import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Box, Text } from 'ink';
import PlanCard from './PlanCard';
const Dashboard = ({ plans, onAddPlan, onEditPlan, onDeletePlan, onLogUsage, onCostSummary, onQuit, }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [columns, setColumns] = useState(3);
    // Recalculate columns based on terminal width
    useEffect(() => {
        const calculateColumns = () => {
            // Each card is 40 wide, plus 1 gap
            const width = process.stdout.columns || 80;
            const cols = Math.max(1, Math.floor(width / 41));
            setColumns(cols);
        };
        calculateColumns();
        // Listen for resize would require a special handler
        // For now, recalculate on any key press
    }, []);
    // Keyboard navigation
    const handleKeyPress = useCallback((key) => {
        const totalCards = plans.length;
        switch (key.toLowerCase()) {
            case 'a':
                onAddPlan?.();
                break;
            case 'e':
                if (plans[selectedIndex]) {
                    onEditPlan?.(plans[selectedIndex].id);
                }
                break;
            case 'd':
                if (plans[selectedIndex]) {
                    onDeletePlan?.(plans[selectedIndex].id);
                }
                break;
            case 'l':
                if (plans[selectedIndex]) {
                    onLogUsage?.(plans[selectedIndex].id);
                }
                break;
            case 'c':
                onCostSummary?.();
                break;
            case 'q':
                onQuit?.();
                break;
            case 'arrowup':
            case 'k':
                if (totalCards > 0) {
                    setSelectedIndex((prev) => (prev - columns + totalCards) % totalCards);
                }
                break;
            case 'arrowdown':
            case 'j':
                if (totalCards > 0) {
                    setSelectedIndex((prev) => (prev + columns) % totalCards);
                }
                break;
            case 'arrowleft':
            case 'h':
                if (totalCards > 0) {
                    setSelectedIndex((prev) => (prev - 1 + totalCards) % totalCards);
                }
                break;
            case 'arrowright':
            case 'l':
                if (totalCards > 0) {
                    setSelectedIndex((prev) => (prev + 1) % totalCards);
                }
                break;
        }
    }, [plans, selectedIndex, columns, onAddPlan, onEditPlan, onDeletePlan, onLogUsage, onCostSummary, onQuit]);
    // Register stdin listener for keyboard input
    useEffect(() => {
        const handleStdin = (data) => {
            const key = data.toString();
            handleKeyPress(key);
        };
        if (process.stdin.isTTY) {
            process.stdin.on('data', handleStdin);
            return () => {
                process.stdin.off('data', handleStdin);
            };
        }
    }, [handleKeyPress]);
    // Update selected index when plans change
    useEffect(() => {
        if (selectedIndex >= plans.length && plans.length > 0) {
            setSelectedIndex(0);
        }
    }, [plans, selectedIndex]);
    // Empty state
    if (plans.length === 0) {
        return (_jsxs(Box, { flexDirection: "column", alignItems: "center", padding: 2, children: [_jsx(Text, { bold: true, children: "No plans yet" }), _jsx(Text, { dimColor: true, children: "Press [a] to add your first subscription plan" })] }));
    }
    // Build grid of PlanCards
    const rows = [];
    for (let i = 0; i < plans.length; i += columns) {
        rows.push(plans.slice(i, i + columns));
    }
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { justifyContent: "space-around", marginBottom: 1, children: [_jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "a" }), "]dd"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "e" }), "]dit"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "d" }), "]elete"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "l" }), "]og usage"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "c" }), "]ost"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "q" }), "]uit"] })] }), _jsxs(Box, { justifyContent: "space-between", marginBottom: 1, children: [_jsx(Text, { dimColor: true, children: "Navigate: Arrow keys or h,j,k,l" }), _jsxs(Text, { dimColor: true, children: [plans.length, " plan(s) | Selected: ", selectedIndex + 1] })] }), rows.map((row, rowIndex) => (_jsxs(Box, { justifyContent: "flex-start", gap: 1, children: [row.map((plan, colIndex) => {
                        const planIndex = rowIndex * columns + colIndex;
                        const isSelected = planIndex === selectedIndex;
                        return (_jsx(PlanCard, { plan: plan, isSelected: isSelected }, plan.id));
                    }), row.length < columns &&
                        Array.from({ length: columns - row.length }).map((_, i) => (_jsx(Box, { width: 40 }, `empty-${i}`)))] }, rowIndex))), plans[selectedIndex] && (_jsxs(Box, { marginTop: 1, padding: 1, borderStyle: "single", children: [_jsx(Text, { bold: true, children: "Selected: " }), _jsx(Text, { children: plans[selectedIndex].planName }), _jsxs(Text, { dimColor: true, children: [" (", plans[selectedIndex].provider, ")"] }), _jsx(Text, { children: " | " }), _jsxs(Text, { children: [plans[selectedIndex].totalTokensUsed.toLocaleString(), " /", ' ', plans[selectedIndex].tokenBudget.toLocaleString(), " tokens used"] })] }))] }));
};
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map