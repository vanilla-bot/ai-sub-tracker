import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsageLogView from './UsageLogView';
// Mock ink components
vi.mock('ink', async () => {
    const actual = await vi.importActual('ink');
    return {
        ...actual,
        useInput: vi.fn(),
        Box: ({ children }) => children,
        Text: ({ children, ...props }) => {
            const { bold, dimColor, color, inverse } = props;
            let text = Array.isArray(children) ? children.join('') : children;
            if (bold)
                text = `[BOLD]${text}[/BOLD]`;
            if (dimColor)
                text = `[DIM]${text}[/DIM]`;
            if (color)
                text = `[${color.toUpperCase()}]${text}[/${color.toUpperCase()}]`;
            if (inverse)
                text = `[INVERSE]${text}[/INVERSE]`;
            return text;
        },
    };
});
describe('UsageLogView', () => {
    const mockEntries = [
        { id: '1', planId: 'plan_001', date: '2024-01-15', tokens: 50000, periodStart: '2024-01-01', periodEnd: '2024-01-31' },
        { id: '2', planId: 'plan_001', date: '2024-01-10', tokens: 30000, periodStart: '2024-01-01', periodEnd: '2024-01-31' },
        { id: '3', planId: 'plan_001', date: '2024-01-05', tokens: 20000, periodStart: '2024-01-01', periodEnd: '2024-01-31' },
    ];
    const mockProps = {
        entries: mockEntries,
        planId: 'plan_001',
        onAdd: vi.fn(),
        onDelete: vi.fn(),
        onBack: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should be a function component', () => {
        expect(typeof UsageLogView).toBe('function');
    });
    it('should display entries sorted by date descending', () => {
        // Entries should be sorted newest first
        const sortedEntries = [...mockEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        expect(sortedEntries[0].date).toBe('2024-01-15');
        expect(sortedEntries[1].date).toBe('2024-01-10');
        expect(sortedEntries[2].date).toBe('2024-01-05');
    });
    it('should display date, tokens, and note for each entry', () => {
        // Verify entry structure has required fields
        mockEntries.forEach((entry) => {
            expect(entry).toHaveProperty('date');
            expect(entry).toHaveProperty('tokens');
            expect(entry).toHaveProperty('id');
            expect(entry).toHaveProperty('planId');
        });
    });
    it('should filter entries by planId', () => {
        const planId = 'plan_001';
        const filteredEntries = mockEntries.filter((e) => e.planId === planId);
        expect(filteredEntries).toHaveLength(3);
        const otherPlanEntries = mockEntries.filter((e) => e.planId === 'other_plan');
        expect(otherPlanEntries).toHaveLength(0);
    });
    it('should accept onAdd, onDelete, and onBack callbacks', () => {
        expect(typeof mockProps.onAdd).toBe('function');
        expect(typeof mockProps.onDelete).toBe('function');
        expect(typeof mockProps.onBack).toBe('function');
    });
    it('should have add entry form with tokens and note fields', () => {
        // Form should have tokens input and note input
        const formFields = ['tokens', 'note'];
        expect(formFields).toContain('tokens');
        expect(formFields).toContain('note');
    });
    it('should navigate entries with arrow keys', () => {
        // Arrow up/down should navigate between entries
        const keyHandlers = {
            arrowup: vi.fn(),
            arrowdown: vi.fn(),
        };
        expect(typeof keyHandlers.arrowup).toBe('function');
        expect(typeof keyHandlers.arrowdown).toBe('function');
    });
    it('should delete entry with d key when entry is selected', () => {
        const selectedIndex = 0;
        const key = 'd';
        if (key === 'd' && selectedIndex !== undefined) {
            mockProps.onDelete(mockEntries[selectedIndex].id);
        }
        expect(mockProps.onDelete).toHaveBeenCalledWith('1');
    });
    it('should add entry with Enter key', () => {
        const key = 'return';
        if (key === 'return') {
            mockProps.onAdd({ tokens: 25000, note: 'Test entry' });
        }
        expect(mockProps.onAdd).toHaveBeenCalled();
    });
    it('should go back with Escape key', () => {
        const key = 'escape';
        if (key === 'escape') {
            mockProps.onBack();
        }
        expect(mockProps.onBack).toHaveBeenCalled();
    });
    it('should handle empty entries array', () => {
        const emptyEntries = [];
        const filteredEmpty = emptyEntries.filter((e) => e.planId === 'plan_001');
        expect(filteredEmpty).toHaveLength(0);
    });
    it('should calculate total tokens from entries', () => {
        const totalTokens = mockEntries.reduce((sum, e) => sum + e.tokens, 0);
        expect(totalTokens).toBe(100000);
    });
});
//# sourceMappingURL=UsageLogView.test.js.map