import Header4 from "@/components/fontsize/Header4";
import Banner from "@/components/ui/Banner";
import Submit from "@/components/ui/buttons/Submit";
import Card from "@/components/ui/cards/MyCard";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomInput from "@/components/ui/input/CustomInput";
import SelectBar from "@/components/ui/input/SelectBar";
import Loading from "@/components/ui/Loading";
import NotAvailable from "@/components/ui/NotAvailable";
import { Skeleton } from "@/components/ui/skeleton";
import { Contractor, User } from "@/types/types";
import { country_list } from "@/utils/dataTools";
import { ContractorSchema } from "@/zod/validation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import Input from "@/components/ui/input/Input";
import React, { Fragment, useState } from "react";
import { toast } from "sonner";
import { format as formatAgo } from "timeago.js";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/UserContext";

function ContractorDisplay({
  user,
  allContractors
}: {
  readonly user: User | undefined;
  readonly allContractors: Contractor[] | undefined;
}) {
  const notAvailable =
    allContractors && allContractors.length === 0 ? (
      <NotAvailable text="No contractors created yet" />
    ) : null;

  return (
    <section className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
        {!allContractors
          ? [0, 1, 2, 3, 4, 5].map((each, i) => {
              return (
                <Fragment key={`${each}_${i}`}>
                  <Skeleton className="h-[25vh] rounded-[3vw] bg-lightText/25 backdrop-blur-2xl" />
                </Fragment>
              );
            })
          : null}
      </div>
      {allContractors?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {allContractors?.map((item) => {
            return (
              <Fragment key={item.id}>
                <Card className="h-[25vh] text-lightText hover:opacity-80 duration-300 hover:shadow-md">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start gap-5">
                      <div>
                        <Link
                          href={`/projects/${item?.project_id}/contractors/${item?.id}`}
                        >
                          <Header4 text={item.name} className="capitalize" />
                        </Link>
                        <p className="text-[14px] text-light50">
                          {item?.city ? (
                            <span className="italic capitalize">
                              {item.city},{" "}
                            </span>
                          ) : null}
                          <span className="italic">{item.country}</span>
                        </p>
                      </div>
                      <DropDown contractor={item} />
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-2">
                      <Banner
                        text={item.is_available ? "ongoing" : "discontinued"}
                      />
                      {item.updated_at ? (
                        <p className="text-sm font-light">
                          Last modified:{" "}
                          <span className="italic">
                            {formatAgo(item.updated_at)}
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </Fragment>
            );
          })}
        </div>
      ) : (
        notAvailable
      )}
    </section>
  );
}

export default ContractorDisplay;

function DropDown({
  contractor,
}: {
  readonly contractor: Contractor | undefined;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { userData } = useAuth();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <EllipsisVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {userData?.role === "admin" ? (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setEditOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <Actions
        contractor={contractor}
        editOpen={editOpen}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        setEditOpen={setEditOpen}
      />
    </>
  );
}

function Actions({
  contractor,
  setEditOpen,
  setDeleteOpen,
  editOpen,
  deleteOpen,
}: {
  readonly contractor: Contractor | undefined;
  readonly editOpen: boolean;
  readonly deleteOpen: boolean;
  readonly setDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [form, setForm] = useState({
    name: contractor?.name,
    city: contractor?.city ?? "",
    country: contractor?.country,
    relevance: contractor?.relevance ? [contractor?.relevance] : [2.5],
    description: contractor?.description ?? "",
    comment: contractor?.comment ?? "",
    is_available: contractor?.is_available ?? false,
  });

  // FOR DELETE PROJECT FUNCTIONALITY
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const supabase = createClient();

  const editProject = async (e: React.FormEvent) => {
    e.preventDefault();

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
      toast("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setEditLoading(false);

      return;
    }

    const { name, city, country, relevance, desc, comment, is_available } =
      result.data;

    try {
      if (!contractor) {
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
        .eq("id", contractor.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      toast("Success", {
        description: "Contractor updated successfully",
      });

      setEditOpen(false);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });

      return;
    } finally {
      setEditLoading(false);
    }
  };

  const deleteProject = async () => {
    setDeleteLoading(true);

    try {
      if (!contractor) {
        return;
      }

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", contractor.id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      toast("Success", {
        description: "Project deleted successfully",
      });

      setDeleteOpen(false);
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
    <>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          aria-describedby="edit project popup"
          className="sm:max-w-sm"
        >
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
          </DialogHeader>
          <form onSubmit={editProject}>
            {/* PROJECT NAME */}
            <Input
              label="Project name *"
              htmlFor="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              name={"name"}
              id="name"
            />
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
            <div className="flex justify-end mt-1">
              <p className="text-sm text-darkText/70">
                {form.description.length} / 60
              </p>
            </div>
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
            <div className="flex items-center gap-2 mt-3">
              <Switch
                id="is_available"
                name="is_available"
                checked={form.is_available}
              />
              <label htmlFor="status">Is contractor available?</label>
            </div>
            {/* SUBMIT BUTTON */}
            <div className="flex justify-end mt-6">
              <Submit loading={editLoading} disabledLogic={editLoading} />
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
            <AlertDialogAction onClick={deleteProject}>
              {deleteLoading ? <Loading className="w-5 h-5" /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
