import React, { useState } from 'react';
import { Box, Text } from 'ink';
import Dashboard from './components/Dashboard';
import AddPlanForm from './components/AddPlanForm';
import UsageLogView from './components/UsageLogView';
import CostSummary from './components/CostSummary';
import { loadPlansSync, loadUsageEntriesSync, savePlans, saveUsageEntries } from './store/fileStore';
import { computePlanWithUsage } from './models/plan';
import type { Plan, UsageEntry, PlanWithUsage } from './models/plan';

type Screen = 'dashboard' | 'addPlan' | 'usageLog' | 'costSummary';

interface AppProps {
  plansFilePath?: string;
  usageFilePath?: string;
}

const App: React.FC<AppProps> = ({
  plansFilePath = './config/plans.json',
  usageFilePath = './data/usage_log.json',
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [plans, setPlans] = useState<Plan[]>(() => loadPlansSync(plansFilePath));
  const [usageEntries, setUsageEntries] = useState<UsageEntry[]>(() => loadUsageEntriesSync(usageFilePath));
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const plansWithUsage: PlanWithUsage[] = plans.map((plan) =>
    computePlanWithUsage(plan, usageEntries)
  );

  const handleAddPlan = async (plan: Plan) => {
    const updatedPlans = [...plans, plan];
    setPlans(updatedPlans);
    await savePlans(plansFilePath, updatedPlans);
    setCurrentScreen('dashboard');
  };

  const handleAddUsageEntry = async (entry: UsageEntry) => {
    const updatedEntries = [...usageEntries, entry];
    setUsageEntries(updatedEntries);
    await saveUsageEntries(usageFilePath, updatedEntries);
    setCurrentScreen('dashboard');
  };

  const handleDeleteUsageEntry = (entryId: string) => {
    const updatedEntries = usageEntries.filter((e) => e.id !== entryId);
    setUsageEntries(updatedEntries);
    saveUsageEntries(usageFilePath, updatedEntries);
  };

  return (
    <Box flexDirection="column">
      <Box borderStyle="single" padding={1}>
        <Text bold>AI Subscription Tracker</Text>
      </Box>
      <Box>
        <Text>Navigate: [D]ashboard | [A]dd Plan | [U]sage Log | [C]ost Summary | [Q]uit</Text>
      </Box>
      <Box padding={1}>
        {currentScreen === 'dashboard' && (
          <Dashboard
            plans={plansWithUsage}
            onLogUsage={(planId) => {
              setSelectedPlanId(planId);
              setCurrentScreen('usageLog');
            }}
          />
        )}
        {currentScreen === 'addPlan' && (
          <AddPlanForm onSubmit={handleAddPlan} onCancel={() => setCurrentScreen('dashboard')} />
        )}
        {currentScreen === 'usageLog' && selectedPlanId && (
          <UsageLogView
            entries={usageEntries}
            planId={selectedPlanId}
            onAdd={(tokens, note) => {
              const newEntry: UsageEntry = {
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
            }}
            onDelete={handleDeleteUsageEntry}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}
        {currentScreen === 'costSummary' && (
          <CostSummary plans={plansWithUsage} onBack={() => setCurrentScreen('dashboard')} />
        )}
      </Box>
    </Box>
  );
};

export default App;
