"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { BackButton } from "@/features/auth/components/back-button";
import { Header } from "@/features/auth/components/header";

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {backButtonHref && backButtonLabel && (
        <CardFooter>
          <BackButton href={backButtonHref} label={backButtonLabel} />
        </CardFooter>
      )}
    </Card>
  );
};
