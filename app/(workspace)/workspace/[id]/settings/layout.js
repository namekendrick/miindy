import { headers } from "next/headers";

import { Separator } from "@/components/ui/separator";

export default async function SettingsLayout({ children }) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const pathSegments = pathname.split("/");

  const isNestedRoute = pathSegments.length > 5;

  let basePathFormatted = "";

  if (!isNestedRoute) {
    const basePath = pathSegments[pathSegments.length - 1];
    basePathFormatted =
      basePath.charAt(0).toUpperCase() + basePath.slice(1).replace(/-/g, " ");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-20">
      {!isNestedRoute && (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">{basePathFormatted}</h1>
            <p className="text-muted-foreground text-sm">
              {(() => {
                switch (basePathFormatted) {
                  case "Profile":
                    return "Manage your personal information and preferences";
                  case "Appearance":
                    return "Customize the look and feel of your platform";
                  case "Email and calendar":
                    return "Manage and sync your email and calendar accounts to stay organized";
                  case "General":
                    return "Change the settings for your current workspace";
                  case "Members":
                    return "Manage workspace members, set access levels, and invite new users within your plan limits";
                  case "Integrations":
                    return "Connect Miindy to your team's favorite tools";
                  case "Billing":
                    return "Update your payment information or switch plans according to your needs";
                  case "Objects":
                    return "Modify and add objects in your workspace";
                  default:
                    return "";
                }
              })()}
            </p>
          </div>
          <Separator />
        </>
      )}
      {children}
    </main>
  );
}
