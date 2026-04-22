import React from 'react';
import type { Plan } from '../models/plan';

interface AddPlanFormProps {
  onSubmit: (plan: Plan) => void;
  onCancel: () => void;
}

const AddPlanForm: React.FC<AddPlanFormProps> = () => {
  return (
    <div>
      <h1>Add Plan</h1>
      <p>Plan form coming soon...</p>
    </div>
  );
};

export default AddPlanForm;
