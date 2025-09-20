import { useAuth } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Skeleton } from "../skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Button } from "../button";
import { toast } from "sonner";
import { Contractor, Stage } from "@/types/types";
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
import { formatCurrency } from "@/utils/currencies";
import { formatDate } from "date-fns";
import { Ellipsis } from "lucide-react";
import Banner from "../Banner";
import Submit from "../buttons/Submit";
import ViewLabel from "../labels/ViewLabel";
import Loading from "../loading/Loading";
import { format as formatAgo } from "timeago.js";
import Input from "../input/Input";
import CustomInput from "../input/CustomInput";
import SelectBar from "../input/SelectBar";
import { country_list } from "@/utils/dataTools";
import { SelectItem } from "../select";
import { Slider } from "../slider";
import { Switch } from "../switch";
import { ContractorSchema } from "@/zod/validation";

function ContractorAction({ data }: { readonly data: Contractor | undefined }) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { userData } = useAuth();
  const supabase = createClient();
  return (
    <>
      <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
        <DropdownMenuTrigger className="flex justify-end items-center">
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setViewOpen(true);
                setDropDownOpen(false);
              }}
            >
              View details
            </DropdownMenuItem>
            {userData?.role === "admin" &&
            userData?.team_id === data?.team_id ? (
              <DropdownMenuItem
                onClick={() => {
                  setEditOpen(true);
                  setDropDownOpen(false);
                }}
              >
                Edit
              </DropdownMenuItem>
            ) : null}
            {userData?.role === "admin" &&
            userData?.team_id === data?.team_id ? (
              <DropdownMenuSeparator />
            ) : null}
            {userData?.role === "admin" &&
            userData?.team_id === data?.team_id ? (
              <DropdownMenuItem
                onClick={() => {
                  setDeleteOpen(true);
                  setDropDownOpen(false);
                }}
                className="text-red-500"
              >
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

export default ContractorAction;

const ViewAction = ({
  open,
  setOpen,
  data,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Contractor | undefined;
}) => {
  const contractorCurrencies = () => {
    if (!data) {
      return;
    }

    const contracts = data.contracts;

    const amounts: string[] = [];

    contracts?.forEach((contract) => {
      contract.contract_amounts?.forEach((amount) => {
        amounts.push(amount.code);
      });
    });

    return [...new Set(amounts)];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="" aria-describedby="contract view details">
        <DialogHeader>
          <DialogTitle>
            Contractor - <span className="italic">{data?.name}</span>
          </DialogTitle>
        </DialogHeader>
        {data ? (
          <div className="grid grid-cols-2 gap-4">
            {/* PROJECT NAME */}
            <ViewLabel label={"Project"} content={data?.projects?.name} />
            {/* CONTRACTOR NAME */}
            <ViewLabel label={"Name"} content={data?.name} />
            {/* LOCATION (CITY, COUNTRY) */}
            <ViewLabel
              label={"Location"}
              content={
                data.city ? data.city + ", " + data.country : data.country
              }
            />
            {/* DATE STARTED (MONTH, YEAR) */}
            <ViewLabel
              label={"Date started"}
              content={data.start_month + " " + data.start_year}
            />
            {/* DESCRIPTION */}
            <ViewLabel label={"Description"} content={data.description} />
            {/* NUMBER OF CONTRACTS */}
            <ViewLabel
              label={"Contracts"}
              content={data.contracts ? `${data.contracts.length}` : "0"}
            />
            {/* NUMBER OF PAYMENTS */}
            <ViewLabel
              label={"Payments"}
              content={
                data.payments
                  ? `${data.payments.filter((item) => item.is_paid).length}`
                  : "0"
              }
            />
            {/* CURRENCIES CONTRACTOR IS PAID IN */}
            {contractorCurrencies() ? (
              <ViewLabel label="Currencies paid" custom>
                <div className="flex gap-1">
                  {contractorCurrencies()?.map((item, i) => {
                    return (
                      <p key={item} className="">
                        {item}
                        <span
                          className={`${
                            i + 1 !== contractorCurrencies()?.length
                              ? "inline-block"
                              : "hidden"
                          }`}
                        >
                          ,
                        </span>
                      </p>
                    );
                  })}
                </div>
              </ViewLabel>
            ) : null}
            {/* STAGES THAT THEY ARE WORKING IN */}

            {/* COMMENT */}
            <ViewLabel label={"Comment"} content={data?.comment ?? "N/A"} />
            {/* STATUS */}
            <ViewLabel label={"Status"} custom>
              {data.is_available ? (
                <Banner text="ongoing" />
              ) : (
                <Banner text="unavailable" />
              )}
            </ViewLabel>
            {/* CREATED AT */}
            <ViewLabel label={"Created"} content={formatAgo(data.created_at)} />
            {/* UPDATED AT */}
            {data?.updated_at ? (
              <ViewLabel
                label={"Updated"}
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
}: //   stages,
{
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Contractor | undefined;
  //   readonly stages: Stage[] | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    relevance: [2.5],
    description: "",
    comment: "",
    is_available: false,
  });

  const supabase = createClient();
  const { userData } = useAuth();

  // UPDATES EVERY TIME THE PAYMENT IS UPDATED SO THAT THE EDIT
  // INPUTS REFLECTS APPROPRIATELY AFTER THE DATA CHANGES
  useEffect(() => {
    setForm({
      name: data?.name ?? "",
      city: data?.city ?? "",
      country: data?.country ?? "",
      relevance: data?.relevance ? [data?.relevance] : [2.5],
      description: data?.description ?? "",
      comment: data?.comment ?? "",
      is_available: data?.is_available ?? false,
    });
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      name: form.name,
      city: form.city.length ? form.city : null,
      country: form.country,
      desc: form.description,
      relevance: form.relevance[0],
      comment: form.comment.length ? form.comment : null,
      is_available: form.is_available,
    };

    const result = ContractorSchema.safeParse(values);

    if (!result.success) {
      toast.error("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setIsLoading(false);

      return;
    }

    const { name, city, country, relevance, desc, comment, is_available } =
      result.data;

    try {
      if (!userData || !data) {
        return;
      }

      const { error } = await supabase
        .from("contractors")
        .update({
          name,
          city,
          country,
          relevance,
          description: desc,
          comment,
          is_available,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Updated contractor ${data.name}`,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "contractor",
        });

      if (activityError) {
        toast.error("Something went wrong", {
          description: activityError.message,
        });

        return;
      }

      toast.success("Success!", {
        description: "Contract was updated successfully",
      });

      setOpen(false);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit contractor {data ? data.name : ""}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            label="Contractor name *"
            htmlFor="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            name={"name"}
            id="name"
          />
          {/* CITY NAME */}
          <Input
            label="City"
            htmlFor="city"
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            name={"city"}
            id="city"
            className="mt-3"
          />
          {/* COUNTRY LOCATION */}
          <CustomInput label="Country *" htmlFor="year" className="mt-5">
            <SelectBar
              placeholder="Select country"
              value={form.country}
              label="Countries"
              className="mt-1"
              valueChange={(text) => {
                setForm({ ...form, country: text });
              }}
            >
              {country_list.map((item) => {
                return (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                );
              })}
            </SelectBar>
          </CustomInput>
          {/* CONTRACTOR DESCRIPTION */}
          <CustomInput label="Description *" htmlFor="desc" className="mt-3">
            <input
              className="form"
              type="text"
              id="desc"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              maxLength={60}
            />
          </CustomInput>
          <div className="flex justify-end mt-1">
            <p className="text-sm text-darkText/70">
              {form.description.length} / 60
            </p>
          </div>
          {/* RELEVANCE SLIDER SECTION */}
          <div className="mt-3">
            <label htmlFor="importance_level" className="">
              Level of relevance (not as crucial to extremely crucial) *
            </label>
            <p className="text-right text-dark75 text-[13px]">
              {form.relevance}
            </p>
            <Slider
              name="relevance"
              id="relevance"
              value={form.relevance}
              onValueChange={(val) => setForm({ ...form, relevance: val })}
              max={5}
              step={0.5}
              className="mt-2"
            />
          </div>
          {/* COMMENT INPUT */}
          <CustomInput
            label="Any additional information?"
            htmlFor="additional_info"
            className="mt-4 flex flex-col gap-3"
          >
            <textarea
              name="additional"
              id="additional_info"
              className="form"
              value={form.comment}
              onChange={(e) =>
                setForm({
                  ...form,
                  comment: e.target.value,
                })
              }
            ></textarea>
          </CustomInput>
          {/* IS CONTRACTOR AVAILABLE */}
          <div className="flex items-center gap-2 mt-3">
            <Switch
              id="is_available"
              name="is_available"
              checked={form.is_available}
              onCheckedChange={(val) => setForm({ ...form, is_available: val })}
            />
            <label htmlFor="status">Is contractor available?</label>
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

const DeleteAction = ({
  open,
  setOpen,
  data,
}: {
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly data: Contractor | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useAuth();

  const supabase = createClient();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!data) {
        return;
      }

      const { error } = await supabase
        .from("contractors")
        .delete()
        .eq("id", data.id);

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Contractor ${data.name} was deleted`,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "contractor",
        });

      if (activityError) {
        toast.error("Something went wrong", {
          description: activityError.message,
        });

        return;
      }

      toast.success("Success!", {
        description: "Contract was deleted successfully",
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected contractor from our servers.
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
