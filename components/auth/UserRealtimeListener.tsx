"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/UserContext";

export default function UserRealtimeListener() {
  const { userData, setUserData } = useAuth(); // assume context exposes a setter
  const supabase = createClient();

  useEffect(() => {
    if (!userData) return;

    const channel = supabase
      .channel("users-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `id=eq.${userData.id}`,
        },
        (payload) => {
          // payload.new = updated row
          setUserData(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userData, supabase, setUserData]);

  return null; // no UI
}