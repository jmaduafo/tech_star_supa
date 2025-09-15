"use client";
import { createClient } from "@/lib/supabase/client";
import React, { useEffect, useMemo, useState } from "react";
import MainPage from "../pages/login_signup/MainPage";
import AuthContainer from "./AuthContainer";
import { images } from "@/utils/dataTools";
import { toast, Toaster } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import Loader from "../ui/loading/Loader";
import { useAuth } from "@/context/UserContext";
import { useBackgroundImage } from "@/lib/queries/queries";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "../ui/sidebar/AppSidebar";
import { useNetworkStatus } from "../network/network";

function CheckAuth({ children }: { readonly children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const pathname = usePathname();
  const route = useRouter();

  const { userData } = useAuth();

  const { data: bgIndex } = useBackgroundImage(userData?.id);
const { isOnline } = useNetworkStatus()
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

  // PREVENTS SSR HYDRATION ERROR SO THAT CLIENT AND SERVER UI MATCH
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a static placeholder that doesn't depend on auth
  }

  // LOADING STATE
  if (!isMounted && loading && !session && pathname === "/") {
    return <Loader />;
  }

  let offlineToastId: string | number | undefined = undefined

  if (!isOnline && !offlineToastId) {
    offlineToastId = toast.error("No internet connection", {
      description: "Internet was disconnected. Failed to fetch.",
      duration: Infinity
    })
  } else {
    toast.dismiss(offlineToastId)
  }

  return (
    <>
      {session && pathname !== "/" ? (
        <SidebarProvider>
          <AppSidebar />
          <main
            style={{
              backgroundImage: bgIndex
                ? `url(${images[bgIndex]?.image})`
                : `url(${images[0].image})`,
            }}
            className={`h-screen w-full bg-fixed bg-cover bg-center bg-no-repeat duration-300 overflow-y-auto`}
          >
            <AuthContainer>{children}</AuthContainer>
          </main>
        </SidebarProvider>
      ) : (
        <main
          style={{
            backgroundImage: `url(${images[0].image})`,
          }}
          className={`h-screen w-full bg-fixed bg-cover bg-center bg-no-repeat duration-300 overflow-y-auto`}
        >
          <MainPage />
        </main>
      )}
      <Toaster closeButton/>
    </>
  );
}

export default CheckAuth;
