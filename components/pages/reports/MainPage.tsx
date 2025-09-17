"use client";

import React, { useEffect, useState } from "react";
import Kpi from "./kpis/Kpi";
import Tables from "./tables/Tables";
import Charts from "./charts/Charts";
import Header1 from "@/components/fontsize/Header1";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAuth } from "@/context/UserContext";
import { Amount, Project } from "@/types/types";
import { createClient } from "@/lib/supabase/client";
import { getUniqueObjects } from "@/utils/chartHelpers";

function MainPage() {
  const [period, setPeriod] = useState("All Time");

  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [currenciesList, setCurrenciesList] = useState<Amount[] | undefined>();

  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [selectedProject, setSelectedProject] = useState("");

  const { userData } = useAuth();
  const supabase = createClient();

  const getData = async () => {
    if (!userData) {
      return;
    }

    const [projects, currencies] = await Promise.all([
      supabase
        .from("projects")
        .select("id, name")
        .eq("team_id", userData.team_id)
        .order("created_at", { ascending: false })
        .throwOnError(),
      supabase
        .from("contract_amounts")
        .select("id, name, symbol, code, contracts ( id, team_id )")
        .eq("contracts.team_id", userData.team_id)
        .throwOnError(),
    ]);

    setSelectedProject(projects.data[0].id)
    setAllProjects(projects.data)
    
    setCurrenciesList(getUniqueObjects(currencies.data, "code"))
    setSelectedCurrency(getUniqueObjects(currencies.data, "code")[0].code)
    setCurrencySymbol(getUniqueObjects(currencies.data, "code")[0].symbol)
  };

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="">
      <div className="flex justify-between">
        <Header1 text={`${period !== "All Time" ? period + " " : ""}Report`} />
        <div className="">
          <Button>
            <Download className="" />
            Download
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-8">
        <SelectBar
          valueChange={setSelectedProject}
          value={selectedProject}
          placeholder="Select a project"
          label="Projects"
        >
          {allProjects
            ? allProjects.map((item) => {
                return (
                  <SelectItem
                    className="cursor-pointer"
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </SelectItem>
                );
              })
            : null}
        </SelectBar>
        <SelectBar
          valueChange={setSelectedCurrency}
          value={selectedCurrency}
          placeholder="Select a currency"
          label="Currencies"
        >
          {currenciesList
            ? currenciesList.map((item) => {
                return (
                  <SelectItem
                    className="cursor-pointer"
                    key={item.name}
                    value={item.code}
                  >
                    {item.name}
                  </SelectItem>
                );
              })
            : null}
        </SelectBar>
        <SelectBar
          placeholder={"Select a time period"}
          label={"Ranges"}
          value={period}
          valueChange={setPeriod}
        >
          {["All Time", "Yearly", "Monthly", "Weekly"].map((item) => {
            return (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectBar>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <Kpi
          project_id={selectedProject}
          currency_code={selectedCurrency}
          currency_symbol={currencySymbol}
          timePeriod={period}
          user={userData}
        />
        <Charts
          project_id={selectedProject}
          currency_code={selectedCurrency}
          currency_symbol={currencySymbol}
          timePeriod={period}
          user={userData}
        />
        <Tables
          project_id={selectedProject}
          currency_code={selectedCurrency}
          currency_symbol={currencySymbol}
          timePeriod={period}
          user={userData}
        />
      </div>
    </div>
  );
}

export default MainPage;
