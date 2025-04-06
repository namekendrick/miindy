import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { BackButton } from "@/features/auth/components/back-button";
import { Header } from "@/features/auth/components/header";

export const ErrorCard = () => {
  return (
    <Card className="m-auto w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops! Something went wrong." />
        <CardFooter>
          <BackButton label="Back to sign-in" href="/auth/sign-in" />
        </CardFooter>
      </CardHeader>
    </Card>
  );
};
