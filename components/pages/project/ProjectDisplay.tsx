"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Project, User } from "@/types/types";
import Card from "@/components/ui/cards/MyCard";
import { Ellipsis, EllipsisVertical } from "lucide-react";
import Banner from "@/components/ui/Banner";
import Header4 from "@/components/fontsize/Header4";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import CustomInput from "@/components/ui/input/CustomInput";
import SelectBar from "@/components/ui/input/SelectBar";
import { country_list, months } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "sonner";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format as formatAgo } from "timeago.js";
import Loading from "@/components/ui/loading/Loading";
import NotAvailable from "@/components/ui/NotAvailable";
import { createClient } from "@/lib/supabase/client";
import { EditProjectSchema } from "@/zod/validation";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/UserContext";
import AddStage from "./AddStage";
import ViewStages from "./ViewStages";
import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ProjectDisplay({
  user,
  allProjects,
  setAllProjects,
  view,
}: {
  readonly user: User | undefined;
  readonly allProjects: Project[] | undefined;
  readonly view: string;
  readonly setAllProjects: React.Dispatch<
    React.SetStateAction<Project[] | undefined>
  >;
}) {
  const notAvailable =
    allProjects && allProjects.length === 0 ? (
      <NotAvailable text="No projects created yet" />
    ) : null;

  const gridView = "";
  const cardView = "";

  return (
    <section className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
        {!allProjects
          ? [0, 1, 2, 3, 4, 5].map((each, i) => {
              return (
                <Fragment key={`${each}_${i}`}>
                  <CardSkeleton className="h-[27vh]">
                    <div></div>
                  </CardSkeleton>
                </Fragment>
              );
            })
          : null}
      </div>
      {allProjects?.length ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
              {allProjects.map((item) => {
                return (
                  <Fragment key={item.id}>
                    <Card className="h-[27vh] z-0 hover:opacity-90 duration-300 hover:shadow-md">
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/projects/${item?.id}/contractors`}>
                              <Header4
                                text={item.name}
                                className="capitalize"
                              />
                            </Link>
                            <p className="text-[14px] text-darkText/50">
                              Since {item?.start_month?.substring(0, 3)}.{" "}
                              {item.start_year} -{" "}
                              {item?.city ? (
                                <span className="italic capitalize">
                                  {item.city},{" "}
                                </span>
                              ) : null}
                              <span className="italic">{item.country}</span>
                            </p>
                          </div>
                          <DropDown
                            project={item}
                            setAllProjects={setAllProjects}
                            allProjects={allProjects}
                            view={view}
                          />
                        </div>
                        <div className="mt-auto flex items-end justify-between gap-2">
                          <Banner
                            text={item.is_completed ? "completed" : "ongoing"}
                          />
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
                {allProjects.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      {/* <Link href={`/projects/${item?.id}/contractors`}> */}
                      <TableCell className="">{item.name}</TableCell>
                      <TableCell>
                        <Banner
                          text={item.is_completed ? "completed" : "ongoing"}
                        />
                      </TableCell>
                      <TableCell>
                        {item.description.length > 50
                          ? item.description.slice(0, 50) + "..."
                          : item.description}
                      </TableCell>
                      <TableCell>
                        {item.city ? item.city + ", " : ""}
                        {item.country}
                      </TableCell>
                      <TableCell>
                        {item.start_month} {item.start_year}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropDown
                          project={item}
                          setAllProjects={setAllProjects}
                          allProjects={allProjects}
                          view={view}
                        />
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

export default ProjectDisplay;

function DropDown({
  project,
  allProjects,
  setAllProjects,
  view,
}: {
  readonly project: Project | undefined;
  readonly setAllProjects: React.Dispatch<
    React.SetStateAction<Project[] | undefined>
  >;
  readonly allProjects: Project[] | undefined;
  readonly view: string;
}) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addStageOpen, setAddStageOpen] = useState(false);
  const [viewStageOpen, setViewStageOpen] = useState(false);

  const { userData } = useAuth();

  return (
    <>
      <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
        <DropdownMenuTrigger asChild>
          <button>
            {view === "grid" ? (
              <EllipsisVertical className="w-5 h-5" />
            ) : (
              <Ellipsis className="w-5 h-5" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={"center"}>
          <DropdownMenuLabel>Stages</DropdownMenuLabel>
          <DropdownMenuGroup>
            {userData?.role === "admin" ? (
              <DropdownMenuItem
                onClick={() => {
                  setAddStageOpen(true);
                  setDropDownOpen(false);
                }}
              >
                Add stage
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              onClick={() => {
                setViewStageOpen(true);
                setDropDownOpen(false);
              }}
            >
              View stages
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={`/projects/${project?.id}/contractors`}>
              <DropdownMenuItem>View contractors</DropdownMenuItem>
            </Link>
            {userData?.role === "admin" ? (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    setEditOpen(true);
                    setDropDownOpen(false);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setDeleteOpen(true);
                    setDropDownOpen(false);
                  }}
                  className="text-red-400"
                >
                  Delete
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddStage
        project={project}
        open={addStageOpen}
        setOpen={setAddStageOpen}
      />
      <ViewStages
        project={project}
        open={viewStageOpen}
        setOpen={setViewStageOpen}
      />
      <EditProject
        project={project}
        allProjects={allProjects}
        setAllProjects={setAllProjects}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <DeleteProject
        project={project}
        allProjects={allProjects}
        setAllProjects={setAllProjects}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </>
  );
}

// DELETE PROJECT ALERT FUNCTIONALITY
const DeleteProject = ({
  project,
  allProjects,
  setAllProjects,
  open,
  setOpen,
}: {
  readonly project: Project | undefined;
  readonly allProjects: Project[] | undefined;
  readonly setAllProjects: React.Dispatch<
    React.SetStateAction<Project[] | undefined>
  >;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { userData } = useAuth();

  const supabase = createClient();

  const deleteProject = async () => {
    setDeleteLoading(true);

    try {
      if (!project) {
        return;
      }

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Deleted project ${project.name} `,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "project",
        });

      if (activityError) {
        toast.error("Something went wrong", {
          description: activityError.message,
        });

        return;
      }

      toast.success("Success!", {
        description: "Project deleted successfully",
      });

      handleDelete(project.id);

      setOpen(false);
    } catch (err: any) {
      toast.error("Something went wrong", {
        description: err.message,
      });

      return;
    } finally {
      setDeleteLoading(false);
    }
  };

  function handleDelete(id: string) {
    setAllProjects((prev) => {
      if (!prev) return prev;
      return prev.filter((item) => item.id !== id);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            selected project from our servers.
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
  );
};

// EDIT DIALOG POP UP
const EditProject = ({
  project,
  allProjects,
  setAllProjects,
  open,
  setOpen,
}: {
  readonly project: Project | undefined;
  readonly allProjects: Project[] | undefined;
  readonly setAllProjects: React.Dispatch<
    React.SetStateAction<Project[] | undefined>
  >;
  readonly open: boolean;
  readonly setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const supabase = createClient();

  const [projectInfo, setProjectInfo] = useState({
    name: "",
    city: "",
    country: "",
    month: "",
    year: 1900,
    relevance: [2.5],
    is_completed: false,
  });

  const [editLoading, setEditLoading] = useState(false);

  const { userData } = useAuth();

  useEffect(() => {
    if (project) {
      setProjectInfo({
        name: project?.name,
        city: project?.city ?? "",
        country: project?.country ?? "",
        month: project?.start_month ?? "",
        year: project?.start_year ?? 1900,
        relevance: project?.relevance ? [project?.relevance] : [2.5],
        is_completed: project?.is_completed ?? false,
      });
    }
  }, [project]);

  const editProject = async (e: React.FormEvent) => {
    e.preventDefault();

    setEditLoading(true);

    const values = {
      name: projectInfo.name,
      city: projectInfo.city.length ? projectInfo.city.trim() : null,
      country: projectInfo.country,
      month: projectInfo.month,
      year: projectInfo.year,
      relevance: projectInfo.relevance[0],
      is_completed: projectInfo.is_completed,
    };

    const result = EditProjectSchema.safeParse(values);

    if (!result.success) {
      toast.success("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setEditLoading(false);

      return;
    }

    const { name, city, country, month, year, is_completed, relevance } =
      result.data;

    try {
      if (!project) {
        return;
      }

      const { error } = await supabase
        .from("projects")
        .update({
          name,
          city: city?.trim() || null,
          country,
          start_month: month,
          start_year: year,
          relevance,
          is_completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id)
        .select()
        .single();

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Updated project ${project.name} `,
          user_id: userData.id,
          team_id: userData.team_id,
          activity_type: "project",
        });

      if (activityError) {
        toast.error("Something went wrong", {
          description: activityError.message,
        });

        return;
      }

      toast.success("Success!", {
        description: "Project updated successfully",
      });

      setOpen(false);
    } catch (err: any) {
      toast.error("Something went wrong", {
        description: err.message,
      });

      return;
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            value={projectInfo.name}
            onChange={(e) =>
              setProjectInfo({ ...projectInfo, name: e.target.value })
            }
            name={"name"}
            id="name"
          />
          <Input
            label="City"
            htmlFor="city"
            type="text"
            value={projectInfo.city}
            onChange={(e) =>
              setProjectInfo({ ...projectInfo, city: e.target.value })
            }
            name={"city"}
            id="city"
            className="mt-3"
          />
          {/* COUNTRY LOCATION */}
          <CustomInput label="Country *" htmlFor="year" className="mt-5">
            <SelectBar
              placeholder="Select country"
              value={projectInfo.country}
              label="Countries"
              className="mt-1"
              valueChange={(text) => {
                setProjectInfo({ ...projectInfo, country: text });
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
          <div className="mt-3">
            <label htmlFor="importance_level" className="">
              Level of relevance (not as crucial to extremely crucial) *
            </label>
            <p className="text-right text-dark75 text-[13px]">
              {projectInfo.relevance}
            </p>
            <Slider
              name="relevance"
              id="relevance"
              value={projectInfo.relevance}
              onValueChange={(val) =>
                setProjectInfo({ ...projectInfo, relevance: val })
              }
              max={5}
              step={0.5}
              className="mt-2"
            />
          </div>
          <div className="flex items-end gap-4 mt-5">
            {/* STARTING MONTH */}
            <CustomInput
              label="Starting month *"
              htmlFor="month"
              className="flex-1"
            >
              <SelectBar
                label="Starting month *"
                value={projectInfo.month}
                placeholder="Select month"
                className="mt-1"
                valueChange={(text) => {
                  setProjectInfo({ ...projectInfo, month: text });
                }}
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
            {/* STARTING YEAR */}
            <Input
              label="Starting year *"
              htmlFor="year"
              type="number"
              value={projectInfo.year}
              onChange={(e) =>
                setProjectInfo({
                  ...projectInfo,
                  year: e.target.valueAsNumber,
                })
              }
              name={"year"}
              id="year"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Switch
              id="is_completed"
              name="is_completed"
              checked={projectInfo.is_completed}
              onCheckedChange={(val) =>
                setProjectInfo({ ...projectInfo, is_completed: val })
              }
            />
            <label htmlFor="is_completed">Completed?</label>
          </div>
          {/* SUBMIT BUTTON */}
          <div className="flex justify-end mt-6">
            <Submit loading={editLoading} disabledLogic={editLoading} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
