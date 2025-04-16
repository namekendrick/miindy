"use client";

import { FileUploaderMinimal } from "@uploadcare/react-uploader";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { uploadProfileImage } from "@/features/auth/server/upload-profile-image";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

import "@uploadcare/react-uploader/core.css";
//TODO: Handle image distorting

export function ProfileImageForm({ user }) {
  const formRef = useRef(null);
  const { update } = useSession();

  const [showForm, setShowForm] = useState(false);
  const [fileAdded, setFileAdded] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      image: undefined,
    },
  });

  const onSubmit = (values) => {
    startTransition(() => {
      uploadProfileImage({ image: values.image.allEntries[0].cdnUrl }).then(
        (data) => {
          if (data.success) {
            update();
            setFileAdded(false);
            setShowForm(false);
          }
        },
      );
    });
  };

  useOnClickOutside(formRef, () => {
    setShowForm(false);
    setFileAdded(false);
  });

  return (
    <>
      {showForm ? (
        <Form {...form}>
          <form
            ref={formRef}
            className="mt-4 w-full max-w-[400px] space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUploaderMinimal
                      {...field}
                      pubkey={process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY}
                      maxLocalFileSizeBytes={5000000}
                      multiple={false}
                      imgOnly={true}
                      onFileAdded={() => setFileAdded(true)}
                      onFileRemoved={() => setFileAdded(false)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending || !fileAdded}
              className="w-full"
            >
              Upload image
            </Button>
          </form>
        </Form>
      ) : (
        <div className="relative w-fit">
          <Avatar className="h-20 w-20 border shadow-sm">
            <AvatarImage src={user.image} className="h-20 w-20" />
            <AvatarFallback className="bg-slate-200">
              <FaUser className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div
            onClick={() => setShowForm(true)}
            className="absolute top-[50px] right-[-8px] cursor-pointer rounded-full border border-slate-700 bg-white p-2"
          >
            <Pencil className="h-4 w-4" />
          </div>
        </div>
      )}
    </>
  );
}
