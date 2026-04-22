import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
const PROVIDERS = ['cloud_code', 'codex', 'glm', 'minimax'];
const PROVIDER_LABELS = {
    cloud_code: 'Cloud Code',
    codex: 'Codex',
    glm: 'GLM',
    minimax: 'MiniMax',
};
const PERIODS = ['monthly', 'quarterly', 'yearly'];
const PERIOD_LABELS = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
};
const FIELD_ORDER = ['provider', 'planName', 'tokenBudget', 'period', 'price', 'renewalDate', 'submit', 'cancel'];
const AddPlanForm = ({ onSubmit, onCancel, plan }) => {
    const isEditMode = Boolean(plan);
    // Form state
    const [provider, setProvider] = useState(plan?.provider || 'minimax');
    const [planName, setPlanName] = useState(plan?.name || '');
    const [tokenBudget, setTokenBudget] = useState(plan?.maxTokens?.toString() || '');
    const [period, setPeriod] = useState(plan?.period || 'monthly');
    const [price, setPrice] = useState(plan?.price?.toString() || '');
    const [renewalDate, setRenewalDate] = useState(plan?.endDate || '');
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
                }
                else {
                    const idx = PERIODS.indexOf(period);
                    setPeriod(PERIODS[idx > 0 ? idx - 1 : PERIODS.length - 1]);
                }
            }
            else if (key.downArrow) {
                // Move to next option
                if (field === 'provider') {
                    const idx = PROVIDERS.indexOf(provider);
                    setProvider(PROVIDERS[(idx + 1) % PROVIDERS.length]);
                }
                else {
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
            }
            else {
                onCancel();
            }
        }
        // Handle text input for text fields
        if (!key.tab && !key.return && !key.escape && !key.upArrow && !key.downArrow && !key.leftArrow && !key.rightArrow) {
            if (field === 'planName') {
                if (key.backspace || key.delete) {
                    setPlanName((prev) => prev.slice(0, -1));
                }
                else if (input) {
                    setPlanName((prev) => prev + input);
                }
            }
            else if (field === 'tokenBudget') {
                if (key.backspace || key.delete) {
                    setTokenBudget((prev) => prev.slice(0, -1));
                }
                else if (/[0-9]/.test(input)) {
                    setTokenBudget((prev) => prev + input);
                }
            }
            else if (field === 'price') {
                if (key.backspace || key.delete) {
                    setPrice((prev) => prev.slice(0, -1));
                }
                else if (/[0-9.]/.test(input)) {
                    setPrice((prev) => prev + input);
                }
            }
            else if (field === 'renewalDate') {
                if (key.backspace || key.delete) {
                    setRenewalDate((prev) => prev.slice(0, -1));
                }
                else if (/[0-9-]/.test(input)) {
                    setRenewalDate((prev) => prev + input);
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
        const newPlan = {
            id: plan?.id || `plan_${Date.now()}`,
            name: planName.trim(),
            provider,
            period,
            price: Number(price),
            currency: plan?.currency || 'USD',
            maxTokens: Number(tokenBudget),
            status: plan?.status || 'active',
            startDate: plan?.startDate || new Date().toISOString().split('T')[0],
            endDate: renewalDate,
        };
        onSubmit(newPlan);
    };
    const isFieldFocused = (field) => currentField === field;
    const renderFieldIndicator = (field) => {
        return isFieldFocused(field) ? '>' : ' ';
    };
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", padding: 1, children: [_jsx(Text, { bold: true, children: isEditMode ? 'Edit Plan' : 'Add New Plan' }), _jsx(Box, { marginTop: 1 }), _jsx(Box, { alignItems: "center", children: _jsxs(Text, { dimColor: !isFieldFocused('provider'), children: [renderFieldIndicator('provider'), " Provider: ", PROVIDER_LABELS[provider]] }) }), _jsx(Box, { alignItems: "center", children: _jsxs(Text, { dimColor: !isFieldFocused('planName'), children: [renderFieldIndicator('planName'), " Plan Name: ", planName || '(enter name)'] }) }), _jsx(Box, { alignItems: "center", children: _jsxs(Text, { dimColor: !isFieldFocused('tokenBudget'), children: [renderFieldIndicator('tokenBudget'), " Token Budget: ", tokenBudget || '(e.g. 1000000)'] }) }), _jsx(Box, { alignItems: "center", children: _jsxs(Text, { dimColor: !isFieldFocused('period'), children: [renderFieldIndicator('period'), " Period: ", PERIOD_LABELS[period]] }) }), _jsx(Box, { alignItems: "center", children: _jsxs(Text, { dimColor: !isFieldFocused('price'), children: [renderFieldIndicator('price'), " Price ($): ", price || '(e.g. 29.99)'] }) }), _jsx(Box, { alignItems: "center", children: _jsxs(Text, { dimColor: !isFieldFocused('renewalDate'), children: [renderFieldIndicator('renewalDate'), " Renewal Date: ", renewalDate || '(YYYY-MM-DD)'] }) }), _jsx(Box, { marginTop: 1 }), _jsxs(Box, { children: [_jsxs(Text, { bold: isFieldFocused('submit'), color: isFieldFocused('submit') ? 'cyan' : undefined, children: [renderFieldIndicator('submit'), " Submit"] }), _jsx(Text, { children: "  " }), _jsxs(Text, { bold: isFieldFocused('cancel'), color: isFieldFocused('cancel') ? 'red' : undefined, children: [renderFieldIndicator('cancel'), " Cancel (Esc)"] })] }), _jsx(Box, { marginTop: 1 }), _jsx(Text, { dimColor: true, children: "Arrows/Tab: navigate | Enter: confirm | Esc: cancel" }), isFieldFocused('provider') && _jsx(Text, { dimColor: true, children: "\u2191\u2193: change provider" }), isFieldFocused('period') && _jsx(Text, { dimColor: true, children: "\u2191\u2193: change period" })] }));
};
export default AddPlanForm;
//# sourceMappingURL=AddPlanForm.js.map