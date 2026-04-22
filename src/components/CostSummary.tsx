import React from 'react';
import type { PlanWithUsage } from '../models/plan';

interface CostSummaryProps {
  plans: PlanWithUsage[];
}

const CostSummary: React.FC<CostSummaryProps> = () => {
  return (
    <div>
      <h1>Cost Summary</h1>
      <p>Cost summary coming soon...</p>
    </div>
  );
};

export default CostSummary;
