"use client";
import Header3 from "@/components/fontsize/Header3";
import AddButton from "@/components/ui/buttons/AddButton";
import Submit from "@/components/ui/buttons/Submit";
import ArrayInput from "@/components/ui/input/ArrayInput";
import ObjectArray from "@/components/ui/input/ObjectArray";
import SelectBar from "@/components/ui/input/SelectBar";
import Loading from "@/components/ui/loading/Loading";
import { contractColumns } from "@/components/ui/tables/columns";
import DataTable from "@/components/ui/tables/DataTable";
import { Amount, Contract, Stage, User } from "@/types/types";
import { formatCurrency } from "@/utils/currencies";
import { currency_list } from "@/utils/dataTools";
import { optionalS } from "@/utils/optionalS";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import Input from "@/components/ui/input/Input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/Separator";
import { cn } from "@/lib/utils";
import CustomInput from "@/components/ui/input/CustomInput";
import { Calendar } from "@/components/ui/calendar";
import { ContractSchema } from "@/zod/validation";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";

function ContractDisplay({
  data,
  stages,
  user,
}: {
  readonly data: Contract[] | undefined;
  readonly stages: Stage[] | undefined;
  readonly user: User | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [contractDate, setContractDate] = useState<Date | undefined>(undefined);
  const [currencyInputs, setCurrencyInputs] = useState<Amount[]>([]);
  const [bankInputs, setBankInputs] = useState<string[]>([]);

  const [form, setForm] = useState({
    contract_code: "",
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
    is_unlimited: false,
  });

  const { project_id, contractor_id } = useParams();
  const { userData } = useAuth();

  const supabase = createClient();

  function handleAddCurrency() {
    // CHECKS IF CODE IS ENTERED, IF THE TOTAL AMOUNT IS MORE THAN
    // 0, AND IF THE AMOUNT IS AT MOST 15 DIGITS
    if (
      (form.amounts.code.length && +form.amounts.amount > 0) ||
      form.is_unlimited ||
      form.amounts.amount.length < 16
    ) {
      const checkDuplicate = currencyInputs.find(
        (item) => item.code === form.amounts.code
      );

      // IF CHECK DUPLICATE IS NOT UNDEFINED, MEANING THAT THE
      // CURRENCY CODE ALREADY EXISTS,
      // THEN CLEAR THE INPUT FIELDS AND DO NOTHING
      if (checkDuplicate) {
        setForm({
          ...form,
          is_unlimited: false,
          amounts: {
            ...form.amounts,
            amount: "",
            code: "",
          },
        });
        return;
      }

      // FIND WHERE THE SELECTED CODE IS IN THE CURRENCY LIST
      const currencyIndex = currency_list.findIndex(
        (curr) => curr.code === form.amounts.code
      );

      if (currencyIndex > -1) {
        setCurrencyInputs([
          ...currencyInputs,
          {
            code: form.amounts.code,
            name: currency_list[currencyIndex].name,
            symbol: currency_list[currencyIndex].symbol,
            amount: form.is_unlimited ? "Unlimited" : form.amounts.amount,
          },
        ]);

        // SET AMOUNT AND CODE TO AN EMPTY STRING
        setForm({
          ...form,
          is_unlimited: false,
          amounts: { ...form.amounts, amount: "", code: "" },
        });
      }
    }
  }

  function deleteInput(item: Amount) {
    setCurrencyInputs((prev) => prev.filter((inp) => inp.code !== item.code));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      date: contractDate,
      stage_id: form.stage_id,
      code: form.contract_code.trim(),
      bank_names: bankInputs,
      currency: currencyInputs,
      is_completed: form.is_completed,
      desc: form.desc.trim(),
      comment: form.comment.length ? form.comment.trim() : null,
    };

    const result = ContractSchema.safeParse(values);

    if (!result.success) {
      toast("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setIsLoading(false);

      return;
    }

    const {
      date,
      desc,
      stage_id,
      code,
      comment,
      is_completed,
      bank_names,
      currency,
    } = result.data;

    try {
      if (!userData || !project_id || !contractor_id) {
        return;
      }

      const { data, error } = await supabase
        .from("contracts")
        .insert({
          date,
          project_id,
          contractor_id,
          stage_id,
          team_id: userData.team_id,
          contract_code: code,
          description: desc,
          comment,
          bank_names,
          is_completed,
        })
        .select("id")
        .single();

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const amountsArray: Amount[] = [];

      currency.forEach((item) => {
        amountsArray.push({
          ...item,
          contract_id: data.id,
        });
      });

      const { error: amountError } = await supabase
        .from("contract_amounts")
        .insert(amountsArray);

      if (amountError) {
        toast("Something went wrong", {
          description: amountError.message,
        });

        return;
      }

      toast("Success!", {
        description: "Contract was added successfully",
      });

      setForm({
        contract_code: "",
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
        is_unlimited: false,
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
    <section>
      <div className="flex items-end justify-between">
        <div className="flex items-start gap-5">
          {data ? (
            <>
              <Header3 text="Contracts" />
              <p className="text-[13.5px]">
                {data.length} result{optionalS(data.length)}
              </p>
            </>
          ) : null}
        </div>
        <AddButton
          title="contract"
          desc="Create a contract in order to add payments"
          setOpen={setOpen}
          open={open}
        >
          <form
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
                    !contractDate && "text-darkText/50"
                  )}
                >
                  {contractDate ? (
                    format(contractDate, "PPP")
                  ) : (
                    <span>Pick a contract date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={contractDate ? new Date(contractDate) : undefined}
                  onDayClick={(date: Date) => {
                    setContractDate(date);
                  }}
                  disabled={(date: Date) => date < new Date("1960-01-01")}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
            {/* CONTRACT CODE INPUT */}
            <Input
              htmlFor="code"
              label="Contract code *"
              type="text"
              id="code"
              name="code"
              value={form.contract_code}
              onChange={(e) =>
                setForm({ ...form, contract_code: e.target.value })
              }
            />
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
              label="Bank names *"
              htmlFor="banks"
              setInputs={setBankInputs}
              inputs={bankInputs}
              disabledLogic={bankInputs.length >= 4}
            >
              {bankInputs.length >= 4 ? (
                <p className="text-[14px] text-red-700">
                  You have reached the max
                </p>
              ) : null}
            </ArrayInput>
            <CustomInput htmlFor={"stage"} label={"Project stage *"}>
              <SelectBar
                name="stage_id"
                value={form.stage_id}
                valueChange={(id) => setForm({ ...form, stage_id: id })}
                placeholder="Select the project stage *"
                label="Stages"
                className="w-full sm:w-full mb-3"
              >
                {stages
                  ? stages.map((item) => {
                      return (
                        <SelectItem key={item.name} value={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })
                  : null}
              </SelectBar>
            </CustomInput>
            <Separator />
            {/* HANDLE OF CURRENCY AMOUNT AND CODE  */}
            <ObjectArray
              handleAdd={handleAddCurrency}
              disabledLogic={
                !form.amounts.code.length ||
                currencyInputs.length >= 4 ||
                (!form.amounts.amount.length && !form.is_unlimited)
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
                          {item.amount !== "Unlimited"
                            ? formatCurrency(+item.amount, item.code)
                            : `${item.symbol} Unlimited`}
                        </p>
                        <button
                          className="hover:bg-lightText hover:text-darkText rounded-full duration-300"
                          type="button"
                          onClick={() => deleteInput(item)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {currencyInputs.length >= 4 ? (
                <p className="text-[14px] text-red-700">
                  You have reached the max
                </p>
              ) : null}
              <CustomInput
                htmlFor={"currency"}
                label={"Currency *"}
                className="mt-2"
              >
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
                  className="w-full"
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
                  disabled={form.is_unlimited}
                />
              </CustomInput>
              <div className="flex items-center gap-2 mt-3">
                <Switch
                  id="is_unlimited"
                  name="is_unlimited"
                  checked={form.is_unlimited}
                  onCheckedChange={(bool) =>
                    setForm({ ...form, is_unlimited: bool })
                  }
                />
                <label htmlFor="is_unlimited">Unlimited amount?</label>
              </div>
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
              <label htmlFor="is_completed">Is the contract complete? *</label>
            </div>
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
        </AddButton>
      </div>
      <div className="mt-4">
        {/* DISPLAY OF DATA TABLE WITH RENDERED DATA FROM BACKEND */}
        {!data ? (
          <div className="py-8 flex justify-center">
            <Loading className="w-10 h-10" />
          </div>
        ) : (
          <DataTable
            columns={contractColumns}
            data={data}
            is_payment={false}
            // DISPLAYS EXPORT BUTTON IF TRUE
            is_export
            advanced
            team_name={user ? user?.first_name : "My"}
          />
        )}
      </div>
    </section>
  );
}

export default ContractDisplay;
