"use client";
import React, { useState, useEffect } from "react";
import { User } from "@/types/types";
import { createClient } from "@/lib/supabase/client";
import CountCard from "@/components/ui/cards/CountCard";

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
    <CountCard count={count} showLink />
  );
}

export default ProjectCount;
