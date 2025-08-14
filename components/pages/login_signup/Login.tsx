"use client";
import React, { useState } from "react";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import IconInput from "@/components/ui/input/IconInput";
import { CiMail, CiLock } from "react-icons/ci";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ForgotPassword from "./ForgotPassword";
import { createClient } from "@/lib/supabase/client";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPass, setViewPass] = useState(false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        setIsLoading(false);
        return;
      }
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/dashboard");
    } catch (error: any) {
      toast("Something went wrong", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header1 text="Welcome back!" className="text-darkText" />
      <Header6
        className="mt-4 text-darkText"
        text="Sign in to access your account and stay on top of  your company finances effortlessly."
      />
      <form className="mt-10" onSubmit={handleLogin}>
        <div>
          <IconInput
            icon={<CiMail className="w-5 h-5 sm:w-6 sm:h-6" />}
            input={
              <input
                placeholder="Email"
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="placeholder-dark50"
              />
            }
          />
        </div>
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
        <div>
          <ForgotPassword />
        </div>
        <div className="mt-[6em] flex justify-center">
          <Submit loading={isLoading} />
        </div>
      </form>
    </div>
  );
}

export default Login;
