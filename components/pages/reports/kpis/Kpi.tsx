"use client";
import Header2 from "@/components/fontsize/Header2";
import Header6 from "@/components/fontsize/Header6";
import CheckedButton from "@/components/ui/buttons/CheckedButton";
import KpiCard from "@/components/ui/cards/KpiCard";
import Card from "@/components/ui/cards/MyCard";
import SelectBar from "@/components/ui/input/SelectBar";
import Loading from "@/components/ui/loading/Loading";
import { Amount, Payment, Project, User, Versus } from "@/types/types";
import { SelectItem } from "@radix-ui/react-select";
import React, { Fragment, useState } from "react";

function Kpi({
  timePeriod,
  user,
}: {
  readonly timePeriod: string;
  readonly user: User | undefined;
}) {
  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [allPayments, setAllPayments] = useState<Payment[] | undefined>();
  const [currenciesList, setCurrenciesList] = useState<Amount[] | undefined>();

  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [selectedProject, setSelectedProject] = useState("");

  const [kpi, setKpi] = useState<Versus[] | undefined>([
    {
      currentAmount: 0,
      previousAmount: 0,
    },
    {
      currentAmount: 0,
      previousAmount: 0,
    },
    {
      currentAmount: 0,
      previousAmount: 0,
    },
    {
      currentAmount: 0,
      previousAmount: 0,
    },
    {
      currentAmount: 0,
      previousAmount: 0,
    },
  ]);

  const cardTitles = [
    {
      title: "Total payment amount",
      symbol: currencySymbol,
      visual: true,
      className: "md:col-span-2 lg:col-span-1"
    },
    {
      title: "Total contract amount",
      symbol: currencySymbol,
      visual: true,
      className: ""
    },
    {
      title: "Contract payment amount",
      symbol: currencySymbol,
      visual: true,
      className: ""
    },
    {
      title: "Contract balance",
      symbol: currencySymbol,
      visual: true,
      className: ""
    },
    {
      title: "Top contractor",
      symbol: null,
      visual: false,
      className: ""
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
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
        <div className="flex gap-1.5">
          <CheckedButton
            clickedFn={() => {}}
            disabledLogic={!selectedCurrency.length || !selectedProject.length}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-4 mt-2">
        {kpi
          ? cardTitles.map((item, i) => {
              return (
                <Fragment key={item.title}>
                  {i < 4 ? (
                    <KpiCard
                      period={timePeriod}
                      item={item}
                      index={i}
                      arr={kpi}
                    />
                  ) : (
                    <Card className="">
                      <Header6 text={item.title} className="capitalize" />
                      <div className="flex justify-end items-start gap-1 mt-8">
                        <div className="flex items-start gap-1">
                          <Header2 text={``} />
                        </div>
                      </div>
                    </Card>
                  )}
                </Fragment>
              );
            })
          : Array.from({ length: 5 }).map((_, i) => {
              return (
                <Card className="h-32 w-full animate-pulse" key={`${i + 1}`}>
                  <Loading />
                </Card>
              );
            })}
      </div>
    </div>
  );
}

export default Kpi;
