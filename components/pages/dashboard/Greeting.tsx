"use client";
import React, { useState, useEffect } from "react";
import { greeting } from "@/utils/greeting";
import Header4 from "@/components/fontsize/Header4";
import Header2 from "@/components/fontsize/Header2";
import { Skeleton } from "@/components/ui/skeleton";
import TimeDate from "../login_signup/TimeDate";
import { User } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/initials";

function Greeting({ user }: { readonly user: User | undefined }) {
  const [greet, setGreet] = useState("");

  useEffect(() => {
    const userGreet = setInterval(() => {
      setGreet(greeting());
    }, 1000);

    return () => clearInterval(userGreet);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="">
        <div className="mb-3">
          {user?.image_url ? (
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={user?.image_url ?? ""}
                alt={`${user.full_name}'s avatar`}
              />
              <AvatarFallback>{getInitials(user?.full_name)}</AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="w-14 h-14 rounded-full" />
          )}
        </div>
        {greet.length ? (
          <Header4 text={`Good ${greet},`} />
        ) : (
          <Skeleton className="w-[65%] h-[18px]" />
        )}
        {user?.first_name ? (
          <Header2
            text={user?.first_name}
            className="capitalize font-semibold"
          />
        ) : (
          <div className="mt-3">
            <Skeleton className="w-[85%] h-[26px]" />
          </div>
        )}
        <div className="mt-3">
          {user?.role === "admin" || user?.role === "editor" ? (
            <p className="capitalize px-3 py-[1px] text-[13.5px] rounded-full border-[1.5px] border-lightText w-fit">
              {user.role}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-auto max-w-fit">
        <TimeDate timeFontSize="dashboard" dateFontSize="dashboard" />
      </div>
    </div>
  );
}

export default Greeting;
