"use client";
import React, { useState, useEffect } from "react";
import ProjectDisplay from "./ProjectDisplay";
import { Project } from "@/types/types";
import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import Header1 from "@/components/fontsize/Header1";
import { useAuth } from "@/context/UserContext";
import AdvancedSearch from "@/components/ui/search/AdvancedSearch";
import AddButton from "@/components/ui/buttons/AddButton";
import Input from "@/components/ui/input/Input";
import SelectBar from "@/components/ui/input/SelectBar";
import { country_list, months } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import Submit from "@/components/ui/buttons/Submit";
import CustomInput from "@/components/ui/input/CustomInput";
import { CreateProjectSchema } from "@/zod/validation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";

function MainPage() {
  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    relevance: [2.5],
    country: "",
    month: "",
    year: 2025,
  });

  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [filteredProjects, setFilteredProjects] = useState<
    Project[] | undefined
  >([]);

  const { userData } = useAuth();

  const supabase = createClient();

  const searchParams = useSearchParams();

  const getProjects = async () => {
    try {
      if (!userData) {
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("team_id", userData.team_id);

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        console.error(error.message);

        return;
      }

      setAllProjects(data as Project[]);
      setFilteredProjects(data as Project[]);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const values = {
      name: form.name.trim(),
      city: form.city.length ? form.city.trim() : null,
      country: form.country,
      relevance: form.relevance[0],
      month: form.month,
      year: +form.year,
    };

    const result = CreateProjectSchema.safeParse(values);

    if (!result.success) {
      toast("Something went wrong", {
        description: result.error.issues[0].message,
      });

      setIsLoading(false);

      return;
    }

    const { city, name, country, month, year } = result.data;

    try {
      if (!userData) {
        return;
      }

      const { error } = await supabase
        .from("projects")
        .insert({
          name,
          team_id: userData?.team_id,
          city,
          country,
          start_month: month,
          start_year: year,
        })

      if (error) {
        toast("Something went wrong", {
          description: error.message,
        });

        console.log(error.message);

        return;
      }

      setForm({
        name: "",
        city: "",
        country: "",
        month: "",
        relevance: [2.5],
        year: 2025,
      });

      setOpen(false);
    } catch (err: any) {
      toast("Something went wrong", {
        description: err.message,
      });
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  function filterProjects() {
    try {
      setFilteredProjects(undefined);

      const sort = searchParams.get("sort");
      const type = searchParams.get("type");
      const query = searchParams.get("query");

      if (!allProjects || allProjects.length === 0) {
        return;
      }

      setFilteredProjects(allProjects);

      if (!sort && !query && !type) {
        setFilteredProjects(allProjects);
      }

      // QUERY
      query &&
        setFilteredProjects(
          allProjects.filter(
            (item) =>
              item.name?.toLowerCase().includes(query.toLowerCase()) ||
              item.country?.toLowerCase().includes(query.toLowerCase()) ||
              item.city?.toLowerCase().includes(query.toLowerCase())
          )
        );

      // SORT
    } catch (err: any) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    filterProjects();
  }, [searchParams]);

  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
        },
        (payload) => getProjects()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, allProjects, setAllProjects]);

  return (
    <div>
      <div className="flex items-start gap-5 mb-8 text-lightText">
        <Header1 text="All Projects" />
        {filteredProjects ? (
          <Header6
            text={`${filteredProjects.length} result${optionalS(
              filteredProjects.length
            )}`}
          />
        ) : null}
      </div>
      <div className="flex items-center gap-3">
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
          title={"project"}
          desc={"It adds projects"}
        >
          <form onSubmit={handleAdd}>
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
            <div className="flex items-center gap-4 mt-5">
              {/* COUNTRY LOCATION */}
              <CustomInput
                htmlFor={"country"}
                label={"Country *"}
                className="flex-1"
              >
                <SelectBar
                  placeholder="Select country *"
                  value={form.country}
                  valueChange={(name) => setForm({ ...form, country: name })}
                  label="Countries"
                  className="mt-1"
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
              <CustomInput
                htmlFor={"month"}
                label={"Starting month *"}
                className="flex-1"
              >
                <SelectBar
                  placeholder="Month *"
                  value={form.month}
                  valueChange={(name) => setForm({ ...form, month: name })}
                  label="Months"
                  className="mt-1"
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
            <CustomInput htmlFor={"year"} label={"Year *"} className="mt-3">
              <input
                type="number"
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: e.target.valueAsNumber })
                }
                name="year"
                id="year"
                className="form"
                min={1900}
                max={new Date().getFullYear()}
              />
            </CustomInput>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end mt-6">
              <Submit loading={isLoading} disabledLogic={isLoading} />
            </div>
          </form>
        </AddButton>
      </div>
      <div className="mt-10">
        <ProjectDisplay
          user={userData}
          allProjects={filteredProjects}
          setAllProjects={setAllProjects}
        />
      </div>
    </div>
  );
}

export default MainPage;
