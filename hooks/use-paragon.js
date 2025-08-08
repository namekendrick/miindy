import { paragon, SDK_EVENT } from "@useparagon/connect";
import { useCallback, useEffect, useState } from "react";

if (typeof window !== "undefined") window.paragon = paragon;

export const useParagon = (paragonUserToken) => {
  const [user, setUser] = useState(paragon.getUser());
  const [error, setError] = useState(null);

  const updateUser = useCallback(() => {
    const authedUser = paragon.getUser();
    setUser({ ...authedUser });
  }, []);

  // Listen for integration state changes
  useEffect(() => {
    paragon.subscribe(SDK_EVENT.ON_INTEGRATION_INSTALL, updateUser);
    paragon.subscribe(SDK_EVENT.ON_INTEGRATION_UNINSTALL, updateUser);

    return () => {
      paragon.unsubscribe(SDK_EVENT.ON_INTEGRATION_INSTALL, updateUser);
      paragon.unsubscribe(SDK_EVENT.ON_INTEGRATION_UNINSTALL, updateUser);
    };
  }, [updateUser]);

  // Authenticate user when token is provided
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
    updateUser,
  };
};
