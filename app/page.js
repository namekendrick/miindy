import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Homepage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-y-6">
      <h1 className="text-6xl font-bold">Miindy</h1>
      <Link href="/auth/sign-in">
        <Button>Sign in</Button>
      </Link>
    </main>
  );
}
