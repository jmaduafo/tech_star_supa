"use client";
import React from "react";
import TimeDate from "../login_signup/TimeDate";
import { User } from "@/types/types";

function Greeting({ user }: { readonly user: User | undefined }) {
  

  return (
    <div className="h-full flex justify-center items-center">
      {/* <div className="flex gap-3 xl:block">
        <div className="mb-3">
          {typeof user?.image_url === "string" ? (
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={user?.image_url}
                alt={`${user.full_name}'s avatar`}
              />
              <AvatarFallback>{getInitials(user?.full_name)}</AvatarFallback>
            </Avatar>
          ) : (
            <Skeleton className="w-14 h-14 rounded-full" />
          )}
        </div>
        <div>
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
              <p className="capitalize px-3 py-[1px] text-[13.5px] rounded-full border-[1.5px] border-darkText w-fit">
                {user.role}
              </p>
            ) : null}
          </div>
        </div>
      </div> */}
      <div className="max-w-fit">
        <TimeDate timeFontSize="dashboard" dateFontSize="dashboard" />
      </div>
    </div>
  );
}

export default Greeting;
