"use client";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import React, { useState } from "react";
import { toast } from "sonner";
import IconInput from "@/components/ui/input/IconInput";
import { CiLock, CiMail } from "react-icons/ci";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Submit from "@/components/ui/buttons/Submit";
import { createClient } from "@/lib/supabase/client";
import { isValidEmail, isValidPassword } from "@/utils/validation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Paragraph from "@/components/fontsize/Paragraph";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

function SignUp() {
  // createAdmin => the action function
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("hi");

    const supabase = createClient();

    if (
      !lastName.length ||
      !firstName.length ||
      !email.length ||
      !password.length
    ) {
      toast("Something went wrong", {
        description: "All entries must not be left empty",
      });

      setIsLoading(false);
      return;
    } else if (!isValidEmail(email)) {
      toast("Something went wrong", {
        description: "Email does not match standard format",
      });

      setIsLoading(false);
      return;
    } else if (!isValidPassword(password)) {
      toast("Something went wrong", {
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
            emailRedirectTo: `${window.location.origin}`,
          },
        });

      if (signUpError) {
        toast("Something went wrong", {
          description: signUpError.message,
        });

        setIsLoading(false);
        return;
      }

      // IF SIGNUP IS COMPLETE, GET USER ID
      const userId = signUpData.user?.id;

      if (!userId) {
        console.log("No user found");
      }

      // CREATE NEW TEAM USING NEWLY CREATED USER ID
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({ team_name: `${firstName}'s Team`, owner_id: userId })
        .select("id")
        .single();

      if (teamError) {
        console.log(teamError.message);
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
        console.log(userError.message);
        return;
      }

      // CREATE A TEAM MEMBERS TABLE AND ADD ROLE, TEAM ID, AND USER ID
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: teamData?.id,
          role: "admin",
          user_id: userId,
        });

      if (memberError) {
        console.log(memberError.message);
        return;
      }

      setIsSuccess(true);
    } catch (error: unknown) {
      toast("Something went wrong", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header1 text="Join us today!" className="text-darkText" />
      <Header6
        className="mt-4 text-darkText"
        text="Create an account to streamline your workflow and manage projects with ease."
      />
      {isSuccess ? <div></div> : null}
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign up success</AlertDialogTitle>
          </AlertDialogHeader>
          <Paragraph
            text="You've successfully signed up. Please check your email to
                confirm your account before signing in."
          />
        </AlertDialogContent>
      </AlertDialog>
      <form className="mt-10" onSubmit={handleSignUp}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div>
            <IconInput
              icon={
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center">
                  <p>A</p>
                </div>
              }
              input={
                <input
                  placeholder="First name"
                  type="text"
                  name="first_name"
                  className="placeholder-dark50"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              }
            />
          </div>
          <div>
            <IconInput
              icon={
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex justify-center items-center">
                  <p>Z</p>
                </div>
              }
              input={
                <input
                  placeholder="Last name"
                  type="text"
                  name="last_name"
                  className="placeholder-dark50"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <IconInput
            icon={<CiMail className="w-5 h-5 sm:w-6 sm:h-6" />}
            input={
              <input
                placeholder="Email"
                type="text"
                name="email"
                className="placeholder-dark50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={viewPass ? "text" : "password"}
                name="password"
                className="placeholder-dark50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            }
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
        {isSuccess ? (
          <Alert className="mt-3">
            <CheckCircle2Icon />
            <AlertTitle>Success! Your account was created</AlertTitle>
            <AlertDescription>
              Please check your email and follow the instructions to confirm
              your account before signing in
            </AlertDescription>
          </Alert>
        ) : (
          <div className="mt-[4em] flex justify-end">
            <Submit
              loading={isLoading}
              width="w-[50px]"
              width_height="w-[100px] h-[50px]"
              arrow_width_height="w-8 h-8"
              disabledLogic={isLoading}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default SignUp;
