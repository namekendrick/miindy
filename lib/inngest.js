import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "miindy" });

export const summarizeWebpage = inngest.createFunction(
  {
    id: "summarize-webpage",
    retries: 1,
    concurrency: {
      limit: 1,
      key: "event.data.userId",
    },
  },
  { event: "summarize-webpage-events" },
  async ({ event, step }) => {
    const { domain } = event.data;

    const response = await step.fetch(process.env.MODAL_SUMMARIZER_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ url: `http://${domain}` }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MODAL_SUMMARIZER_AUTH}`,
      },
    });

    const data = await response.json();
    return data;
  },
);
