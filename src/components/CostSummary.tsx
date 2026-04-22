import React, { useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { PlanWithUsage, PlanPeriod } from '../models/plan';
import { formatCurrency } from '../models/plan';

interface CostSummaryProps {
  plans: PlanWithUsage[];
  onBack: () => void;
}

/**
 * Calculate the monthly equivalent cost for a plan based on its billing period.
 */
function getMonthlyEquivalent(price: number, period: PlanPeriod): number {
  switch (period) {
    case 'monthly':
      return price / 1;
    case 'quarterly':
      return price / 3;
    case 'yearly':
      return price / 12;
    default:
      return price;
  }
}

/**
 * Get the divisor for converting period price to monthly equivalent.
 */
function getPeriodDivisor(period: PlanPeriod): number {
  switch (period) {
    case 'monthly':
      return 1;
    case 'quarterly':
      return 3;
    case 'yearly':
      return 12;
    default:
      return 1;
  }
}

/**
 * CostSummary displays a table of all plans with their billing information,
 * monthly equivalents, and total cost projections.
 */
const CostSummary: React.FC<CostSummaryProps> = ({ plans, onBack }) => {
  // Handle Escape key to go back
  useInput((input, key) => {
    if (key.escape) {
      onBack();
    }
  });

  // Calculate totals
  const monthlyTotal = plans.reduce((sum, plan) => {
    return sum + getMonthlyEquivalent(plan.price, plan.period);
  }, 0);

  const annualProjection = monthlyTotal * 12;

  // Format period name for display
  const formatPeriod = (period: PlanPeriod): string => {
    switch (period) {
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'yearly':
        return 'Yearly';
      default:
        return period;
    }
  };

  // Empty state
  if (plans.length === 0) {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
        <Text bold>Cost Summary</Text>
        <Box marginTop={1} />
        <Text dimColor>No plans to display.</Text>
        <Text dimColor>Add a plan to see cost projections.</Text>
        <Box marginTop={1} />
        <Text dimColor>Press [Esc] to go back</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text bold>Cost Summary</Text>
      <Box marginTop={1} />

      {/* Header Row */}
      <Box justifyContent="space-between" borderStyle="single" paddingX={1}>
        <Text bold>Plan</Text>
        <Text bold>Period</Text>
        <Text bold>Price</Text>
        <Text bold>Monthly</Text>
      </Box>

      {/* Plan Rows */}
      {plans.map((plan) => {
        const monthlyEquiv = getMonthlyEquivalent(plan.price, plan.period);
        const divisor = getPeriodDivisor(plan.period);
        
        return (
          <Box key={plan.id} justifyContent="space-between" paddingX={1}>
            <Text>{plan.name}</Text>
            <Text dimColor>{formatPeriod(plan.period)}</Text>
            <Text>{formatCurrency(plan.price, plan.currency)}</Text>
            <Text>{formatCurrency(monthlyEquiv, plan.currency)}/mo</Text>
          </Box>
        );
      })}

      <Box marginTop={1} />

      {/* Totals Section */}
      <Box flexDirection="column" borderStyle="single" padding={1}>
        <Box justifyContent="space-between">
          <Text bold>Monthly Total:</Text>
          <Text bold>{formatCurrency(monthlyTotal, 'USD')}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Text bold>Annual Projection:</Text>
          <Text bold color="cyan">{formatCurrency(annualProjection, 'USD')}</Text>
        </Box>
      </Box>

      <Box marginTop={1} />

      {/* Footer hint */}
      <Text dimColor>Press [Esc] to go back</Text>
    </Box>
  );
};

export default CostSummary;