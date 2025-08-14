"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client";

function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    message: "",
  });

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      const supabase = createClient();
      setIsLoading(true);
      setError(null);
  
      try {
        // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
        const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        });
        if (error) throw error;
        setSuccess(true);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="mt-2 text-sm">Forgot password?</button>
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
          {form.message.length ? (
            <div>
              <p>{form.message}</p>
            </div>
          ) : null}
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Reset password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPassword;
