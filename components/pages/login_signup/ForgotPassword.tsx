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
import { toast } from "sonner";
import { isValidEmail } from "@/utils/validation";

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
  });

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);

    if (!form.email.length) {
      toast.error("Something went wrong", {
        description: "No entries must be left empty",
      });

      setIsLoading(false);
      return;
    } else if (!isValidEmail(form.email)) {
      toast.error("Something went wrong", {
        description: "Email does not match standard format",
      });

      setIsLoading(false);
      return;
    }

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
          duration: Infinity,
        });

        return;
      }

      toast.success("Password reset email sent", {
        description:
          "Please check your email and follow the instructions to change your password",
        duration: Infinity,
      });
    } catch (error: any) {
      toast.error("Something went wrong", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="mt-2 text-sm text-lightText/70">
          Forgot password?
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="forgot password"
      >
        <DialogHeader>
          <DialogTitle>Forgot password?</DialogTitle>
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
          <div className="mt-3 flex justify-end">
            <Submit loading={isLoading} disabledLogic={isLoading} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPassword;
