"use client";
import React, { useState } from "react";
import Submit from "@/components/ui/buttons/Submit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import { toast } from "sonner";
import { User } from "@/types/types";
import SignInCard from "@/components/ui/cards/SignInCard";
import { isValidEmail } from "@/utils/validation";
import { createClient } from "@/lib/supabase/client";

function ChangeEmail({
  user,
  mainOpen,
  mainOpenChange,
}: {
  readonly user: User | undefined;
  readonly mainOpen: boolean;
  readonly mainOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [newEmailOpen, setNewEmailOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [newEmail, setNewEmail] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!isValidEmail(newEmail)) {
      toast("Something went wrong", {
        description: "Email is in an invalid format",
      });
    } else if (!newEmail.length) {
      toast("Something went wrong", {
        description: "Email field must not be left empty",
      });
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      toast("Success!", {
        description: "Email was updated successfully",
      });

      setNewEmailOpen(false);
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
          mainOpenChange(false)
        }}
        className={`w-full text-[14px] text-left outline-none border-b border-b-dark10 py-4 text-dark75 hover:text-darkText duration-300`}
      >
        Update email
      </button>
      {/* SHOW THIS DIALOG INITIALLY AND APPOINT FOR USER TO ENTER 
              THEIR CURRENT PASSWORD AND SIGN IN BEFORE BEING ALLOWED TO UPDATE THEIR PASSWORD */}
      <SignInCard
        open={signInOpen}
        setOpen={setSignInOpen}
        newOpen={newEmailOpen}
        setNewOpen={setNewEmailOpen}
        description={"Login in to update email"}
      />
      <Dialog open={newEmailOpen} onOpenChange={setNewEmailOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Update email</DialogTitle>
            <DialogDescription>
              Insert a new email and update the changes
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="duration-300">
            <Input
              htmlFor={"email"}
              label={"Email"}
              className=""
              id="email"
              name="email"
              type="text"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
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

export default ChangeEmail;
