"use client";
import React, { useActionState, useEffect, useState } from "react";
import Submit from "@/components/ui/buttons/Submit";
import Input from "@/components/ui/input/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { User } from "@/types/types";
import SignInCard from "@/components/ui/cards/SignInCard";
import { createClient } from "@/lib/supabase/client";
import { isValidPassword } from "@/utils/validation";

function ChangePassword({
  user,
  mainOpen,
  mainOpenChange,
}: {
  readonly user: User | undefined;
  readonly mainOpen: boolean;
  readonly mainOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [newPasswordOpen, setNewPasswordOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!isValidPassword(newPassword)) {
      toast("Something went wrong", {
        description: "Password must be at least 6 characters",
      });
    } else if (!newPassword.length) {
      toast("Something went wrong", {
        description: "Password field must not be left empty",
      });
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      toast("Success!", {
        description: "Password was updated successfully",
      });

      setNewPasswordOpen(false);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setSignInOpen(true);
        }}
        className={`w-full text-[14px] text-left outline-none border-b border-b-dark10 py-4 text-dark75 hover:text-darkText duration-300`}
      >
        Update password
      </button>
      {/* SHOW THIS DIALOG INITIALLY AND APPOINT FOR USER TO ENTER 
            THEIR CURRENT PASSWORD AND SIGN IN BEFORE BEING ALLOWED TO UPDATE THEIR PASSWORD */}
      <SignInCard
        open={signInOpen}
        setOpen={setSignInOpen}
        newOpen={newPasswordOpen}
        setNewOpen={setNewPasswordOpen}
        description={"update password"}
      />
      <Dialog open={newPasswordOpen} onOpenChange={setNewPasswordOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>New password</DialogTitle>
            <DialogDescription>
              Insert a new password and update the changes
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="duration-300">
            <Input
              htmlFor={"password"}
              label={"Password"}
              id="password"
              name="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <Submit loading={loading} />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChangePassword;
