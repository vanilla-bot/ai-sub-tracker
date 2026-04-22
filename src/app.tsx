import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import Dashboard from './components/Dashboard';
import AddPlanForm from './components/AddPlanForm';
import UsageLogView from './components/UsageLogView';
import CostSummary from './components/CostSummary';
import { loadPlans, loadUsageEntries, savePlans, saveUsageEntries } from './store/fileStore';
import { computePlanWithUsage } from './models/plan';
import type { Plan, UsageEntry, PlanWithUsage } from './models/plan';

type Screen = 'dashboard' | 'addPlan' | 'usageLog' | 'costSummary';

interface AppProps {
  plansFilePath?: string;
  usageFilePath?: string;
}

const App: React.FC<AppProps> = ({
  plansFilePath = './data/plans.json',
  usageFilePath = './data/usage.json',
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usageEntries, setUsageEntries] = useState<UsageEntry[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [plansFilePath, usageFilePath]);

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

  if (isLoading) {
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }

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
        {currentScreen === 'usageLog' && (
          <UsageLogView
            entries={usageEntries}
            planId={selectedPlanId || ''}
            onAdd={(tokens, note) => {
              const newEntry: UsageEntry = {
                id: `entry_${Date.now()}`,
                planId: selectedPlanId || '',
                date: new Date().toISOString().split('T')[0],
                tokens,
                periodStart: '',
                periodEnd: '',
              };
              handleAddUsageEntry(newEntry);
            }}
            onDelete={(entryId) => {
              const updatedEntries = usageEntries.filter((e) => e.id !== entryId);
              setUsageEntries(updatedEntries);
              saveUsageEntries(usageFilePath, updatedEntries);
            }}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}
        {currentScreen === 'costSummary' && <CostSummary plans={plansWithUsage} />}
      </Box>
    </Box>
  );
};

export default App;
