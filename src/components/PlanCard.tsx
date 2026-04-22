import React from 'react';
import { Box, Text } from 'ink';
import type { PlanWithUsage, Provider } from '../models/plan';

// Provider display names and icons
const providerInfo: Record<Provider, { name: string; icon: string }> = {
  cloud_code: { name: 'Cloud Code', icon: '☁' },
  codex: { name: 'Codex', icon: '⚡' },
  glm: { name: 'GLM', icon: '🔮' },
  minimax: { name: 'MiniMax', icon: '🤖' },
};

// Status colors
const statusColors: Record<string, string> = {
  active: 'green',
  expired: 'red',
  cancelled: 'yellow',
};

// Period labels
const periodLabels: Record<string, string> = {
  monthly: '/mo',
  quarterly: '/qtr',
  yearly: '/yr',
};

interface PlanCardProps {
  plan: PlanWithUsage;
  isSelected?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected = false }) => {
  const provider = providerInfo[plan.provider];
  const statusColor = statusColors[plan.status] || 'white';
  const periodLabel = periodLabels[plan.period] || '';

  // Format price
  const formatPrice = (price: number, currency: string): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };
    const symbol = symbols[currency] || currency + ' ';
    return `${symbol}${price.toFixed(2)}`;
  };

  // Visual budget bar (using block characters)
  const renderBudgetBar = (percentage: number): string => {
    const totalBlocks = 20;
    const filledBlocks = Math.round((percentage / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
  };

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={isSelected ? 'blue' : 'white'}
      padding={1}
      width={40}
    >
      {/* Header: Provider icon and name */}
      <Box justifyContent="space-between">
        <Text bold>
          {provider.icon} {provider.name}
        </Text>
        <Text bold color={statusColor}>
          {plan.status.toUpperCase()}
        </Text>
      </Box>

      {/* Plan name */}
      <Text>{plan.planName}</Text>

      {/* Visual budget bar */}
      <Box marginY={1}>
        <Text>
          Usage: {renderBudgetBar(plan.usagePercentage)} {plan.usagePercentage}%
        </Text>
      </Box>

      {/* Price and period */}
      <Box justifyContent="space-between">
        <Text>
          {formatPrice(plan.pricePerPeriod, plan.currency)}
          <Text dimColor>{periodLabel}</Text>
        </Text>
        <Text dimColor>Renews: {plan.renewalDate}</Text>
      </Box>

      {/* Token usage details */}
      <Box justifyContent="space-between" marginTop={1}>
        <Text dimColor>
          {plan.totalTokensUsed.toLocaleString()} used
        </Text>
        <Text dimColor>
          {plan.remainingTokens.toLocaleString()} left
        </Text>
      </Box>
    </Box>
  );
};

export default PlanCard;
