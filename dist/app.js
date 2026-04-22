import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text } from 'ink';
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
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Box, { borderStyle: "single", padding: 1, children: _jsx(Text, { bold: true, children: "AI Subscription Tracker" }) }), _jsx(Box, { children: _jsx(Text, { children: "Navigate: [D]ashboard | [A]dd Plan | [U]sage Log | [C]ost Summary | [Q]uit" }) }), _jsxs(Box, { padding: 1, children: [currentScreen === 'dashboard' && (_jsx(Dashboard, { plans: plansWithUsage, onLogUsage: (planId) => {
                            setSelectedPlanId(planId);
                            setCurrentScreen('usageLog');
                        } })), currentScreen === 'addPlan' && (_jsx(AddPlanForm, { onSubmit: handleAddPlan, onCancel: () => setCurrentScreen('dashboard') })), currentScreen === 'usageLog' && selectedPlanId && (_jsx(UsageLogView, { entries: usageEntries, planId: selectedPlanId, onAdd: handleAddUsageEntry, onDelete: handleDeleteUsageEntry, onBack: () => setCurrentScreen('dashboard') })), currentScreen === 'costSummary' && (_jsx(CostSummary, { plans: plansWithUsage, onBack: () => setCurrentScreen('dashboard') }))] })] }));
};
export default App;
//# sourceMappingURL=app.js.map