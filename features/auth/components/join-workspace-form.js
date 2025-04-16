"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CardWrapper } from "@/features/auth/components/card-wrapper";
import { joinWorkspace } from "@/features/auth/server/join-workspace";

export const JoinWorkspaceForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const onSubmit = useCallback(() => {
    if (!token || !id) {
      setError("Something went wrong!");
      return;
    }

    joinWorkspace(token, id)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, id]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Joining workspace"
      backButtonLabel={(success || error) && `Go to workspace`}
      backButtonHref={`/workspace/${id}`}
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
