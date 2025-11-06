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
  setSelectedProject,
  period,
  customEnd,
  customStart,
  setPeriod,
  setCustomEnd,
  setCustomStart,
}: {
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
  readonly user: User | undefined;
  readonly selectedProject: string;
  readonly selectedCurrency: string;
  readonly period: string;
  readonly customStart: string;
  readonly customEnd: string;
  readonly setSelectedProject: React.Dispatch<React.SetStateAction<string>>;
  readonly setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
  readonly setPeriod: React.Dispatch<React.SetStateAction<string>>;
  readonly setCustomStart: React.Dispatch<React.SetStateAction<string>>;
  readonly setCustomEnd: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [kpi, setKpi] = useState<Versus[] | undefined>();

  // GETS ALL PROJECT AND CONTRACTOR NAMES BASED ON THE USER'S TEAM ID
  function allData() {
    try {
      if (
        !projects ||
        !currencies ||
        !selectedProject.length ||
        !selectedCurrency.length ||
        !period.length
      ) {
        return;
      }

      const currency = currency_list.find(
        (item) => item.code === selectedCurrency
      );

      currency && setCurrencySymbol(currency.symbol);

      setKpi([
        totalAmountPaid(
          projects as unknown as Project[],
          selectedProject,
          selectedCurrency,
          period
        ),
        totalPayments(
          projects as unknown as Project[],
          selectedProject,
          selectedCurrency,
          period
        ),
        averageContract(
          projects as unknown as Project[],
          selectedProject,
          selectedCurrency,
          period
        ),
        activeContractors(projects as unknown as Project[], selectedProject),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    allData();
  }, [projects, selectedProject, selectedCurrency, period]);

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

  const switchPeriod = (text: string) => {
    if (text === "custom") {
      return "Custom";
    } else if (text === "day") {
      return "Last 24 hours";
    } else {
      return "Last 1 " + text;
    }
  };

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
          valueChange={setPeriod}
          value={period}
          placeholder="Select a period"
          label="Periods"
        >
          {["year", "quarter", "month", "week", "day", "custom"].map((item) => {
            return (
              <SelectItem className="cursor-pointer" key={item} value={item}>
                {switchPeriod(item)}
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
                  <KpiCard item={item} index={i} arr={kpi} period={period} />
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
