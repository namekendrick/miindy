"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendContactCreatedEvent } from "@/features/integrations/api/use-send-hubspot-event";

export const IntegrationTest = ({ paragon, isAuthenticated }) => {
  const [testContact, setTestContact] = useState({
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    company: "Test Company",
    title: "Test Engineer",
  });

  const { sendContactCreated, isLoading } = useSendContactCreatedEvent(paragon);

  const handleTestEvent = async () => {
    await sendContactCreated(testContact);
  };

  const handleInputChange = useCallback((field, value) => {
    setTestContact((prev) => ({ ...prev, [field]: value }));
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Test HubSpot Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={testContact.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={testContact.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={testContact.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={testContact.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={testContact.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleTestEvent}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Sending..." : "Send Test Contact to HubSpot"}
        </Button>

        <p className="text-sm text-gray-600">
          This will trigger a "Contact Created" event that should create a new
          contact in your connected HubSpot account (if you have the workflow
          configured).
        </p>
      </CardContent>
    </Card>
  );
};
