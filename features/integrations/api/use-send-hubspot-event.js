import { useState } from "react";
import { toast } from "sonner";

export const useSendHubspotEvent = (paragon) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEvent = async (eventName, eventPayload) => {
    if (!paragon) {
      const error = "Paragon not initialized";
      setError(error);
      toast.error(error);
      return { success: false, error };
    }

    try {
      setIsLoading(true);
      setError(null);

      await paragon.event(eventName, eventPayload);

      toast.success(`${eventName} event sent to HubSpot successfully`);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Failed to send event to HubSpot";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("HubSpot event error:", err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEvent,
    isLoading,
    error,
  };
};

export const useSendContactCreatedEvent = (paragon) => {
  const { sendEvent, isLoading, error } = useSendHubspotEvent(paragon);

  const sendContactCreated = async (contact) => {
    const eventPayload = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      company: contact.company || "",
      title: contact.title || "",
      phone: contact.phone || "",
    };

    return await sendEvent("Contact Created", eventPayload);
  };

  return {
    sendContactCreated,
    isLoading,
    error,
  };
};

export const useSendDealCreatedEvent = (paragon) => {
  const { sendEvent, isLoading, error } = useSendHubspotEvent(paragon);

  const sendDealCreated = async (deal) => {
    const eventPayload = {
      dealName: deal.name,
      dealAmount: deal.amount,
      dealStage: deal.stage,
      companyName: deal.companyName || "",
      contactEmail: deal.contactEmail || "",
      closeDate: deal.closeDate || "",
    };

    return await sendEvent("Deal Created", eventPayload);
  };

  return {
    sendDealCreated,
    isLoading,
    error,
  };
};
