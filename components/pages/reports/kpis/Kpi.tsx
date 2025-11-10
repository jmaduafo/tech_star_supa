"use client";

import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import KpiCard from "@/components/ui/cards/KpiCard";
import Loading from "@/components/ui/loading/Loading";
import NotAvailable from "@/components/ui/NotAvailable";
import { Amount, Project, User, Versus } from "@/types/types";
import { switchPeriod } from "@/utils/dateAndTime";
import {
  highestPaymentAmount,
  totalAmountPaid,
  totalContractAmount,
  totalContractBalance,
  totalContractPayments,
} from "@/utils/kpi";
import React, { Fragment, useEffect, useState } from "react";

function Kpi({
  timePeriod,
  user,
  currency_symbol,
  project_id,
  currency_code,
  projects,
  currencies,
}: {
  readonly timePeriod: string;
  readonly project_id: string;
  readonly currency_code: string;
  readonly currency_symbol: string;
  readonly user: User | undefined;
  readonly projects: Project[] | undefined;
  readonly currencies: Amount[] | undefined;
}) {
  const [kpi, setKpi] = useState<Versus[] | undefined>();

  const getData = () => {
    if (!projects || !project_id.length || !currency_code.length) {
      return;
    }

    setKpi([
      totalAmountPaid(
        projects,
        project_id,
        currency_code,
        switchPeriod(timePeriod)
      ),
      totalContractAmount(
        projects,
        project_id,
        currency_code,
        switchPeriod(timePeriod)
      ),
      totalContractPayments(
        projects,
        project_id,
        currency_code,
        switchPeriod(timePeriod)
      ),
      totalContractBalance(
        projects,
        project_id,
        currency_code,
        switchPeriod(timePeriod)
      ),
      highestPaymentAmount(
        projects,
        project_id,
        currency_code,
        switchPeriod(timePeriod)
      ),
    ]);
  };

  useEffect(() => {
    getData();
  }, [project_id, currency_code, timePeriod]);

  const cardTitles = [
    {
      title: "Total payment amount",
      symbol: currency_symbol,
      visual: true,
      className: "md:col-span-2 xl:col-span-1",
    },
    {
      title: "Total contract amount",
      symbol: currency_symbol,
      visual: true,
      className: "md:col-span-1 xl:col-span-1",
    },
    {
      title: "Contract payment amount",
      symbol: currency_symbol,
      visual: true,
      className: "md:col-span-1 xl:col-span-1",
    },
    {
      title: "Contract balance",
      symbol: currency_symbol,
      visual: true,
      className: "md:col-span-1 xl:col-span-1",
    },
    {
      title: "Highest Payment",
      symbol: currency_symbol,
      visual: true,
      className: "md:col-span-1 xl:col-span-1",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-4">
      {kpi
        ? null
        : Array.from({ length: 5 }).map((_, i) => {
            return (
              <CardSkeleton className="h-32" key={`${i + 1}`}>
                <Loading />
              </CardSkeleton>
            );
        })}
      {kpi?.length && project_id.length ? (
        cardTitles.map((item, i) => {
          return (
            <Fragment key={item.title}>
              <KpiCard
                period={switchPeriod(timePeriod)}
                item={item}
                index={i}
                arr={kpi}
              />
            </Fragment>
          );
        })
      ) : (
        <div className="h-36 w-full md:col-span-3 xl:col-span-5 flex justify-center items-center">
            <NotAvailable text="No data available" />
          </div>
      )}
    </div>
  );
}

export default Kpi;
