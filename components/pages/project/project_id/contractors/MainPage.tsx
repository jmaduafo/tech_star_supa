"use client";
import AddButton from "@/components/ui/buttons/AddButton";
import Submit from "@/components/ui/buttons/Submit";
import CustomInput from "@/components/ui/input/CustomInput";
import SelectBar from "@/components/ui/input/SelectBar";
import AdvancedSearch from "@/components/ui/search/AdvancedSearch";
import { country_list, months } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import Input from "@/components/ui/input/Input";
import React, { useEffect, useState } from "react";
import { Contractor } from "@/types/types";
import ContractorDisplay from "./ContractorDisplay";
import { useAuth } from "@/context/UserContext";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ContractorSchema } from "@/zod/validation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useParams, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MainTitle from "@/components/ui/labels/MainTitle";
import { sortByNumOrBool, sortByString } from "@/utils/sortFilter";
import BulkAdd from "@/components/ui/buttons/BulkAdd";

function MainPage() {
  const [filteredContractors, setFilteredContractors] = useState<
    Contractor[] | undefined
  >();
  const [allContractors, setAllContractors] = useState<
    Contractor[] | undefined
  >();

  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [projectName, setProjectName] = useState("");

  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, string>[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [sortLoading, setSortLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const { userData } = useAuth();
  const supabase = createClient();
  const { project_id } = useParams();

  const searchParams = useSearchParams();

  // RETRIEVE CONTRACTOR DATA
  const getData = async () => {
    try {
      if (!userData || !project_id) {
        return;
      }

      const { data, error } = await supabase
        .from("contractors")
        .select("*, projects (name, is_completed)")
        .eq("team_id", userData.team_id)
        .eq("project_id", project_id);

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      setAllContractors(data as Contractor[]);
      setFilteredContractors(data as Contractor[]);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // RETRIEVE PROJECT NAME FOR BREADCRUMBS LINKS
  const getProjectName = async () => {
    try {
      if (!userData || !project_id) {
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("name")
        .eq("id", project_id)
        .single();

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        return;
      }

      setProjectName(data.name);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProjectName();
    getData();
  }, [project_id]);

  function filterContractors() {
    setSortLoading(true);

    try {
      const sort = searchParams.get("sort");
      const type = searchParams.get("type") as "asc" | "desc";
      const query = searchParams.get("query");

      if (!allContractors || allContractors.length === 0) {
        return;
      }

      if (!sort && !query) {
        setFilteredContractors(allContractors);
      }

      // QUERY
      query &&
        setFilteredContractors(
          allContractors.filter(
            (item) =>
              item.name?.toLowerCase().includes(query.toLowerCase()) ||
              item.country?.toLowerCase().includes(query.toLowerCase()) ||
              item.city?.toLowerCase().includes(query.toLowerCase())
          )
        );

      // SORT

      if (sort === "relevance") {
        setFilteredContractors(
          (prev) => prev && sortByNumOrBool(prev, "relevance", "desc")
        );
      } else if (sort === "status") {
        setFilteredContractors(
          (prev) => prev && sortByNumOrBool(prev, "is_available", "desc")
        );
      }
      if (sort === "name") {
        setFilteredContractors(
          (prev) => prev && sortByString(prev, "name", type)
        );
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setSortLoading(false);
    }
  }

  const handleUpload = async () => {};

  useEffect(() => {
    filterContractors();
  }, [searchParams]);

  // REATIME UPDATES WHEN THERE ARE CHANGES TO CONTRACTORS TABLE
  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contractors",
        },
        (payload) => getData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, allContractors, setAllContractors]);

  // INITIALIZING FORM VALUES FOR CREATE FUNCTIONALITY
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    description: "",
    start_month: "",
    start_year: "",
    relevance: [2.5],
    is_available: true,
    comment: "",
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      name: form.name.trim(),
      city: form.city.length ? form.city.trim() : null,
      country: form.country,
      start_month: form.start_month,
      start_year: +form.start_year,
      desc: form.description.trim(),
      relevance: form.relevance[0],
      is_available: form.is_available,
      comment: form.comment.length ? form.comment.trim() : null,
    };

    const result = ContractorSchema.safeParse(values);

    if (!result.success) {
      toast.error("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setIsLoading(false);

      return;
    }

    const {
      name,
      city,
      comment,
      start_month,
      start_year,
      country,
      desc,
      relevance,
      is_available,
    } = result.data;

    try {
      if (!userData || !project_id || !projectName.length) {
        return;
      }

      const { error } = await supabase.from("contractors").insert({
        name,
        city,
        country,
        description: desc,
        relevance,
        is_available,
        comment,
        start_year,
        start_month,
        project_id,

        team_id: userData.team_id,
      });

      if (error) {
        toast.error("Something went wrong", {
          description: error.message,
        });

        console.log(error.message);

        return;
      }

      const { error: activityError } = await supabase
        .from("activities")
        .insert({
          description: `Created contractor ${name} for project ${projectName}`,
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
        description: "Contractor was successfully created",
      });

      setForm({
        name: "",
        city: "",
        country: "",
        start_month: "",
        start_year: "",
        description: "",
        relevance: [2.5],
        is_available: true,
        comment: "",
      });

      setOpen(false);
    } catch (err: any) {
      toast.error("Something went wrong", {
        description: err.message,
      });
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MainTitle title="Contractors" data={filteredContractors} />

      {/* BREADCRUMB DISPLAY */}
      <div className="mb-8 mt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {projectName.length ? (
              <BreadcrumbItem>
                <BreadcrumbPage>{projectName}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex-1">
          <AdvancedSearch
            user={userData}
            setSort={setSort}
            sort={sort}
            setValue={setSearchValue}
            value={searchValue}
          />
        </div>
        <AddButton
          setOpen={setOpen}
          open={open}
          title={"contractor"}
          desc={"Create a new contractor"}
        >
          <form onSubmit={handleAdd}>
            {/* PROJECT NAME */}
            <Input
              label="Contractor name *"
              htmlFor="name"
              name="name"
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {/* CITY LOCATION */}
            <Input
              label="City"
              htmlFor="city"
              name="city"
              type="text"
              id="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-3"
            />
            {/* COUNTRY LOCATION */}
            <CustomInput
              htmlFor={"country"}
              label={"Country *"}
              className="mt-3"
            >
              <SelectBar
                placeholder="Select country location"
                value={form.country}
                valueChange={(val) => setForm({ ...form, country: val })}
                label="Countries"
                className="w-full mt-1"
                name="country"
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
            <div className="mt-3">
              <label htmlFor="relevance" className="">
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
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              ></textarea>
            </CustomInput>
            <div className="flex items-center gap-2 mt-3">
              <Switch id="status" name="status" checked={form.is_available} />
              <label htmlFor="status">Is contractor available?</label>
            </div>
            {/* SUBMIT BUTTON */}
            <div className="flex justify-end mt-6">
              <Submit loading={isLoading} disabledLogic={isLoading} />
            </div>
          </form>
        </AddButton>
        <BulkAdd
          mode="contractor"
          setHeaders={setHeaders}
          headers={headers}
          setItems={setData}
          items={data}
          desc="Upload contractor data here"
          title={"contractor files"}
          setOpen={setUploadOpen}
          open={uploadOpen}
          handleSubmit={handleUpload}
          loading={uploadLoading}
        />
      </div>
      <div className="mt-10">
        <ContractorDisplay
          allContractors={filteredContractors}
          loading={sortLoading}
        />
      </div>
    </div>
  );
}

export default MainPage;
