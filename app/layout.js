import { Montserrat } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/providers/modal-provider";
import { QueryProvider } from "@/providers/query-provider";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Miindy: A CRM for product-led sales",
  description: "10x your GTM team's productivity",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={montserrat.className}>
          <Toaster />
          <QueryProvider>
            <ModalProvider />
            {children}
          </QueryProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
