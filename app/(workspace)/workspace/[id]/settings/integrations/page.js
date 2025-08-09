import { IntegrationsClient } from "./_components/integrations-client";
import { generateParagonUserToken } from "@/features/integrations/server/paragon-auth";

export default async function IntegrationsSettingsPage() {
  const tokenResult = await generateParagonUserToken();

  const paragonUserToken = tokenResult.success ? tokenResult.token : null;
  const tokenError = tokenResult.success ? null : tokenResult.error;

  return (
    <IntegrationsClient
      paragonUserToken={paragonUserToken}
      tokenError={tokenError}
    />
  );
}
