import { usePathname } from "next/navigation";

export const useViewId = () => {
  const path = usePathname();
  return path.split("/")[5];
};
