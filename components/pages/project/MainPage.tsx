"use client";
import React, { useState, useEffect } from "react";
import ProjectDisplay from "./ProjectDisplay";
import ProjectSearch from "./ProjectSearch";
import { Project } from "@/types/types";
import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import Header1 from "@/components/fontsize/Header1";
import { useAuth } from "@/context/UserContext";

function MainPage() {
  const [sort, setSort] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [filterSearch, setFilterSearch] = useState<Project[]>([]);

  const { userData } = useAuth()

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
      <ProjectSearch
        user={userData}
        setSort={setSort}
        sort={sort}
        setValue={setSearchValue}
        value={searchValue}
      />
      {/* <div className="mt-10">
        <ProjectDisplay
          user={userData}
          sort={sort}
          searchValue={searchValue}
          allProjects={allProjects}
          filterSearch={filterSearch}
        />
      </div> */}
    </div>
  );
}

export default MainPage;
