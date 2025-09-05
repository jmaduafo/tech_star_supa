import Header3 from "@/components/fontsize/Header3";
import AddButton from "@/components/ui/buttons/AddButton";
import Submit from "@/components/ui/buttons/Submit";
import ArrayInput from "@/components/ui/input/ArrayInput";
import ObjectArray from "@/components/ui/input/ObjectArray";
import SelectBar from "@/components/ui/input/SelectBar";
import Loading from "@/components/ui/loading/Loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { paymentColumns } from "@/components/ui/tables/columns";
import DataTable from "@/components/ui/tables/DataTable";
import { Amount, Payment, Stage, User } from "@/types/types";
import { formatCurrency } from "@/utils/currencies";
import { currency_list } from "@/utils/dataTools";
import { optionalS } from "@/utils/optionalS";
import { SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Input from "@/components/ui/input/Input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomInput from "@/components/ui/input/CustomInput";
import Separator from "@/components/ui/Separator";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import { PaymentSchema } from "@/zod/validation";

function NonContractDisplay({
  data,
  stages,
  user,
}: {
  readonly data: Payment[] | undefined;
  readonly stages: Stage[] | undefined;
  readonly user: User | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);

  const [currencyInputs, setCurrencyInputs] = useState<Amount[]>([]);
  const [bankInputs, setBankInputs] = useState<string[]>([]);

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

  const { project_id, contractor_id } = useParams();

  const supabase = createClient();
  const { userData } = useAuth();

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
        setCurrencyInputs([
          {
            code: form.amounts.code,
            name: currency_list[currencyIndex].name,
            symbol: currency_list[currencyIndex].symbol,
            amount: form.amounts.amount,
          },
        ]);

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

    const {
      date,
      desc,
      stage_id,
      comment,
      is_completed,
      is_paid,
      bank_name,
      currency,
    } = result.data;

    try {
      if (!user || !project_id || !contractor_id || !data) {
        return;
      }

      const { data: paymentData, error } = await supabase
        .from("payments")
        .insert({
          date,
          project_id,
          contractor_id,
          stage_id,
          team_id: user.team_id,
          contract_id: null,
          description: desc,
          comment,
          bank_name,
          is_completed,
          is_paid,
        })
        .select("id")
        .single();

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: amountError } = await supabase
        .from("payment_amounts")
        .insert({
          payment_id: paymentData.id,
          symbol: currency[0].symbol,
          name: currency[0].name,
          code: currency[0].code,
          amount: currency[0].amount,
        });

      if (amountError) {
        toast("Something went wrong", {
          description: amountError.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Created new stand alone payment ${
            data[0].contractors
              ? "for contractor " + data[0].contractors.name
              : ""
          } under project ${
            data[0].projects
              ? data[0].projects.name
              : ""
          }`,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "payment",
        });

      if (activityError) {
        toast("Something went wrong", {
          description: activityError.message,
        });

        return;
      }

      toast("Success!", {
        description: "Stand alone payment was added successfully",
      });

      setForm({
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

      setBankInputs([]);
      setCurrencyInputs([]);
      setPaymentDate(undefined);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="flex items-end justify-between">
        <div className="flex items-start gap-5">
          {data ? (
            <>
              <Header3 text="Non-Contracts" />
              <p className="text-[13.5px]">
                {data.length} result{optionalS(data.length)}
              </p>
            </>
          ) : null}
        </div>
        <div>
          <AddButton
            title="non-contract"
            desc="Create a stand-alone payment"
            setOpen={setOpen}
            open={open}
          >
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
                <label htmlFor="is_completed">
                  Is this payment complete? *
                </label>
              </div>
              {/* CHECK IF CONTRACT IS COMPLETE OR NOT */}
              {form.is_completed ? (
                <div className="flex items-center gap-2 mt-3">
                  <Switch
                    id="is_paid"
                    name="is_paid"
                    checked={form.is_paid}
                    onCheckedChange={(bool) =>
                      setForm({ ...form, is_paid: bool })
                    }
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
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                ></textarea>
              </CustomInput>
              {/* SUBMIT BUTTON */}
              <div className="flex justify-end mt-6">
                <Submit loading={isLoading} disabledLogic={isLoading} />
              </div>
            </form>
          </AddButton>
        </div>
      </div>
      <div className="mt-4">
        {/* DISPLAY OF DATA TABLE WITH RENDERED DATA FROM BACKEND */}
        {!data ? (
          <div className="py-8 flex justify-center">
            <Loading className="w-10 h-10" />
          </div>
        ) : (
          <DataTable
            columns={paymentColumns}
            data={data}
            is_payment
            // DISPLAYS EXPORT BUTTON IF TRUE
            is_export
            // DISPLAYS PAGINATION IF TRUE
            advanced
            team_name={user ? user?.first_name : "My"}
            filterCategory="description"
          />
        )}
      </div>
    </section>
  );
}

export default NonContractDisplay;
