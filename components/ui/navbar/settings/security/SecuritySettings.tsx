import React from "react";
import Header6 from "@/components/fontsize/Header6";
import { User } from "@/types/types";
import Logout from "./Logout";
import DeleteAccount from "./DeleteAccount";

function SecuritySettings({ user }: { readonly user: User | undefined }) {
  

  return (
    <section>
      <Header6 text="Security settings" className="text-darkText mb-4" />
      <div className="text-[14px] text-dark75 flex flex-col w-full">
        <Logout/>
        <DeleteAccount/>
      </div>
    </section>
  );
}

export default SecuritySettings;

