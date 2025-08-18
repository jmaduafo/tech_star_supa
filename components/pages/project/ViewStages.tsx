"use client";

import Banner from "@/components/ui/Banner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { Project, Stage } from "@/types/types";
import React, { Fragment, useEffect, useState } from "react";
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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[600px] bg-lightText/10"
        aria-describedby="view stage popup"
      >
        <DialogHeader>
          <DialogTitle className="text-lightText">All stages</DialogTitle>
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
                <Fragment key={item.id}>
                  <StageRow stage={item} index={i} />
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewStages;

const StageRow = ({
  stage,
  index,
}: {
  readonly stage: Stage;
  readonly index: number;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { userData } = useAuth();

  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>{stage.name}</TableCell>
      <TableCell>{stage.description}</TableCell>
      <TableCell>
        <div
          className={`flex ${
            userData?.role === "admin" ? "justify-start" : "justify-end"
          }`}
        >
          {stage.is_completed ? (
            <Banner text={"completed"} />
          ) : (
            <Banner text={"ongoing"} />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger>
              {userData?.role === "admin" ? (
                <Ellipsis className="w-5 h-5" />
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Edit
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Delete
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
