import { useState } from "react";

import { enableSync } from "@/features/integrations/server/enable-sync";

export const useEnableSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnableSync = async (
    integration,
    pipeline,
    configuration = {},
    configurationName = null,
    workspaceId,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await enableSync(
        integration,
        pipeline,
        configuration,
        configurationName,
        workspaceId,
      );

      return result;
    } catch (err) {
      const errorMessage = err.message || "Failed to enable sync";
      setError(errorMessage);
      console.error("Enable sync error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleEnableSync,
    isLoading,
    error,
  };
};
