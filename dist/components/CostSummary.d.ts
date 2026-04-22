import React from 'react';
import type { PlanWithUsage } from '../models/plan';
interface CostSummaryProps {
    plans: PlanWithUsage[];
    onBack: () => void;
}
/**
 * CostSummary displays a table of all plans with their billing information,
 * monthly equivalents, and total cost projections.
 */
declare const CostSummary: React.FC<CostSummaryProps>;
export default CostSummary;
//# sourceMappingURL=CostSummary.d.ts.map