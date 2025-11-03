"use client";
import React, { useState, useEffect, Fragment } from "react";
import { currency_list } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import SelectBar from "@/components/ui/input/SelectBar";
import { Amount, Project, User, Versus } from "@/types/types";
import Card from "@/components/ui/cards/MyCard";
import KpiCard from "@/components/ui/cards/KpiCard";
import Loading from "@/components/ui/loading/Loading";
import {
  activeContractors,
  averageContract,
  totalAmountPaid,
  totalPayments,
} from "@/utils/kpi";

function AmountDisplay({
  projects,
  currencies,
  user,
  selectedCurrency,
  selectedProject,
  setSelectedCurrency,
  setSelectedProject
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
  readonly user: User | undefined;
  readonly selectedProject: string;
  readonly selectedCurrency: string;
  readonly setSelectedProject: React.Dispatch<React.SetStateAction<string>>;
    readonly setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
}) {

  const [selectedPeriod, setSelectedPeriod] = useState("year");

  const [currencySymbol, setCurrencySymbol] = useState("");
  
 

  const [kpi, setKpi] = useState<Versus[] | undefined>();

  // GETS ALL PROJECT AND CONTRACTOR NAMES BASED ON THE USER'S TEAM ID
  function allData() {
    try {
      if (!projects || !currencies || !selectedProject.length || !selectedCurrency.length) {
        return;
      }



      // if (!selectedProject.length) {
      //   setSelectedProject(projects[0].id)
      // }

      // if (selectedCurrency.length) {
      //   const currency = currency_list.find(
      //     (item) => item.code === selectedCurrency
      //   );

      //   currency && setCurrencySymbol(currency.symbol);
      // } else {
      //   setSelectedCurrency(currencies[0].code)

        const currency = currency_list.find(
          (item) => item.code === currencies[0].code
        );

        currency && setCurrencySymbol(currency.symbol);
      

      setKpi([
        totalAmountPaid(
          projects as unknown as Project[],
          selectedProject,
          selectedCurrency,
          selectedPeriod
        ),
        totalPayments(
          projects as unknown as Project[],
          selectedProject,
          selectedCurrency,
          selectedPeriod
        ),
        averageContract(
          projects as unknown as Project[],
          selectedProject,
          selectedCurrency,
          selectedPeriod
        ),
        activeContractors(
          projects as unknown as Project[],
          selectedProject
        ),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    allData();
  }, [projects, selectedProject, selectedCurrency, selectedPeriod]);

  const cardTitle = [
    {
      title: "Total amount paid",
      symbol: currencySymbol,
      visual: true,
    },
    {
      title: "Payments made",
      symbol: null,
      visual: true,
    },
    {
      title: "Average contract size",
      symbol: currencySymbol,
      visual: true,
    },
    {
      title: "Active contractors",
      symbol: null,
      visual: false,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <SelectBar
          valueChange={setSelectedProject}
          value={selectedProject}
          placeholder="Select a project"
          label="Projects"
        >
          {projects
            ? projects.map((item) => {
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
          {currencies
            ? currencies.map((item) => {
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
          valueChange={setSelectedPeriod}
          value={selectedPeriod}
          placeholder="Select a period"
          label="Periods"
        >
          {["year", "month", "week"].map((item) => {
            return (
              <SelectItem className="cursor-pointer" key={item} value={item}>
                vs. last {item}
              </SelectItem>
            );
          })}
        </SelectBar>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 mt-2">
        {kpi
          ? cardTitle.map((item, i) => {
              return (
                <Fragment key={item.title}>
                  <KpiCard item={item} index={i} arr={kpi} period={selectedPeriod}/>
                </Fragment>
              );
            })
          : Array.from({ length: 4 }).map((_, i) => {
              return (
                <Card
                  className="h-32 w-full animate-pulse flex justify-center items-center"
                  key={`${i + 1}`}
                >
                  <Loading />
                </Card>
              );
            })}
      </div>
    </div>
  );
}

export default AmountDisplay;
