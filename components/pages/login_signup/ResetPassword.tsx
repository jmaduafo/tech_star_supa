"use client";

import React, { useEffect, useState } from "react";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import Submit from "@/components/ui/buttons/Submit";
import IconInput from "@/components/ui/input/IconInput";
import { useRouter } from "next/navigation";
import { CiLock } from "react-icons/ci";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { isValidPassword } from "@/utils/validation";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [viewPass, setViewPass] = useState(false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

   useEffect(() => {
    // Supabase automatically picks up the session from the hash (#access_token)
    supabase.auth.getSession().then(({ data }) => {
      console.log("Current session:", data.session); // 👈 should be set
    });
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (!password.length) {
      toast.error("Something went wrong", {
        description: "No entries must be left empty",
      });

      setIsLoading(false);
      return;
    } else if (!isValidPassword(password)) {
      toast.error("Something went wrong", {
        description:
          "Password length is too short. Must be at least 6 characters",
      });

      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/");
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-full">
      <section className="bg-lightText/30 backdrop-blur-xl h-full">
        <div className="w-[80%] sm:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%] mx-auto flex flex-col justify-center h-full">
          <div>
            <Header1 text="Reset password" className="text-darkText" />
            <Header6
              className="mt-4 text-darkText/80"
              text="Change your password here to access your account. And please ensure to save your password in a safe place."
            />
            <form className="mt-10" onSubmit={handleLogin}>
              <div className="mt-4">
                <IconInput
                  icon={<CiLock className="w-5 h-5 sm:w-6 sm:h-6" />}
                  input={
                    <input
                      placeholder="Password"
                      // CHANGE THE TYPE BASED ON BUTTON CLICK
                      type={viewPass ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="placeholder-dark50"
                    />
                  }
                  // BUTTON TO HIDE OR VIEW PASSWORD TEXT
                  otherLogic={
                    <button
                      type="button"
                      className="text-darkText pr-3 cursor-pointer"
                      onClick={() => setViewPass((prev) => !prev)}
                    >
                      {viewPass ? (
                        <HiEye className="w-5 h-5" />
                      ) : (
                        <HiEyeSlash className="w-5 h-5" />
                      )}
                    </button>
                  }
                />
              </div>
              <div className="mt-[4em] flex justify-end">
                <Submit
                  loading={isLoading}
                  width="w-[50px]"
                  width_height="w-[100px] h-[50px]"
                  arrow_width_height="w-8 h-8"
                  disabledLogic={isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetPassword;
