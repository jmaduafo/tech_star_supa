"use client";

import Banner from "@/components/ui/Banner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { Project, Stage } from "@/types/types";
import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
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
import Loading from "@/components/ui/loading/Loading";
import Input from "@/components/ui/input/Input";
import CustomInput from "@/components/ui/input/CustomInput";
import Submit from "@/components/ui/buttons/Submit";
import { StagesSchema } from "@/zod/validation";
import { optionalS } from "@/utils/optionalS";
import { STAGE_ICONS } from "@/utils/dataTools";
import Header6 from "@/components/fontsize/Header6";
import Paragraph from "@/components/fontsize/Paragraph";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import NotAvailable from "@/components/ui/NotAvailable";

function ViewStages({
  open,
  setOpen,
  project,
}: {
  readonly project: Project | undefined;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [deleteStage, setDeleteStage] = useState<Stage | undefined>();
  const [editStage, setEditStage] = useState<Stage | undefined>();

  const { userData } = useAuth();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`sm:max-w-[435px]`}
          aria-describedby="view stage popup"
        >
          <DialogHeader>
            {/* <span className=""> */}
            <DialogTitle className="flex items-start gap-3 text-3xl font-normal">
              Stages
              {project?.stages ? (
                <p className="text-sm tracking-normal rounded-full px-3 bg-darkText text-lightText">
                  {project.stages?.length} result
                  {optionalS(project.stages?.length)}
                </p>
              ) : null}
            </DialogTitle>
            {/* </span> */}
            <DialogDescription>
              All stages under the project{" "}
              <span className="font-semibold">
                {project ? project.name : ""}
              </span>
            </DialogDescription>
          </DialogHeader>
          {project ? (
            <div className="flex flex-col gap-3 w-full mt-4">
              {project.stages?.length ? (
                project.stages?.map((item) => {
                  let Icon;
                  if (typeof item.icon === "number") {
                    const IconEntry = STAGE_ICONS[item.icon]; // get object from array
                    Icon = IconEntry?.icon;
                  }
                  return (
                    <div
                      key={item.id}
                      className="text-darkText bg-lightText/40 px-2 py-2 rounded-md"
                    >
                      <div className="flex justify-between gap-6">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 flex justify-center items-center rounded-full bg-darkText text-lightText">
                            {Icon && (
                              <Icon className="w-5 h-5" strokeWidth={1} />
                            )}
                          </div>
                          <div>
                            <Header6 text={item.name} className="capitalize" />
                            {item.description ? (
                              <Paragraph
                                text={item.description}
                                className="text-darkText/70"
                              />
                            ) : null}
                          </div>
                        </div>
                        <div className="">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              {userData?.role === "admin" ? (
                                <EllipsisVertical className="w-5 h-5" />
                              ) : null}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="" align="start">
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setOpen(false);
                                    setEditStage(item);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setOpen(false);
                                    setDeleteStage(item);
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="mt-1 flex justify-end">
                        {item.is_completed ? (
                          <Banner text="completed" />
                        ) : (
                          <Banner text="ongoing" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center pb-5">
                  <NotAvailable text="No stages created yet" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full mt-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[80%]" />
              <Skeleton className="h-5 w-[70%]" />
              <Skeleton className="h-5 w-[50%]" />
              <Skeleton className="h-5 w-[35%]" />
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Row Dialog */}
      {editStage && (
        <EditRow
          stage={editStage}
          setStage={setEditStage}
          viewOpen={open}
          setViewOpen={setOpen}
        />
      )}
      {deleteStage && (
        <DeleteRow
          stage={deleteStage}
          setStage={setDeleteStage}
          viewOpen={open}
          setViewOpen={setOpen}
        />
      )}
    </>
  );
}

export default ViewStages;

// DELETE PROJECT ALERT FUNCTIONALITY
const DeleteRow = ({
  stage,
  setStage,
  viewOpen,
  setViewOpen,
}: {
  readonly stage: Stage | undefined;
  readonly setStage: React.Dispatch<React.SetStateAction<Stage | undefined>>;
  readonly viewOpen: boolean;
  readonly setViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const supabase = createClient();

  const { userData } = useAuth();

  const deleteRow = async () => {
    setDeleteLoading(true);

    try {
      if (!stage) {
        return;
      }

      const { error } = await supabase
        .from("stages")
        .delete()
        .eq("id", stage.id);

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Deleted stage ${stage.name} `,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "stage",
        });

      if (activityError) {
        toast.error("Something went wrong", {
          description: activityError.message,
        });

        return;
      }

      toast.success("Success!", {
        description: "Stage deleted successfully",
      });
    } catch (err: any) {
      toast.error("Something went wrong", {
        description: err.message,
      });

      setStage(undefined);
      setViewOpen(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AlertDialog
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setStage(undefined);
          setViewOpen(true); // reopen stages
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected stage from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteRow}>
            {deleteLoading ? <Loading className="w-5 h-5" /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const EditRow = ({
  stage,
  setStage,
  viewOpen,
  setViewOpen,
}: {
  readonly stage: Stage | undefined;
  readonly setStage: React.Dispatch<React.SetStateAction<Stage | undefined>>;
  readonly viewOpen: boolean;
  readonly setViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: stage?.name ?? "",
    desc: stage?.description ?? "",
    is_completed: stage?.is_completed ?? false,
    icon: stage?.icon?.toString() ?? "",
  });

  const { userData } = useAuth();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      name: form.name.trim(),
      description: form.desc.trim(),
      icon: +form.icon,
      is_completed: form.is_completed,
    };

    const result = StagesSchema.safeParse(values);

    if (!result.success) {
      toast.error("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setIsLoading(false);

      return;
    }

    const { name, description, is_completed, icon } = result.data;

    try {
      if (!userData || !stage) {
        return;
      }

      const { error } = await supabase
        .from("stages")
        .update({
          name,
          description,
          is_completed,
          icon,
          updated_at: new Date().toISOString(),
        })
        .eq("id", stage.id);

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Updated stage ${stage.name} `,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "stage",
        });

      if (activityError) {
        toast.error("Something went wrong", {
          description: activityError.message,
        });

        return;
      }

      toast.success("Success!", {
        description: "Stage updated successfully",
      });

      setStage(undefined);
      setViewOpen(true);
    } catch (err: any) {
      toast.error("Something went wrong", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setStage(undefined);
          setViewOpen(true); // reopen stages
        }
      }}
    >
      <DialogContent
        aria-describedby="edit stage popup"
        className="sm:max-w-sm"
      >
        <DialogHeader>
          <DialogTitle>Edit stage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            htmlFor={"name"}
            label={"Name *"}
            type={"text"}
            name={"name"}
            id={"name"}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <CustomInput
            htmlFor={"desc"}
            label={"Description *"}
            className="mt-3"
          >
            <input
              type={"text"}
              name={"desc"}
              id={"desc"}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              maxLength={50}
              className="form !mt-0"
            />
          </CustomInput>
          <div className="">
            <p className="text-right text-sm text-darkText/70">
              {form.desc.length} / 80
            </p>
          </div>
          {/* ICONS */}
          <CustomInput
            htmlFor={"icon"}
            label={"Choose an icon that best describes the stage *"}
            className="mt-3"
          >
            <SelectBar
              className="w-full selectForm"
              placeholder={"Select an icon"}
              label={"Icons"}
              value={form.icon}
              valueChange={(name) => setForm({ ...form, icon: name })}
            >
              {STAGE_ICONS.map((icon, i) => {
                const Icon = icon.icon;

                return (
                  <SelectItem key={icon.label} value={`${i}`}>
                    <span className="flex items-center gap-2">
                      <Icon className="w-5 h-5" strokeWidth={1} />
                      {icon.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectBar>
          </CustomInput>
          {/* SUBMIT BUTTON */}
          <div className="flex justify-end mt-6">
            <Submit loading={isLoading} disabledLogic={isLoading} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
