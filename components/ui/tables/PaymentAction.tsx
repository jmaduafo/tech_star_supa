"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Ellipsis } from "lucide-react";
import { Amount, Payment, Stage } from "@/types/types";
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
import { format } from "date-fns";
import { format as formatAgo } from "timeago.js";
import { formatCurrency, upsertCurrency } from "@/utils/currencies";
import CustomInput from "../input/CustomInput";
import { createClient } from "@/lib/supabase/client";
import { currency_list } from "@/utils/dataTools";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { cn } from "@/lib/utils";
import { SelectItem } from "../select";
import Separator from "../Separator";
import { Switch } from "../switch";
import Input from "../input/Input";
import { Calendar } from "../calendar";
import Submit from "../buttons/Submit";
import ArrayInput from "../input/ArrayInput";
import ObjectArray from "../input/ObjectArray";
import SelectBar from "../input/SelectBar";
import { contractorStages } from "@/utils/stagesFilter";
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
import Loading from "../loading/Loading";
import { toast } from "sonner";
import { PaymentSchema } from "@/zod/validation";

function PaymentAction({ data }: { readonly data: Payment | undefined }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [stages, setStages] = useState<Stage[] | undefined>();

  const { userData } = useAuth();
  const supabase = createClient();

  // RETRIEVE CONTRACTOR DATA
  const getStages = async () => {
    try {
      if (!userData || !data?.contractor_id) {
        return;
      }

      const { data: stagesData } = await supabase
        .from("stages")
        .select("id, name, stage_contractors ( contractor_id )")
        .eq("stage_contractors.contractor_id", data.contractor_id)
        .eq("team_id", userData.team_id)
        .throwOnError();

      setStages(contractorStages(stagesData));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getStages();
  }, [data]);

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
      <EditAction
        open={editOpen}
        setOpen={setEditOpen}
        data={data}
        stages={stages}
      />
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
            {/* AMOUNT */}
            <ViewLabel label={"Payment amount"} custom>
              <div>
                {data.payment_amounts.map((item) => {
                  return (
                    <p key={item.id}>
                      {item.code} {formatCurrency(+item.amount, item.code)}
                    </p>
                  );
                })}
              </div>
            </ViewLabel>
            {/* COMMENTS */}
            <ViewLabel label={"Comment"} content={data?.comment ?? "N/A"} />
            {/* STATUS */}
            <ViewLabel label={"Status"} custom>
              {data.is_completed ? checkIsPaid : <Banner text="pending" />}
            </ViewLabel>
            {/* CREATED AT */}
            <ViewLabel label={"Created"} content={formatAgo(data.created_at)} />
            {/* UPDATED AT */}
            {data?.updated_at ? (
              <ViewLabel
                label={"Updated at"}
                content={formatAgo(data?.updated_at)}
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
  stages,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Payment | undefined;
  readonly stages: Stage[] | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);

  const [currencyInputs, setCurrencyInputs] = useState<Amount[]>([]);
  const [bankInputs, setBankInputs] = useState<string[]>(
    data ? [data.bank_name] : []
  );

  const [form, setForm] = useState({
    desc: "",
    stage_id: "",
    comment: "",
    amounts: {
      code: "",
      symbol: "",
      amount: "",
      name: "",
    },
    is_completed: false,
    is_paid: true,
  });

  const { userData } = useAuth();
  const supabase = createClient();

  // UPDATES EVERY TIME THE PAYMENT IS UPDATED SO THAT THE EDIT
  // INPUTS REFLECTS APPROPRIATELY AFTER THE DATA CHANGES
  useEffect(() => {
    setForm({
      desc: data ? data.description : "",
      stage_id: data ? data.stage_id : "",
      comment: data?.comment ?? "",
      amounts: {
        code: "",
        symbol: "",
        amount: "",
        name: "",
      },
      is_completed: data ? data.is_completed : false,
      is_paid: data ? data.is_paid : true,
    });

    setPaymentDate(data ? new Date(data.date) : undefined);
    setCurrencyInputs(data ? data.payment_amounts : []);
    setBankInputs(data ? [data.bank_name] : []);
  }, [data]);

  function handleAddCurrency() {
    if (
      // CHECKS IF CODE IS ENTERED, IF THE TOTAL AMOUNT IS MORE THAN
      // 0, AND IF THE AMOUNT IS AT MOST 15 DIGITS
      (form.amounts.code.length && +form.amounts.amount > 0) ||
      form.amounts.amount.length < 16
    ) {
      // FIND WHERE THE SELECTED CODE IS IN THE CURRENCY LIST
      const currencyIndex = currency_list.findIndex(
        (curr) => curr.code === form.amounts.code
      );

      if (currencyIndex > -1) {
        setCurrencyInputs((prev) =>
          upsertCurrency(prev, {
            code: form.amounts.code,
            name: currency_list[currencyIndex].name,
            symbol: currency_list[currencyIndex].symbol,
            amount: form.amounts.amount,
          })
        );

        // SET AMOUNT AND CODE TO AN EMPTY STRING
        setForm({
          ...form,
          amounts: { ...form.amounts, amount: "", code: "" },
        });
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      date: paymentDate,
      stage_id: form.stage_id,
      bank_name: bankInputs[0],
      currency: currencyInputs,
      is_completed: form.is_completed,
      is_paid: !form.is_completed ? false : form.is_paid,
      desc: form.desc.trim(),
      comment: form.comment.length ? form.comment.trim() : null,
    };

    const result = PaymentSchema.safeParse(values);

    if (!result.success) {
      toast("Something went wrong", {
        description: result.error.issues[0].message,
      });

      console.log(result.error.issues[0].message);

      setIsLoading(false);

      return;
    }

    const { date, desc, stage_id, comment, is_completed, is_paid, bank_name } =
      result.data;

    try {
      if (!userData || !data) {
        return;
      }

      const { error } = await supabase
        .from("payments")
        .update({
          date,
          stage_id,
          description: desc,
          comment,
          bank_name,
          is_completed,
          is_paid,
        })
        .eq("id", data.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      console.log(currencyInputs);

      const { error: amountError } = await supabase
        .from("payment_amounts")
        .update({
          code: currencyInputs[0].code,
          name: currencyInputs[0].name,
          amount: currencyInputs[0].amount,
          symbol: currencyInputs[0].symbol,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currencyInputs[0].id);

      if (amountError) {
        toast("Something went wrong", {
          description: amountError.message,
        });

        console.error(amountError.message);

        return;
      }

      toast("Success!", {
        description: "Stand alone payment was updated successfully",
      });

      setOpen(false);
    } catch (err: any) {
      toast("Something went wrong", {
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
        aria-describedby="payment edit dialog"
      >
        <DialogHeader>
          <DialogTitle>
            Edit {data ? `contract ${data.contract_code}` : ""}
          </DialogTitle>
        </DialogHeader>
        <form
          role="form"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              return;
            }
          }}
        >
          {/* DATE PICKER POPUP */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                type="button"
                className={cn(
                  "w-full pl-3 text-left font-normal mb-3",
                  !paymentDate && "text-darkText/50"
                )}
              >
                {paymentDate ? (
                  format(paymentDate, "PPP")
                ) : (
                  <span>Pick a payment date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={paymentDate ? new Date(paymentDate) : undefined}
                onDayClick={(date: Date) => {
                  setPaymentDate(date);
                }}
                disabled={(date: Date) => date < new Date("1960-01-01")}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          {/* DESCRIPTION INPUT */}
          <Input
            htmlFor="desc"
            label="Description *"
            className="my-3"
            type="text"
            id="desc"
            name="desc"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
          {/* ADD AND DELETE BANK NAMES */}
          <ArrayInput
            label="Bank name *"
            htmlFor="banks"
            setInputs={setBankInputs}
            inputs={bankInputs}
            disabledLogic={bankInputs.length >= 1}
          />
          {/* ADD STAGES */}
          <CustomInput
            htmlFor={"stages"}
            label={"Project stage *"}
            className="mb-3"
          >
            {stages ? (
              <SelectBar
                name="stage_id"
                value={form.stage_id}
                valueChange={(id) => setForm({ ...form, stage_id: id })}
                placeholder="Select a stage *"
                label="Stages"
                className="w-full sm:w-full"
              >
                {stages.map((item) => {
                  return (
                    <SelectItem key={item.name} value={item.id}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            ) : null}
          </CustomInput>
          <Separator />
          {/* HANDLE PAYMENT AMOUNT */}
          <ObjectArray
            handleAdd={handleAddCurrency}
            disabledLogic={
              !form.amounts.amount.length || !form.amounts.code.length
            }
          >
            <div className="mb-2 flex flex-col gap-1.5">
              {currencyInputs.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="flex justify-between items-center text-[13.5px] py-0.5 px-3 bg-darkText text-lightText rounded-full"
                  >
                    <p>{item.code}</p>
                    <div className="flex items-center gap-1">
                      <p className="capitalize">
                        {formatCurrency(+item.amount, item.code)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <CustomInput htmlFor={"currency"} label={"Currency *"}>
              <SelectBar
                valueChange={(name) =>
                  setForm({
                    ...form,
                    amounts: { ...form.amounts, code: name },
                  })
                }
                value={form.amounts.code}
                placeholder="Select a currency"
                label="Currency"
                className="w-full mt-1.5"
              >
                {currency_list.map((item) => {
                  return (
                    <SelectItem key={item.name} value={item.code}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </CustomInput>
            <CustomInput
              htmlFor="amount"
              label="Payment amount *"
              className="mt-3"
            >
              <input
                className="form"
                type="number"
                id="amount"
                name="amount"
                onChange={(e) =>
                  setForm({
                    ...form,
                    amounts: {
                      ...form.amounts,
                      amount: e.target.value,
                    },
                  })
                }
                value={form.amounts.amount}
              />
            </CustomInput>
          </ObjectArray>
          <Separator />
          {/* CHECK IF CONTRACT IS COMPLETE OR NOT */}
          <div className="flex items-center gap-2 mt-3">
            <Switch
              id="is_completed"
              name="is_completed"
              checked={form.is_completed}
              onCheckedChange={(bool) =>
                setForm({ ...form, is_completed: bool })
              }
            />
            <label htmlFor="is_completed">Is this payment complete? *</label>
          </div>
          {/* CHECK IF CONTRACT IS COMPLETE OR NOT */}
          {form.is_completed ? (
            <div className="flex items-center gap-2 mt-3">
              <Switch
                id="is_paid"
                name="is_paid"
                checked={form.is_paid}
                onCheckedChange={(bool) => setForm({ ...form, is_paid: bool })}
              />
              <label htmlFor="is_paid">Has this payment been paid? *</label>
            </div>
          ) : null}
          {/* OPTIONAL COMMENT INPUT */}
          <CustomInput
            htmlFor="comment"
            label="Optional comment"
            className="mt-3"
          >
            <textarea
              className="form"
              id="comment"
              name="comment"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            ></textarea>
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

const DeleteAction = ({
  open,
  setOpen,
  data,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Payment | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!data) {
        return;
      }

      const { error } = await supabase
        .from("payments")
        .delete()
        .eq("id", data.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      toast("Success!", {
        description: "Payment was deleted successfully",
      });
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected payment from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            {isLoading ? <Loading className="w-5 h-5" /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
