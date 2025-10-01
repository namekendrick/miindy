import {
  Box,
  CalendarSync,
  CreditCard,
  Zap,
  Home,
  Layers,
  Palette,
  PanelsTopLeft,
  User,
  Users,
  SquareCheckBig,
} from "lucide-react";

export const navMain = [
  {
    title: "Home",
    url: "home",
    icon: Home,
  },
  {
    title: "Tasks",
    url: "tasks",
    icon: SquareCheckBig,
  },
  {
    title: "Workflows",
    url: "workflows",
    icon: Layers,
  },
];

export const accountSettings = [
  {
    title: "Profile",
    url: "settings/profile",
    icon: User,
  },
  {
    title: "Appearance",
    url: "settings/appearance",
    icon: Palette,
  },
  {
    title: "Email and calendar",
    url: "settings/email-and-calendar",
    icon: CalendarSync,
  },
];

export const dataSettings = [
  {
    title: "Objects",
    url: "settings/objects",
    icon: Box,
  },
];

export const workspaceSettings = [
  {
    title: "General",
    url: "settings/general",
    icon: PanelsTopLeft,
  },
  {
    title: "Members",
    url: "settings/members",
    icon: Users,
  },
  {
    title: "Integrations",
    url: "settings/integrations",
    icon: Zap,
  },
  {
    title: "Billing",
    url: "settings/billing",
    icon: CreditCard,
  },
];
