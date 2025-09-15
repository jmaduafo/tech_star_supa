"use client";
import React, { useState, useEffect, Fragment } from "react";
import { currency_list } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import SelectBar from "@/components/ui/input/SelectBar";
import Header2 from "@/components/fontsize/Header2";
import { Amount, Project, User, Versus } from "@/types/types";
import {
  convertCurrency,
  getPercentChange,
  totalSum,
} from "@/utils/currencies";
import CheckedButton from "@/components/ui/buttons/CheckedButton";
import Header6 from "@/components/fontsize/Header6";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/cards/MyCard";
import PercentBanner from "@/components/ui/banners/PercentBanner";
import { versusLast } from "@/utils/dateAndTime";
import { getUniqueObjects } from "@/utils/chartHelpers";

function AmountDisplay({ user }: { readonly user: User | undefined }) {
  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [currenciesList, setCurrenciesList] = useState<Amount[] | undefined>();

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [kpi, setKpi] = useState<Versus[] | undefined>();

  const supabase = createClient();

  // GETS ALL PROJECT AND CONTRACTOR NAMES BASED ON THE USER'S TEAM ID
  async function allData() {
    try {
      if (!user) {
        return;
      }

      const [projects, contracts, payments] = await Promise.all([
        supabase
          .from("projects")
          .select(
            "id, name, payments ( id, date, is_paid, is_completed, payment_amounts ( * )), contracts ( id, date, contract_amounts ( * )), contractors (id, name, is_available, start_month, start_year)"
          )
          .eq("team_id", user.team_id)
          .throwOnError(),
        supabase
          .from("contract_amounts")
          .select("*, contracts ( id, is_completed, team_id)")
          .eq("contracts.team_id", user.team_id)
          // .rangeGte("contracts.date", format(pastTime("Last 1 year"), "PP"))
          .throwOnError(),
        supabase
          .from("payment_amounts")
          .select("*, payments ( id, is_completed, is_paid, team_id)")
          .eq("payments.team_id", user.team_id)
          // .rangeGte("contracts.date", format(pastTime("Last 1 year"), "PP"))
          .throwOnError(),
      ]);

      const allCurrencies: Amount[] = [];

      contracts.data.forEach((item) => {
        allCurrencies.push({
          code: item.code,
          symbol: item.symbol,
          name: item.name,
          amount: item.amount,
        });
      });

      payments.data.forEach((item) => {
        allCurrencies.push({
          code: item.code,
          symbol: item.symbol,
          name: item.name,
          amount: item.amount,
        });
      });

      setAllProjects(projects.data as unknown as Project[]);

      const uniqueCurrency = getUniqueObjects(allCurrencies, "code");
      setCurrenciesList(uniqueCurrency);

      setSelectedProject(projects.data[0].id);
      setSelectedCurrency(uniqueCurrency[0].code);
      setCurrencySymbol(uniqueCurrency[0].symbol);

      setKpi([
        totalAmountPaid(
          projects.data as unknown as Project[],
          projects.data[0].id,
          uniqueCurrency[0].code,
          selectedPeriod
        ),
        totalPayments(
          projects.data as unknown as Project[],
          projects.data[0].id,
          uniqueCurrency[0].code,
          selectedPeriod
        ),
        averageContract(
          projects.data as unknown as Project[],
          projects.data[0].id,
          uniqueCurrency[0].code,
          selectedPeriod
        ),
        activeContractors(
          projects.data as unknown as Project[],
          projects.data[0].id
        ),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    allData();
  }, [user]);

  function totalAmountPaid(
    data: Project[],
    project_id: string,
    code: string,
    period: string
  ) {
    const payments = data.find((item) => item.id === project_id)?.payments;

    const filter = payments?.filter(
      (item) => item.is_paid && item.payment_amounts && item.payment_amounts[0]?.code === code
    );

    const prevAmounts: number[] = [];
    const currentAmounts: number[] = [];

    filter?.forEach((item) => {
      if (item?.payment_amounts) {
        versusLast(item?.date, period).prev &&
          prevAmounts.push(Number(item?.payment_amounts[0]?.amount));

        versusLast(item?.date, period).current &&
          currentAmounts.push(Number(item?.payment_amounts[0]?.amount));
      }
    });

    return {
      previousAmount: prevAmounts.length
        ? totalSum(prevAmounts) / prevAmounts.length
        : 0,
      currentAmount: currentAmounts.length
        ? totalSum(currentAmounts) / currentAmounts.length
        : 0,
    };
  }

  function totalPayments(
    data: Project[],
    project_id: string,
    code: string,
    period: string
  ) {
    const payments = data.find((item) => item.id === project_id)?.payments;

    const filter = payments?.filter(
      (item) =>
        item.is_paid === true &&
        item.payment_amounts &&
        item.payment_amounts[0].code === code
    );

    let previousAmount = 0;
    let currentAmount = 0;

    filter?.forEach((item) => {
      versusLast(item?.date, period).prev && previousAmount++;
      versusLast(item?.date, period).current && currentAmount++;
    });

    return {
      previousAmount,
      currentAmount,
    };
  }

  function averageContract(
    data: Project[],
    project_id: string,
    code: string,
    period: string
  ) {
    const contracts = data.find((item) => item.id === project_id)?.contracts;

    const filter = contracts?.filter((item) =>
      item.contract_amounts?.find((item) => item.code === code)
    );

    const prevAmounts: number[] = [];
    const currentAmounts: number[] = [];

    filter?.forEach((item) => {
      if (item?.contract_amounts) {
        versusLast(item?.date, period).prev &&
          prevAmounts.push(
            Number(
              item?.contract_amounts?.find((item) => item.code === code)?.amount
            )
          );

        versusLast(item?.date, period).current &&
          currentAmounts.push(
            Number(
              item?.contract_amounts?.find((item) => item.code === code)?.amount
            )
          );
      }
    });

    return {
      previousAmount: prevAmounts.length
        ? totalSum(prevAmounts) / prevAmounts.length
        : 0,
      currentAmount: currentAmounts.length
        ? totalSum(currentAmounts) / currentAmounts.length
        : 0,
    };
  }

  function activeContractors(
    data: Project[],
    project_id: string,
  ) {
    const contractors = data.find(
      (item) => item.id === project_id
    )?.contractors;

    const filter = contractors?.filter((item) => item.is_available === true);

    return {
      previousAmount: 0,
      currentAmount: filter ? filter.length : 0,
    };
  }

  function runKPI() {
    if (!allProjects && !selectedCurrency.length && !selectedProject.length) {
      return;
    }

    const currency = currency_list.find((item) => item.code === selectedCurrency);
    setCurrencySymbol(currency ? currency.symbol : "")

    setKpi([
      totalAmountPaid(
        allProjects as unknown as Project[],
        selectedProject,
        selectedCurrency,
        selectedPeriod
      ),
      totalPayments(
        allProjects as unknown as Project[],
        selectedProject,
        selectedCurrency,
        selectedPeriod
      ),
      averageContract(
        allProjects as unknown as Project[],
        selectedProject,
        selectedCurrency,
        selectedPeriod
      ),
      activeContractors(
        allProjects as unknown as Project[],
        selectedProject
      ),
    ]);
  }

  const cardTitle = [
    {
      title: "Total amount paid",
      symbol: currencySymbol,
      visual: true
    },
    {
      title: "Payments made",
      symbol: null,
      visual: true
    },
    {
      title: "Average contract size",
      symbol: currencySymbol,
      visual: true
    },
    {
      title: "Active contractors",
      symbol: null,
      visual: false
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
        <div className="flex gap-1.5">
          <CheckedButton
            clickedFn={runKPI}
            disabledLogic={!selectedCurrency.length || !selectedProject.length}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-2">
        {kpi
          ? cardTitle.map((item, i) => {
              return (
                <Fragment key={item.title}>
                  <Card>
                    <Header6 text={item.title} className="capitalize" />
                    <div className="flex justify-end items-start gap-1 mt-8">
                      <div className="flex items-start gap-1">
                        {item.symbol ? (
                          <p className="text-sm">{item.symbol}</p>
                        ) : null}
                        <Header2
                          text={`${convertCurrency(kpi[i].currentAmount)}`}
                        />
                      </div>
                      {item.visual && <PercentBanner
                        type={
                          getPercentChange(
                            kpi[i].currentAmount,
                            kpi[i].previousAmount
                          ).type
                        }
                        percent={
                          getPercentChange(
                            kpi[i].currentAmount,
                            kpi[i].previousAmount
                          ).percent
                        }
                      />}
                    </div>
                  </Card>
                </Fragment>
              );
            })
          : Array.from({ length: 4 }).map((_, i) => {
              return (
                <Card className="h-32 w-full animate-pulse" key={`${i + 1}`}>
                  <div></div>
                </Card>
              );
            })}
      </div>
    </div>
  );
}

export default AmountDisplay;
