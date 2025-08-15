"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Project, User } from "@/types/types";
import Card from "@/components/ui/cards/MyCard";
import { EllipsisVertical, Plus } from "lucide-react";
import Header5 from "@/components/fontsize/Header5";
import Banner from "@/components/ui/Banner";
import Header4 from "@/components/fontsize/Header4";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
// import Input from "@/components/ui/input/CustomInput";
import Input from "@/components/ui/input/Input";
import SelectBar from "@/components/ui/input/SelectBar";
import { country_list, months } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "sonner";
import Link from "next/link";
// import { createProject, editProject } from "@/zod/actions";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
// import { deleteItem } from "@/firebase/actions";
import Loading from "@/components/ui/Loading";
import CustomInput from "@/components/ui/input/CustomInput";

function ProjectDisplay({
  user,
  sort,
  searchValue,
  allProjects,
  filterSearch,
}: {
  readonly user: User | undefined;
  readonly sort: string;
  readonly searchValue: string;
  readonly allProjects: Project[] | undefined;
  readonly filterSearch: Project[];
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    month: "",
    year: 0,
  });
  // const [state, action, isLoading] = useActionState(
  //   (prevState: any, formData: FormData) =>
  //     createProject(prevState, formData, {
  //       id: user?.id as string,
  //       team_id: user?.team_id as string,
  //     }),
  //   {
  //     data: {
  //       month: "",
  //       city: "",
  //       country: "",
  //       name: "",
  //       year: "",
  //     },
  //     message: "",
  //     success: false,
  //   }
  // );

  // useEffect(() => {
  //   if (!state?.success && state?.message?.length) {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong",
  //       description: state?.message,
  //     });
  //   } else if (state?.success) {
  //     toast({
  //       title: "Project was created successfully!",
  //     });

  //     setOpen(false);
  //   }
  // }, [state]);

  const checkAdmin =
    user?.is_owner || user?.role === "admin" ? (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* BUTTON TO ADD NEW PROJECT; ONLY ADMIN CAN ADD A NEW PROJECT */}
          <button>
            <Card className="h-[200px] text-lightText cursor-pointer flex justify-center items-center hover:opacity-80 duration-300 hover:shadow-md">
              <div className="">
                <div className="flex justify-center">
                  <Plus strokeWidth={1} className="w-16 h-16" />
                </div>
                <Header5 text="Add new project" className="text-center" />
              </div>
            </Card>
          </button>
        </DialogTrigger>
        {/* CREATE PROJECT DIALOG POPUP */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a project</DialogTitle>
            <DialogDescription>
              Start a project and manage finances
            </DialogDescription>
          </DialogHeader>
          <form>
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
              label="City name *"
              htmlFor="city"
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              name={"city"}
              id="city"
            />
            <div className="flex items-center gap-4 mt-5">
              {/* COUNTRY LOCATION */}
              <SelectBar
                placeholder="Select country *"
                value={form.country}
                valueChange={(name) => setForm({ ...form, country: name })}
                label="Countries"
                className="flex-1"
              >
                {country_list.map((item) => {
                  return (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectBar>
              <SelectBar
                placeholder="Starting month *"
                value={form.month}
                valueChange={(name) => setForm({ ...form, month: name })}
                label="Months"
                className="flex-1"
              >
                {months.map((item) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
            </div>
            <Input
              label="Year *"
              htmlFor="year"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.valueAsNumber })}
              name="year"
              id="year"
            />
            {/* SUBMIT BUTTON */}
            <div className="flex justify-end mt-6">
              <Submit
                loading={isLoading}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
                disabledLogic={isLoading}
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    ) : null;

  const filtered =
    filterSearch?.length && searchValue.length
      ? filterSearch.map((item) => {
          return (
            <Link href={`/projects/${item?.id}`} key={item.id}>
              <Card className="h-[200px] text-lightText z-0 cursor-pointer hover:opacity-90 duration-300 hover:shadow-md">
                <div className="flex flex-col h-full">
                  <Header4 text={item.name} className="capitalize" />
                  <p className="text-[14px] text-light50">
                    Since {item?.start_month?.substring(0, 3)}.{" "}
                    {item.start_year} -{" "}
                    {item?.city ? (
                      <span className="italic">`${item.city}, `</span>
                    ) : null}
                    <span className="italic">{item.country}</span>
                  </p>
                  <div className="mt-auto">
                    <Banner
                      text={item.is_completed ? "completed" : "ongoing"}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })
      : null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 w-full">
      {isLoading
        ? [0, 1, 2, 3, 4, 5].map((each, i) => {
            return (
              <Fragment key={`${each}_${i}`}>
                <Skeleton className="h-[200px] rounded-[40px]" />
              </Fragment>
            );
          })
        : checkAdmin}
      {allProjects?.length && !filterSearch.length && !searchValue.length
        ? allProjects?.map((item) => {
            return (
              <Fragment key={item.id}>
                <Card className="h-[200px] text-lightText z-0 hover:opacity-90 duration-300 hover:shadow-md">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/projects/${item?.id}`}>
                          <Header4 text={item.name} className="capitalize" />
                        </Link>
                        <p className="text-[14px] text-light50">
                          Since {item?.start_month?.substring(0, 3)}.{" "}
                          {item.start_year} -{" "}
                          {item?.city ? (
                            <span className="italic">`${item.city}, `</span>
                          ) : null}
                          <span className="italic">{item.country}</span>
                        </p>
                      </div>
                      <EditProject project={item} />
                    </div>
                    <div className="mt-auto">
                      <Banner
                        text={item.is_completed ? "completed" : "ongoing"}
                      />
                    </div>
                  </div>
                </Card>
              </Fragment>
            );
          })
        : filtered}
    </section>
  );
}

export default ProjectDisplay;

function EditProject({ project }: { readonly project: Project | undefined }) {
  const [projectInfo, setProjectInfo] = useState({
    name: "",
    city: "",
    country: "",
    month: "",
    year: 0,
    is_completed: false,
  });

  // const [state, action, isLoading] = useActionState(
  //   (prevState: any, formData: FormData) =>
  //     editProject(prevState, formData, {
  //       id: project?.id as string,
  //       team_id: project?.team_id as string,
  //     }),
  //   {
  //     message: "",
  //     success: false,
  //   }
  // );

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // FOR DELETE PROJECT FUNCTIONALITY
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (project) {
  //     setProjectInfo({
  //       name: project?.name,
  //       city: project?.city ?? "",
  //       country: project?.country,
  //       month: project?.start_month,
  //       year: project?.start_year,
  //       is_completed: project?.is_completed,
  //     });
  //   }
  // }, [project]);

  // useEffect(() => {
  //   if (!state?.success && state?.message) {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong",
  //       description: state?.message,
  //     });
  //   } else if (state?.success) {
  //     toast({
  //       title: "Your profile was updated successfully!",
  //     });
  //   }
  // }, [state]);

  // const deleteProject = async () => {
  //   setLoading(true);

  //   try {
  //     if (!project) {
  //       return;
  //     }

  //     await deleteItem("projects", project.id);

  //     toast({
  //       title: "Project was deleted successfully!",
  //     });
  //   } catch (err: any) {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong",
  //       description: err.message,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen}>
        <DropdownMenuTrigger asChild>
          <button>
            <EllipsisVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setEditOpen(true);
                setDropDownOpen(false);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleteOpen(true);
                setEditOpen(false);
                setDropDownOpen(false);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          aria-describedby="edit project popup"
          className="sm:max-w-sm"
        >
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
          </DialogHeader>
          <form>
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
                placeholder="Select country *"
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
            <div className="flex items-end gap-4 mt-5">
              {/* STARTING MONTH */}
              <CustomInput
                label="Starting month *"
                htmlFor="month"
                className="flex-1"
              >
                <SelectBar
                  placeholder="Starting month *"
                  value={projectInfo.month}
                  label="Months"
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
            {/* <div className="flex justify-end mt-6">
              <Submit
                loading={isLoading}
                disabledLogic={isLoading}
              />
            </div> */}
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
            <AlertDialogAction onClick={() => {}}>
              {loading ? <Loading className="w-5 h-5" /> : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
