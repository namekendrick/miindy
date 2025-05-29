import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const WorkflowCard = ({ workflow }) => {
  return (
    <Card className="flex flex-col gap-y-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <a
            href={`/workspace/${workflow.workspaceId}/workflows/${workflow.id}`}
          >
            <CardTitle className="text-lg font-semibold hover:underline">
              {workflow.name}
            </CardTitle>
          </a>
          <Badge variant="outline" className="text-xs">
            {workflow.status.charAt(0).toUpperCase() +
              workflow.status.slice(1).toLowerCase()}
          </Badge>
        </div>
        <CardDescription>{workflow.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <p className="text-muted-foreground text-sm">
          Created on: {new Date(workflow.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};
