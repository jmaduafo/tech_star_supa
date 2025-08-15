"use client";
import React, { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/types";
import { MoreHorizontal } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ProfileCard from "../cards/ProfileCard";
// import { editMember } from "@/zod/actions";
import Input from "../input/CustomInput";
import SelectBar from "../input/SelectBar";
import { SelectItem } from "../select";
import Submit from "../buttons/Submit";

type Dialog = {
  readonly data: User | undefined;
};

function UserAction({ data }: Dialog) {

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewEditSheetOpen, setViewEditSheetOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // const [state, action, isLoading] = useActionState(
  //   (prevState: any) =>
  //     editMember(prevState, {
  //       id: data?.id as string,
  //       role: user.role,
  //       hire_type: user.hire_type,
  //     }),
  //   {
  //     message: "",
  //     success: false,
  //   }
  // );

  // const [user, setUser] = useState({
  //   role: "",
  //   hire_type: "",
  // });

  // useEffect(() => {
  //   if (data) {
  //     setUser({
  //       role: data?.role ?? "",
  //       hire_type: data?.hire_type ?? "",
  //     });
  //   }
  // }, [data?.id ?? "guest"]);

  // useEffect(() => {
  //   if (!state?.success && state?.message.length) {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong",
  //       description: state?.message,
  //     });
  //   } else if (state?.success) {
  //     toast({
  //       title:
  //         "Team member was updated successfully!",
  //     });

  //     setEditDialogOpen(false)
  //   }
  // }, [state]);

  // console.log(user);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-end items-center">
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* VIEW DETAILS DROPDOWN DIALOG */}
          <DropdownMenuItem
            onClick={() => {
              setViewDialogOpen(true);
              setEditDialogOpen(false);
            }}
          >
            View profile
          </DropdownMenuItem>
          {/* {userData?.role === "admin" || userData?.role === "editor" ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditDialogOpen(true);
                  setViewDialogOpen(false);
                }}
              >
                Edit member
              </DropdownMenuItem>{" "}
            </>
          ) : null} */}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* DISPLAY TEAM MEMBER'S INFORMATION */}
      {/* <ProfileCard
        user={data}
        profileOpen={viewDialogOpen}
        setProfileOpen={setViewDialogOpen}
        editProfileOpen={viewEditSheetOpen}
        setEditProfileOpen={setViewEditSheetOpen}
        // ONLY HIDE EDIT BUTTON IF THE PROFILE IS NOT THE USER'S
        hideEdit={userData?.id !== data?.id}
      /> */}
      {/* EDIT MEMBER INFORMATION ITEM */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="sm:max-w-sm"
          aria-describedby="update member credentials"
        >
          <DialogHeader>
            <DialogTitle>Edit member</DialogTitle>
          </DialogHeader>
          <form>
            <Input htmlFor={"full_name"} label={"Full name"}>
              <input
                className="disabledForm"
                type="text"
                id="full_name"
                name="full_name"
                disabled
                value={data?.full_name}
              />
            </Input>
            <Input htmlFor={"email"} label={"Email"} className="mt-4">
              <input
                className="disabledForm"
                type="text"
                id="email"
                name="email"
                disabled
                value={data?.email}
              />
            </Input>
            {/* ROLES */}
            {/* <Input label="Role" htmlFor="" className="mt-5">
              <SelectBar
                name="role"
                placeholder={"Select a role *"}
                label={"Roles *"}
                className="mt-1.5"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                valueChange={(text) =>
                  setUser((prev) => ({
                    ...prev,
                    role: text,
                  }))
                }
              >
                {["Viewer", "Editor", "Admin"].map((item) => {
                  return (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </Input> */}
            {/* HIRE TYPE */}
            {/* <Input htmlFor={"hire_type"} label={"Hire type"} className="mt-5">
              <SelectBar
                name="hire_type"
                placeholder={"Select a hire type *"}
                label={"Hire type *"}
                className="mt-1.5"
                value={
                  user.hire_type.charAt(0).toUpperCase() +
                  user.hire_type.slice(1)
                }
                valueChange={(text) =>
                  setUser((prev) => ({
                    ...prev,
                    hire_type: text,
                  }))
                }
              >
                {["Employee", "Contractor", "Independent"].map((item) => {
                  return (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </Input> */}
            {/* <div className="flex justify-end mt-6">
              <Submit
                loading={isLoading}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
                disabledLogic={
                  isLoading ||
                  !user.hire_type.length ||
                  !user.role.length ||
                  (user.hire_type === data?.hire_type &&
                  user.role === data?.role)
                }
              />
            </div> */}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserAction;
