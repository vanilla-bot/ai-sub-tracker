import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text } from 'ink';
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
  const handleKeyPress = useCallback(
    (key: string) => {
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
    },
    [plans, selectedIndex, columns, onAddPlan, onEditPlan, onDeletePlan, onLogUsage, onCostSummary, onQuit]
  );

  // Register stdin listener for keyboard input
  useEffect(() => {
    const handleStdin = (data: Buffer) => {
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
        <Text dimColor>
          [<Text bold color="cyan">a</Text>]dd
        </Text>
        <Text dimColor>
          [<Text bold color="cyan">e</Text>]dit
        </Text>
        <Text dimColor>
          [<Text bold color="cyan">d</Text>]elete
        </Text>
        <Text dimColor>
          [<Text bold color="cyan">l</Text>]og usage
        </Text>
        <Text dimColor>
          [<Text bold color="cyan">c</Text>]ost
        </Text>
        <Text dimColor>
          [<Text bold color="cyan">q</Text>]uit
        </Text>
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
          <Text>{plans[selectedIndex].name}</Text>
          <Text dimColor> ({plans[selectedIndex].provider})</Text>
          <Text> | </Text>
          <Text>
            {plans[selectedIndex].totalTokensUsed.toLocaleString()} /{' '}
            {plans[selectedIndex].maxTokens.toLocaleString()} tokens used
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
