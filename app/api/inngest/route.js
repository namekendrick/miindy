import { serve } from "inngest/next";
import { inngest, summarizeWebpage } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [summarizeWebpage],
});
