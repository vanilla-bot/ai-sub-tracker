import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import PlanCard from './PlanCard';
import type { PlanWithUsage } from '../models/plan';

interface DashboardProps {
  plans: PlanWithUsage[];
  onAddPlan?: () => void;
  onEditPlan?: (planId: string) => void;
  onDeletePlan?: (planId: string) => void;
  onLogUsage?: (planId: string) => void;
  onCostSummary?: () => void;
  onQuit?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  plans,
  onAddPlan,
  onEditPlan,
  onDeletePlan,
  onLogUsage,
  onCostSummary,
  onQuit,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get terminal width for column calculation
  const columns = Math.max(1, Math.floor((process.stdout.columns || 80) / 41));

  // Keyboard navigation using Ink's useInput
  useInput((input, key) => {
    const totalCards = plans.length;
    if (totalCards === 0) return;

    if (key.upArrow || input === 'k') {
      setSelectedIndex((prev) => (prev - columns + totalCards) % totalCards);
    } else if (key.downArrow || input === 'j') {
      setSelectedIndex((prev) => (prev + columns) % totalCards);
    } else if (key.leftArrow || input === 'h') {
      setSelectedIndex((prev) => (prev - 1 + totalCards) % totalCards);
    } else if (key.rightArrow || input === 'l') {
      setSelectedIndex((prev) => (prev + 1) % totalCards);
    } else if (input === 'a' || input === 'A') {
      onAddPlan?.();
    } else if (input === 'e' || input === 'E') {
      if (plans[selectedIndex]) onEditPlan?.(plans[selectedIndex].id);
    } else if (input === 'd' || input === 'D') {
      if (plans[selectedIndex]) onDeletePlan?.(plans[selectedIndex].id);
    } else if (input === 'u' || input === 'U') {
      if (plans[selectedIndex]) onLogUsage?.(plans[selectedIndex].id);
    } else if (input === 'c' || input === 'C') {
      onCostSummary?.();
    } else if (input === 'q' || input === 'Q') {
      onQuit?.();
    }
  });

  // Update selected index when plans change
  if (selectedIndex >= plans.length && plans.length > 0) {
    setSelectedIndex(0);
  }

  // Empty state
  if (plans.length === 0) {
    return (
      <Box flexDirection="column" alignItems="center" padding={2}>
        <Text bold>No plans yet</Text>
        <Text dimColor>Press [a] to add your first subscription plan</Text>
      </Box>
    );
  }

  // Build grid of PlanCards
  const rows: PlanWithUsage[][] = [];
  for (let i = 0; i < plans.length; i += columns) {
    rows.push(plans.slice(i, i + columns));
  }

  return (
    <Box flexDirection="column">
      {/* Keyboard navigation hints */}
      <Box justifyContent="space-around" marginBottom={1}>
        <Text dimColor>[<Text bold color="cyan">a</Text>]dd</Text>
        <Text dimColor>[<Text bold color="cyan">e</Text>]dit</Text>
        <Text dimColor>[<Text bold color="cyan">d</Text>]elete</Text>
        <Text dimColor>[<Text bold color="cyan">u</Text>]sage</Text>
        <Text dimColor>[<Text bold color="cyan">c</Text>]ost</Text>
        <Text dimColor>[<Text bold color="cyan">q</Text>]uit</Text>
      </Box>

      <Box justifyContent="space-between" marginBottom={1}>
        <Text dimColor>Navigate: Arrow keys or h,j,k,l</Text>
        <Text dimColor>{plans.length} plan(s) | Selected: {selectedIndex + 1}</Text>
      </Box>

      {/* Plan cards grid */}
      {rows.map((row, rowIndex) => (
        <Box key={rowIndex} justifyContent="flex-start" gap={1}>
          {row.map((plan, colIndex) => {
            const planIndex = rowIndex * columns + colIndex;
            const isSelected = planIndex === selectedIndex;
            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={isSelected}
              />
            );
          })}
          {/* Fill empty slots if row is not complete */}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, i) => (
              <Box key={`empty-${i}`} width={40} />
            ))}
        </Box>
      ))}

      {/* Selected plan details */}
      {plans[selectedIndex] && (
        <Box marginTop={1} padding={1} borderStyle="single">
          <Text bold>Selected: </Text>
          <Text>{plans[selectedIndex].planName}</Text>
          <Text dimColor> ({plans[selectedIndex].provider})</Text>
          <Text> | </Text>
          <Text>
            {plans[selectedIndex].totalTokensUsed.toLocaleString()} /{' '}
            {plans[selectedIndex].tokenBudget.toLocaleString()} tokens used
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
