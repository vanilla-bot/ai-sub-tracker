import React from 'react';
import type { Plan } from '../models/plan';
interface AddPlanFormProps {
    onSubmit: (plan: Plan) => void;
    onCancel: () => void;
    plan?: Plan;
}
declare const AddPlanForm: React.FC<AddPlanFormProps>;
export default AddPlanForm;
//# sourceMappingURL=AddPlanForm.d.ts.map