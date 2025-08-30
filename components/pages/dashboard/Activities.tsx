"use client";
import Header5 from "@/components/fontsize/Header5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TextButton from "@/components/ui/buttons/TextButton";
import { User } from "@/types/types";
import { getInitials } from "@/utils/initials";
import React, { useState } from "react";

function Activities({ user }: { readonly user: User | undefined }) {
  const [allActivitiesOpen, setAllActivitiesOpen] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between">
        <Header5 text="Recent Activities" />
        <TextButton
          text={"View all"}
          iconDirection={"right"}
          actionButton={() => setAllActivitiesOpen(true)}
        />
      </div>
      <div className="mt-auto">
        {[6, 5, 4, 3, 2, 1, 0].map((item, i) => {
          return (
            <div
              key={`item_${i + 1}`}
              className={`py-2.5 ${
                i + 1 !== 7 ? "border-b" : ""
              } border-b-lightText/10 flex justify-between gap-4`}
            >
              <div className="flex-1">
                <p>10:0{item}</p>
              </div>
              <div className="flex-[1.5]">
                <p>Project</p>
              </div>
              <div className="flex-[5] flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={user?.image_url ?? ""}
                    alt={user ? `${user.first_name}_profile` : ""}
                  />
                  <AvatarFallback>
                    {user ? getInitials(user.full_name) : "??"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">
                  Chel,{" "}
                  <span className="font-light">Updated the team name</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Activities;
