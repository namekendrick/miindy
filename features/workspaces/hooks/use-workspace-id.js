import { usePathname } from "next/navigation";

export const useWorkspaceId = () => {
  const path = usePathname();
  return path.split("/")[2];
};
