import React from "react";
import Header6 from "@/components/fontsize/Header6";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import { User } from "@/types/types";

function ProfileSettings({
  user,
  open,
  openChange,
}: {
  readonly user: User | undefined;
  readonly open: boolean;
  readonly openChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section className="mb-6">
      <Header6 text="Profile settings" className="text-darkText mb-4" />
      {/* UPDATE NAME, EMAIL, OR USERNAME */}
      <ChangeEmail user={user} mainOpen={open} mainOpenChange={openChange}/>
      <ChangePassword user={user} mainOpen={open} mainOpenChange={openChange}/>
    </section>
  );
}

export default ProfileSettings;
