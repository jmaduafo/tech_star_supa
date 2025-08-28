import React from "react";
import Header6 from "@/components/fontsize/Header6";
import ChangeNames from "./ChangeNames";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import { User } from "@/types/types";

function ProfileSettings({ user }: { readonly user: User | undefined }) {

  return (
    <section className="mb-6">
      <Header6 text="Profile settings" className="text-darkText mb-4" />
      {/* UPDATE NAME, EMAIL, OR USERNAME */}
      <ChangeNames user={user} />
      <ChangeEmail
        user={user}
      />
      <ChangePassword user={user} />
    </section>
  );
}

export default ProfileSettings;
