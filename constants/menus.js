import {
  BookOpen,
  Box,
  CalendarSync,
  CreditCard,
  FileUser,
  Handshake,
  Home,
  Mail,
  Palette,
  PanelsTopLeft,
  Play,
  Store,
  User,
  Users,
} from "lucide-react";

export const navMain = [
  {
    title: "Home",
    url: "home",
    icon: Home,
  },
  {
    title: "Email",
    url: "email",
    icon: Mail,
  },
  {
    title: "Playbooks",
    url: "playbooks",
    icon: BookOpen,
  },
  {
    title: "Workflows",
    url: "workflows",
    icon: Play,
  },
];

export const navRecords = [
  {
    title: "Companies",
    url: "companies",
    icon: Store,
  },
  {
    title: "Deals",
    url: "deals",
    icon: Handshake,
  },
  {
    title: "People",
    url: "people",
    icon: FileUser,
  },
  {
    title: "Users",
    url: "users",
    icon: Users,
  },
  {
    title: "Workspaces",
    url: "workspaces",
    icon: PanelsTopLeft,
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
    title: "Billing",
    url: "settings/billing",
    icon: CreditCard,
  },
];
