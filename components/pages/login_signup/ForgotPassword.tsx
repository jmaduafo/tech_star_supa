"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/CustomInput";
import { createClient } from "@/lib/supabase/client";
import Submit from "@/components/ui/buttons/Submit";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
  });

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="mt-2 text-sm text-lightText/70">Forgot password?</button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="forgot password"
      >
        <DialogHeader>
          <DialogTitle>Forgot password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleForgotPassword}>
          {/* EMAIL */}
          <Input label="Email *" htmlFor="email" className="">
            <input
              name="email"
              className="form"
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Input>
          {/* ERROR MESSAGE */}
          {error ? (
            <Alert variant="destructive" className="mt-3">
              <AlertCircleIcon />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {/* SUCCESS  MESSAGE */}
          {success ? (
            <Alert className="mt-3">
              <CheckCircle2Icon />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Please check your email and follow the instructions to change
                your password
              </AlertDescription>
            </Alert>
          ) : (
            <div className="mt-3 flex justify-end">
              <Submit loading={isLoading} disabledLogic={isLoading} />
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPassword;
