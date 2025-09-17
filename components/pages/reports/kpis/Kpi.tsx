"use client";
import Header2 from "@/components/fontsize/Header2";
import Header6 from "@/components/fontsize/Header6";
import KpiCard from "@/components/ui/cards/KpiCard";
import Card from "@/components/ui/cards/MyCard";
import Loading from "@/components/ui/loading/Loading";
import { Payment, User, Versus } from "@/types/types";
import React, { Fragment, useState } from "react";

function Kpi({
  timePeriod,
  user,
  currency_symbol,
  project_id,
  currency_code
}: {
  readonly timePeriod: string;
  readonly project_id: string;
  readonly currency_code: string;
  readonly currency_symbol: string;
  readonly user: User | undefined;
  
}) {
  const [allPayments, setAllPayments] = useState<Payment[] | undefined>();

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
      symbol: currency_symbol,
      visual: true,
      className: "md:col-span-2 lg:col-span-1",
    },
    {
      title: "Total contract amount",
      symbol: currency_symbol,
      visual: true,
      className: "",
    },
    {
      title: "Contract payment amount",
      symbol: currency_symbol,
      visual: true,
      className: "",
    },
    {
      title: "Contract balance",
      symbol: currency_symbol,
      visual: true,
      className: "",
    },
    {
      title: "Top contractor",
      symbol: null,
      visual: false,
      className: "",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-4">
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
                  <Card className="flex flex-col">
                    <Header6 text={item.title} className="capitalize" />
                    <div className="flex justify-end items-start gap-1 mt-8">
                      <div className="">
                        <Header2 text={`Equalize Limited`} className="text-right" />
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
  );
}

export default Kpi;
