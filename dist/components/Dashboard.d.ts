import React from 'react';
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
declare const Dashboard: React.FC<DashboardProps>;
export default Dashboard;
//# sourceMappingURL=Dashboard.d.ts.map