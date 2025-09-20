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
import { isValidEmail, isValidPassword } from "@/utils/validation";

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

    if (!email.length || !password.length) {
      toast.error("Something went wrong", {
        description: "No entries must be left empty",
      });

      setIsLoading(false);
      return;
    } else if (!isValidEmail(email)) {
      toast.error("Something went wrong", {
        description: "Email does not match standard format",
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        setIsLoading(false);
        return;
      }
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Something went wrong", {
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
  );
}

export default Login;
