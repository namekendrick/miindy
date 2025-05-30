"use client";

import { CoinsIcon, CreditCard } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePurchaseCredits } from "@/features/billing/api/use-purchase-credits";
import { CREDITS_PACKS } from "@/features/billing/constants/credits-packs";

export const CreditsPurchase = ({ workspaceId }) => {
  const [selectedPack, setSelectedPack] = useState("MEDIUM");

  const { mutate: purchaseCredits, isPending } = usePurchaseCredits();

  const handlePurchase = () => {
    purchaseCredits({ workspaceId, packId: selectedPack });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <CoinsIcon className="text-primary h-6 w-6" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setSelectedPack(value)}
          value={selectedPack}
        >
          {CREDITS_PACKS.map((pack) => (
            <div
              key={pack.id}
              className="bg-secondary/50 hover:bg-secondary group flex cursor-pointer items-center space-x-3 rounded-lg p-3"
              onClick={() => setSelectedPack(pack.id)}
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex w-full cursor-pointer justify-between">
                <span className="font-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="text-primary font-bold">
                  ${(pack.price / 100).toFixed(2)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isPending}
          onClick={handlePurchase}
        >
          <CreditCard className="mr-2 h-5 w-5" /> Purchase credits
        </Button>
      </CardFooter>
    </Card>
  );
};
