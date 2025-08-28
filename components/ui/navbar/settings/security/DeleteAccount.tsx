"use client";
import React, { useActionState, useEffect, useState } from "react";
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

function DeleteAccount() {
  
  const [alertOpen, setAlertOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const router = useRouter();

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
          <form>
            {/* <Input htmlFor={"email"} label={"Email"}>
              <input
                className="form"
                id="email"
                name="email"
                defaultValue={state?.data?.email}
              />
            </Input>
            <Input htmlFor={"password"} label={"Password"} className="mt-3">
              <input
                className="form"
                type="password"
                id="password"
                name="password"
                defaultValue={state?.data?.password}
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={isLoading}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
              />
            </div> */}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeleteAccount;
