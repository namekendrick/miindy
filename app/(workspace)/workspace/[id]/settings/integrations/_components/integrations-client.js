"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParagon } from "@/features/integrations/hooks/use-paragon";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const IntegrationsClient = ({ paragonUserToken, tokenError }) => {
  const workspaceId = useWorkspaceId();
  const [isMounted, setIsMounted] = useState(false);
  const { paragon, user, error } = useParagon(paragonUserToken, workspaceId);

  useEffect(() => setIsMounted(true), []);

  const getIntegrationsWithState = () => {
    try {
      const integrationMetadata = paragon.getIntegrationMetadata();

      return integrationMetadata.map((integration) => ({
        ...integration,
        connected: user?.integrations?.[integration.type]?.enabled || false,
      }));
    } catch (err) {
      console.error("Failed to load integration metadata:", err);
      toast.error("Failed to load available integrations");
      return [];
    }
  };

  const handleIntegrationConnect = async (integrationType) => {
    try {
      paragon.connect(integrationType);
    } catch (err) {
      console.error(`Failed to open ${integrationType} connect portal:`, err);
      toast.error(`Failed to open ${integrationType} connection`);
    }
  };

  if (tokenError || error) {
    return (
      <div className="space-y-6">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600">
                Something went wrong
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {tokenError || error}
              </p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isMounted || (!user?.authenticated && !error)) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-gray-200" />
                  <div>
                    <div className="h-6 w-24 rounded bg-gray-200" />
                    <div className="mt-1 h-4 w-16 rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-6 w-20 rounded bg-gray-200" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-4 w-full rounded bg-gray-200" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const integrations = getIntegrationsWithState();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card
            key={integration.type}
            className={`relative cursor-pointer transition-shadow hover:shadow-md ${
              !user?.authenticated ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={
              user?.authenticated
                ? () => handleIntegrationConnect(integration.type)
                : undefined
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {integration.icon ? (
                      <Image
                        src={integration.icon}
                        alt={`${integration.name} icon`}
                        width={32}
                        height={32}
                        className="h-8 w-8"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-sm font-semibold">
                        {integration.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {integration.name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {integration.category || "Integration"}
                    </Badge>
                  </div>
                </div>
                <Badge
                  variant={integration.connected ? "default" : "secondary"}
                  className={
                    integration.connected
                      ? "bg-green-500 hover:bg-green-600"
                      : ""
                  }
                >
                  {integration.connected ? "Connected" : "Not connected"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm">
                {integration.description ||
                  `Connect your ${integration.name} account to sync data with Miindy.`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
