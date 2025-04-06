import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function absoluteUrl(path) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isSettingsItemActive = (itemUrl, pathname) => {
  const itemSection = itemUrl.split("/").pop();
  const pathSegments = pathname.split("/");
  const sectionIndex =
    pathSegments.findIndex((segment) => segment === "settings") + 1;

  if (sectionIndex > 0 && sectionIndex < pathSegments.length) {
    const currentSection = pathSegments[sectionIndex];
    return currentSection === itemSection;
  }

  return false;
};
