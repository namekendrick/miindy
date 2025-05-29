import { createContext, useState } from "react";

export const FlowValidationContext = createContext(null);

export const FlowValidationContextProvider = ({ children }) => {
  const [invalidInputs, setInvalidInputs] = useState([]);

  const clearErrors = () => {
    setInvalidInputs([]);
  };

  return (
    <FlowValidationContext.Provider
      value={{
        invalidInputs,
        setInvalidInputs,
        clearErrors,
      }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
};
