"use client";
import { createClient } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";
import MainPage from "../pages/login_signup/MainPage";
import AuthContainer from "./AuthContainer";
import { images } from "@/utils/dataTools";
import { Toaster } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";

function CheckAuth({ children }: { readonly children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const supabase = createClient();

  const pathname = usePathname();
  const route = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          (event === "SIGNED_IN" && pathname === "/") ||
          pathname === "/auth/login"
        ) {
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

  // PREVENTS SSR HYDRATION ERROR SO THAT CLIENT AND SERVER UI MATCH
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a static placeholder that doesn't depend on auth
  }

  // LOADING STATE
  if (!isMounted && (loading && !session && pathname === "/")) {
    return (
      <main className="h-screen w-full flex items-center justify-center bg-background bg-lightText text-darkText">
        {/* Loading spinner or skeleton */}
        <div className="animate-spin">
            <LoaderCircle className="w-10 h-10"/>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        backgroundImage:
          session && pathname !== "/"
            ? `url(${images[5].image})`
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
