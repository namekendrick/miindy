import { Montserrat } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modal-provider";
import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Miindy | Pipeline that converts",
  description: "An AI-powered CRM to 10x your GTM strategy.",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={montserrat.className}>
          <QueryProvider>
            <ModalProvider />
            {children}
            <Toaster />
          </QueryProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
