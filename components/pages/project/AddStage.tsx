"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import Submit from "@/components/ui/buttons/Submit";
import { StagesSchema } from "@/zod/validation";
import { toast } from "sonner";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import CustomInput from "@/components/ui/input/CustomInput";
import { Project } from "@/types/types";

function AddStage({
  open,
  setOpen,
  project,
}: {
  readonly project: Project | undefined;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    desc: "",
  });

  const { userData } = useAuth();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      name: form.name.trim(),
      description: form.desc.trim(),
      is_completed: false,
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
      if (!userData || !project) {
        return;
      }

      const { error } = await supabase.from("stages").insert({
        name,
        description,
        is_completed,
        project_id: project.id,
        team_id: userData.team_id,
      });

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Created new stage for project ${project.name}`,
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
        description: "Stage added successfully",
      });

      setForm({
        name: "",
        desc: "",
      });
    } catch (err: any) {
      toast.error("Something went wrong", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="add stage popup"
      >
        <DialogHeader>
          <DialogTitle>Add a stage</DialogTitle>
          <DialogDescription>
            Stages represent the different phases of a project. Add stages to
            enhance project organization.
          </DialogDescription>
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
          <CustomInput htmlFor={"desc"} label={"Description *"} className="mt-3">
            <input
              type={"text"}
              name={"desc"}
              id={"desc"}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              maxLength={50}
              className="form"
            />
          </CustomInput>
          <div className="">
            <p className="text-right text-sm text-darkText/70">
              {form.desc.length} / 50
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
}

export default AddStage;
