"use client";
import React, { useEffect, useState } from "react";
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
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/types";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import ProfileCard from "../cards/ProfileCard";
import SelectBar from "../input/SelectBar";
import { SelectItem } from "../select";
import Submit from "../buttons/Submit";
import { useAuth } from "@/context/UserContext";
import CustomInput from "../input/CustomInput";
import { job_titles } from "@/utils/dataTools";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../alert-dialog";
import { EditMemberSchema } from "@/zod/validation";
import { createClient } from "@/lib/supabase/client";
import { deleteUser } from "@/lib/supabase/deleteUser";
import Loading from "../loading/Loading";

type Dialog = {
  readonly data: User | undefined;
};

function UserAction({ data }: Dialog) {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewEditSheetOpen, setViewEditSheetOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { userData } = useAuth();
  const supabase = createClient();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    location: "",
    role: "",
    job_title: "",
    hire_type: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        full_name: data.full_name ?? "",
        email: data.email ?? "",
        location: data.location ?? "",
        role: data.role ?? "",
        job_title: data.job_title ?? "",
        hire_type: data.hire_type ?? "",
      });
    }
  }, [data]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      role: form.role,
      job_title: form.job_title,
      hire_type: form.hire_type,
    };

    const result = EditMemberSchema.safeParse(values);

    if (!result.success) {
      toast("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setIsLoading(false);

      return;
    }

    const { role, hire_type, job_title } = result.data;

    try {
      if (!data || !userData || data.team_id !== userData.team_id) {
        return;
      }

      // IF NO ERRORS OCCUR, THEN ADD NEW MEMBER TO THE USERS TABLE
      const { error } = await supabase
        .from("users")
        .update({
          role,
          hire_type,
          job_title,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Team member ${form.full_name} was updated`,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "team",
        });

      if (activityError) {
        toast("Something went wrong", {
          description: activityError.message,
        });

        return;
      }

      // NOTIFY ADMIN THAT THE NEW MEMBER WOULD NEED TO VERIFY THEIR ACCOUNT
      // BEFORE LOGIN
      toast("Success!", {
        description: `Member ${form.full_name} was successfuly updated`,
      });

      setEditDialogOpen(false);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });

      return;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMember = async () => {
    setDeleteLoading(true);

    try {
      if (!data) {
        return;
      }

      const result = await deleteUser(data.id);

      if (!result.success) {
        toast("Something went wrong", {
          description: result.message,
        });

        return;
      }

      const { error } = await supabase.from("users").delete().eq("id", data.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Team member ${data.full_name} was deleted`,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "team",
        });

      if (activityError) {
        toast("Something went wrong", {
          description: activityError.message,
        });

        return;
      }

      toast("Success!", {
        description: `Team member ${form.full_name} was deleted successfully`,
      });

      setDeleteDialogOpen(false);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
        <DropdownMenuTrigger className="flex justify-end items-center">
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* VIEW DETAILS DROPDOWN DIALOG */}
          <DropdownMenuItem
            onClick={() => {
              setViewDialogOpen(true);
              setDropDownOpen(false);
            }}
          >
            View profile
          </DropdownMenuItem>
          {userData?.role === "admin" ? (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setEditDialogOpen(true);
                  setDropDownOpen(false);
                }}
              >
                Edit member
              </DropdownMenuItem>{" "}
              <DropdownMenuItem
                onClick={() => {
                  setDeleteDialogOpen(true);
                  setDropDownOpen(false);
                }}
              >
                Delete member
              </DropdownMenuItem>{" "}
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* DISPLAY TEAM MEMBER'S INFORMATION */}
      <ProfileCard
        user={data}
        profileOpen={viewDialogOpen}
        setProfileOpen={setViewDialogOpen}
        editProfileOpen={viewEditSheetOpen}
        setEditProfileOpen={setViewEditSheetOpen}
        // ONLY HIDE EDIT BUTTON IF THE PROFILE IS NOT THE USER'S
        hideEdit={userData?.id !== data?.id}
      />

      {/* EDIT MEMBER INFORMATION ITEM */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="sm:max-w-sm"
          aria-describedby="update member credentials"
        >
          <DialogHeader>
            <DialogTitle>Edit member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            {/* FIRST NAME */}
            <CustomInput htmlFor={"full_name"} label={"Full name *"}>
              <input
                className="disabledForm"
                type="text"
                id="full_name"
                name="full_name"
                disabled
                value={form.full_name}
              />
            </CustomInput>
            {/* EMAIL */}
            <CustomInput htmlFor={"email"} label={"Email *"} className="mt-4">
              <input
                className="disabledForm"
                type="text"
                id="email"
                name="email"
                disabled
                value={form.email}
              />
            </CustomInput>
            {/* LOCATION */}
            <CustomInput
              htmlFor={"location"}
              label={"Location *"}
              className="mt-4"
            >
              <input
                className="disabledForm"
                type="text"
                id="location"
                name="location"
                disabled
                value={form.location}
              />
            </CustomInput>
            {/* JOB TITLE */}
            <CustomInput label="Occupation *" htmlFor="" className="mt-5">
              <SelectBar
                name="job_title"
                placeholder={"Select a job title *"}
                label={"Job title"}
                className="mt-1.5"
                value={form.job_title}
                valueChange={(name) => setForm({ ...form, job_title: name })}
              >
                {job_titles.map((item) => {
                  return (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </CustomInput>
            {/* ROLES */}
            <CustomInput label="Role *" htmlFor="" className="mt-5">
              <SelectBar
                name="role"
                placeholder={"Select a role *"}
                label={"Roles"}
                className="mt-1.5"
                value={form.role}
                valueChange={(name) => setForm({ ...form, role: name })}
              >
                {["viewer", "admin"].map((item) => {
                  return (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </CustomInput>
            {/* HIRE TYPE */}
            <CustomInput htmlFor={""} label={"Hire type *"} className="mt-5">
              <SelectBar
                name="hire_type"
                placeholder={"Select a hire type *"}
                label={"Hire type"}
                className="mt-1.5"
                value={form.hire_type}
                valueChange={(name) => setForm({ ...form, hire_type: name })}
              >
                {["employee", "contractor", "independent", "employer"].map(
                  (item) => {
                    return (
                      <SelectItem
                        value={item}
                        key={item}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    );
                  }
                )}
              </SelectBar>
            </CustomInput>
            {/* SUBMIT BUTTON */}
            <div className="flex justify-end mt-6">
              <Submit loading={isLoading} disabledLogic={isLoading} />
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MEMBER INFORMATION ITEM */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              member and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMember}>
              {deleteLoading ? <Loading /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UserAction;
