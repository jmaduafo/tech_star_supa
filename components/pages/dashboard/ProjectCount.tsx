"use client";
import React, { useState, useEffect } from "react";
import Header6 from "@/components/fontsize/Header6";
import TextButton from "@/components/ui/buttons/TextButton";
import Loading from "@/components/ui/loading/Loading";
import { optionalS } from "@/utils/optionalS";
import { User } from "@/types/types";

function ProjectCount({ user }: { readonly user: User | undefined }) {
  const [count, setCount] = useState<number | undefined>();

  // async function getUser() {
  //   if (!user) {
  //     return;
  //   }

  //   const q = query(
  //     collection(db, "projects"),
  //     where("team_id", "==", user?.team_id)
  //   );

  //   const projectCount = await getQueriedCount(q);

  //   setCount(projectCount as number);
  // }

  // useEffect(() => {
  //   getUser();
  // }, [user?.id ?? "guest"]);

  return (
    <>
      {typeof count === "number" ? (
        <div className="flex flex-col h-full">
          {count > 0 ? (
            <div className="flex justify-end">
              <TextButton
                href="/projects"
                text="View all"
                iconDirection="right"
              />
            </div>
          ) : null}
          <div className="mt-auto mb-3">
            <p className="text-center font-semibold text-[4vw] leading-[1]">
              {count ?? 0}
            </p>
            <Header6
              text={`Total project${optionalS(count)}`}
              className="text-center mt-3"
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <Loading />
        </div>
      )}
    </>
  );
}

export default ProjectCount;
