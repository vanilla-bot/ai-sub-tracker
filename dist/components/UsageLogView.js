import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
const UsageLogView = ({ entries, planId, onAdd, onDelete, onBack, }) => {
    // Filter entries for this plan and sort by date descending
    const planEntries = entries
        .filter((e) => e.planId === planId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // View mode state
    const [viewMode, setViewMode] = useState('list');
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
            }
            else {
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
                    }
                    else if (/[0-9]/.test(input)) {
                        setTokensInput((prev) => prev + input);
                    }
                }
                else if (formFieldIndex === 1) {
                    // Note field
                    if (key.backspace || key.delete) {
                        setNoteInput((prev) => prev.slice(0, -1));
                    }
                    else if (input) {
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
        return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", padding: 1, children: [_jsx(Text, { bold: true, children: "Add Usage Entry" }), _jsx(Box, { marginTop: 1 }), _jsx(Box, { alignItems: "center", children: _jsxs(Text, { dimColor: !isTokensFocused, children: [isTokensFocused ? '>' : ' ', " Tokens: ", tokensInput || '(e.g. 50000)'] }) }), _jsx(Box, { alignItems: "center", children: _jsxs(Text, { dimColor: !isNoteFocused, children: [isNoteFocused ? '>' : ' ', " Note: ", noteInput || '(optional)'] }) }), _jsx(Box, { marginTop: 1 }), _jsxs(Box, { children: [_jsxs(Text, { bold: isSubmitFocused, color: isSubmitFocused ? 'cyan' : undefined, children: [isSubmitFocused ? '>' : ' ', " Add Entry"] }), _jsx(Text, { children: "  " }), _jsx(Text, { dimColor: true, children: "Cancel (Esc)" })] }), _jsx(Box, { marginTop: 1 }), _jsx(Text, { dimColor: true, children: "Tokens: numbers only | Note: any text" }), _jsx(Text, { dimColor: true, children: "Enter: add | Esc: cancel" })] }));
    }
    // Render entries list
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", padding: 1, children: [_jsxs(Text, { bold: true, children: ["Usage Log - Plan: ", planId] }), _jsx(Box, { marginTop: 1 }), _jsxs(Box, { justifyContent: "space-between", marginBottom: 1, children: [_jsxs(Text, { dimColor: true, children: ["Total: ", totalTokens.toLocaleString(), " tokens"] }), _jsxs(Text, { dimColor: true, children: [planEntries.length, " entries"] })] }), planEntries.length === 0 ? (_jsx(Text, { dimColor: true, children: "No usage entries yet. Press [a] or [Enter] to add." })) : (planEntries.map((entry, index) => {
                const isSelected = index === selectedIndex;
                return (_jsxs(Box, { justifyContent: "space-between", paddingX: 1, children: [_jsxs(Text, { bold: isSelected, color: isSelected ? 'black' : undefined, children: [isSelected ? '> ' : '  ', entry.date] }), _jsxs(Text, { bold: isSelected, color: isSelected ? 'black' : undefined, children: [entry.tokens.toLocaleString(), " tokens"] }), entry.periodStart && entry.periodEnd && (_jsxs(Text, { bold: isSelected, dimColor: !isSelected, children: ["(", entry.periodStart, " to ", entry.periodEnd, ")"] }))] }, entry.id));
            })), _jsx(Box, { marginTop: 1 }), _jsxs(Box, { justifyContent: "space-around", children: [_jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "\u2191\u2193" }), "] Navigate"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "d" }), "] Delete"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "a" }), "/", _jsx(Text, { bold: true, color: "cyan", children: "Enter" }), "] Add"] }), _jsxs(Text, { dimColor: true, children: ["[", _jsx(Text, { bold: true, color: "cyan", children: "Esc" }), "] Back"] })] }), planEntries.length > 0 && selectedIndex < planEntries.length && (_jsx(Box, { marginTop: 1, children: _jsxs(Text, { dimColor: true, children: ["Selected: ", planEntries[selectedIndex].date, " - ", planEntries[selectedIndex].tokens.toLocaleString(), " tokens"] }) }))] }));
};
export default UsageLogView;
//# sourceMappingURL=UsageLogView.js.map