import { useContext } from "react";

import { FlowValidationContext } from "@/features/workflows/context/flow-validation-context";

export const useFlowValidation = () => {
  const context = useContext(FlowValidationContext);

  if (!context) {
    throw new Error(
      "useFlowValidation must be used within a FlowValidationContext",
    );
  }

  return context;
};
