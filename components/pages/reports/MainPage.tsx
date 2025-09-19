"use client";

import React, { useEffect, useState } from "react";
import Kpi from "./kpis/Kpi";
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
import { currency_list } from "@/utils/dataTools";

function MainPage() {
  const [period, setPeriod] = useState("All Time");

  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [currenciesList, setCurrenciesList] = useState<Amount[] | undefined>();

  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const { userData } = useAuth();
  const supabase = createClient();

  const getData = async () => {
    if (!userData) {
      return;
    }

    const [projects, contractCurrencies, paymentCurrencies] = await Promise.all(
      [
        supabase
          .from("projects")
          .select(
            "id, name, contractors ( *, payments ( *, payment_amounts ( * ) ) ), stages ( * ), contracts ( *, contract_amounts ( * ) ), payments ( *, payment_amounts ( * ) )"
          )
          .eq("team_id", userData.team_id)
          .order("created_at", { ascending: false })
          .throwOnError(),
        supabase
          .from("contract_amounts")
          .select(
            "id, contract_id, name, symbol, code, contracts ( id, team_id, project_id, contractor_id )"
          )
          .eq("contracts.team_id", userData.team_id)
          .throwOnError(),
        supabase
          .from("payment_amounts")
          .select(
            "id, payment_id, name, symbol, code, payments ( id, team_id, project_id, contractor_id )"
          )
          .eq("payments.team_id", userData.team_id)
          .throwOnError(),
      ]
    );

    setSelectedProject(projects.data[0].id);
    setAllProjects(projects.data);

    setCurrenciesList(
      getUniqueObjects(
        [...contractCurrencies.data, ...paymentCurrencies.data],
        "code"
      )
    );
    setSelectedCurrency(
      getUniqueObjects(
        [...contractCurrencies.data, ...paymentCurrencies.data],
        "code"
      )[0].code
    );
    setCurrencySymbol(
      getUniqueObjects(
        [...contractCurrencies.data, ...paymentCurrencies.data],
        "code"
      )[0].symbol
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const changeCurrency = (name: string) => {
    setSelectedCurrency(name);

    const currency = currency_list.find((item) => item.code === name);

    currency && setCurrencySymbol(currency.symbol);
  };

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
          valueChange={(name) => changeCurrency(name)}
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
          {["All Time", "Yearly", "Quarterly", "Monthly", "Weekly"].map(
            (item) => {
              return (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              );
            }
          )}
        </SelectBar>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <Kpi
          project_id={selectedProject}
          currency_code={selectedCurrency}
          currency_symbol={currencySymbol}
          projects={allProjects}
          currencies={currenciesList}
          timePeriod={period}
          user={userData}
        />
        <Charts
          project_id={selectedProject}
          currency_code={selectedCurrency}
          currency_symbol={currencySymbol}
          projects={allProjects}
          currencies={currenciesList}
          timePeriod={period}
          user={userData}
        />
      </div>
    </div>
  );
}

export default MainPage;
