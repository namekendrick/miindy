import {
  Store,
  Handshake,
  FileUser,
  Users,
  PanelsTopLeft,
  Box,
} from "lucide-react";

const OBJECT_ICONS = {
  COMPANY: Store,
  DEAL: Handshake,
  PERSON: FileUser,
  USER: Users,
  WORKSPACE: PanelsTopLeft,
  CUSTOM: Box,
};

export const generateObjectNavigation = (objects) => {
  if (!Array.isArray(objects)) return [];

  return objects.map((object) => ({
    title: object.plural,
    url: object.slug,
    icon: OBJECT_ICONS[object.type] || OBJECT_ICONS.CUSTOM,
    slug: object.slug,
    type: object.type,
    recordCount: object._count?.records || 0,
  }));
};

export const validateObjectSlug = async (workspaceId, slug) => {
  const { getObjectBySlug } = await import("@/db/objects");
  const object = await getObjectBySlug(workspaceId, slug);
  return object !== null;
};
