"use client";
import React, { useState, useEffect } from "react";
import Header6 from "@/components/fontsize/Header6";
import TextButton from "@/components/ui/buttons/TextButton";
import Loading from "@/components/ui/loading/Loading";
import { optionalS } from "@/utils/optionalS";
import { User } from "@/types/types";
import { createClient } from "@/lib/supabase/client";

function ProjectCount({ user }: { readonly user: User | undefined }) {
  const [count, setCount] = useState<number | undefined>();

  const supabase = createClient();

  const getUser = async () => {
    try {
      if (!user) {
        return;
      }

      const { data } = await supabase
        .from("projects")
        .select("id")
        .eq("team_id", user.team_id)
        .throwOnError();

      setCount(data.length);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUser();
  }, [user]);

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
          <div className="mt-auto">
            <p className="text-center font-semibold text-[4vw] leading-[1]">
              {count}
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
