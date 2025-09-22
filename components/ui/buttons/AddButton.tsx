"use client";
import React from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/UserContext";
import { Button } from "../button";

function AddButton({
  children,
  title,
  buttonTitle,
  desc,
  footerButton,
  className,
  setOpen,
  open,
}: {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly buttonTitle?: string;
  readonly desc: string;
  readonly footerButton?: React.ReactNode;
  readonly className?: string;
  readonly setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  readonly open?: boolean;
}) {
  const { userData } = useAuth();

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className={`${
            userData?.role === "admin" ? "flex" : "hidden"
          } ${className}`}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:block">Add {buttonTitle}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a {title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>{footerButton}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddButton;
