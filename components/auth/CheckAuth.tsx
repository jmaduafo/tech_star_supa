"use client";
import { createClient } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";
import MainPage from "../pages/login_signup/MainPage";
import AuthContainer from "./AuthContainer";
import { images } from "@/utils/dataTools";
import { Toaster } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import Loader from "../ui/loading/Loader";
import { useAuth } from "@/context/UserContext";
import { User } from "@/types/types";

function CheckAuth({ children }: { readonly children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const [user, setUser] = useState<User | undefined>();

  const supabase = createClient();

  const pathname = usePathname();
  const route = useRouter();

  const { userData } = useAuth();

  // GETS THE CURRENT USER SESSION TO LISTEN IF USER IS 
  // LOGGED IN OR NOT
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && pathname === "/") {
          // handle initial session
          route.push("/dashboard");
        } else if (event === "SIGNED_OUT" && pathname !== "/") {
          // handle sign out event
          [window.localStorage, window.sessionStorage].forEach((storage) => {
            Object.entries(storage).forEach(([key]) => {
              storage.removeItem(key);
            });
          });
          route.push("/");
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [pathname, route, supabase]);


  // GETS USER DATA
  const getUser = () => {
    if (!userData) return;

    setUser(userData);
  };


  // LISTENS FOR CHANGES IN CURRENT USER DATA
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
          getUser();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userData, supabase, setUser]);


  // PREVENTS SSR HYDRATION ERROR SO THAT CLIENT AND SERVER UI MATCH
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    getUser()
  }, [userData])


  if (!isMounted) {
    return null; // or a static placeholder that doesn't depend on auth
  }


  // LOADING STATE
  if (!isMounted && loading && !session && pathname === "/") {
    return <Loader />;
  }

  return (
    <main
      style={{
        backgroundImage:
          session && pathname !== "/" && user
            ? `url(${images[user?.bg_image_index].image})`
            : `url(${images[0].image})`,
      }}
      className={`h-screen w-full bg-fixed bg-cover bg-center bg-no-repeat duration-300 overflow-y-auto`}
    >
      {session && pathname !== "/" ? (
        <AuthContainer>{children}</AuthContainer>
      ) : (
        <MainPage />
      )}
      <Toaster />
    </main>
  );
}

export default CheckAuth;
