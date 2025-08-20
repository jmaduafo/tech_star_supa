"use client";

import Header4 from "@/components/fontsize/Header4";
import Banner from "@/components/ui/Banner";
import Submit from "@/components/ui/buttons/Submit";
import Card from "@/components/ui/cards/MyCard";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomInput from "@/components/ui/input/CustomInput";
import SelectBar from "@/components/ui/input/SelectBar";
import Loading from "@/components/ui/Loading";
import NotAvailable from "@/components/ui/NotAvailable";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Contractor,
  MultiSelect,
  Stage,
  StageContractor,
  User,
} from "@/types/types";
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
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { format as formatAgo } from "timeago.js";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/UserContext";
import { useParams } from "next/navigation";
import MultiSelectBar from "@/components/ui/input/MultiSelectBar";

function ContractorDisplay({
  allContractors,
}: {
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
                        {/* CONTRACTOR TITLE */}
                        <Link
                          href={`/projects/${item?.project_id}/contractors/${item?.id}/contracts`}
                        >
                          <Header4 text={item.name} className="capitalize" />
                        </Link>
                        {/* CONTRACTOR LOCATION */}
                        <p className="text-[14px] text-light50">
                          {item?.city ? (
                            <span className="italic capitalize">
                              {item.city},{" "}
                            </span>
                          ) : null}
                          <span className="italic">{item.country}</span>
                        </p>
                      </div>
                      {/* ELLIPSIS ICON DROPDOWN MENU */}
                      <DropDown contractor={item} />
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-2">
                      {/* CONTRACTOR ACTIVITY STATUS */}
                      <Banner
                        text={item.is_available ? "ongoing" : "unavailable"}
                      />
                      {/* CONTRACTOR INFO LAST UPDATED */}
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
  const [viewContractorOpen, setViewContractorOpen] = useState(false);
  const [viewStagesOpen, setViewStagesOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const [stagesList, setStagesList] = useState<MultiSelect[] | undefined>();
  const [stages, setStages] = useState<Stage[] | undefined>();

  const { userData } = useAuth();
  const { project_id } = useParams();
  const supabase = createClient();

  const getStages = async () => {
    try {
      if (!project_id || !contractor || !userData) {
        return;
      }

      const { data, error } = await supabase
        .from("stages")
        .select("id, name")
        .eq("team_id", userData?.team_id)
        .eq("project_id", project_id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const keyValue: MultiSelect[] = [];

      data.forEach((item) => {
        keyValue.push({ label: item.name, value: item.id });
      });

      setStagesList(keyValue);
      setStages(data as Stage[]);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getStages();
  }, [project_id]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <EllipsisVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {userData?.role === "admin" ? (
              <DropdownMenuItem
                onClick={() => {
                  setAssignOpen(true);
                }}
              >
                Assign stages
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              onClick={() => {
                setViewStagesOpen(true);
              }}
            >
              View stages
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Contractor</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setViewContractorOpen(true);
              }}
            >
              View
            </DropdownMenuItem>
            {userData?.role === "admin" ? (
              <>
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
              </>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* EDIT AND DELETE OPTIONS */}
      <Actions
        contractor={contractor}
        editOpen={editOpen}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        setEditOpen={setEditOpen}
      />
      <AssignStage
        stages={stages}
        contractor={contractor}
        user={userData}
        open={assignOpen}
        setOpen={setAssignOpen}
        list={stagesList}
      />
    </>
  );
}

function AssignStage({
  stages,
  contractor,
  user,
  open,
  setOpen,
  list,
}: {
  readonly stages: Stage[] | undefined;
  readonly list: MultiSelect[] | undefined;
  readonly contractor: Contractor | undefined;
  readonly user: User | undefined;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [data, setData] = useState<Stage[] | undefined>();
  const [stageList, setStageList] = useState<MultiSelect[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const getData = async () => {
    try {
      if (!contractor || !stages) {
        return;
      }

      const { data, error } = await supabase
        .from("stages")
        .select(
          `
            id,
            name,
            stage_contractors (
              contractor_id
            )
          `
        )
        .eq("stage_contractors.contractor_id", contractor.id);

      if (error) {
        console.log(error.message);
        return;
      }

      console.log(data);
      setData(data as Stage[]);

      // TURN DATA INTO AN ARRAY OF {label: string; value: string}[]
      // FOR MULTI SELECT BAR
      const list: MultiSelect[] = [];

      data.forEach((item) => {
        item.stage_contractors.length &&
          list.push({ label: item.name, value: item.id });
      });

      setStageList(list);
      console.log(list);

      setOpen(false);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    }
  };

  useEffect(() => {
    getData();
  }, [contractor, stages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // MAKE SURE THAT LIST IS NOT EMPTY
    if (!stageList.length) {
      toast("Something went wrong", {
        description: "You must add at least one stage",
      });

      setIsLoading(false);

      return;
    }

    try {
      if (!contractor || !data) {
        return;
      }

      // DELETE ALL PREVIOUS STAGES ASSIGNED TO CONTRACTOR TO ENSURE
      // NO DUPLICATES
      const { error: deleteError } = await supabase
        .from("stage_contractors")
        .delete()
        .eq("contractor_id", contractor.id);

      if (deleteError) {
        toast("Something went wrong", {
          description: deleteError.message,
        });

        return;
      }

      const array: StageContractor[] = [];

      // CHANGE LIST ARRAY BACK TO STAGE_CONTRACTORS TYPE
      stageList.forEach((item) => {
        array.push({ stage_id: item.value, contractor_id: contractor.id });
      });

      // INSERT NEW ARRAY TO STAGE CONTRACTORS TABLE
      const { error: insertError } = await supabase
        .from("stage_contractors")
        .insert(array);

      if (insertError) {
        toast("Something went wrong", {
          description: insertError.message,
        });

        return;
      }

      toast("Success!", {
        description: `Stage was successfully assigned to contractor ${contractor.name}`,
      });

      setOpen(false);

      // THIS METHOD IS ALSO A LESS HEADACHE INDUCING METHOD THAT TAKES CARE OF
      // UPDATING. MAYBE NOT THE MOST OPTIMAL METHOD BUT IT WORKS
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign stage</DialogTitle>
          <DialogDescription>
            Appoint{" "}
            <strong>
              {contractor
                ? contractor.name.charAt(0).toUpperCase() +
                  contractor.name.slice(1)
                : "contractor"}
            </strong>{" "}
            one or multiple stages
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* ADD AND DELETE BANK NAMES */}
          <MultiSelectBar
            array={list}
            selectedArray={stageList}
            setSelectedArray={setStageList}
            name="stages"
          />
          <div className="flex justify-end mt-6">
            <Submit loading={isLoading} disabledLogic={isLoading} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
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

  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const supabase = createClient();

  // EDIT CONTRACTOR FUNCTIONALITY
  const editProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);

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

      toast("Success!", {
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

  // DELETE CONTRACTOR FUNCTIONALITY
  const deleteContractor = async () => {
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

      toast("Success!", {
        description: "Contractor deleted successfully",
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
            <DialogTitle>Edit contractor</DialogTitle>
            <DialogDescription>
              Update the selected contractor here
            </DialogDescription>
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
                onCheckedChange={(val) =>
                  setForm({ ...form, is_available: val })
                }
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
            <AlertDialogAction onClick={deleteContractor}>
              {deleteLoading ? <Loading className="w-5 h-5" /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
