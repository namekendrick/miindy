"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Coming Soon</h3>
            <p className="mt-2 text-sm">
              Currently, integrations are handled through n8n.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
