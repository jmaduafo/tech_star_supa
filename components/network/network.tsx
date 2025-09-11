"use client";

import { useEffect, useState } from "react";

export function useNetworkStatus(
  pingUrl: string = "https://www.google.com/favicon.ico"
) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator?.onLine);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean>(true);

  // Check if internet actually works
  const checkInternet = async () => {
    if (!navigator.onLine) {
      setIsInternetReachable(false);
      return;
    }

    try {
      const res = await fetch(pingUrl, { method: "HEAD", cache: "no-store" });
      setIsInternetReachable(res.ok);
    } catch {
      setIsInternetReachable(false);
    }
  };

  useEffect(() => {
    // Handle browser-level online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      checkInternet();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsInternetReachable(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    checkInternet();

    // Keep re-checking every 10s
    const interval = setInterval(checkInternet, 10000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, isInternetReachable };
}
