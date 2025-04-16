import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { BackButton } from "@/features/auth/components/back-button";
import { Header } from "@/features/auth/components/header";

export const ErrorCard = () => {
  return (
    <Card className="m-auto w-[400px] shadow-md">
      <CardHeader>
        <Header />
        <div className="mb-2 rounded-md bg-amber-100 p-4 text-center text-sm font-medium text-amber-900">
          <p>Oops! Something went wrong.</p>
        </div>
        <CardFooter>
          <BackButton label="Back to sign-in" href="/auth/sign-in" />
        </CardFooter>
      </CardHeader>
    </Card>
  );
};
