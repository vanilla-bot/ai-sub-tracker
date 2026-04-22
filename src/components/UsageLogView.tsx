import React from 'react';
import type { UsageEntry } from '../models/plan';

interface UsageLogViewProps {
  entries: UsageEntry[];
  planId?: string;
}

const UsageLogView: React.FC<UsageLogViewProps> = () => {
  return (
    <div>
      <h1>Usage Log</h1>
      <p>Usage log view coming soon...</p>
    </div>
  );
};

export default UsageLogView;
