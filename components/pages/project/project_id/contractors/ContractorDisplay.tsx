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
  DialogFooter,
  DialogClose,
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
import Loading from "@/components/ui/loading/Loading";
import NotAvailable from "@/components/ui/NotAvailable";
import { Skeleton } from "@/components/ui/skeleton";
import { Contractor, MultiSelect, Stage, StageContractor } from "@/types/types";
import { country_list, months } from "@/utils/dataTools";
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
import { Ellipsis, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import Input from "@/components/ui/input/Input";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { format as formatAgo } from "timeago.js";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/UserContext";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import ViewLabel from "@/components/ui/labels/ViewLabel";
import { contractorStages } from "@/utils/stagesFilter";
import MultiComboBox from "@/components/ui/input/MultiComboBox";
import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ContractorDisplay({
  allContractors,
  loading,
  view,
}: {
  readonly allContractors: Contractor[] | undefined;
  readonly loading?: boolean;
  readonly view: string;
}) {
  const notAvailable =
    allContractors && allContractors.length === 0 ? (
      <NotAvailable text="No contractors listed" />
    ) : null;

  return (
    <section className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
        {!allContractors || loading
          ? Array.from({ length: 6 }).map((_, i) => {
              return (
                <Fragment key={`skeleton_${i + 1}`}>
                  <CardSkeleton className="h-[27vh]">
                    <div></div>
                  </CardSkeleton>
                </Fragment>
              );
            })
          : null}
      </div>
      {allContractors?.length ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
              {allContractors?.map((item) => {
                return (
                  <Fragment key={item.id}>
                    <Card className="h-[27vh] hover:opacity-80 duration-300 hover:shadow-md">
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start gap-5">
                          <div>
                            {/* CONTRACTOR TITLE */}
                            <Link
                              href={`/projects/${item?.project_id}/contractors/${item?.id}/contracts`}
                            >
                              <Header4
                                text={item.name}
                                className="capitalize"
                              />
                            </Link>
                            {/* CONTRACTOR LOCATION */}
                            <p className="text-[14px] text-darkText/50">
                              {item?.city ? (
                                <span className="italic capitalize">
                                  {item.city},{" "}
                                </span>
                              ) : null}
                              <span className="italic">{item.country}</span>
                            </p>
                          </div>
                          {/* ELLIPSIS ICON DROPDOWN MENU */}
                          <DropDown contractor={item} view={view} />
                        </div>
                        <div className="mt-auto flex items-end justify-between gap-2">
                          {/* CONTRACTOR ACTIVITY STATUS */}
                          <Banner
                            text={item.is_available ? "ongoing" : "unavailable"}
                          />
                          {/* CONTRACTOR INFO LAST UPDATED */}
                          {item.updated_at ? (
                            <p className="text-sm font-light">
                              Modified:{" "}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Project Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-[100px]">Start Year</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allContractors.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      {/* <Link href={`/projects/${item?.id}/contractors`}> */}
                      <TableCell className="">{item.name}</TableCell>
                      <TableCell>
                        <Banner
                          text={item.is_available ? "ongoing" : "unavailable"}
                        />
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        {item.city ? item.city + ", " : ""}
                        {item.country}
                      </TableCell>
                      <TableCell>
                        {item.start_month} {item.start_year}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropDown contractor={item} view={view} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </>
      ) : (
        notAvailable
      )}
    </section>
  );
}

export default ContractorDisplay;

function DropDown({
  contractor,
  view,
}: {
  readonly contractor: Contractor | undefined;
  readonly view: string;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewContractorOpen, setViewContractorOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [stagesList, setStagesList] = useState<MultiSelect[] | undefined>();

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
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getStages();
  }, [project_id]);

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button>
            {view === "grid" ? (
              <EllipsisVertical className="w-5 h-5" />
            ) : (
              <Ellipsis className="w-5 h-5" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {userData?.role === "admin" ? (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setAssignOpen(true);
                    setDropdownOpen(false);
                  }}
                >
                  Assign stages
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Contractor</DropdownMenuLabel>
            </>
          ) : null}
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setViewContractorOpen(true);
                setDropdownOpen(false);
              }}
            >
              View info
            </DropdownMenuItem>
            <DropdownMenuGroup>
              <Link
                href={`/projects/${contractor?.project_id}/contractors/${contractor?.id}`}
              >
                <DropdownMenuItem>View contracts</DropdownMenuItem>
              </Link>
              {userData?.role === "admin" ? (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      setEditOpen(true);
                      setDropdownOpen(false);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setDeleteOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="text-red-400"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* ASSIGN STAGES DROPDOWN OPTION */}
      <AssignStage
        contractor={contractor}
        open={assignOpen}
        setOpen={setAssignOpen}
        list={stagesList}
        listOpen={listOpen}
        setListOpen={setListOpen}
      />
      {/* VIEW CONTRACTORS DROPDOWN OPTION */}
      <ViewContractor
        contractor={contractor}
        open={viewContractorOpen}
        setOpen={setViewContractorOpen}
      />
      {/* EDIT AND DELETE OPTIONS */}
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

function AssignStage({
  contractor,
  open,
  setOpen,
  list,
  listOpen,
  setListOpen,
}: {
  readonly list: MultiSelect[] | undefined;
  readonly contractor: Contractor | undefined;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly listOpen: boolean;
  readonly setListOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [stageList, setStageList] = useState<MultiSelect[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const { userData } = useAuth();

  const getData = async () => {
    try {
      if (!contractor) {
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

      // TURN DATA INTO AN ARRAY OF {label: string; value: string}[]
      // FOR MULTI SELECT BAR
      const list: MultiSelect[] = [];

      data.forEach((item) => {
        item.stage_contractors.length &&
          list.push({ label: item.name, value: item.id });
      });

      setStageList(list);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
    }
  };

  useEffect(() => {
    getData();
  }, [contractor]);

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
      if (!contractor) {
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

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Updated stages for contractor ${contractor.name}`,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "stage",
        });

      if (activityError) {
        toast("Something went wrong", {
          description: activityError.message,
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
      <DialogContent className="sm:max-w-[425px]" id="radix-dialog-content">
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
          {/* ADD AND DELETE MULTIPLE ITEMS */}
          <MultiComboBox
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

const ViewContractor = ({
  contractor,
  open,
  setOpen,
}: {
  readonly contractor: Contractor | undefined;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [stagesData, setStagesData] = useState<Stage[] | undefined>();

  const supabase = createClient();

  const getStages = async () => {
    try {
      if (!contractor) {
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

      setStagesData(contractorStages(data));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getStages();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="contractor view dialog"
      >
        <DialogHeader>
          <DialogTitle>
            Contractor -{" "}
            {contractor ? (
              <span className="italic">{contractor?.name}</span>
            ) : (
              <Skeleton className="w-12 h-6" />
            )}
          </DialogTitle>
        </DialogHeader>
        {contractor ? (
          <div className="grid grid-cols-2 gap-4">
            <ViewLabel label="Name" content={contractor.name} />
            <ViewLabel label="Project" content={contractor.projects.name} />
            <ViewLabel
              label="Location"
              content={
                contractor.city
                  ? `${contractor.city}, ${contractor.country}`
                  : contractor.country
              }
            />
            <ViewLabel label="Description" content={contractor.description} />
            <ViewLabel
              label="Date started"
              content={contractor.start_month + " " + contractor.start_year}
            />
            <ViewLabel label="Stages" custom>
              {stagesData ? (
                <p>
                  {stagesData.map((item, i) => {
                    return (
                      <Fragment key={item.id}>
                        <span className="">{item.name}</span>
                        {i !== stagesData.length - 1 ? (
                          <span className="">, </span>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </p>
              ) : null}
            </ViewLabel>
            <ViewLabel label="status" custom>
              {contractor.is_available ? (
                <Banner text="ongoing" />
              ) : (
                <Banner text="unavailable" />
              )}
            </ViewLabel>
            <ViewLabel
              label="Created at"
              content={formatAgo(contractor.created_at)}
            />
            {contractor.updated_at ? (
              <ViewLabel
                label="Updated at"
                content={formatAgo(contractor.updated_at)}
              />
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[80%]" />
            <Skeleton className="h-5 w-[65%]" />
            <Skeleton className="h-5 w-[55%]" />
            <Skeleton className="h-5 w-[30%]" />
            <Skeleton className="h-5 w-[20%]" />
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
    start_year: contractor?.start_year ? contractor.start_year?.toString() : "",
    start_month: contractor?.start_month ?? "",
    description: contractor?.description ?? "",
    comment: contractor?.comment ?? "",
    is_available: contractor?.is_available ?? false,
  });

  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const supabase = createClient();
  const { userData } = useAuth();

  // EDIT CONTRACTOR FUNCTIONALITY
  const editContractor = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);

    const values = {
      name: form.name,
      city: form.city.length ? form.city : null,
      country: form.country,
      desc: form.description,
      start_year: +form.start_year,
      start_month: form.start_month,
      relevance: form.relevance[0],
      comment: form.comment.length ? form.comment : null,
      is_available: form.is_available,
    };

    const result = ContractorSchema.safeParse(values);

    if (!result.success) {
      toast.error("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setEditLoading(false);

      return;
    }

    const {
      name,
      city,
      country,
      relevance,
      start_year,
      start_month,
      desc,
      comment,
      is_available,
    } = result.data;

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
          start_month,
          start_year,
          description: desc,
          comment,
          is_available,
          updated_at: new Date().toISOString(),
        })
        .eq("id", contractor.id);

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Updated contractor ${contractor.name}`,
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
        description: "Contractor updated successfully",
      });

      setEditOpen(false);
    } catch (err: any) {
      toast.error("Something went wrong", {
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
        .from("contractors")
        .delete()
        .eq("id", contractor.id);

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Deleted contractor ${contractor.name}`,
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
        description: "Contractor deleted successfully",
      });

      setDeleteOpen(false);
    } catch (err: any) {
      toast.error("Something went wrong", {
        description: err.message,
      });

      return;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* EDIT DIALOG POPUP */}
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
          <form onSubmit={editContractor}>
            {/* CONTRACTOR NAME */}
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
            {/* START MONTH */}
            <CustomInput
              htmlFor={"month"}
              label={"Start Month *"}
              className="mt-3"
            >
              <SelectBar
                placeholder="Select contractor start month"
                value={form.start_month}
                valueChange={(val) => setForm({ ...form, start_month: val })}
                label="Months"
                className="w-full mt-1"
                name="month"
              >
                {months.map((item) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </CustomInput>
            {/* START YEAR */}
            <Input
              label="Start year *"
              htmlFor="start_year"
              name="start_year"
              type="text"
              id="start_year"
              value={form.start_year}
              onChange={(e) => setForm({ ...form, start_year: e.target.value })}
              className="mt-3"
            />
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

      {/* DELETE DIALOG POP UP */}
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
