"use client";

import { createContext, useContext } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js"; // or your custom type
import { User } from "@/types/types";

type UserContextType = {
  user: SupabaseUser | null;
  userData: User | undefined; // replace with your actual type for db profile
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  value,
  children,
}: {
  readonly value: UserContextType;
  readonly children: React.ReactNode;
}) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAuth() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}