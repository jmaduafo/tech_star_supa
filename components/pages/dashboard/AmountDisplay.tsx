"use client";
import React, { useState, useEffect, Fragment } from "react";
import { currency_list } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import SelectBar from "@/components/ui/input/SelectBar";
import Header2 from "@/components/fontsize/Header2";
import { Amount, Payment, Project, User, Versus } from "@/types/types";
import {
  convertCurrency,
  getPercentChange,
  totalSum,
} from "@/utils/currencies";
import Loading from "@/components/ui/loading/Loading";
import Reset from "@/components/ui/buttons/Reset";
import CheckedButton from "@/components/ui/buttons/CheckedButton";
import Header6 from "@/components/fontsize/Header6";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/cards/MyCard";
import Header5 from "@/components/fontsize/Header5";
import PercentBanner from "@/components/ui/banners/PercentBanner";
import { pastTime, versusLast } from "@/utils/dateAndTime";
import { format } from "date-fns";
import { getUniqueObjects } from "@/utils/chartHelpers";

function AmountDisplay({ user }: { readonly user: User | undefined }) {
  const [allProjects, setAllProjects] = useState<Project[] | undefined>();
  const [currenciesList, setCurrenciesList] = useState<Amount[] | undefined>();

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const [kpi, setKpi] = useState<Versus[]>([]);

  const [loading, setLoading] = useState(false);

  const [allTotals, setAllTotals] = useState({
    noncontractPayments: 0,
    contractPayments: 0,
    contracts: 0,
  });

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
            "id, name, payments ( id, date, is_paid, is_completed, payment_amounts ( * )), contracts ( id, date, contract_amounts ( * )), contractors (id, name, payments ( id, date, is_paid, is_completed ))"
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

      console.log(projects.data);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    allData();
  }, [user]);

  function reset() {
    setSelectedCurrency("");
    setCurrencySymbol("");
    setAllTotals({
      contractPayments: 0,
      contracts: 0,
      noncontractPayments: 0,
    });
  }

  function currencyChange(curr: string) {
    const currency = currency_list.find((item) => item.code === curr);
    setCurrencySymbol(currency ? currency.symbol : "");
  }

  function totalAmountPaid(project_id: string, code: string) {
    if (!allProjects) {
      return;
    }

    const payments = allProjects.find(
      (item) => item.id === project_id
    )?.payments;

    const filter = payments?.filter(
      (item) => item.payment_amounts && item.payment_amounts[0]?.code === code
    );

    const prevAmounts: number[] = [];
    const currentAmounts: number[] = [];

    filter?.forEach((item) => {
      if (item?.payment_amounts) {
        versusLast(item?.date, "year").prev &&
          prevAmounts.push(Number(item?.payment_amounts[0]?.amount));
        versusLast(item?.date, "year").current &&
          currentAmounts.push(Number(item?.payment_amounts[0]?.amount));
      }
    });

    return {
      previousAmount: totalSum(prevAmounts),
      currentAmount: totalSum(currentAmounts),
    };
  }

  function totalPayments(project_id: string) {
    if (!allProjects) {
      return;
    }

    const payments = allProjects.find(
      (item) => item.id === project_id
    )?.payments;

    const filter = payments?.filter((item) => item.is_paid === true);

    let previousAmount = 0;
    let currentAmount = 0;

    filter?.forEach((item) => {
      versusLast(item?.date, "year").prev && previousAmount ++
      versusLast(item?.date, "year").current && currentAmount ++
    });

    return {
      previousAmount,
      currentAmount,
    };
  }

  const cardTitle = [
    {
      title: "Total amount paid",
      symbol: currencySymbol,
    },
    {
      title: "Payments made",
      symbol: null,
    },
    {
      title: "Average contract size",
      symbol: null,
    },
    {
      title: "Average contractors paid",
      symbol: currencySymbol,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-4">
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
          valueChange={(name) => currencyChange(name)}
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
            clickedFn={() => {
              totalAmountPaid(selectedProject, selectedCurrency);
            }}
            disabledLogic={!selectedCurrency.length || !selectedProject.length}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-2">
        {cardTitle.map((item) => {
          return (
            <Fragment key={item.title}>
              <Card>
                <Header6 text={item.title} className="capitalize" />
                <div className="flex justify-end items-start gap-2 mt-8">
                  <Header2 text={`${98}`} />
                  <PercentBanner
                    type={getPercentChange(567, 390).type}
                    percent={getPercentChange(567, 390).percent}
                  />
                </div>
              </Card>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default AmountDisplay;
