import CheckAuth from "@/components/auth/CheckAuth";
import { createClient } from "@/lib/supabase/server";
import { UserProvider } from "@/context/UserContext";
import Loader from "@/components/ui/loading/Loader";
import { Suspense } from "react";

export default async function ClientWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile from DB
  let profile = {};

  if (user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
      .throwOnError();

    profile = data;
  }

  return (
    <UserProvider value={{ user, userData: profile }}>
      <Suspense fallback={<Loader />}>
        <CheckAuth>{children}</CheckAuth>
      </Suspense>
    </UserProvider>
  );
}
