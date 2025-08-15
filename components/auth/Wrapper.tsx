import CheckAuth from "@/components/auth/CheckAuth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserProvider } from "@/context/UserContext";

export default async function ClientWrapper({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const supabase = createClient();

  // Get logged-in user
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get user profile from DB
  const { data: profile } = await (await supabase)
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <UserProvider value={{ user, userData: profile }}>
      <CheckAuth>{children}</CheckAuth>
    </UserProvider>
  );
}
