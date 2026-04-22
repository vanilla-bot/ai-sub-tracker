import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Dashboard from './components/Dashboard';
import AddPlanForm from './components/AddPlanForm';
import UsageLogView from './components/UsageLogView';
import CostSummary from './components/CostSummary';
import { loadPlans, loadUsageEntries, savePlans, saveUsageEntries } from './store/fileStore';
import { computePlanWithUsage } from './models/plan';
const App = ({ plansFilePath = './data/plans.json', usageFilePath = './data/usage.json', }) => {
    const [currentScreen, setCurrentScreen] = useState('dashboard');
    const [plans, setPlans] = useState([]);
    const [usageEntries, setUsageEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [loadedPlans, loadedUsage] = await Promise.all([
                    loadPlans(plansFilePath),
                    loadUsageEntries(usageFilePath),
                ]);
                setPlans(loadedPlans);
                setUsageEntries(loadedUsage);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [plansFilePath, usageFilePath]);
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
    if (isLoading) {
        return (_jsx(Box, { children: _jsx(Text, { children: "Loading..." }) }));
    }
    if (error) {
        return (_jsx(Box, { children: _jsxs(Text, { color: "red", children: ["Error: ", error] }) }));
    }
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Box, { borderStyle: "single", padding: 1, children: _jsx(Text, { bold: true, children: "AI Subscription Tracker" }) }), _jsx(Box, { children: _jsx(Text, { children: "Navigate: [D]ashboard | [A]dd Plan | [U]sage Log | [C]ost Summary | [Q]uit" }) }), _jsxs(Box, { padding: 1, children: [currentScreen === 'dashboard' && _jsx(Dashboard, { plans: plansWithUsage }), currentScreen === 'addPlan' && (_jsx(AddPlanForm, { onSubmit: handleAddPlan, onCancel: () => setCurrentScreen('dashboard') })), currentScreen === 'usageLog' && _jsx(UsageLogView, { entries: usageEntries }), currentScreen === 'costSummary' && _jsx(CostSummary, { plans: plansWithUsage })] })] }));
};
export default App;
//# sourceMappingURL=app.js.map