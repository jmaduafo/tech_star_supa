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

function MainPage() {
  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    month: "",
    year: 0,
  });

  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [filterSearch, setFilterSearch] = useState<Project[]>([]);

  const { userData } = useAuth();

  function getProjects() {
    try {
      if (!userData) {
        return;
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }

  // useEffect(() => {
  //   getProjects();
  // }, []);

  function filterProjects() {
    allProjects?.length &&
      searchValue.length &&
      setFilterSearch(
        allProjects.filter(
          (item) =>
            item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.country?.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.city?.toLowerCase().includes(searchValue.toLowerCase())
        )
      );

    //   !searchValue.length && allProjects && setFilterSearch(allProjects)
  }

  useEffect(() => {
    filterProjects();
  }, [searchValue]);

  return (
    <div>
      <div className="flex items-start gap-5 mb-8 text-lightText">
        <Header1 text="All Projects" />
        {allProjects ? (
          <Header6
            text={`${
              allProjects?.length && !filterSearch.length && !searchValue.length
                ? allProjects?.length
                : filterSearch.length
            } result${optionalS(
              allProjects?.length && !filterSearch.length && !searchValue.length
                ? allProjects?.length
                : filterSearch.length
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
        <AddButton title={"project"} desc={""}>
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
              className="mt-3"
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
              onChange={(e) =>
                setForm({ ...form, year: e.target.valueAsNumber })
              }
              name="year"
              id="year"
              className="mt-3"
            />
            {/* SUBMIT BUTTON */}
            {/* <div className="flex justify-end mt-6">
              <Submit
                loading={isLoading}
                disabledLogic={isLoading}
              />
            </div> */}
          </form>
        </AddButton>
      </div>
      <div className="mt-10">
        <ProjectDisplay
          user={userData}
          allProjects={allProjects}
        />
      </div>
    </div>
  );
}

export default MainPage;
