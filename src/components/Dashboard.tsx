import React from 'react';
import type { PlanWithUsage } from '../models/plan';

interface DashboardProps {
  plans: PlanWithUsage[];
}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Plan overview coming soon...</p>
    </div>
  );
};

export default Dashboard;
