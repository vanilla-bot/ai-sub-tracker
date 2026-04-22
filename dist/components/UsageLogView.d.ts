import React from 'react';
import type { UsageEntry } from '../models/plan';
interface UsageLogViewProps {
    entries: UsageEntry[];
    planId: string;
    onAdd: (tokens: number, note: string) => void;
    onDelete: (entryId: string) => void;
    onBack: () => void;
}
declare const UsageLogView: React.FC<UsageLogViewProps>;
export default UsageLogView;
//# sourceMappingURL=UsageLogView.d.ts.map