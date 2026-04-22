import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { Plan, Provider, PlanPeriod } from '../models/plan';

interface AddPlanFormProps {
  onSubmit: (plan: Plan) => void;
  onCancel: () => void;
  plan?: Plan; // Optional: if provided, form is in edit mode
}

const PROVIDERS: Provider[] = ['cloud_code', 'codex', 'glm', 'minimax'];
const PROVIDER_LABELS: Record<Provider, string> = {
  cloud_code: 'Cloud Code',
  codex: 'Codex',
  glm: 'GLM',
  minimax: 'MiniMax',
};

const PERIODS: PlanPeriod[] = ['monthly', 'quarterly', 'yearly'];
const PERIOD_LABELS: Record<PlanPeriod, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

type FieldName = 'provider' | 'planName' | 'tokenBudget' | 'period' | 'price' | 'renewalDate' | 'submit' | 'cancel';

const FIELD_ORDER: FieldName[] = ['provider', 'planName', 'tokenBudget', 'period', 'price', 'renewalDate', 'submit', 'cancel'];

const AddPlanForm: React.FC<AddPlanFormProps> = ({ onSubmit, onCancel, plan }) => {
  const isEditMode = Boolean(plan);

  // Form state
  const [provider, setProvider] = useState<Provider>(plan?.provider || 'minimax');
  const [planName, setPlanName] = useState(plan?.planName || '');
  const [tokenBudget, setTokenBudget] = useState(plan?.tokenBudget?.toString() || '');
  const [period, setPeriod] = useState<PlanPeriod>(plan?.period || 'monthly');
  const [price, setPrice] = useState(plan?.pricePerPeriod?.toString() || '');
  const [renewalDate, setRenewalDate] = useState(plan?.renewalDate || '');

  // Focus state - index into FIELD_ORDER
  const [focusIndex, setFocusIndex] = useState(0);
  const currentField = FIELD_ORDER[focusIndex];

  // Handle keyboard navigation
  useInput((input, key) => {
    const field = FIELD_ORDER[focusIndex];

    // Escape always cancels
    if (key.escape) {
      onCancel();
      return;
    }

    // Arrow navigation only for select fields
    if (field === 'provider' || field === 'period') {
      if (key.upArrow) {
        // Move to previous option
        if (field === 'provider') {
          const idx = PROVIDERS.indexOf(provider);
          setProvider(PROVIDERS[idx > 0 ? idx - 1 : PROVIDERS.length - 1]);
        } else {
          const idx = PERIODS.indexOf(period);
          setPeriod(PERIODS[idx > 0 ? idx - 1 : PERIODS.length - 1]);
        }
      } else if (key.downArrow) {
        // Move to next option
        if (field === 'provider') {
          const idx = PROVIDERS.indexOf(provider);
          setProvider(PROVIDERS[(idx + 1) % PROVIDERS.length]);
        } else {
          const idx = PERIODS.indexOf(period);
          setPeriod(PERIODS[(idx + 1) % PERIODS.length]);
        }
      }
    }

    // Tab / Enter: advance to next field
    if (key.tab || (key.return && field !== 'submit' && field !== 'cancel')) {
      setFocusIndex((prev) => Math.min(prev + 1, FIELD_ORDER.length - 1));
    }

    // Shift+Tab: go back
    if (key.tab && key.shift) {
      setFocusIndex((prev) => Math.max(prev - 1, 0));
    }

    // Arrow keys also navigate between fields
    if (key.rightArrow || key.downArrow) {
      if (field !== 'provider' && field !== 'period') {
        setFocusIndex((prev) => Math.min(prev + 1, FIELD_ORDER.length - 1));
      }
    }
    if (key.leftArrow || key.upArrow) {
      if (field !== 'provider' && field !== 'period') {
        setFocusIndex((prev) => Math.max(prev - 1, 0));
      }
    }

    // Enter on submit button
    if (key.return && (field === 'submit' || field === 'cancel')) {
      if (field === 'submit') {
        handleSubmit();
      } else {
        onCancel();
      }
    }

    // Handle text input for text fields
    if (!key.tab && !key.return && !key.escape && !key.upArrow && !key.downArrow && !key.leftArrow && !key.rightArrow) {
      if (field === 'planName') {
        if (key.backspace || key.delete) {
          setPlanName((prev: string) => prev.slice(0, -1));
        } else if (input) {
          setPlanName((prev: string) => prev + input);
        }
      } else if (field === 'tokenBudget') {
        if (key.backspace || key.delete) {
          setTokenBudget((prev: string) => prev.slice(0, -1));
        } else if (/[0-9]/.test(input)) {
          setTokenBudget((prev: string) => prev + input);
        }
      } else if (field === 'price') {
        if (key.backspace || key.delete) {
          setPrice((prev: string) => prev.slice(0, -1));
        } else if (/[0-9.]/.test(input)) {
          setPrice((prev: string) => prev + input);
        }
      } else if (field === 'renewalDate') {
        if (key.backspace || key.delete) {
          setRenewalDate((prev: string) => prev.slice(0, -1));
        } else if (/[0-9-]/.test(input)) {
          setRenewalDate((prev: string) => prev + input);
        }
      }
    }
  });

  const handleSubmit = () => {
    // Validate required fields
    if (!planName.trim()) {
      return;
    }
    if (!tokenBudget || isNaN(Number(tokenBudget)) || Number(tokenBudget) <= 0) {
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return;
    }
    if (!renewalDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return;
    }

    const newPlan: Plan = {
      id: plan?.id || `plan_${Date.now()}`,
      planName: planName.trim(),
      provider,
      period,
      pricePerPeriod: Number(price),
      currency: plan?.currency || 'USD',
      tokenBudget: Number(tokenBudget),
      status: plan?.status || 'active',
      startDate: plan?.startDate || new Date().toISOString().split('T')[0],
      renewalDate: renewalDate,
      createdAt: plan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newPlan);
  };

  const isFieldFocused = (field: FieldName) => currentField === field;

  const renderFieldIndicator = (field: FieldName) => {
    return isFieldFocused(field) ? '>' : ' ';
  };

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text bold>{isEditMode ? 'Edit Plan' : 'Add New Plan'}</Text>
      <Box marginTop={1} />

      {/* Provider Select */}
      <Box alignItems="center">
        <Text dimColor={!isFieldFocused('provider')}>
          {renderFieldIndicator('provider')} Provider: {PROVIDER_LABELS[provider]}
        </Text>
      </Box>

      {/* Plan Name Input */}
      <Box alignItems="center">
        <Text dimColor={!isFieldFocused('planName')}>
          {renderFieldIndicator('planName')} Plan Name: {planName || '(enter name)'}
        </Text>
      </Box>

      {/* Token Budget Input */}
      <Box alignItems="center">
        <Text dimColor={!isFieldFocused('tokenBudget')}>
          {renderFieldIndicator('tokenBudget')} Token Budget: {tokenBudget || '(e.g. 1000000)'}
        </Text>
      </Box>

      {/* Period Select */}
      <Box alignItems="center">
        <Text dimColor={!isFieldFocused('period')}>
          {renderFieldIndicator('period')} Period: {PERIOD_LABELS[period]}
        </Text>
      </Box>

      {/* Price Input */}
      <Box alignItems="center">
        <Text dimColor={!isFieldFocused('price')}>
          {renderFieldIndicator('price')} Price ($): {price || '(e.g. 29.99)'}
        </Text>
      </Box>

      {/* Renewal Date Input */}
      <Box alignItems="center">
        <Text dimColor={!isFieldFocused('renewalDate')}>
          {renderFieldIndicator('renewalDate')} Renewal Date: {renewalDate || '(YYYY-MM-DD)'}
        </Text>
      </Box>

      <Box marginTop={1} />

      {/* Action Buttons */}
      <Box>
        <Text
          bold={isFieldFocused('submit')}
          color={isFieldFocused('submit') ? 'cyan' : undefined}
        >
          {renderFieldIndicator('submit')} Submit
        </Text>
        <Text>  </Text>
        <Text
          bold={isFieldFocused('cancel')}
          color={isFieldFocused('cancel') ? 'red' : undefined}
        >
          {renderFieldIndicator('cancel')} Cancel (Esc)
        </Text>
      </Box>

      <Box marginTop={1} />
      <Text dimColor>Arrows/Tab: navigate | Enter: confirm | Esc: cancel</Text>
      {isFieldFocused('provider') && <Text dimColor>↑↓: change provider</Text>}
      {isFieldFocused('period') && <Text dimColor>↑↓: change period</Text>}
    </Box>
  );
};

export default AddPlanForm;
