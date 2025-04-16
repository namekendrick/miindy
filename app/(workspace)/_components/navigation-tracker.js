"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const NavigationTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && !pathname.includes("/settings"))
      localStorage.setItem("lastNonSettingsPath", pathname);
  }, [pathname, searchParams]);

  return null;
};
