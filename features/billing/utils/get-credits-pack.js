import { CREDITS_PACKS } from "@/features/billing/constants/credits-packs";

export const getCreditsPack = (id) => CREDITS_PACKS.find((p) => p.id === id);
