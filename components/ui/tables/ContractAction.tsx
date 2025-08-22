"use client";
import React, { Fragment, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { Contract } from "@/types/types";
import { useAuth } from "@/context/UserContext";
import Link from "next/link";
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
import { formatCurrency } from "@/utils/currencies";

function ContractAction({ data }: { readonly data: Contract | undefined }) {
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
            <Link
              href={`/projects/${data?.project_id}/contractors/${data?.contractor_id}/contracts/${data?.id}/payments`}
            >
              <DropdownMenuItem>View payments</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ViewAction open={viewOpen} setOpen={setViewOpen} data={data} />
      <EditAction open={editOpen} setOpen={setEditOpen} data={data} />
      <DeleteAction open={deleteOpen} setOpen={setDeleteOpen} data={data} />
    </>
  );
}

export default ContractAction;

const ViewAction = ({
  open,
  setOpen,
  data,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Contract | undefined;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="" aria-describedby="contract view details">
        <DialogHeader>
          <DialogTitle>
            Contract - <span className="italic">{data?.contract_code}</span>
          </DialogTitle>
        </DialogHeader>
        {data ? (
          <div className="grid grid-cols-2 gap-4">
            {/* PROJECT NAME */}
            <ViewLabel label={"Project"} content={data?.projects?.name} />
            {/* CONTRACTOR NAME */}
            <ViewLabel label={"Contractor"} content={data?.contractors?.name} />
            {/* CONTRACT CODE */}
            <ViewLabel label={"Contract code"} content={data.contract_code} />
            {/* CONTRACTOR DATE */}
            <ViewLabel
              label={"Contract date"}
              content={formatDate(data.date)}
            />
            {/* STAGE */}
            <ViewLabel label={"Stage"} content={data.stages?.name} />
            {/* BANK TITLES */}
            <ViewLabel label={"Bank names"} custom className="capitalize">
              <p>
                {data.bank_names.map((item, i) => {
                  return (
                    <Fragment key={item}>
                      <span key={item}>{item}</span>
                      <span
                        className={`${
                          data.bank_names.length !== i + 1
                            ? "visible"
                            : "invisible"
                        }`}
                      >
                        ,{" "}
                      </span>
                    </Fragment>
                  );
                })}
              </p>
            </ViewLabel>
            {/* DESCRIPTION */}
            <ViewLabel label={"Description"} content={data.description} />
            {/* AMOUNT */}
            <ViewLabel label={"Amounts"} custom>
              <div className="flex flex-col">
                {data.contract_amounts.map((item) => {
                  return (
                    <p key={item.id}>
                      {item.code} {formatCurrency(+item.amount, item.code)}
                    </p>
                  );
                })}
              </div>
            </ViewLabel>
            {/* COMMENT */}
            <ViewLabel label={"Comment"} content={data?.comment ?? "N/A"} />
            {/* STATUS */}
            <ViewLabel label={"Status"} custom>
              {data.is_completed ? (
                <Banner text="completed" />
              ) : (
                <Banner text="ongoing" />
              )}
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
  readonly data: Contract | undefined;
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
  readonly data: Contract | undefined;
}) => {
  return <div></div>;
};
