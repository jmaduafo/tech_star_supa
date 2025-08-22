"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { Payment } from "@/types/types";
import { useAuth } from "@/context/UserContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import ViewLabel from "../labels/ViewLabel";
import { Skeleton } from "../skeleton";
import Banner from "../Banner";
import { formatDate } from "@/utils/dateAndTime";
import { format } from "timeago.js";

function PaymentAction({ data }: { readonly data: Payment | undefined }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { userData } = useAuth();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex justify-end items-center">
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              View details
            </DropdownMenuItem>
            {userData?.role === "admin" &&
            userData?.team_id === data?.team_id ? (
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit
              </DropdownMenuItem>
            ) : null}
            {userData?.role === "admin" &&
            userData?.team_id === data?.team_id ? (
              <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewAction open={viewOpen} setOpen={setViewOpen} data={data} />
      <EditAction open={editOpen} setOpen={setEditOpen} data={data} />
      <DeleteAction open={deleteOpen} setOpen={setDeleteOpen} data={data} />
    </>
  );
}

export default PaymentAction;

const ViewAction = ({
  open,
  setOpen,
  data,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Payment | undefined;
}) => {
  const checkIsPaid = data?.is_paid ? (
    <Banner text="paid" />
  ) : (
    <Banner text="unpaid" />
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="" aria-describedby="contract view details">
        <DialogHeader>
          <DialogTitle>
            {data?.contracts
              ? `Payment for ${data?.contracts?.contract_code}`
              : "Stand Alone Payment"}
          </DialogTitle>
        </DialogHeader>
        {data ? (
          <div className="grid grid-cols-2 gap-4">
            {/* PROJECT NAME */}
            <ViewLabel label={"Project"} content={data?.projects?.name} />
            {/* CONTRACTOR NAME */}
            <ViewLabel label={"Contractor"} content={data?.contractors?.name} />
            {/* DATE */}
            <ViewLabel label={"Payment date"} content={formatDate(data.date)} />
            {/* STAGE */}
            <ViewLabel label={"Stage"} content={data.stages?.name} />
            {/* BANK */}
            <ViewLabel
              label={"Bank name"}
              content={data.bank_name}
              className="capitalize"
            />
            {/* DESCRIPTION */}
            <ViewLabel label={"Description"} content={data.description} />
            {/* COMMENTS */}
            <ViewLabel label={"Comment"} content={data?.comment ?? "N/A"} />
            {/* STATUS */}
            <ViewLabel label={"Status"} custom>
              {data.is_completed ? checkIsPaid : <Banner text="pending" />}
            </ViewLabel>
            {/* CREATED AT */}
            <ViewLabel label={"Created"} content={format(data.created_at)} />
            {/* UPDATED AT */}
            {data?.updated_at ? (
              <ViewLabel
                label={"Updated at"}
                content={format(data?.updated_at)}
              />
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[55%]" />
            <Skeleton className="h-4 w-[30%]" />
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditAction = ({
  open,
  setOpen,
  data,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Payment | undefined;
}) => {
  return <div></div>;
};

const DeleteAction = ({
  open,
  setOpen,
  data,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Payment | undefined;
}) => {
  return <div></div>;
};
