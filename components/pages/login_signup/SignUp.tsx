"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Submit from "@/components/ui/buttons/Submit";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail, isValidPassword } from "@/utils/validation";
import LogSignHeading from "@/components/ui/labels/LogSignHeading";
import Input from "@/components/ui/input/Input";
import CustomInput from "@/components/ui/input/CustomInput";

function SignUp() {
  // createAdmin => the action function
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [viewPass, setViewPass] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const supabase = createClient();

    if (
      !lastName.length ||
      !firstName.length ||
      !email.length ||
      !password.length
    ) {
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
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${globalThis.location.origin}`,
          },
        });

      if (signUpError) {
        toast.error("Something went wrong", {
          description: signUpError.message,
        });

        setIsLoading(false);
        return;
      }

      // IF SIGNUP IS COMPLETE, GET USER ID
      const userId = signUpData.user?.id;

      if (!userId) {
        toast.error("Something went wrong", {
          description: "No user found",
        });
      }

      // CREATE NEW TEAM USING NEWLY CREATED USER ID
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({ team_name: `${firstName}'s Team`, owner_id: userId })
        .select("id")
        .single();

      if (teamError) {
        toast.error("Something went wrong", {
          description: teamError.message,
        });

        return;
      }

      // CREATE NEW USER DATA AND ADD TEAM ID WITH NEWLY CREATED ID FROM TEAMS TABLE
      const { error: userError } = await supabase.from("users").insert({
        // id automatically set to authenticated user
        id: userId,
        first_name: firstName,
        last_name: lastName,
        full_name:
          firstName.charAt(0).toUpperCase() +
          firstName.slice(1) +
          " " +
          lastName.charAt(0).toUpperCase() +
          lastName.slice(1),
        email,
        team_id: teamData.id,
        image_url: null,
        is_owner: true,
        role: "admin",
        job_title: null,
        hire_type: "independent",
        is_online: true,
      });

      if (userError) {
        toast.error("Something went wrong", {
          description: userError.message,
        });

        return;
      }

      // CREATE A TEAM MEMBERS TABLE AND ADD ROLE, TEAM ID, AND USER ID
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: teamData?.id,
          user_id: userId,
        });

      if (memberError) {
        toast.error("Something went wrong", {
          description: memberError.message,
        });

        return;
      }

      toast.success("Your account was created!", {
        description:
          "Please check your email and follow the instructions to confirm your account before signing in",
        duration: Infinity,
      });

      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
    } catch (error: unknown) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <LogSignHeading
        heading="Create your account"
        text="Set up your workspace and start managing projects with confidence"
      />
      <form className="mt-10" onSubmit={handleSignUp}>
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <Input
            label="First name *"
            htmlFor="first_name"
            type="text"
            name="first_name"
            value={firstName}
            placeholder="John"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last name *"
            htmlFor="last_name"
            type="text"
            name="last_name"
            value={lastName}
            placeholder="Doe"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <Input
          label="Email *"
          htmlFor="email"
          placeholder="eg. example@email.com"
          type="text"
          name="email"
          value={email}
          className="mt-4"
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
        <div className="mt-[4em] flex justify-end">
          <Submit loading={isLoading} disabledLogic={isLoading} />
        </div>
      </form>
    </div>
  );
}

export default SignUp;
