import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import Dashboard from './components/Dashboard.js'
import AddPlanForm from './components/AddPlanForm.js'
import UsageLogView from './components/UsageLogView.js'
import CostSummary from './components/CostSummary.js'
import { loadPlansSync, loadUsageEntriesSync, savePlans, saveUsageEntries } from './store/fileStore.js'
import { computePlanWithUsage } from './models/plan.js'
const App = ({ plansFilePath = './config/plans.json', usageFilePath = './data/usage_log.json', }) => {
    const [currentScreen, setCurrentScreen] = useState('dashboard');
    const [plans, setPlans] = useState(() => loadPlansSync(plansFilePath));
    const [usageEntries, setUsageEntries] = useState(() => loadUsageEntriesSync(usageFilePath));
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const plansWithUsage = plans.map((plan) => computePlanWithUsage(plan, usageEntries));
    // Global keyboard navigation
    useInput((input, key) => {
        const ch = input.toLowerCase();
        if (ch === 'a' && currentScreen !== 'addPlan') {
            setCurrentScreen('addPlan');
            return;
        }
        if (ch === 'd' || ch === 'u' || ch === 'c') {
            // Only switch to dashboard if not already there
            if (currentScreen !== 'dashboard') {
                setCurrentScreen('dashboard');
            }
            return;
        }
        if (ch === 'q') {
            process.exit(0);
        }
    });
    const handleAddPlan = async (plan) => {
        const updatedPlans = [...plans, plan];
        setPlans(updatedPlans);
        await savePlans(plansFilePath, updatedPlans);
        setCurrentScreen('dashboard');
    };
    const handleAddUsageEntry = async (entry) => {
        const updatedEntries = [...usageEntries, entry];
        setUsageEntries(updatedEntries);
        await saveUsageEntries(usageFilePath, updatedEntries);
        setCurrentScreen('dashboard');
    };
    const handleDeleteUsageEntry = (entryId) => {
        const updatedEntries = usageEntries.filter((e) => e.id !== entryId);
        setUsageEntries(updatedEntries);
        saveUsageEntries(usageFilePath, updatedEntries);
    };
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Box, { borderStyle: "single", padding: 1, children: _jsx(Text, { bold: true, children: "AI Subscription Tracker" }) }), _jsxs(Box, { children: [_jsx(Text, { dimColor: true, children: "Navigate: " }), _jsx(Text, { bold: true, color: "cyan", children: "[A]" }), _jsx(Text, { dimColor: true, children: "dd " }), _jsx(Text, { bold: true, color: "cyan", children: "[D]" }), _jsx(Text, { dimColor: true, children: "ashboard " }), _jsx(Text, { bold: true, color: "cyan", children: "[U]" }), _jsx(Text, { dimColor: true, children: "sage " }), _jsx(Text, { bold: true, color: "cyan", children: "[C]" }), _jsx(Text, { dimColor: true, children: "ost " }), _jsx(Text, { bold: true, color: "red", children: "[Q]" }), _jsx(Text, { dimColor: true, children: "uit" })] }), _jsxs(Box, { padding: 1, children: [currentScreen === 'dashboard' && (_jsx(Dashboard, { plans: plansWithUsage, onAddPlan: () => setCurrentScreen('addPlan'), onLogUsage: (planId) => {
                            setSelectedPlanId(planId);
                            setCurrentScreen('usageLog');
                        }, onCostSummary: () => setCurrentScreen('costSummary') })), currentScreen === 'addPlan' && (_jsx(AddPlanForm, { onSubmit: handleAddPlan, onCancel: () => setCurrentScreen('dashboard') })), currentScreen === 'usageLog' && selectedPlanId && (_jsx(UsageLogView, { entries: usageEntries, planId: selectedPlanId, onAdd: (tokens, note) => {
                            const newEntry = {
                                id: `entry_${Date.now()}`,
                                planId: selectedPlanId || '',
                                tokens,
                                date: new Date().toISOString().split('T')[0],
                                note,
                                createdAt: new Date().toISOString(),
                                periodStart: '',
                                periodEnd: '',
                            };
                            handleAddUsageEntry(newEntry);
                        }, onDelete: handleDeleteUsageEntry, onBack: () => setCurrentScreen('dashboard') })), currentScreen === 'costSummary' && (_jsx(CostSummary, { plans: plansWithUsage, onBack: () => setCurrentScreen('dashboard') }))] })] }));
};
export default App;
//# sourceMappingURL=app.js.map