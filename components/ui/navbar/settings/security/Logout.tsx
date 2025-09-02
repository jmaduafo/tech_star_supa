"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading/Loading";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function Logout() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });
      }

      router.push("/");
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={logout}
      className={`text-left outline-none border-b border-b-dark10 py-4 text-dark75 hover:text-darkText duration-300`}
    >
      {loading ? <Loading className="w-6 h-6 border-t-darkText/80" /> : "Logout"}
    </button>
  );
}

export default Logout;
