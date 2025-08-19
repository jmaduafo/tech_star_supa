"use client";

import Banner from "@/components/ui/Banner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { Project, Stage } from "@/types/types";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
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
import Loading from "@/components/ui/Loading";
import Input from "@/components/ui/input/Input";
import CustomInput from "@/components/ui/input/CustomInput";
import Submit from "@/components/ui/buttons/Submit";
import { StagesSchema } from "@/zod/validation";
import { optionalS } from "@/utils/optionalS";

function ViewStages({
  open,
  setOpen,
  project,
}: {
  readonly project: Project | undefined;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [data, setData] = useState<Stage[] | undefined>();

  const [deleteStage, setDeleteStage] = useState<Stage | undefined>();
  const [editStage, setEditStage] = useState<Stage | undefined>();

  const { userData } = useAuth();
  const supabase = createClient();

  const getData = async () => {
    try {
      if (!userData || !project) {
        return;
      }

      const { data, error } = await supabase
        .from("stages")
        .select("id, name, description, is_completed, created_at, updated_at")
        .eq("project_id", project.id)
        .eq("team_id", userData.team_id);

      if (error) {
        console.error(error.message);
      }

      setData(data as Stage[]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`sm:max-w-[600px] bg-lightText/5`}
          aria-describedby="view stage popup"
        >
          <DialogHeader>
            <div className="flex items-start gap-3">
              <DialogTitle className="text-lightText text-3xl font-normal">
                All stages
              </DialogTitle>
              {data ? (
                <p className="text-[12.5px] rounded-full px-3 bg-darkText">
                  {data.length} result{optionalS(data.length)}
                </p>
              ) : null}
            </div>
          </DialogHeader>
          {!data ? (
            <div className="flex flex-col gap-3 w-full">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[80%]" />
              <Skeleton className="h-5 w-[70%]" />
              <Skeleton className="h-5 w-[50%]" />
              <Skeleton className="h-5 w-[35%]" />
            </div>
          ) : (
            <Table className="z-[1] mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead
                    className={`${
                      userData?.role === "admin" ? "text-left" : "text-right"
                    }`}
                  >
                    Status
                  </TableHead>
                  {userData?.role === "admin" ? (
                    <TableHead className="text-right">Action</TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, i) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <div
                        className={`flex ${
                          userData?.role === "admin"
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        {item.is_completed ? (
                          <Banner text={"completed"} />
                        ) : (
                          <Banner text={"ongoing"} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            {userData?.role === "admin" ? (
                              <Ellipsis className="w-5 h-5" />
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      toast("Success!", {
        description: "Stage deleted successfully",
      });
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });

      return;
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
  });

  const { userData } = useAuth();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      name: form.name.trim(),
      description: form.desc.length ? form.desc.trim() : null,
      is_completed: form.is_completed,
    };

    const result = StagesSchema.safeParse(values);

    if (!result.success) {
      toast("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setIsLoading(false);

      return;
    }

    const { name, description, is_completed } = result.data;

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
          updated_at: new Date().toISOString()
        })
        .eq("id", stage.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      toast("Success!", {
        description: "Stage updated successfully",
      });

      setStage(undefined);
    } catch (err: any) {
      toast("Something went wrong", {
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
          <CustomInput htmlFor={"desc"} label={"Description"} className="mt-3">
            <input
              type={"text"}
              name={"desc"}
              id={"desc"}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              maxLength={80}
              className="form"
            />
          </CustomInput>
          <div className="">
            <p className="text-right text-sm text-darkText/70">
              {form.desc.length} / 80
            </p>
          </div>
          {/* SUBMIT BUTTON */}
          <div className="flex justify-end mt-6">
            <Submit loading={isLoading} disabledLogic={isLoading} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
