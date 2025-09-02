"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import Input from "../input/Input";
import Submit from "../buttons/Submit";
import { isValidEmail, isValidPassword } from "@/utils/validation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function SignInCard({
  open,
  setOpen,
  newOpen,
  setNewOpen,
  description,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly newOpen: boolean;
  readonly setNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly description: string;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!isValidEmail(form.email)) {
      toast("Something went wrong", {
        description: "Email is in an invalid format",
      });
    } else if (!isValidPassword(form.password)) {
      toast("Something went wrong", {
        description: "Password should be at least 6 characters or more",
      });
    } else if (!form.email.length || !form.password.length) {
      toast("Something went wrong", {
        description: "All fields must not be left empty",
      });
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      setOpen(false);
      setNewOpen(true);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-lg bg-darkText">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>Log in to {description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="duration-300">
          <Input
            htmlFor={"email"}
            label={"Email"}
            className=""
            id="email"
            name="email"
            type="text"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            htmlFor={"password"}
            label={"Password *"}
            className="mt-3"
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="flex justify-end mt-4">
            <Submit loading={loading} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SignInCard;
