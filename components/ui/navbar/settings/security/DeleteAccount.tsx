"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@/types/types";
import { isValidEmail, isValidPassword } from "@/utils/validation";
import { deleteUser } from "@/lib/supabase/deleteUser";
import { createClient } from "@/lib/supabase/client";

function DeleteAccount({ user }: { readonly user: User | undefined }) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const router = useRouter();

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

      setLoading(false);

      return;
    } else if (!isValidPassword(form.password)) {
      toast("Something went wrong", {
        description: "Password should be at least 6 characters or more",
      });

      setLoading(false);

      return;
    } else if (!form.email.length || !form.password.length) {
      toast("Something went wrong", {
        description: "All fields must not be left empty",
      });

      setLoading(false);

      return;
    }

    try {
      if (!user) {
        return;
      }

      const result = await deleteUser(user?.id);

      if (!result.success) {
        toast("Something went wrong", {
          description: result.message,
        });

        return;
      }

      const { error } = await supabase.from("users").delete().eq("id", user.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      setSignInOpen(false);
      setAlertOpen(false);

      router.push("/");
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
          setAlertOpen(true);
          setSignInOpen(false);
        }}
        className={`text-left outline-none border-b border-b-dark10 py-4 text-[#dc2626c4] hover:text-[#dc2626] duration-300 `}
      >
        Delete account
      </button>
      {/* ALERTS USER IF THEY WANT TO PROCEED IN CASE THEY ACCIDENTLY PRESSED DELETE */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setAlertOpen(false);
                setSignInOpen(true);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* POPUP THAT ALLOWS USER TO SIGN IN TO THEIR ACCOUNT IN ORDER FOR THEIR ACCOUNT TO BE DELETED */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              We are sorry to see you go. Please enter your email and password
              to delete your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
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
    </>
  );
}

export default DeleteAccount;
