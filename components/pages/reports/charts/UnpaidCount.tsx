"use client";

import CountCard from "@/components/ui/cards/CountCard";
import { Project } from "@/types/types";
import { checkArray } from "@/utils/currencies";
import { switchPeriod, versusLast } from "@/utils/dateAndTime";
import React, { useEffect, useState } from "react";

function UnpaidCount({
  timePeriod,
  project_id,
  projects,
  currency_code,
  currency_symbol,
}: {
  readonly project_id: string;
  readonly projects: Project[] | undefined;
  readonly timePeriod: string;
  readonly currency_code: string;
  readonly currency_symbol: string;
}) {
  const [count, setCount] = useState<number | undefined>();

  const getData = () => {
    if (!project_id.length || !projects || !currency_code.length) {
      return;
    }

    const project = projects.find((item) => item.id === project_id);

    if (!project) {
      return;
    }

    const payments = project.payments;

    const paymentCount =
      timePeriod !== "All Time"
        ? payments?.filter((item) => {
            const amount =
              item.payment_amounts && checkArray(item.payment_amounts);

            return (
              item.is_completed &&
              !item.is_paid &&
              amount?.code === currency_code &&
              versusLast(item.date, switchPeriod(timePeriod)).current
            );
          })
        : payments?.filter((item) => {
            const amount =
              item.payment_amounts && checkArray(item.payment_amounts);

            return (
              item.is_completed &&
              !item.is_paid &&
              amount?.code === currency_code
            );
          });

    paymentCount ? setCount(paymentCount.length) : setCount(0);
  };

  useEffect(() => {
    getData();
  }, [currency_code, project_id, timePeriod]);

  return <CountCard count={count} title={`Unpaid ${currency_code} payment`} />;
}

export default UnpaidCount;
