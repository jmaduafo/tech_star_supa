import Header5 from "@/components/fontsize/Header5";
import Header6 from "@/components/fontsize/Header6";
import { User } from "@/types/types";
import React from "react";

function Activities({ user }: { readonly user: User | undefined }) {
  return (
    <div className="flex flex-col h-full">
      <Header5 text="Recent Activities" />
      <div className="mt-auto">
        {[6, 5, 4, 3, 2, 1, 0].map((item, i) => {
          return (
            <div
              key={`item_${i + 1}`}
              className="py-2.5 border-b border-b-lightText/10 flex justify-between"
            >
              <div className="flex-1">
                <p>10:0{item}</p>
              </div>
              <div className="flex-[4]">
                <p className="font-medium">
                  Chel,{" "}
                  <span className="font-normal">Updated the team name</span>
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
