import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { UsageEntry } from '../models/plan';

interface UsageLogViewProps {
  entries: UsageEntry[];
  planId: string;
  onAdd: (tokens: number, note: string) => void;
  onDelete: (entryId: string) => void;
  onBack: () => void;
}

type ViewMode = 'list' | 'add';

const UsageLogView: React.FC<UsageLogViewProps> = ({
  entries,
  planId,
  onAdd,
  onDelete,
  onBack,
}) => {
  // Filter entries for this plan and sort by date descending
  const planEntries = entries
    .filter((e) => e.planId === planId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Selection state for list navigation
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Form state for add entry
  const [tokensInput, setTokensInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [formFieldIndex, setFormFieldIndex] = useState(0); // 0 = tokens, 1 = note
  const [formFocused, setFormFocused] = useState(false);

  // Reset selection when entries change
  useEffect(() => {
    if (selectedIndex >= planEntries.length && planEntries.length > 0) {
      setSelectedIndex(0);
    }
  }, [planEntries.length, selectedIndex]);

  // Keyboard handling
  useInput((input, key) => {
    // Escape handling
    if (key.escape) {
      if (viewMode === 'add') {
        // Cancel add mode and go back to list
        setViewMode('list');
        setTokensInput('');
        setNoteInput('');
        setFormFieldIndex(0);
      } else {
        // Exit from list view
        onBack();
      }
      return;
    }

    if (viewMode === 'add') {
      // Add entry form keyboard handling
      if (key.return) {
        // Submit the entry
        const tokens = parseInt(tokensInput, 10);
        if (!isNaN(tokens) && tokens > 0) {
          onAdd(tokens, noteInput);
          setTokensInput('');
          setNoteInput('');
          setFormFieldIndex(0);
          setViewMode('list');
        }
        return;
      }

      if (key.tab || key.rightArrow || key.downArrow) {
        setFormFieldIndex((prev) => Math.min(prev + 1, 2)); // 2 = submit button index
      }
      if (key.leftArrow || key.upArrow) {
        setFormFieldIndex((prev) => Math.max(prev - 1, 0));
      }

      // Handle text input
      if (!key.tab && !key.return && !key.escape && !key.upArrow && !key.downArrow && !key.leftArrow && !key.rightArrow) {
        if (formFieldIndex === 0) {
          // Tokens field - only numbers
          if (key.backspace || key.delete) {
            setTokensInput((prev) => prev.slice(0, -1));
          } else if (/[0-9]/.test(input)) {
            setTokensInput((prev) => prev + input);
          }
        } else if (formFieldIndex === 1) {
          // Note field
          if (key.backspace || key.delete) {
            setNoteInput((prev) => prev.slice(0, -1));
          } else if (input) {
            setNoteInput((prev) => prev + input);
          }
        }
      }
      return;
    }

    // List view keyboard handling
    if (key.escape) {
      onBack();
      return;
    }

    // Navigation
    if (key.upArrow || key.leftArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : planEntries.length - 1));
      return;
    }
    if (key.downArrow || key.rightArrow) {
      setSelectedIndex((prev) => (prev < planEntries.length - 1 ? prev + 1 : 0));
      return;
    }

    // Delete with 'd' key
    if (input === 'd' || input === 'D') {
      if (planEntries.length > 0 && selectedIndex < planEntries.length) {
        onDelete(planEntries[selectedIndex].id);
        // Adjust selection if needed
        if (selectedIndex >= planEntries.length - 1 && selectedIndex > 0) {
          setSelectedIndex((prev) => prev - 1);
        }
      }
      return;
    }

    // Enter to add new entry
    if (key.return) {
      setViewMode('add');
      setTokensInput('');
      setNoteInput('');
      setFormFieldIndex(0);
      setFormFocused(true);
      return;
    }

    // 'a' to add new entry
    if (input === 'a' || input === 'A') {
      setViewMode('add');
      setTokensInput('');
      setNoteInput('');
      setFormFieldIndex(0);
      setFormFocused(true);
      return;
    }
  });

  // Calculate total tokens
  const totalTokens = planEntries.reduce((sum, e) => sum + e.tokens, 0);

  // Render add entry form
  if (viewMode === 'add') {
    const isTokensFocused = formFieldIndex === 0;
    const isNoteFocused = formFieldIndex === 1;
    const isSubmitFocused = formFieldIndex === 2;

    return (
      <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
        <Text bold>Add Usage Entry</Text>
        <Box marginTop={1} />

        {/* Tokens Input */}
        <Box alignItems="center">
          <Text dimColor={!isTokensFocused}>
            {isTokensFocused ? '>' : ' '} Tokens: {tokensInput || '(e.g. 50000)'}
          </Text>
        </Box>

        {/* Note Input */}
        <Box alignItems="center">
          <Text dimColor={!isNoteFocused}>
            {isNoteFocused ? '>' : ' '} Note: {noteInput || '(optional)'}
          </Text>
        </Box>

        <Box marginTop={1} />

        {/* Action Buttons */}
        <Box>
          <Text
            bold={isSubmitFocused}
            color={isSubmitFocused ? 'cyan' : undefined}
          >
            {isSubmitFocused ? '>' : ' '} Add Entry
          </Text>
          <Text>  </Text>
          <Text dimColor>Cancel (Esc)</Text>
        </Box>

        <Box marginTop={1} />
        <Text dimColor>Tokens: numbers only | Note: any text</Text>
        <Text dimColor>Enter: add | Esc: cancel</Text>
      </Box>
    );
  }

  // Render entries list
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text bold>Usage Log - Plan: {planId}</Text>
      <Box marginTop={1} />

      {/* Header */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Text dimColor>Total: {totalTokens.toLocaleString()} tokens</Text>
        <Text dimColor>{planEntries.length} entries</Text>
      </Box>

      {/* Entries List */}
      {planEntries.length === 0 ? (
        <Text dimColor>No usage entries yet. Press [a] or [Enter] to add.</Text>
      ) : (
        planEntries.map((entry, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box
              key={entry.id}
              justifyContent="space-between"
              paddingX={1}
            >
              <Text
                bold={isSelected}
                color={isSelected ? 'black' : undefined}
              >
                {isSelected ? '> ' : '  '}
                {entry.date}
              </Text>
              <Text
                bold={isSelected}
                color={isSelected ? 'black' : undefined}
              >
                {entry.tokens.toLocaleString()} tokens
              </Text>
              {entry.periodStart && entry.periodEnd && (
                <Text
                  bold={isSelected}
                  dimColor={!isSelected}
                >
                  ({entry.periodStart} to {entry.periodEnd})
                </Text>
              )}
            </Box>
          );
        })
      )}

      <Box marginTop={1} />

      {/* Keyboard hints */}
      <Box justifyContent="space-around">
        <Text dimColor>
          [<Text bold color="cyan">↑↓</Text>] Navigate
        </Text>
        <Text dimColor>
          [<Text bold color="cyan">d</Text>] Delete
        </Text>
        <Text dimColor>
          [<Text bold color="cyan">a</Text>/<Text bold color="cyan">Enter</Text>] Add
        </Text>
        <Text dimColor>
          [<Text bold color="cyan">Esc</Text>] Back
        </Text>
      </Box>

      {/* Delete confirmation hint when entry selected */}
      {planEntries.length > 0 && selectedIndex < planEntries.length && (
        <Box marginTop={1}>
          <Text dimColor>
            Selected: {planEntries[selectedIndex].date} - {planEntries[selectedIndex].tokens.toLocaleString()} tokens
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default UsageLogView;