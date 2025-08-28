"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading/Loading";

function Logout() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function logout() {
    setLoading(true);

  }
  
  return (
    <button
      onClick={logout}
      className={`text-left outline-none border-b border-b-dark10 py-4 text-dark75 hover:text-darkText duration-300`}
    >
      {loading ? <Loading className="w-6 h-6" /> : "Logout"}
    </button>
  );
}

export default Logout;
