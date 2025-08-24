"use client";

import { createContext, useContext, useState } from "react";

const UserContext = createContext<any>(null);

export function UserProvider({
  value,
  children,
}: {
  readonly value: any;
  readonly children: React.ReactNode;
}) {
   const [userData, setUserData] = useState(value.userData);
   
  return <UserContext.Provider value={{...value, userData, setUserData }}>{children}</UserContext.Provider>;
}

export function useAuth() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}