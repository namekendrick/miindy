"use client";

import { FormError } from "@/components/form-error";
import { useCurrentRole } from "@/features/auth/hooks";

export const RoleGate = ({ children, allowedRole }) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="Permission denied!" />;
  }

  return <>{children}</>;
};
