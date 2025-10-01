"use client";
import React, { useState } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ForgotPassword from "./ForgotPassword";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail, isValidPassword } from "@/utils/validation";
import LogSignHeading from "@/components/ui/labels/LogSignHeading";
import Input from "@/components/ui/input/Input";
import CustomInput from "@/components/ui/input/CustomInput";

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
      <LogSignHeading
        heading="Sign in to your account"
        text="Securely access your projects and keep your work moving forward"
      />
      <form className="mt-10" onSubmit={handleLogin}>
        <Input
          label="Email *"
          htmlFor="email"
          placeholder="eg. example@email.com"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <CustomInput htmlFor={"password"} label={"Password *"} className="mt-4">
          <div className="flex items-center bg-lightText/50 rounded-[10px] px-1">
            <input
              placeholder="••••••"
              // CHANGE THE TYPE BASED ON BUTTON CLICK
              type={viewPass ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm placeholder-darkText/65"
            />
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
          </div>
        </CustomInput>

        <div>
          <ForgotPassword />
        </div>
        <div className="mt-[4em] flex justify-end">
          <Submit
            loading={isLoading}
            disabledLogic={isLoading}
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
