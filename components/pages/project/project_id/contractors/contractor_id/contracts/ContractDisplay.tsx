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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Input from "@/components/ui/input/Input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/Separator";
import { cn } from "@/lib/utils";
import CustomInput from "@/components/ui/input/CustomInput";
import { Calendar } from "@/components/ui/calendar";

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

  const [date, setDate] = useState<Date | undefined>(undefined);
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

  function handleAddCurrency() {
    //
    if (
      (form.amounts.code.length && +form.amounts.amount > 0) ||
      (form.is_unlimited && form.amounts.amount.length < 16)
    ) {
      // FIND WHERE THE SELECTED CODE IS IN THE CURRENCY LIST
      const currencyIndex = currency_list.findIndex(
        (curr) => curr.code === form.amounts.code
      );

      setCurrencyInputs([
        {
          code: form.amounts.code,
          name: currency_list[currencyIndex].name,
          symbol: currency_list[currencyIndex].symbol,
          amount: form.is_unlimited ? "Unlimited" : form.amounts.amount,
        },
      ]);

      setForm({ ...form, is_unlimited: false });
      setForm({ ...form, amounts: { ...form.amounts, amount: "" } });
    }
  }

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
          <form>
            {/* CONTRACT CODE INPUT */}
            {/* DATE PICKER POPUP */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  type="button"
                  className={cn(
                    "w-full pl-3 text-left font-normal mb-3",
                    !date && "text-darkText/50"
                  )}
                >
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Pick a contract date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onDayClick={(date: Date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                  disabled={(date: Date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
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
              disabledLogic={bankInputs.length === 4}
            >
              {bankInputs.length === 4 ? (
                <p className="text-[14px] text-red-700">
                  You have reached the max
                </p>
              ) : null}
            </ArrayInput>
            <CustomInput htmlFor={"stage"} label={"Project stage *"}>
              <SelectBar
                name="stage_id"
                value={form.stage_id}
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
            <ObjectArray handleAdd={handleAddCurrency}>
              <div className="mb-2">
                {currencyInputs.map((item) => {
                  return (
                    <div
                      key={item.name}
                      className="flex justify-between items-center text-[14px] mb-1"
                    >
                      <p>{item.code}</p>
                      <div className="flex items-center gap-1">
                        <p className="capitalize">
                          {item.amount !== "Unlimited"
                            ? formatCurrency(+item.amount, item.code)
                            : `${item.symbol} Unlimited`}
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
              <Input
                htmlFor="amount"
                label="Payment amount *"
                className="mt-3"
                type="number"
                id="amount"
                name="amount"
                onChange={(e) =>
                  setForm({
                    ...form,
                    amounts: { ...form.amounts, amount: e.target.value },
                  })
                }
                value={form.amounts.code}
              />
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
