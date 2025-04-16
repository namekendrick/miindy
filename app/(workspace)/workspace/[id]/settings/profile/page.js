import { ProfileImageForm } from "@/features/auth/components/profile-image-form";
import { ProfileSettings } from "@/features/auth/components/profile-settings";
import { currentUser } from "@/lib/auth";

export default async function ProfileSettingsPage() {
  const user = await currentUser();

  return (
    <div className="flex flex-col gap-8">
      <ProfileImageForm user={user} />
      <ProfileSettings user={user} />
    </div>
  );
}
