import { paragon, SDK_EVENT } from "@useparagon/connect";
import { useCallback, useEffect, useState } from "react";

import { useEnableSync } from "@/features/integrations/api/use-enable-sync";

if (typeof window !== "undefined") window.paragon = paragon;

export const useParagon = (paragonUserToken, workspaceId) => {
  const [user, setUser] = useState(paragon.getUser());
  const [error, setError] = useState(null);
  const { handleEnableSync } = useEnableSync();

  const updateUser = useCallback(() => {
    const authedUser = paragon.getUser();
    setUser({ ...authedUser });
  }, []);

  const handleIntegrationInstall = useCallback(
    async (integrationData) => {
      updateUser();

      if (integrationData?.integrationType === "hubspot") {
        await handleEnableSync(
          "hubspot",
          "contacts",
          {},
          "HubSpot Contacts Sync",
          workspaceId,
        );
      }
    },
    [updateUser, handleEnableSync, workspaceId],
  );

  useEffect(() => {
    paragon.subscribe(
      SDK_EVENT.ON_INTEGRATION_INSTALL,
      handleIntegrationInstall,
    );
    paragon.subscribe(SDK_EVENT.ON_INTEGRATION_UNINSTALL, updateUser);

    return () => {
      paragon.unsubscribe(
        SDK_EVENT.ON_INTEGRATION_INSTALL,
        handleIntegrationInstall,
      );
      paragon.unsubscribe(SDK_EVENT.ON_INTEGRATION_UNINSTALL, updateUser);
    };
  }, [handleIntegrationInstall, updateUser]);

  useEffect(() => {
    if (!paragonUserToken) return;

    paragon
      .authenticate(
        process.env.NEXT_PUBLIC_PARAGON_PROJECT_ID,
        paragonUserToken,
      )
      .then(() => {
        const authedUser = paragon.getUser();
        setUser(authedUser);
        setError(null);
      })
      .catch((err) => {
        console.error("Paragon authentication failed:", err);
        setError(err.message || "Authentication failed");
      });
  }, [paragonUserToken]);

  return {
    paragon,
    user,
    error,
  };
};
